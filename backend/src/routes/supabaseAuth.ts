import express from 'express';
import { supabase, supabaseAdmin, supabaseHelpers } from '../config/supabase.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/supabaseAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Register new user
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, fullName, travelPreferences } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({
      error: 'Email, password, and full name are required'
    });
  }

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for demo
      user_metadata: {
        full_name: fullName
      }
    });

    if (authError) {
      return res.status(400).json({
        error: authError.message,
        code: authError.code
      });
    }

    // Create user profile in our users table
    const userProfile = await supabaseHelpers.upsertUser({
      id: authData.user.id,
      email,
      full_name: fullName,
      travel_preferences: travelPreferences || {},
      risk_tolerance: 'medium',
      travel_experience: 'beginner'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        fullName,
        profile: userProfile
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        error: error.message,
        code: error.code
      });
    }

    // Get user profile
    const userProfile = await supabaseHelpers.getUser(data.user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        profile: userProfile
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({
      error: 'Refresh token is required'
    });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      return res.status(401).json({
        error: error.message,
        code: error.code
      });
    }

    res.json({
      message: 'Token refreshed successfully',
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed'
    });
  }
}));

// Get current user profile
router.get('/profile', 
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    try {
      const userProfile = await supabaseHelpers.getUser(req.userId!);
      
      res.json({
        user: userProfile
      });

    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({
        error: 'Failed to fetch user profile'
      });
    }
  })
);

// Update user profile
router.put('/profile',
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const updates = req.body;
    
    try {
      const updatedProfile = await supabaseHelpers.upsertUser({
        id: req.userId!,
        ...updates,
        updated_at: new Date().toISOString()
      });

      res.json({
        message: 'Profile updated successfully',
        user: updatedProfile
      });

    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        error: 'Failed to update profile'
      });
    }
  })
);

// Logout user (invalidate session)
router.post('/logout',
  authenticateToken,
  asyncHandler(async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(500).json({
          error: error.message
        });
      }

      res.json({
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed'
      });
    }
  })
);

// Password reset request
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`
    });

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.json({
      message: 'Password reset email sent'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      error: 'Password reset failed'
    });
  }
}));

// Update password
router.post('/update-password',
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'New password is required'
      });
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.json({
        message: 'Password updated successfully'
      });

    } catch (error) {
      console.error('Password update error:', error);
      res.status(500).json({
        error: 'Password update failed'
      });
    }
  })
);

// Delete account
router.delete('/account',
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    try {
      // Delete user data from our tables first
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', req.userId!);

      // Delete from auth (admin only)
      const { error } = await supabaseAdmin.auth.admin.deleteUser(req.userId!);

      if (error) {
        return res.status(500).json({
          error: error.message
        });
      }

      res.json({
        message: 'Account deleted successfully'
      });

    } catch (error) {
      console.error('Account deletion error:', error);
      res.status(500).json({
        error: 'Account deletion failed'
      });
    }
  })
);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Supabase Authentication',
    timestamp: new Date().toISOString()
  });
});

export default router;
