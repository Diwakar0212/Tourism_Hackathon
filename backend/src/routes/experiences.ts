import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = Router();

// Get all experiences
router.get('/', asyncHandler(async (req: any, res: any) => {
  const { category, city, priceMin, priceMax, limit = 20, offset = 0 } = req.query;

  try {
    let query = db.collection('experiences');
    
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }
    
    if (city) {
      query = query.where('location.city', '==', city);
    }
    
    query = query.orderBy('rating', 'desc').limit(Number(limit)).offset(Number(offset));
    
    let experiencesSnapshot = await query.get();
    let experiences = experiencesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter by price range if specified
    if (priceMin || priceMax) {
      experiences = experiences.filter((exp: any) => {
        const price = exp.price;
        return (!priceMin || price >= Number(priceMin)) && 
               (!priceMax || price <= Number(priceMax));
      });
    }

    res.json({
      experiences,
      total: experiences.length,
      hasMore: experiences.length === Number(limit)
    });

  } catch (error) {
    console.error('Get experiences error:', error);
    throw createError('Failed to retrieve experiences', 500);
  }
}));

// Get single experience
router.get('/:experienceId', asyncHandler(async (req: any, res: any) => {
  const { experienceId } = req.params;

  try {
    const experienceDoc = await db.collection('experiences').doc(experienceId).get();
    
    if (!experienceDoc.exists) {
      throw createError('Experience not found', 404);
    }

    res.json({
      experience: {
        id: experienceDoc.id,
        ...experienceDoc.data()
      }
    });

  } catch (error) {
    console.error('Get experience error:', error);
    throw createError('Failed to retrieve experience', 500);
  }
}));

// Create new experience (for hosts)
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('duration').isInt({ min: 30 }).withMessage('Duration must be at least 30 minutes'),
  body('maxParticipants').isInt({ min: 1, max: 50 }).withMessage('Max participants must be between 1 and 50'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('location').isObject().withMessage('Location is required'),
], asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const uid = req.user!.uid;
  const experienceData = {
    hostId: uid,
    ...req.body,
    rating: 0,
    reviews: [],
    availability: [],
    bookings: [],
    images: req.body.images || [],
    safetyFeatures: req.body.safetyFeatures || [],
    languages: req.body.languages || ['English'],
    accessibilityInfo: req.body.accessibilityInfo || {
      wheelchairAccessible: false,
      audioGuide: false,
      brailleSignage: false,
      elevatorAccess: false,
      accessibleParking: false,
      accessibleRestrooms: false,
      signLanguageSupport: false,
      notes: ''
    },
    status: 'pending', // Requires approval
    createdAt: new Date(),
    updatedAt: new Date()
  };

  try {
    const experienceRef = await db.collection('experiences').add(experienceData);

    res.status(201).json({
      message: 'Experience created successfully',
      experience: {
        id: experienceRef.id,
        ...experienceData
      }
    });

  } catch (error) {
    console.error('Create experience error:', error);
    throw createError('Failed to create experience', 500);
  }
}));

// Book experience
router.post('/:experienceId/book', [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('participants').isInt({ min: 1 }).withMessage('Number of participants is required'),
], asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const uid = req.user!.uid;
  const { experienceId } = req.params;
  const { date, participants, notes } = req.body;

  try {
    const experienceDoc = await db.collection('experiences').doc(experienceId).get();
    
    if (!experienceDoc.exists) {
      throw createError('Experience not found', 404);
    }

    const experienceData = experienceDoc.data();
    
    // Check availability
    const requestedDate = new Date(date);
    const isAvailable = experienceData?.availability?.some((availableDate: any) => {
      const available = new Date(availableDate.toDate());
      return available.toDateString() === requestedDate.toDateString();
    });

    if (!isAvailable) {
      throw createError('Experience not available on selected date', 400);
    }

    // Check capacity
    if (participants > experienceData?.maxParticipants) {
      throw createError('Exceeds maximum participants limit', 400);
    }

    const bookingData = {
      userId: uid,
      experienceId,
      hostId: experienceData?.hostId,
      date: requestedDate,
      participants,
      notes: notes || '',
      totalPrice: experienceData?.price * participants,
      status: 'pending',
      createdAt: new Date()
    };

    const bookingRef = await db.collection('bookings').add(bookingData);

    // Update experience bookings
    await db.collection('experiences').doc(experienceId).update({
      bookings: db.FieldValue.arrayUnion({
        bookingId: bookingRef.id,
        userId: uid,
        date: requestedDate,
        participants,
        status: 'pending'
      }),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: bookingRef.id,
        ...bookingData
      }
    });

  } catch (error) {
    console.error('Book experience error:', error);
    throw createError('Failed to book experience', 500);
  }
}));

// Add review
router.post('/:experienceId/review', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required'),
], asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const uid = req.user!.uid;
  const { experienceId } = req.params;
  const { rating, comment } = req.body;

  try {
    // Check if user has booked this experience
    const bookingQuery = await db.collection('bookings')
      .where('userId', '==', uid)
      .where('experienceId', '==', experienceId)
      .where('status', '==', 'completed')
      .limit(1)
      .get();

    if (bookingQuery.empty) {
      throw createError('You can only review experiences you have completed', 403);
    }

    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    const reviewData = {
      id: db.collection('experiences').doc().id,
      userId: uid,
      userName: userData?.displayName || 'Anonymous',
      rating,
      comment,
      date: new Date(),
      verified: true
    };

    await db.collection('experiences').doc(experienceId).update({
      reviews: db.FieldValue.arrayUnion(reviewData),
      updatedAt: new Date()
    });

    // Recalculate average rating
    const experienceDoc = await db.collection('experiences').doc(experienceId).get();
    const experienceData = experienceDoc.data();
    const reviews = experienceData?.reviews || [];
    const averageRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length;

    await db.collection('experiences').doc(experienceId).update({
      rating: averageRating
    });

    res.status(201).json({
      message: 'Review added successfully',
      review: reviewData
    });

  } catch (error) {
    console.error('Add review error:', error);
    throw createError('Failed to add review', 500);
  }
}));

export default router;
