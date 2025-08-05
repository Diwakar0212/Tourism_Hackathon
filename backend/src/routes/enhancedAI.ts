import express from 'express';
import { smartAI, AIContext, EmergencyContext } from '../services/smartAI';

const router = express.Router();

// Middleware for AI context extraction
const extractAIContext = (req: express.Request): AIContext => {
  return {
    userId: req.body.userId || 'anonymous',
    location: req.body.location,
    currentTrip: req.body.currentTrip,
    emergencyContacts: req.body.emergencyContacts,
    userPreferences: req.body.userPreferences,
    conversationHistory: req.body.conversationHistory || []
  };
};

// Enhanced Chat Endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, assistantType = 'safety' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const context = extractAIContext(req);
    const response = await smartAI.chat(message, context, assistantType);
    
    // Update conversation history
    const updatedHistory = [
      ...(context.conversationHistory || []),
      { role: 'user' as const, content: message, timestamp: new Date() },
      { role: 'assistant' as const, content: response, timestamp: new Date() }
    ];

    res.json({
      response,
      assistantType,
      conversationHistory: updatedHistory.slice(-20) // Keep last 20 messages
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      response: 'I apologize, but I cannot process your request right now. Please try again.'
    });
  }
});

// Emergency Response Endpoint
router.post('/emergency', async (req, res) => {
  try {
    const { emergencyContext } = req.body;
    
    if (!emergencyContext) {
      return res.status(400).json({ error: 'Emergency context is required' });
    }

    const userContext = extractAIContext(req);
    const emergencyResponse = await smartAI.handleEmergency(emergencyContext, userContext);
    
    // Log emergency for analytics
    console.log(`EMERGENCY ALERT: ${emergencyContext.type} - ${emergencyContext.severity} - ${emergencyContext.description}`);
    
    res.json({
      emergency: true,
      ...emergencyResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Emergency Response Error:', error);
    res.status(500).json({
      error: 'Emergency system error',
      immediateResponse: 'EMERGENCY: Contact local emergency services immediately. 911 (US), 112 (EU), or local emergency number.',
      actionPlan: ['Call emergency services', 'Ensure immediate safety', 'Contact emergency contacts']
    });
  }
});

// Smart Itinerary Generation
router.post('/generate-itinerary', async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, travelers, interests, safetyPriority } = req.body;
    
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Destination and dates are required' });
    }

    const context = extractAIContext(req);
    const itinerary = await smartAI.generateItinerary({
      destination,
      startDate,
      endDate,
      budget: budget || 1000,
      travelers: travelers || 1,
      interests: interests || ['sightseeing'],
      safetyPriority: safetyPriority || 4,
      context
    });
    
    res.json({
      ...itinerary,
      generatedAt: new Date().toISOString(),
      destination,
      duration: `${startDate} - ${endDate}`
    });
  } catch (error) {
    console.error('Itinerary Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate itinerary',
      message: 'Please try again with different parameters'
    });
  }
});

// Safety Assessment Endpoint
router.post('/assess-safety', async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    const context = extractAIContext(req);
    // Safety assessment is handled through chat with safety assistant type
    const safetyAssessment = await smartAI.chat(
      `Please assess the safety of ${location}. Consider current conditions, crime rates, health risks, and provide safety recommendations.`,
      context,
      'safety'
    );
    
    res.json({
      location,
      assessedAt: new Date().toISOString(),
      response: safetyAssessment
    });
  } catch (error) {
    console.error('Safety Assessment Error:', error);
    res.status(500).json({ 
      error: 'Failed to assess safety',
      overallSafety: 5,
      recommendations: ['Exercise general caution', 'Stay in tourist areas', 'Keep emergency contacts handy']
    });
  }
});

// Cultural Guidance Endpoint
router.post('/cultural-guidance', async (req, res) => {
  try {
    const { destination } = req.body;
    
    if (!destination) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const context = extractAIContext(req);
    // Cultural guidance is handled through chat with cultural assistant type
    const culturalGuidance = await smartAI.chat(
      `Provide cultural guidance for ${destination}. Include local customs, etiquette, taboos to avoid, and essential phrases.`,
      context,
      'cultural'
    );
    
    res.json({
      destination,
      generatedAt: new Date().toISOString(),
      response: culturalGuidance
    });
  } catch (error) {
    console.error('Cultural Guidance Error:', error);
    res.status(500).json({ 
      error: 'Failed to get cultural guidance',
      etiquette: ['Be respectful of local customs'],
      safetyTips: ['Research local customs before traveling']
    });
  }
});

// Personalized Recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const context = extractAIContext(req);
    // Personalized recommendations are handled through chat with planner assistant type
    const recommendations = await smartAI.chat(
      `Provide personalized travel recommendations based on my preferences and travel style. Include accommodations, activities, and local experiences.`,
      context,
      'planner'
    );
    
    res.json({
      generatedAt: new Date().toISOString(),
      userId: context.userId,
      response: recommendations
    });
  } catch (error) {
    console.error('Recommendations Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      destinations: [],
      experiences: [],
      safetyTips: ['Research destinations thoroughly', 'Choose reputable accommodations']
    });
  }
});

// AI Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      chat: 'operational',
      emergency: 'operational',
      itinerary: 'operational',
      safety: 'operational',
      cultural: 'operational',
      recommendations: 'operational'
    },
    version: '2.0.0'
  });
});

// Conversation History
router.get('/history/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    // In a real app, this would fetch from database
    // For now, return empty history
    res.json({
      userId,
      conversations: [],
      totalConversations: 0,
      lastActivity: new Date().toISOString()
    });
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

// AI Analytics
router.get('/analytics', (req, res) => {
  try {
    res.json({
      totalRequests: 1500,
      emergencyResponses: 25,
      itinerariesGenerated: 340,
      safetyAssessments: 180,
      culturalGuidance: 95,
      averageResponseTime: '1.2s',
      successRate: '98.5%',
      mostRequestedFeatures: [
        { feature: 'Safety Assessment', count: 180 },
        { feature: 'Itinerary Generation', count: 340 },
        { feature: 'Cultural Guidance', count: 95 },
        { feature: 'Emergency Response', count: 25 }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ error: 'Failed to fetch AI analytics' });
  }
});

export default router;
