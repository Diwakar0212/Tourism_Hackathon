import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = Router();

// Get all trips for user
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { status, limit = 20, offset = 0 } = req.query;

  try {
    let query = db.collection('trips').where('userId', '==', uid);
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    query = query.orderBy('createdAt', 'desc').limit(Number(limit)).offset(Number(offset));
    
    const tripsSnapshot = await query.get();
    const trips = tripsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      trips,
      total: trips.length,
      hasMore: trips.length === Number(limit)
    });

  } catch (error) {
    console.error('Get trips error:', error);
    throw createError('Failed to retrieve trips', 500);
  }
}));

// Get single trip
router.get('/:tripId', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { tripId } = req.params;

  try {
    const tripDoc = await db.collection('trips').doc(tripId).get();
    
    if (!tripDoc.exists) {
      throw createError('Trip not found', 404);
    }

    const tripData = tripDoc.data();
    
    // Check if user owns the trip or it's shared with them
    if (tripData?.userId !== uid && !tripData?.sharedWith?.includes(uid)) {
      throw createError('Access denied', 403);
    }

    res.json({
      trip: {
        id: tripDoc.id,
        ...tripData
      }
    });

  } catch (error) {
    console.error('Get trip error:', error);
    throw createError('Failed to retrieve trip', 500);
  }
}));

// Create new trip
router.post('/', [
  body('title').notEmpty().withMessage('Trip title is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const uid = req.user!.uid;
  const {
    title,
    destination,
    startDate,
    endDate,
    budget,
    travelers,
    itinerary,
    notes,
    sharedWith
  } = req.body;

  try {
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      throw createError('End date must be after start date', 400);
    }

    const tripData = {
      userId: uid,
      title,
      destination,
      startDate: start,
      endDate: end,
      budget,
      actualSpent: 0,
      status: 'planning',
      travelers: travelers || [uid],
      itinerary: itinerary || [],
      notes: notes || '',
      sharedWith: sharedWith || [],
      safetyChecks: [],
      lastCheckin: null,
      carbonFootprint: {
        transport: 0,
        accommodation: 0,
        activities: 0,
        food: 0,
        total: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const tripRef = await db.collection('trips').add(tripData);

    res.status(201).json({
      message: 'Trip created successfully',
      trip: {
        id: tripRef.id,
        ...tripData
      }
    });

  } catch (error) {
    console.error('Create trip error:', error);
    throw createError('Failed to create trip', 500);
  }
}));

// Update trip
router.put('/:tripId', [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('budget').optional().isNumeric().withMessage('Budget must be a number'),
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { tripId } = req.params;
  const updateData = { ...req.body, updatedAt: new Date() };

  try {
    const tripDoc = await db.collection('trips').doc(tripId).get();
    
    if (!tripDoc.exists) {
      throw createError('Trip not found', 404);
    }

    const tripData = tripDoc.data();
    
    if (tripData?.userId !== uid) {
      throw createError('Access denied', 403);
    }

    await db.collection('trips').doc(tripId).update(updateData);

    res.json({
      message: 'Trip updated successfully'
    });

  } catch (error) {
    console.error('Update trip error:', error);
    throw createError('Failed to update trip', 500);
  }
}));

// Delete trip
router.delete('/:tripId', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { tripId } = req.params;

  try {
    const tripDoc = await db.collection('trips').doc(tripId).get();
    
    if (!tripDoc.exists) {
      throw createError('Trip not found', 404);
    }

    const tripData = tripDoc.data();
    
    if (tripData?.userId !== uid) {
      throw createError('Access denied', 403);
    }

    await db.collection('trips').doc(tripId).delete();

    res.json({
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('Delete trip error:', error);
    throw createError('Failed to delete trip', 500);
  }
}));

// Add itinerary item
router.post('/:tripId/itinerary', [
  body('day').isInt({ min: 1 }).withMessage('Day must be a positive integer'),
  body('time').notEmpty().withMessage('Time is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('location').notEmpty().withMessage('Location is required'),
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { tripId } = req.params;
  const itemData = {
    id: db.collection('trips').doc().id,
    ...req.body,
    createdAt: new Date()
  };

  try {
    const tripDoc = await db.collection('trips').doc(tripId).get();
    
    if (!tripDoc.exists) {
      throw createError('Trip not found', 404);
    }

    const tripData = tripDoc.data();
    
    if (tripData?.userId !== uid) {
      throw createError('Access denied', 403);
    }

    await db.collection('trips').doc(tripId).update({
      itinerary: db.FieldValue.arrayUnion(itemData),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Itinerary item added successfully',
      item: itemData
    });

  } catch (error) {
    console.error('Add itinerary item error:', error);
    throw createError('Failed to add itinerary item', 500);
  }
}));

// Update trip status
router.patch('/:tripId/status', [
  body('status').isIn(['planning', 'confirmed', 'active', 'completed', 'cancelled'])
    .withMessage('Invalid status')
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { tripId } = req.params;
  const { status } = req.body;

  try {
    const tripDoc = await db.collection('trips').doc(tripId).get();
    
    if (!tripDoc.exists) {
      throw createError('Trip not found', 404);
    }

    const tripData = tripDoc.data();
    
    if (tripData?.userId !== uid) {
      throw createError('Access denied', 403);
    }

    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    // Add status-specific fields
    if (status === 'active') {
      updateData.actualStartDate = new Date();
    } else if (status === 'completed') {
      updateData.actualEndDate = new Date();
    }

    await db.collection('trips').doc(tripId).update(updateData);

    res.json({
      message: 'Trip status updated successfully'
    });

  } catch (error) {
    console.error('Update trip status error:', error);
    throw createError('Failed to update trip status', 500);
  }
}));

// Share trip
router.post('/:tripId/share', [
  body('shareWith').isArray().withMessage('shareWith must be an array'),
  body('shareWith.*').isEmail().withMessage('Each share recipient must be a valid email')
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { tripId } = req.params;
  const { shareWith } = req.body;

  try {
    const tripDoc = await db.collection('trips').doc(tripId).get();
    
    if (!tripDoc.exists) {
      throw createError('Trip not found', 404);
    }

    const tripData = tripDoc.data();
    
    if (tripData?.userId !== uid) {
      throw createError('Access denied', 403);
    }

    // Find user IDs from emails
    const userIds: string[] = [];
    for (const email of shareWith) {
      const userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
      if (!userQuery.empty) {
        userIds.push(userQuery.docs[0].id);
      }
    }

    await db.collection('trips').doc(tripId).update({
      sharedWith: userIds,
      updatedAt: new Date()
    });

    // Notify shared users via Socket.IO
    const io = req.app.get('io');
    userIds.forEach(userId => {
      io.to(`user_${userId}`).emit('trip_shared', {
        tripId,
        tripTitle: tripData?.title,
        sharedBy: uid,
        timestamp: new Date()
      });
    });

    res.json({
      message: 'Trip shared successfully',
      sharedWith: userIds
    });

  } catch (error) {
    console.error('Share trip error:', error);
    throw createError('Failed to share trip', 500);
  }
}));

// Get trip statistics
router.get('/:tripId/statistics', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { tripId } = req.params;

  try {
    const tripDoc = await db.collection('trips').doc(tripId).get();
    
    if (!tripDoc.exists) {
      throw createError('Trip not found', 404);
    }

    const tripData = tripDoc.data();
    
    if (tripData?.userId !== uid && !tripData?.sharedWith?.includes(uid)) {
      throw createError('Access denied', 403);
    }

    // Calculate statistics
    const statistics = {
      duration: Math.ceil((tripData?.endDate?.toDate().getTime() - tripData?.startDate?.toDate().getTime()) / (1000 * 60 * 60 * 24)),
      budgetUtilization: ((tripData?.actualSpent || 0) / tripData?.budget) * 100,
      itineraryItems: tripData?.itinerary?.length || 0,
      safetyCheckins: tripData?.safetyChecks?.length || 0,
      carbonFootprint: tripData?.carbonFootprint?.total || 0,
      status: tripData?.status,
      progress: calculateTripProgress(tripData)
    };

    res.json({
      statistics
    });

  } catch (error) {
    console.error('Get trip statistics error:', error);
    throw createError('Failed to retrieve trip statistics', 500);
  }
}));

// Helper functions
function calculateTripProgress(tripData: any): number {
  if (!tripData || tripData.status === 'planning') return 0;
  if (tripData.status === 'completed') return 100;
  if (tripData.status === 'cancelled') return 0;

  const now = new Date();
  const start = tripData.startDate?.toDate();
  const end = tripData.endDate?.toDate();

  if (!start || !end) return 0;
  if (now < start) return 0;
  if (now > end) return 100;

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}

export default router;
