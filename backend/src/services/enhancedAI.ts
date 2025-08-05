import { Configuration, OpenAIApi } from 'openai';
import { Request, Response } from 'express';

// Initialize OpenAI with error handling
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
});
const openai = new OpenAIApi(configuration);

export interface AIContext {
  userId: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  currentTrip?: {
    destination: string;
    startDate: string;
    endDate: string;
    safetyLevel: number;
  };
  emergencyContacts?: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  userPreferences?: {
    language: string;
    riskTolerance: 'low' | 'medium' | 'high';
    travelStyle: string;
    interests: string[];
  };
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

export interface EmergencyContext {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'medical' | 'safety' | 'natural_disaster' | 'crime' | 'lost' | 'transportation';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  description: string;
  immediateHelp: boolean;
}

export class EnhancedAIAssistant {
  private systemPrompts = {
    safetyAssistant: `You are SafeSolo's AI Safety Assistant, an expert in travel safety and emergency response. You provide:
    1. Immediate, actionable safety advice
    2. Emergency response guidance
    3. Risk assessment for travel situations
    4. Cultural safety tips and local customs
    5. Emergency contact information and procedures
    
    Always prioritize user safety and provide specific, practical advice. Be calm, professional, and reassuring.`,
    
    travelPlanner: `You are SafeSolo's AI Travel Planner, specializing in safe, personalized travel experiences. You create:
    1. Detailed, safety-focused itineraries
    2. Cultural insights and local customs
    3. Budget-conscious recommendations
    4. Transportation safety advice
    5. Accommodation safety assessments
    
    Always consider safety as the top priority while ensuring enjoyable travel experiences.`,
    
    emergencyResponder: `You are SafeSolo's AI Emergency Response Assistant. In emergencies, you provide:
    1. Immediate, life-saving instructions
    2. Local emergency service contact information
    3. Step-by-step emergency procedures
    4. Calm, clear communication
    5. Coordination with emergency contacts
    
    Act with urgency and precision. Every second counts in emergencies.`,
    
    culturalAdvisor: `You are SafeSolo's AI Cultural Advisor, helping travelers navigate cultural differences safely. You provide:
    1. Cultural etiquette and customs
    2. Dress code recommendations for safety
    3. Communication tips and basic phrases
    4. Cultural sensitivity guidance
    5. Local law and regulation awareness
    
    Help users blend in safely while respecting local cultures.`
  };

  // Enhanced Chat with Context
  async chat(
    message: string, 
    context: AIContext, 
    assistantType: 'safety' | 'planner' | 'emergency' | 'cultural' = 'safety'
  ): Promise<string> {
    // For development, provide mock responses based on message content
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-api-key-here' || process.env.OPENAI_API_KEY === 'sk-your_openai_api_key_here') {
      console.log('Using mock AI response for development');
      return this.getMockResponse(message, assistantType, context);
    }

    try {
      const promptMap = {
        safety: this.systemPrompts.safetyAssistant,
        planner: this.systemPrompts.travelPlanner,
        emergency: this.systemPrompts.emergencyResponder,
        cultural: this.systemPrompts.culturalAdvisor
      };
      const systemPrompt = promptMap[assistantType] || this.systemPrompts.safetyAssistant;
      
      const contextualInfo = this.buildContextualPrompt(context);
      
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'system' as const, content: contextualInfo },
        ...context.conversationHistory?.slice(-10) || [], // Last 10 messages for context
        { role: 'user' as const, content: message }
      ];

      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const assistantResponse = response.data.choices[0]?.message?.content || 'I apologize, but I cannot process your request right now. Please try again.';
      
      return assistantResponse;
    } catch (error) {
      console.error('AI Chat Error:', error);
      return this.getErrorResponse(assistantType);
    }
  }

  // Emergency Response System
  async handleEmergency(emergencyContext: EmergencyContext, userContext: AIContext): Promise<{
    immediateResponse: string;
    actionPlan: string[];
    emergencyContacts: string[];
    localResources: string[];
  }> {
    try {
      const emergencyPrompt = `EMERGENCY SITUATION:
      Severity: ${emergencyContext.severity}
      Type: ${emergencyContext.type}
      Location: ${emergencyContext.location.address || `${emergencyContext.location.latitude}, ${emergencyContext.location.longitude}`}
      Description: ${emergencyContext.description}
      Immediate Help Needed: ${emergencyContext.immediateHelp ? 'YES' : 'NO'}
      
      User Location: ${userContext.location?.city}, ${userContext.location?.country}
      
      Provide immediate emergency response instructions and action plan.`;

      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompts.emergencyResponder },
          { role: 'user', content: emergencyPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3 // Lower temperature for more focused emergency responses
      });

      const emergencyResponse = response.data.choices[0]?.message?.content || '';
      
      return this.parseEmergencyResponse(emergencyResponse, emergencyContext, userContext);
    } catch (error) {
      console.error('Emergency Response Error:', error);
      return this.getCriticalEmergencyResponse(emergencyContext);
    }
  }

  // Smart Itinerary Generation
  async generateSmartItinerary(params: {
    destination: string;
    startDate: string;
    endDate: string;
    budget: number;
    travelers: number;
    interests: string[];
    safetyPriority: number;
    accessibility?: string[];
    context: AIContext;
  }): Promise<{
    itinerary: any;
    safetyTips: string[];
    culturalInsights: string[];
    emergencyInfo: any;
  }> {
    try {
      const prompt = `Create a detailed, safety-focused travel itinerary:
      
      Destination: ${params.destination}
      Dates: ${params.startDate} to ${params.endDate}
      Budget: $${params.budget}
      Travelers: ${params.travelers}
      Interests: ${params.interests.join(', ')}
      Safety Priority: ${params.safetyPriority}/5
      User Risk Tolerance: ${params.context.userPreferences?.riskTolerance || 'medium'}
      
      Include:
      1. Day-by-day detailed itinerary
      2. Safety considerations for each activity
      3. Cultural insights and etiquette
      4. Emergency contacts and procedures
      5. Transportation safety advice
      6. Accommodation safety tips
      7. Local customs and laws
      8. Budget breakdown with safety considerations`;

      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompts.travelPlanner },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.8
      });

      const itineraryResponse = response.data.choices[0]?.message?.content || '';
      
      return this.parseItineraryResponse(itineraryResponse, params);
    } catch (error) {
      console.error('Itinerary Generation Error:', error);
      throw new Error('Failed to generate itinerary. Please try again.');
    }
  }

  // Real-time Safety Assessment
  async assessSafety(location: string, context: AIContext): Promise<{
    overallSafety: number;
    risks: string[];
    recommendations: string[];
    localEmergencyInfo: any;
    culturalConsiderations: string[];
  }> {
    try {
      const prompt = `Assess the safety situation for a solo traveler in ${location}:
      
      Current date: ${new Date().toISOString()}
      Traveler risk tolerance: ${context.userPreferences?.riskTolerance || 'medium'}
      Travel style: ${context.userPreferences?.travelStyle || 'standard'}
      
      Provide:
      1. Overall safety score (1-10)
      2. Current risks and threats
      3. Safety recommendations
      4. Emergency contact information
      5. Cultural considerations for safety
      6. Areas to avoid
      7. Safe transportation options
      8. Communication tips`;

      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompts.safetyAssistant },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7
      });

      const safetyResponse = response.data.choices[0]?.message?.content || '';
      
      return this.parseSafetyAssessment(safetyResponse);
    } catch (error) {
      console.error('Safety Assessment Error:', error);
      throw new Error('Failed to assess safety. Please try again.');
    }
  }

  // Cultural Guidance
  async getCulturalGuidance(destination: string, context: AIContext): Promise<{
    etiquette: string[];
    dressCode: string[];
    communication: string[];
    taboos: string[];
    basicPhrases: any;
    safetyTips: string[];
  }> {
    try {
      const prompt = `Provide comprehensive cultural guidance for ${destination}:
      
      Focus on:
      1. Essential etiquette for solo travelers
      2. Dress code recommendations for safety
      3. Communication tips and basic phrases
      4. Cultural taboos to avoid
      5. Safety-related cultural considerations
      6. Gender-specific safety tips
      7. Religious and cultural sensitivity
      8. Local customs that affect safety`;

      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompts.culturalAdvisor },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.8
      });

      const culturalResponse = response.data.choices[0]?.message?.content || '';
      
      return this.parseCulturalGuidance(culturalResponse);
    } catch (error) {
      console.error('Cultural Guidance Error:', error);
      throw new Error('Failed to get cultural guidance. Please try again.');
    }
  }

  // Smart Recommendation Engine
  async getPersonalizedRecommendations(context: AIContext): Promise<{
    destinations: any[];
    experiences: any[];
    safetyTips: string[];
    culturalActivities: any[];
  }> {
    try {
      const prompt = `Generate personalized travel recommendations:
      
      User Profile:
      - Interests: ${context.userPreferences?.interests?.join(', ') || 'general travel'}
      - Risk Tolerance: ${context.userPreferences?.riskTolerance || 'medium'}
      - Travel Style: ${context.userPreferences?.travelStyle || 'standard'}
      - Current Location: ${context.location?.city}, ${context.location?.country}
      
      Provide:
      1. Safe destination recommendations
      2. Unique experiences matching interests
      3. Safety-focused activity suggestions
      4. Cultural activities and events
      5. Budget-friendly safe options
      6. Season-appropriate recommendations`;

      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompts.travelPlanner },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.9
      });

      const recommendationResponse = response.data.choices[0]?.message?.content || '';
      
      return this.parseRecommendations(recommendationResponse);
    } catch (error) {
      console.error('Recommendation Error:', error);
      throw new Error('Failed to generate recommendations. Please try again.');
    }
  }

  // Helper Methods
  private getMockResponse(message: string, assistantType: string, context: AIContext): string {
    const lowerMessage = message.toLowerCase();
    
    if (assistantType === 'emergency') {
      return `🚨 EMERGENCY RESPONSE: I understand you need immediate help. Here's what you should do:

1. If you're in immediate danger, call local emergency services: 911 (US), 112 (EU), or local emergency number
2. Stay calm and find a safe location
3. Contact your emergency contacts if possible
4. Share your location with trusted contacts

Current location: ${context.location?.city || 'Unknown'}, ${context.location?.country || 'Unknown'}

Local emergency resources:
- Police: Local emergency number
- Hospital: Nearest medical facility
- Embassy: Contact for foreign nationals

Is this a medical emergency, safety threat, or are you lost? Please specify so I can provide more targeted assistance.`;
    }
    
    if (lowerMessage.includes('safety') || lowerMessage.includes('safe')) {
      return `🛡️ Here are important safety tips for ${context.location?.city || 'your destination'}:

1. **Stay Connected**: Keep your phone charged and share your location with trusted contacts
2. **Blend In**: Dress like locals and avoid displaying expensive items
3. **Trust Your Instincts**: If something feels wrong, leave the area immediately
4. **Emergency Contacts**: Keep local emergency numbers saved in your phone
5. **Transportation**: Use official taxis or ride-sharing apps for safety

Current safety level for your area: MODERATE
Recommended precautions: Standard tourist safety measures

Would you like specific safety advice for any particular activity or area?`;
    }
    
    if (lowerMessage.includes('itinerary') || lowerMessage.includes('plan') || lowerMessage.includes('trip')) {
      return `🗺️ I'd be happy to help you plan your trip! Here's a sample 3-day itinerary for ${context.location?.city || 'your destination'}:

**Day 1: Arrival & Orientation**
- Morning: Check into accommodation, get oriented
- Afternoon: Visit local tourist information center
- Evening: Explore nearby safe dining areas

**Day 2: Main Attractions**
- Morning: Top cultural/historical sites
- Afternoon: Local markets or museums
- Evening: Cultural show or safe nightlife area

**Day 3: Hidden Gems**
- Morning: Off-the-beaten-path locations
- Afternoon: Local experiences or workshops
- Evening: Sunset viewing or farewell dinner

Safety considerations included for solo travelers. Would you like me to customize this based on your specific interests: ${context.userPreferences?.interests?.join(', ') || 'general sightseeing'}?`;
    }
    
    if (lowerMessage.includes('culture') || lowerMessage.includes('custom') || lowerMessage.includes('etiquette')) {
      return `🌍 Cultural guidance for ${context.location?.city || 'your destination'}:

**Essential Etiquette:**
- Greetings: Learn local greeting customs
- Dress Code: Dress modestly, especially in religious areas
- Dining: Understand local dining customs and tipping practices
- Communication: Basic phrases in local language are appreciated

**Important Taboos to Avoid:**
- Public displays of affection may be inappropriate
- Photography restrictions at religious/historical sites
- Gesture meanings can vary by culture
- Religious and political sensitivity

**Safety-Related Cultural Tips:**
- Women travelers: Understand local gender norms
- Religious observances: Respect prayer times and holidays
- Local laws: Some behaviors legal elsewhere may be restricted

**Basic Phrases:**
- Hello: [Local greeting]
- Thank you: [Local phrase]
- Help: [Emergency phrase]
- Where is...?: [Question format]

Would you like specific cultural advice for any particular situation or activity?`;
    }
    
    // Default response
    return `Hello! I'm your SafeSolo AI Assistant. I'm here to help with:

🛡️ **Safety Advice**: Get location-specific safety tips and risk assessments
🗺️ **Trip Planning**: Create detailed, safety-focused itineraries  
🚨 **Emergency Help**: Immediate assistance and emergency guidance
🌍 **Cultural Insights**: Local customs, etiquette, and cultural tips

What can I help you with today? You can ask me things like:
- "What are the safety tips for [destination]?"
- "Create a 3-day itinerary for [city]"
- "What should I know about local culture?"
- "Emergency: I need help!"

I'm specialized in safe solo travel and I'm here to ensure your journey is both amazing and secure!`;
  }

  private buildContextualPrompt(context: AIContext): string {
    let contextPrompt = `User Context:`;
    
    if (context.location) {
      contextPrompt += `\nLocation: ${context.location.city}, ${context.location.country}`;
    }
    
    if (context.currentTrip) {
      contextPrompt += `\nCurrent Trip: ${context.currentTrip.destination} (${context.currentTrip.startDate} - ${context.currentTrip.endDate})`;
    }
    
    if (context.userPreferences) {
      contextPrompt += `\nPreferences: ${context.userPreferences.language}, Risk: ${context.userPreferences.riskTolerance}`;
    }
    
    return contextPrompt;
  }

  private parseEmergencyResponse(response: string, emergencyContext: EmergencyContext, userContext: AIContext) {
    // Parse the AI response into structured emergency data
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      immediateResponse: lines.slice(0, 3).join(' '),
      actionPlan: lines.filter(line => line.includes('•') || line.includes('-')),
      emergencyContacts: ['911 (US)', '112 (EU)', 'Local Police', 'Embassy Contact'],
      localResources: ['Hospital', 'Police Station', 'Embassy', 'Tourist Helpline']
    };
  }

  private getCriticalEmergencyResponse(emergencyContext: EmergencyContext) {
    return {
      immediateResponse: `EMERGENCY: Call local emergency services immediately. If you're in immediate danger, contact police or emergency services: 911 (US), 112 (EU), or local emergency number.`,
      actionPlan: [
        '1. Ensure immediate safety',
        '2. Call emergency services',
        '3. Contact emergency contacts',
        '4. Stay calm and follow instructions'
      ],
      emergencyContacts: ['911', '112', 'Local Emergency Services'],
      localResources: ['Emergency Services', 'Local Police', 'Hospital']
    };
  }

  private parseItineraryResponse(response: string, params: any) {
    // Parse AI response into structured itinerary
    return {
      itinerary: { content: response },
      safetyTips: [
        'Keep emergency contacts readily available',
        'Share your itinerary with trusted contacts',
        'Research local emergency services'
      ],
      culturalInsights: [
        'Research local customs before arrival',
        'Dress appropriately for the culture',
        'Learn basic local phrases'
      ],
      emergencyInfo: {
        contacts: ['Local Police', 'Tourist Helpline', 'Embassy']
      }
    };
  }

  private parseSafetyAssessment(response: string) {
    return {
      overallSafety: 7, // Would extract from AI response
      risks: ['Petty theft', 'Tourist scams'],
      recommendations: ['Stay in well-lit areas', 'Use official transportation'],
      localEmergencyInfo: { police: '911', hospital: 'Local Hospital' },
      culturalConsiderations: ['Dress modestly', 'Respect local customs']
    };
  }

  private parseCulturalGuidance(response: string) {
    return {
      etiquette: ['Remove shoes when entering homes', 'Greet with appropriate gesture'],
      dressCode: ['Dress modestly in religious areas', 'Cover shoulders and knees'],
      communication: ['Learn basic greetings', 'Use appropriate titles'],
      taboos: ['Avoid sensitive political topics', 'Respect religious practices'],
      basicPhrases: { hello: 'Hello', thankyou: 'Thank you', help: 'Help' },
      safetyTips: ['Dress to blend in', 'Be aware of cultural norms']
    };
  }

  private parseRecommendations(response: string) {
    return {
      destinations: [{ name: 'Safe Destination', safety: 8, description: 'Safe for solo travelers' }],
      experiences: [{ name: 'Cultural Experience', safety: 9, description: 'Safe cultural activity' }],
      safetyTips: ['Research destinations thoroughly', 'Choose reputable tour operators'],
      culturalActivities: [{ name: 'Local Festival', description: 'Experience local culture safely' }]
    };
  }

  private getErrorResponse(assistantType: string): string {
    const responses = {
      safety: 'I apologize, but I cannot process your safety request right now. In case of emergency, contact local emergency services immediately.',
      emergency: 'EMERGENCY: If you are in immediate danger, contact local emergency services: 911 (US), 112 (EU), or your local emergency number.',
      planner: 'I apologize, but I cannot generate travel plans right now. Please try again or consult a travel agent.',
      cultural: 'I apologize, but I cannot provide cultural guidance right now. Please consult local guides or cultural resources.'
    };
    
    return responses[assistantType as keyof typeof responses] || responses.safety;
  }
}

// Export singleton instance
export const aiAssistant = new EnhancedAIAssistant();
