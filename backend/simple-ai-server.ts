import express from 'express';
import cors from 'cors';

// Import the Dynamic AI instead
import { dynamicAI } from './src/services/dynamicAI.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Simple AI chat endpoint for testing
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, assistantType = 'safety', context } = req.body;
    
    console.log(`🤖 AI Chat Request: ${assistantType} - "${message}"`);

    // Create default context if none provided
    const defaultContext = {
      userId: 'demo-user',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        city: 'New York',
        country: 'USA'
      },
      preferences: {
        riskTolerance: 'medium',
        budget: 'moderate',
        interests: ['culture', 'food', 'safety']
      },
      userProfile: {
        name: 'Demo User',
        age: 28,
        travelExperience: 'intermediate'
      },
      ...context
    };
    
    const response = await dynamicAI.chat(message, defaultContext, assistantType);
    
    res.json({
      success: true,
      response,
      assistantType,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process AI request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Emergency endpoint
app.post('/api/ai/emergency', async (req, res) => {
  try {
    const { emergencyContext, userContext } = req.body;
    
    console.log('🚨 Emergency Request:', emergencyContext);
    
    const response = await dynamicAI.handleEmergency(emergencyContext, userContext);
    
    res.json({
      success: true,
      ...response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Emergency Handler Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to handle emergency',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate itinerary endpoint
app.post('/api/ai/generate-itinerary', async (req, res) => {
  try {
    const params = req.body;
    
    console.log('🗺️ Itinerary Request:', params);
    
    const response = await dynamicAI.generateItinerary(params);
    
    res.json({
      success: true,
      itinerary: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Itinerary Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate itinerary',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SafeSolo Smart AI Server',
    timestamp: new Date().toISOString(),
    ai: 'online'
  });
});

// Test endpoint to verify AI is working
app.get('/api/ai/test', async (req, res) => {
  try {
    const testResponse = await dynamicAI.chat(
      'Hello, is the AI working?',
      {
        userId: 'test',
        location: { latitude: 0, longitude: 0, city: 'Test', country: 'Test' },
        userProfile: { name: 'Test' }
      } as any,
      'safety'
    );
    
    res.json({
      status: 'AI is working!',
      testResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'AI test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🤖 Smart AI Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧠 AI Test: http://localhost:${PORT}/api/ai/test`);
  console.log(`💬 AI Chat: http://localhost:${PORT}/api/ai/chat`);
  console.log(`🚨 Emergency: http://localhost:${PORT}/api/ai/emergency`);
  console.log('✅ Smart AI System Ready!');
});
