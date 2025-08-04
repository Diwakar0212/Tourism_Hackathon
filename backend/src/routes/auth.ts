import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db, auth } from '../config/firebase.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = Router();

// Register user
router.post('/register', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('dateOfBirth').isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').isIn(['female', 'male', 'other', 'prefer-not-to-say']).withMessage('Please select a valid gender'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email, password, firstName, lastName, dateOfBirth, gender, phoneNumber, emergencyContacts } = req.body;

  try {
    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      emailVerified: false
    });

    // Create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      dateOfBirth,
      gender,
      phoneNumber: phoneNumber || null,
      emergencyContacts: emergencyContacts || [],
      role: 'user',
      profile: {
        bio: '',
        interests: [],
        travelStyle: '',
        accessibility: [],
        languages: ['English'],
        safetyPreferences: {
          shareLocationWithContacts: true,
          sosEnabled: true,
          safeRoutePreference: true,
          femaleOnlyServices: gender === 'female',
          autoCheckIn: true,
          checkInInterval: 60
        }
      },
      statistics: {
        tripsCompleted: 0,
        countriesVisited: 0,
        totalSpent: 0,
        carbonFootprint: 0,
        safetyScore: 5.0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      emailVerified: false
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);

    // Generate custom token for immediate login
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified
      },
      customToken
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      throw createError('Email address is already registered', 409);
    }
    
    throw createError('Failed to create user account', 500);
  }
}));

// Login user (Firebase handles authentication, this is for additional user data)
router.post('/login', asyncHandler(async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    throw createError('User ID is required', 400);
  }

  try {
    // Get user profile from Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      throw createError('User profile not found', 404);
    }

    // Update last login
    await db.collection('users').doc(uid).update({
      lastLoginAt: new Date(),
      updatedAt: new Date()
    });

    const userData = userDoc.data();

    res.json({
      message: 'Login successful',
      user: {
        uid: userData?.uid,
        email: userData?.email,
        displayName: userData?.displayName,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        role: userData?.role,
        profile: userData?.profile,
        emailVerified: userData?.emailVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    throw createError('Failed to retrieve user profile', 500);
  }
}));

// Send email verification
router.post('/verify-email', asyncHandler(async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    throw createError('User ID is required', 400);
  }

  try {
    // Generate email verification link
    const link = await auth.generateEmailVerificationLink(
      (await auth.getUser(uid)).email!,
      {
        url: `${process.env.FRONTEND_URL}/email-verified`,
      }
    );

    // Here you would typically send the email using your email service
    // For now, we'll just return the link
    
    res.json({
      message: 'Verification email sent successfully',
      verificationLink: link // Remove this in production
    });

  } catch (error) {
    console.error('Email verification error:', error);
    throw createError('Failed to send verification email', 500);
  }
}));

// Reset password
router.post('/reset-password', [
  body('email').isEmail().withMessage('Please provide a valid email')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email } = req.body;

  try {
    const link = await auth.generatePasswordResetLink(email, {
      url: `${process.env.FRONTEND_URL}/reset-password-complete`,
    });

    // Here you would send the email using your email service
    
    res.json({
      message: 'Password reset email sent successfully',
      resetLink: link // Remove this in production
    });

  } catch (error: any) {
    console.error('Password reset error:', error);
    
    if (error.code === 'auth/user-not-found') {
      throw createError('No user found with this email address', 404);
    }
    
    throw createError('Failed to send password reset email', 500);
  }
}));

// Logout (client-side operation, but we can track it)
router.post('/logout', asyncHandler(async (req, res) => {
  const { uid } = req.body;

  if (uid) {
    try {
      await db.collection('users').doc(uid).update({
        lastLogoutAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Logout tracking error:', error);
    }
  }

  res.json({
    message: 'Logout successful'
  });
}));

export default router;
