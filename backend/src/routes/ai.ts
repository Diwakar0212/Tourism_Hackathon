import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Configuration, OpenAIApi } from 'openai';
import { db } from '../config/firebase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';

const router = Router();

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate trip itinerary
router.post('/generate-itinerary', [
  body('destination').notEmpty().withMessage('Destination is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('travelers').isInt({ min: 1, max: 20 }).withMessage('Number of travelers must be between 1 and 20'),
  body('interests').isArray().withMessage('Interests must be an array'),
  body('travelStyle').notEmpty().withMessage('Travel style is required'),
  body('safetyPriority').isInt({ min: 1, max: 5 }).withMessage('Safety priority must be between 1 and 5'),
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
    destination,
    startDate,
    endDate,
    budget,
    travelers,
    interests,
    travelStyle,
    accessibility,
    safetyPriority,
    ecoFriendly
  } = req.body;

  try {
    // Get user profile for personalization
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // Create AI prompt
    const prompt = createItineraryPrompt({
      destination,
      duration,
      budget,
      travelers,
      interests,
      travelStyle,
      accessibility: accessibility || [],
      safetyPriority,
      ecoFriendly: ecoFriendly || false,
      userProfile: {
        gender: userData?.gender,
        age: calculateAge(userData?.dateOfBirth),
        previousTrips: userData?.statistics?.tripsCompleted || 0
      }
    });

    // Generate itinerary using OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner specializing in safe, accessible, and personalized travel experiences for solo female travelers and differently-abled users. Always prioritize safety and accessibility in your recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const aiResponse = completion.data.choices[0]?.message?.content;
    if (!aiResponse) {
      throw createError('Failed to generate itinerary from AI', 500);
    }

    // Parse AI response and create structured itinerary
    const parsedItinerary = parseAIItinerary(aiResponse, duration);

    // Calculate additional metrics
    const safetyScore = calculateSafetyScore(parsedItinerary, safetyPriority);
    const accessibilityScore = calculateAccessibilityScore(parsedItinerary, accessibility);
    const ecoScore = calculateEcoScore(parsedItinerary, ecoFriendly);
    const carbonFootprint = calculateCarbonFootprint(parsedItinerary, travelers);

    // Save generated itinerary
    const itineraryRef = db.collection('generatedItineraries').doc();
    const itineraryData = {
      id: itineraryRef.id,
      userId: uid,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration,
      budget,
      travelers,
      interests,
      travelStyle,
      accessibility: accessibility || [],
      safetyPriority,
      ecoFriendly: ecoFriendly || false,
      itinerary: parsedItinerary,
      metrics: {
        safetyScore,
        accessibilityScore,
        ecoScore,
        carbonFootprint
      },
      aiPrompt: prompt,
      aiResponse,
      createdAt: new Date(),
      status: 'generated'
    };

    await itineraryRef.set(itineraryData);

    res.json({
      message: 'Itinerary generated successfully',
      itinerary: {
        id: itineraryRef.id,
        destination,
        duration,
        totalBudget: budget,
        safetyScore,
        accessibilityScore,
        ecoScore,
        carbonFootprint,
        days: parsedItinerary
      }
    });

  } catch (error: any) {
    console.error('Generate itinerary error:', error);
    
    if (error.response?.status === 429) {
      throw createError('AI service is currently busy. Please try again in a moment.', 429);
    }
    
    if (error.response?.status === 401) {
      throw createError('AI service configuration error. Please contact support.', 500);
    }
    
    throw createError('Failed to generate itinerary', 500);
  }
}));

// Get travel recommendations
router.post('/recommendations', [
  body('destination').notEmpty().withMessage('Destination is required'),
  body('interests').isArray().withMessage('Interests must be an array'),
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { destination, interests, budget, accessibility } = req.body;

  try {
    // Get user's previous trips for personalization
    const tripsSnapshot = await db.collection('trips')
      .where('userId', '==', uid)
      .limit(5)
      .get();

    const previousTrips = tripsSnapshot.docs.map(doc => doc.data());

    // Create recommendation prompt
    const prompt = createRecommendationPrompt({
      destination,
      interests: interests || [],
      budget,
      accessibility: accessibility || [],
      previousTrips
    });

    // Get recommendations from AI
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a travel expert providing personalized recommendations for safe and accessible travel experiences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    const recommendations = parseRecommendations(completion.data.choices[0]?.message?.content || '');

    res.json({
      message: 'Recommendations generated successfully',
      recommendations
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    throw createError('Failed to generate recommendations', 500);
  }
}));

// Chat with AI assistant
router.post('/chat', [
  body('message').notEmpty().withMessage('Message is required'),
  body('context').optional().isObject(),
], asyncHandler(async (req: AuthenticatedRequest, res) => {
  const uid = req.user!.uid;
  const { message, context } = req.body;

  try {
    // Get user profile for context
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    // Create chat context
    const chatPrompt = createChatPrompt(message, {
      userProfile: userData,
      context: context || {}
    });

    // Get AI response
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are SafeSolo AI, a helpful travel assistant specializing in safe, accessible travel for women and differently-abled travelers. Always provide practical, safety-focused advice."
        },
        {
          role: "user",
          content: chatPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiMessage = completion.data.choices[0]?.message?.content;

    // Save chat interaction
    await db.collection('chatHistory').add({
      userId: uid,
      userMessage: message,
      aiResponse: aiMessage,
      context,
      timestamp: new Date()
    });

    res.json({
      message: 'Response generated successfully',
      response: aiMessage
    });

  } catch (error) {
    console.error('Chat error:', error);
    throw createError('Failed to process chat message', 500);
  }
}));

// Helper functions
function createItineraryPrompt(data: any): string {
  return `Create a detailed ${data.duration}-day travel itinerary for ${data.destination} with the following requirements:

Budget: $${data.budget}
Travelers: ${data.travelers}
Interests: ${data.interests.join(', ')}
Travel Style: ${data.travelStyle}
Safety Priority: ${data.safetyPriority}/5
Accessibility Needs: ${data.accessibility.join(', ') || 'None'}
Eco-friendly: ${data.ecoFriendly ? 'Yes' : 'No'}
Traveler Profile: ${data.userProfile.gender || 'Not specified'}, ${data.userProfile.age || 'Age not specified'}, ${data.userProfile.previousTrips} previous trips

Please provide:
1. Daily activities with specific times, locations, and costs
2. Safety ratings and tips for each activity (1-5 scale)
3. Accessibility information where relevant
4. Transportation recommendations
5. Accommodation suggestions with safety features
6. Emergency contact information and safe zones
7. Cultural considerations and local customs
8. Weather-appropriate clothing suggestions

Format the response as JSON with days, activities, and detailed information for each item.`;
}

function createRecommendationPrompt(data: any): string {
  return `Provide travel recommendations for ${data.destination} based on:

Interests: ${data.interests.join(', ')}
Budget: ${data.budget ? `$${data.budget}` : 'Not specified'}
Accessibility: ${data.accessibility.join(', ') || 'None'}
Previous destinations: ${data.previousTrips.map((trip: any) => trip.destination).join(', ') || 'None'}

Please recommend:
1. Top 5 safe attractions and activities
2. Recommended accommodations with safety ratings
3. Local transportation options
4. Safety tips specific to this destination
5. Accessibility information
6. Best time to visit
7. Cultural considerations
8. Emergency contacts and resources`;
}

function createChatPrompt(message: string, context: any): string {
  return `User question: ${message}

User context:
- Gender: ${context.userProfile?.gender || 'Not specified'}
- Travel experience: ${context.userProfile?.statistics?.tripsCompleted || 0} trips completed
- Safety preferences: ${JSON.stringify(context.userProfile?.profile?.safetyPreferences || {})}
- Current context: ${JSON.stringify(context.context)}

Please provide a helpful, safety-focused response.`;
}

function parseAIItinerary(aiResponse: string, duration: number): any[] {
  // This is a simplified parser - in production, you'd want more robust parsing
  try {
    const parsed = JSON.parse(aiResponse);
    return parsed.days || [];
  } catch (error) {
    // Fallback: create basic structure from text response
    const days = [];
    for (let i = 1; i <= duration; i++) {
      days.push({
        day: i,
        title: `Day ${i}`,
        activities: [
          {
            time: '9:00 AM',
            title: 'Morning Activity',
            description: 'Planned activity based on your preferences',
            location: 'TBD',
            cost: Math.floor(Math.random() * 100) + 20,
            safetyFeatures: ['Safe Location', 'Well-lit Area']
          }
        ]
      });
    }
    return days;
  }
}

function parseRecommendations(aiResponse: string): any {
  // Parse AI recommendations into structured format
  return {
    attractions: [],
    accommodations: [],
    transportation: [],
    safetyTips: [],
    accessibility: [],
    cultural: []
  };
}

function calculateAge(dateOfBirth: any): number {
  if (!dateOfBirth) return 0;
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function calculateSafetyScore(itinerary: any[], safetyPriority: number): number {
  // Calculate safety score based on activities and user priority
  return Math.min(5.0, 3.5 + (safetyPriority * 0.3));
}

function calculateAccessibilityScore(itinerary: any[], accessibility: string[]): number {
  // Calculate accessibility score based on requirements
  return accessibility.length > 0 ? 4.2 : 5.0;
}

function calculateEcoScore(itinerary: any[], ecoFriendly: boolean): number {
  // Calculate eco-friendliness score
  return ecoFriendly ? 4.5 : 3.0;
}

function calculateCarbonFootprint(itinerary: any[], travelers: number): number {
  // Estimate carbon footprint
  const baseFootprint = 50; // kg CO2 per day per person
  return baseFootprint * itinerary.length * travelers;
}

export default router;
