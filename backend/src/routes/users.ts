import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = Router();

// Get user profile
router.get('/profile', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;

  try {
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      throw createError('User profile not found', 404);
    }

    const userData = userDoc.data();
    
    res.json({
      user: userData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    throw createError('Failed to retrieve user profile', 500);
  }
}));

// Update user profile
router.put('/profile', [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('emergencyContacts').optional().isArray().withMessage('Emergency contacts must be an array'),
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const uid = req.user!.uid;
  const updateData = { ...req.body, updatedAt: new Date() };

  try {
    await db.collection('users').doc(uid).update(updateData);

    res.json({
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    throw createError('Failed to update profile', 500);
  }
}));

// Get user statistics
router.get('/statistics', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;

  try {
    // Get user stats
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    // Get trip statistics
    const tripsSnapshot = await db.collection('trips')
      .where('userId', '==', uid)
      .get();

    const trips = tripsSnapshot.docs.map(doc => doc.data());
    
    const stats = {
      tripsCompleted: trips.filter(trip => trip.status === 'completed').length,
      tripsActive: trips.filter(trip => trip.status === 'active').length,
      tripsPlanned: trips.filter(trip => trip.status === 'planning').length,
      totalSpent: trips.reduce((sum, trip) => sum + (trip.actualSpent || 0), 0),
      totalBudget: trips.reduce((sum, trip) => sum + trip.budget, 0),
      carbonFootprint: trips.reduce((sum, trip) => sum + (trip.carbonFootprint?.total || 0), 0),
      countriesVisited: new Set(trips.map(trip => trip.destination.split(',').pop()?.trim())).size,
      safetyScore: userData?.statistics?.safetyScore || 5.0,
      lastTripDate: trips.length > 0 ? Math.max(...trips.map(trip => trip.startDate.toDate().getTime())) : null
    };

    res.json({
      statistics: stats
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    throw createError('Failed to retrieve statistics', 500);
  }
}));

// Update safety preferences
router.put('/safety-preferences', [
  body('shareLocationWithContacts').isBoolean(),
  body('sosEnabled').isBoolean(),
  body('safeRoutePreference').isBoolean(),
  body('femaleOnlyServices').isBoolean(),
  body('autoCheckIn').isBoolean(),
  body('checkInInterval').isInt({ min: 15, max: 1440 })
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const uid = req.user!.uid;
  const safetyPreferences = req.body;

  try {
    await db.collection('users').doc(uid).update({
      'profile.safetyPreferences': safetyPreferences,
      updatedAt: new Date()
    });

    res.json({
      message: 'Safety preferences updated successfully'
    });

  } catch (error) {
    console.error('Update safety preferences error:', error);
    throw createError('Failed to update safety preferences', 500);
  }
}));

// Add emergency contact
router.post('/emergency-contacts', [
  body('name').notEmpty().withMessage('Contact name is required'),
  body('phoneNumber').isMobilePhone('any').withMessage('Valid phone number is required'),
  body('relationship').notEmpty().withMessage('Relationship is required'),
  body('email').optional().isEmail().withMessage('Please provide a valid email')
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const uid = req.user!.uid;
  const contactData = {
    id: db.collection('users').doc().id,
    ...req.body,
    createdAt: new Date()
  };

  try {
    await db.collection('users').doc(uid).update({
      emergencyContacts: db.FieldValue.arrayUnion(contactData),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Emergency contact added successfully',
      contact: contactData
    });

  } catch (error) {
    console.error('Add emergency contact error:', error);
    throw createError('Failed to add emergency contact', 500);
  }
}));

// Remove emergency contact
router.delete('/emergency-contacts/:contactId', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { contactId } = req.params;

  try {
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    if (!userData) {
      throw createError('User not found', 404);
    }

    const updatedContacts = (userData.emergencyContacts || [])
      .filter((contact: any) => contact.id !== contactId);

    await db.collection('users').doc(uid).update({
      emergencyContacts: updatedContacts,
      updatedAt: new Date()
    });

    res.json({
      message: 'Emergency contact removed successfully'
    });

  } catch (error) {
    console.error('Remove emergency contact error:', error);
    throw createError('Failed to remove emergency contact', 500);
  }
}));

export default router;
