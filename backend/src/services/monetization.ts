import { Request, Response } from 'express';
import Stripe from 'stripe';

// Initialize Stripe (in production, use environment variable)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2022-11-15'
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

export interface UserSubscription {
  userId: string;
  planId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  category: 'safety' | 'travel' | 'analytics' | 'premium';
  oneTime: boolean;
  requiresSubscription?: string; // plan ID that includes this feature
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'subscription' | 'one_time' | 'refund';
  amount: number; // in cents
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'SafeSolo Basic',
    description: 'Essential safety features for solo travelers',
    price: 999, // $9.99
    currency: 'usd',
    interval: 'month',
    stripePriceId: 'price_basic_monthly',
    features: [
      'Emergency SOS alerts',
      'Basic location sharing',
      'Emergency contacts (up to 3)',
      'Safety check-ins',
      'Basic trip planning'
    ]
  },
  {
    id: 'premium',
    name: 'SafeSolo Premium',
    description: 'Advanced safety and travel features',
    price: 1999, // $19.99
    currency: 'usd',
    interval: 'month',
    stripePriceId: 'price_premium_monthly',
    popular: true,
    features: [
      'All Basic features',
      'Real-time location tracking',
      'Unlimited emergency contacts',
      'Advanced safety analytics',
      'Trip recommendations',
      'Offline emergency features',
      '24/7 emergency support',
      'Travel insurance integration'
    ]
  },
  {
    id: 'enterprise',
    name: 'SafeSolo Enterprise',
    description: 'Complete solution for travel organizations',
    price: 4999, // $49.99
    currency: 'usd',
    interval: 'month',
    stripePriceId: 'price_enterprise_monthly',
    features: [
      'All Premium features',
      'Multi-user management',
      'Custom safety protocols',
      'Advanced analytics dashboard',
      'API access',
      'White-label options',
      'Dedicated account manager',
      'Custom integrations'
    ]
  }
];

// Premium Features Configuration
export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: 'emergency_ai_assistant',
    name: 'AI Emergency Assistant',
    description: 'AI-powered emergency guidance and support',
    price: 499, // $4.99
    category: 'safety',
    oneTime: false,
    requiresSubscription: 'premium'
  },
  {
    id: 'travel_insurance',
    name: 'Integrated Travel Insurance',
    description: 'Comprehensive travel insurance coverage',
    price: 2999, // $29.99
    category: 'travel',
    oneTime: true
  },
  {
    id: 'priority_support',
    name: '24/7 Priority Support',
    description: 'Immediate response for emergency situations',
    price: 999, // $9.99
    category: 'premium',
    oneTime: false,
    requiresSubscription: 'basic'
  },
  {
    id: 'advanced_analytics',
    name: 'Advanced Travel Analytics',
    description: 'Detailed insights into your travel patterns and safety',
    price: 699, // $6.99
    category: 'analytics',
    oneTime: false,
    requiresSubscription: 'basic'
  }
];

// In-memory storage (in production, use database)
class MonetizationStore {
  private subscriptions: UserSubscription[] = [];
  private transactions: Transaction[] = [];
  private customerIds: Map<string, string> = new Map(); // userId -> stripeCustomerId

  // Subscription Management
  addSubscription(subscription: UserSubscription): void {
    const existingIndex = this.subscriptions.findIndex(s => s.userId === subscription.userId);
    if (existingIndex >= 0) {
      this.subscriptions[existingIndex] = subscription;
    } else {
      this.subscriptions.push(subscription);
    }
  }

  getUserSubscription(userId: string): UserSubscription | null {
    return this.subscriptions.find(s => s.userId === userId) || null;
  }

  updateSubscriptionStatus(userId: string, status: UserSubscription['status']): void {
    const subscription = this.getUserSubscription(userId);
    if (subscription) {
      subscription.status = status;
      subscription.updatedAt = new Date();
    }
  }

  // Transaction Management
  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  getUserTransactions(userId: string): Transaction[] {
    return this.transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Customer Management
  setCustomerId(userId: string, customerId: string): void {
    this.customerIds.set(userId, customerId);
  }

  getCustomerId(userId: string): string | undefined {
    return this.customerIds.get(userId);
  }

  // Revenue Analytics
  getRevenueAnalytics(dateRange: { start: Date; end: Date }) {
    const transactions = this.transactions.filter(t => 
      t.createdAt >= dateRange.start && 
      t.createdAt <= dateRange.end &&
      t.status === 'completed'
    );

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const subscriptionRevenue = transactions
      .filter(t => t.type === 'subscription')
      .reduce((sum, t) => sum + t.amount, 0);
    const oneTimeRevenue = transactions
      .filter(t => t.type === 'one_time')
      .reduce((sum, t) => sum + t.amount, 0);

    const activeSubscriptions = this.subscriptions.filter(s => s.status === 'active').length;
    const mrr = this.calculateMRR();

    return {
      totalRevenue: totalRevenue / 100, // Convert from cents
      subscriptionRevenue: subscriptionRevenue / 100,
      oneTimeRevenue: oneTimeRevenue / 100,
      activeSubscriptions,
      mrr: mrr / 100,
      churnRate: this.calculateChurnRate(),
      averageRevenuePerUser: activeSubscriptions > 0 ? (mrr / activeSubscriptions) / 100 : 0
    };
  }

  private calculateMRR(): number {
    return this.subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === s.planId);
        if (plan && plan.interval === 'month') {
          return sum + plan.price;
        } else if (plan && plan.interval === 'year') {
          return sum + (plan.price / 12); // Convert annual to monthly
        }
        return sum;
      }, 0);
  }

  private calculateChurnRate(): number {
    const totalSubscriptions = this.subscriptions.length;
    const cancelledSubscriptions = this.subscriptions.filter(s => 
      s.status === 'cancelled' || s.cancelAtPeriodEnd
    ).length;

    return totalSubscriptions > 0 ? (cancelledSubscriptions / totalSubscriptions) * 100 : 0;
  }
}

export const monetizationStore = new MonetizationStore();

// Monetization Controller
export class MonetizationController {
  // Get subscription plans
  static async getPlans(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: {
          plans: SUBSCRIPTION_PLANS,
          features: PREMIUM_FEATURES
        }
      });
    } catch (error) {
      console.error('Error getting plans:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get subscription plans'
      });
    }
  }

  // Create subscription
  static async createSubscription(req: Request, res: Response) {
    try {
      const { userId, planId, paymentMethodId } = req.body;

      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        return res.status(400).json({
          success: false,
          message: 'Invalid plan selected'
        });
      }

      // Get or create Stripe customer
      let customerId = monetizationStore.getCustomerId(userId);
      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: { userId }
        });
        customerId = customer.id;
        monetizationStore.setCustomerId(userId, customerId);
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan.stripePriceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      });

      // Store subscription in our system
      const userSubscription: UserSubscription = {
        userId,
        planId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status as UserSubscription['status'],
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      monetizationStore.addSubscription(userSubscription);

      // Record transaction
      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: 'subscription',
        amount: plan.price,
        currency: plan.currency,
        status: 'pending',
        description: `Subscription to ${plan.name}`,
        metadata: { planId, subscriptionId: subscription.id },
        createdAt: new Date()
      };

      monetizationStore.addTransaction(transaction);

      res.json({
        success: true,
        data: {
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          status: subscription.status
        }
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create subscription'
      });
    }
  }

  // Get user subscription
  static async getUserSubscription(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const subscription = monetizationStore.getUserSubscription(userId);
      if (!subscription) {
        return res.json({
          success: true,
          data: { subscription: null }
        });
      }

      const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId);

      res.json({
        success: true,
        data: {
          subscription: {
            ...subscription,
            plan
          }
        }
      });
    } catch (error) {
      console.error('Error getting user subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user subscription'
      });
    }
  }

  // Cancel subscription
  static async cancelSubscription(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { immediate = false } = req.body;

      const subscription = monetizationStore.getUserSubscription(userId);
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'No active subscription found'
        });
      }

      // Cancel in Stripe
      if (immediate) {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        monetizationStore.updateSubscriptionStatus(userId, 'cancelled');
      } else {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
        subscription.cancelAtPeriodEnd = true;
        subscription.updatedAt = new Date();
      }

      res.json({
        success: true,
        message: immediate ? 'Subscription cancelled immediately' : 'Subscription will cancel at period end'
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel subscription'
      });
    }
  }

  // Purchase premium feature
  static async purchasePremiumFeature(req: Request, res: Response) {
    try {
      const { userId, featureId, paymentMethodId } = req.body;

      const feature = PREMIUM_FEATURES.find(f => f.id === featureId);
      if (!feature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid feature selected'
        });
      }

      // Check if user has required subscription
      if (feature.requiresSubscription) {
        const userSubscription = monetizationStore.getUserSubscription(userId);
        if (!userSubscription || userSubscription.status !== 'active') {
          return res.status(400).json({
            success: false,
            message: 'Required subscription not found'
          });
        }

        const requiredPlan = SUBSCRIPTION_PLANS.find(p => p.id === feature.requiresSubscription);
        const userPlan = SUBSCRIPTION_PLANS.find(p => p.id === userSubscription.planId);
        
        if (!userPlan || !requiredPlan) {
          return res.status(400).json({
            success: false,
            message: 'Invalid subscription plan'
          });
        }
      }

      // Get customer ID
      let customerId = monetizationStore.getCustomerId(userId);
      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: { userId }
        });
        customerId = customer.id;
        monetizationStore.setCustomerId(userId, customerId);
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: feature.price,
        currency: 'usd',
        customer: customerId,
        payment_method: paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
        description: `Purchase of ${feature.name}`,
        metadata: {
          userId,
          featureId,
          type: 'premium_feature'
        }
      });

      // Record transaction
      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: 'one_time',
        amount: feature.price,
        currency: 'usd',
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
        stripePaymentIntentId: paymentIntent.id,
        description: `Purchase of ${feature.name}`,
        metadata: { featureId },
        createdAt: new Date()
      };

      monetizationStore.addTransaction(transaction);

      res.json({
        success: true,
        data: {
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          clientSecret: paymentIntent.client_secret
        }
      });
    } catch (error) {
      console.error('Error purchasing premium feature:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to purchase premium feature'
      });
    }
  }

  // Get user transactions
  static async getUserTransactions(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const transactions = monetizationStore.getUserTransactions(userId);

      res.json({
        success: true,
        data: { transactions }
      });
    } catch (error) {
      console.error('Error getting user transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user transactions'
      });
    }
  }

  // Get revenue analytics (admin only)
  static async getRevenueAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      
      const dateRange = {
        start: startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: endDate ? new Date(endDate as string) : new Date()
      };

      const analytics = monetizationStore.getRevenueAnalytics(dateRange);

      res.json({
        success: true,
        data: {
          dateRange,
          ...analytics
        }
      });
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get revenue analytics'
      });
    }
  }

  // Webhook handler for Stripe events
  static async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !endpointSecret) {
        return res.status(400).send('Missing signature or webhook secret');
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).send('Webhook signature verification failed');
      }

      // Handle the event
      switch (event.type) {
        case 'invoice.payment_succeeded':
          const invoice = event.data.object as any;
          const customerId = invoice.customer;
          // Update transaction status
          break;

        case 'invoice.payment_failed':
          // Handle failed payment
          break;

        case 'customer.subscription.deleted':
          const subscription = event.data.object as any;
          // Update subscription status in our system
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to handle webhook'
      });
    }
  }
}
