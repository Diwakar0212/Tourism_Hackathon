import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { AnalyticsController } from '../services/analytics';
import { MonetizationController } from '../services/monetization';

const router = Router();

// Analytics Routes

// Track user event
router.post('/track', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('event').notEmpty().withMessage('Event name is required'),
  body('metadata').optional().isObject(),
  body('location').optional().isObject(),
  body('device').optional().isObject(),
  body('source').optional().isObject()
], AnalyticsController.trackEvent);

// Get user analytics
router.get('/user/:userId', [
  param('userId').notEmpty().withMessage('User ID is required'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], AnalyticsController.getUserAnalytics);

// Get business dashboard
router.get('/dashboard', [
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], AnalyticsController.getDashboard);

// Track safety event
router.post('/safety', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('eventType').isIn([
    'sos_triggered', 
    'check_in_missed', 
    'safe_arrival', 
    'emergency_contact_added', 
    'location_shared'
  ]).withMessage('Invalid event type'),
  body('location').isObject().withMessage('Location is required'),
  body('location.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('severity').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity'),
  body('metadata').optional().isObject()
], AnalyticsController.trackSafetyEvent);

// Get safety analytics
router.get('/safety', [
  query('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
  query('eventType').optional().isIn([
    'sos_triggered', 
    'check_in_missed', 
    'safe_arrival', 
    'emergency_contact_added', 
    'location_shared'
  ]),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], AnalyticsController.getSafetyAnalytics);

// Monetization Routes

// Get subscription plans
router.get('/plans', MonetizationController.getPlans);

// Create subscription
router.post('/subscription', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('planId').notEmpty().withMessage('Plan ID is required'),
  body('paymentMethodId').notEmpty().withMessage('Payment method is required')
], MonetizationController.createSubscription);

// Get user subscription
router.get('/subscription/:userId', [
  param('userId').notEmpty().withMessage('User ID is required')
], MonetizationController.getUserSubscription);

// Cancel subscription
router.delete('/subscription/:userId', [
  param('userId').notEmpty().withMessage('User ID is required'),
  body('immediate').optional().isBoolean()
], MonetizationController.cancelSubscription);

// Purchase premium feature
router.post('/feature', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('featureId').notEmpty().withMessage('Feature ID is required'),
  body('paymentMethodId').notEmpty().withMessage('Payment method is required')
], MonetizationController.purchasePremiumFeature);

// Get user transactions
router.get('/transactions/:userId', [
  param('userId').notEmpty().withMessage('User ID is required')
], MonetizationController.getUserTransactions);

// Get revenue analytics (admin only)
router.get('/revenue', [
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], MonetizationController.getRevenueAnalytics);

// Stripe webhook
router.post('/webhook/stripe', MonetizationController.handleWebhook);

export default router;
