import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = Router();

// Create SOS alert
router.post('/sos', [
  body('type').isIn(['emergency', 'safety-concern', 'medical', 'harassment']).withMessage('Invalid SOS type'),
  body('location.lat').isFloat().withMessage('Valid latitude is required'),
  body('location.lng').isFloat().withMessage('Valid longitude is required'),
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { type, location, description } = req.body;

  try {
    const alertData = {
      userId: uid,
      type,
      location,
      description: description || '',
      status: 'active',
      timestamp: new Date(),
      responders: []
    };

    const alertRef = await db.collection('sosAlerts').add(alertData);

    // Emit to Socket.IO for real-time notifications
    const io = req.app.get('io');
    
    // Get user data
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    // Notify emergency contacts
    const emergencyContacts = userData?.emergencyContacts || [];
    emergencyContacts.forEach((contact: any) => {
      io.to(`user_${contact.userId}`).emit('sos_alert_received', {
        alertId: alertRef.id,
        contactId: uid,
        contactName: userData?.displayName,
        type,
        location,
        description,
        timestamp: new Date()
      });
    });

    res.status(201).json({
      message: 'SOS alert sent successfully',
      alertId: alertRef.id
    });

  } catch (error) {
    console.error('SOS alert error:', error);
    throw createError('Failed to send SOS alert', 500);
  }
}));

// Safety check-in
router.post('/checkin', [
  body('tripId').notEmpty().withMessage('Trip ID is required'),
  body('location.lat').isFloat().withMessage('Valid latitude is required'),
  body('location.lng').isFloat().withMessage('Valid longitude is required'),
  body('status').isIn(['safe', 'unsafe', 'emergency']).withMessage('Invalid status'),
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { tripId, location, status, notes } = req.body;

  try {
    const checkinData = {
      userId: uid,
      tripId,
      location,
      status,
      notes: notes || '',
      timestamp: new Date()
    };

    const checkinRef = await db.collection('safetyCheckins').add(checkinData);

    // Update trip with latest check-in
    await db.collection('trips').doc(tripId).update({
      lastCheckin: {
        timestamp: new Date(),
        location,
        status
      },
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Safety check-in recorded successfully',
      checkinId: checkinRef.id
    });

  } catch (error) {
    console.error('Safety check-in error:', error);
    throw createError('Failed to record safety check-in', 500);
  }
}));

// Get safety alerts
router.get('/alerts', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { status, limit = 20 } = req.query;

  try {
    let query = db.collection('sosAlerts').where('userId', '==', uid);
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    query = query.orderBy('timestamp', 'desc').limit(Number(limit));
    
    const alertsSnapshot = await query.get();
    const alerts = alertsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      alerts
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    throw createError('Failed to retrieve safety alerts', 500);
  }
}));

export default router;
