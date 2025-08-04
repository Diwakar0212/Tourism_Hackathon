import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Stripe from 'stripe';
import { db } from '../config/firebase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

// Create payment intent
router.post('/create-intent', [
  body('amount').isNumeric().withMessage('Amount is required'),
  body('currency').optional().isIn(['usd', 'inr', 'eur']).withMessage('Invalid currency'),
  body('bookingId').notEmpty().withMessage('Booking ID is required'),
], asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { amount, currency = 'inr', bookingId, description } = req.body;
  const uid = req.user!.uid;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: uid,
        bookingId,
        description: description || 'SafeSolo booking payment'
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    throw createError('Failed to create payment intent', 500);
  }
}));

// Webhook handler for Stripe events
router.post('/webhook', async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

async function handlePaymentSuccess(paymentIntent: any) {
  const { userId, bookingId } = paymentIntent.metadata;

  try {
    // Update booking status
    await db.collection('bookings').doc(bookingId).update({
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentIntentId: paymentIntent.id,
      paidAt: new Date(),
      updatedAt: new Date()
    });

    // Update user statistics
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const currentSpent = userData?.statistics?.totalSpent || 0;
    
    await db.collection('users').doc(userId).update({
      'statistics.totalSpent': currentSpent + (paymentIntent.amount / 100),
      updatedAt: new Date()
    });

    console.log(`Payment successful for booking ${bookingId}`);
  } catch (error) {
    console.error('Handle payment success error:', error);
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  const { bookingId } = paymentIntent.metadata;

  try {
    await db.collection('bookings').doc(bookingId).update({
      paymentStatus: 'failed',
      paymentError: paymentIntent.last_payment_error?.message || 'Payment failed',
      updatedAt: new Date()
    });

    console.log(`Payment failed for booking ${bookingId}`);
  } catch (error) {
    console.error('Handle payment failure error:', error);
  }
}

export default router;
