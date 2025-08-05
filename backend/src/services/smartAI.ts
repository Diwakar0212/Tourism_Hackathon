import { Request, Response } from 'express';

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

export class SmartAIAssistant {
  private knowledgeBase: any;
  private safetyDatabase: any;
  private culturalDatabase: any;
  private destinationDatabase: any;

  constructor() {
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    this.safetyDatabase = {
      general: {
        tips: [
          "Keep your phone charged and carry a portable charger",
          "Share your location with trusted contacts regularly",
          "Trust your instincts - if something feels wrong, leave",
          "Keep copies of important documents in separate places",
          "Avoid displaying expensive items or large amounts of cash",
          "Stay in well-lit, populated areas especially at night",
          "Research local emergency numbers before traveling",
          "Keep emergency contacts easily accessible"
        ],
        emergencyNumbers: {
          US: "911",
          EU: "112",
          UK: "999",
          Australia: "000",
          Canada: "911",
          India: "108",
          Japan: "110"
        }
      },
      destinations: {
        tokyo: {
          safetyRating: 9,
          tips: [
            "Tokyo is extremely safe, but stay aware in crowded areas",
            "Learn basic Japanese phrases for emergencies",
            "Carry cash as many places don't accept cards",
            "Respect train etiquette - no phone calls, quiet conversations"
          ],
          areas: {
            safe: ["Shibuya", "Shinjuku", "Harajuku", "Ginza"],
            caution: ["Kabukicho late at night", "Roppongi bars"]
          }
        },
        paris: {
          safetyRating: 6,
          tips: [
            "Be extra vigilant of pickpockets in tourist areas",
            "Avoid displaying expensive items on metro",
            "Stay alert in crowded areas like Champs-Élysées",
            "Learn basic French emergency phrases"
          ],
          areas: {
            safe: ["Marais", "Saint-Germain", "7th arrondissement"],
            caution: ["Châtelet-Les Halles", "Gare du Nord", "Some suburbs"]
          }
        },
        london: {
          safetyRating: 7,
          tips: [
            "Use official black cabs or licensed minicabs",
            "Stay left when walking, right when escalator",
            "Be aware of your surroundings on public transport",
            "Carry an umbrella and dress in layers"
          ]
        }
      }
    };

    this.culturalDatabase = {
      japan: {
        etiquette: [
          "Bow when greeting, handshakes are becoming common",
          "Remove shoes when entering homes and some restaurants",
          "Don't tip - it's considered rude",
          "Respect personal space and avoid loud conversations in public"
        ],
        taboos: [
          "Don't stick chopsticks upright in rice",
          "Don't point with chopsticks",
          "Don't walk and eat at the same time",
          "Don't blow your nose in public"
        ],
        phrases: {
          hello: "Konnichiwa",
          thankyou: "Arigato gozaimasu",
          excuse_me: "Sumimasen",
          help: "Tasukete"
        }
      },
      france: {
        etiquette: [
          "Always greet with 'Bonjour' when entering shops",
          "Use 'Vous' (formal) unless invited to use 'Tu'",
          "Don't start eating until everyone has been served",
          "Keep hands visible on the table while dining"
        ],
        phrases: {
          hello: "Bonjour",
          thankyou: "Merci",
          excuse_me: "Excusez-moi",
          help: "À l'aide"
        }
      }
    };

    this.destinationDatabase = {
      tokyo: {
        activities: [
          "Visit Senso-ji Temple in Asakusa",
          "Experience the crossing at Shibuya",
          "Explore traditional gardens in Ueno",
          "Try authentic sushi at Tsukiji Outer Market"
        ],
        transportation: "Extensive train system, get a JR Pass for tourists",
        bestTime: "Spring (March-May) or Autumn (September-November)",
        budget: "Expensive but value for money, budget $100-200/day"
      },
      paris: {
        activities: [
          "Visit iconic landmarks: Eiffel Tower, Louvre, Notre-Dame",
          "Stroll along the Seine River",
          "Explore charming neighborhoods like Montmartre",
          "Experience café culture and French cuisine"
        ],
        transportation: "Metro system covers the city well, get a weekly pass",
        bestTime: "April-June or September-October",
        budget: "Moderate to expensive, budget $80-150/day"
      }
    };
  }

  async chat(
    message: string,
    context: AIContext,
    assistantType: 'safety' | 'planner' | 'emergency' | 'cultural' = 'safety'
  ): Promise<string> {
    const lowerMessage = message.toLowerCase();
    const location = context.location?.city?.toLowerCase() || '';
    
    console.log(`AI Assistant (${assistantType}): Processing message - "${message}"`);

    // Always prioritize explicit assistant type first
    if (assistantType === 'emergency') {
      return this.handleEmergencyChat(message, context);
    }
    
    if (assistantType === 'safety') {
      return this.handleSafetyChat(message, context, location);
    }
    
    if (assistantType === 'cultural') {
      return this.handleCulturalChat(message, context, location);
    }
    
    if (assistantType === 'planner') {
      return this.handlePlanningChat(message, context, location);
    }

    // Fallback to keyword matching if assistantType is not specific
    // Emergency responses
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help me') || lowerMessage.includes('urgent')) {
      return this.handleEmergencyChat(message, context);
    }

    // Safety responses
    if (lowerMessage.includes('safety') || lowerMessage.includes('safe') || lowerMessage.includes('danger')) {
      return this.handleSafetyChat(message, context, location);
    }

    // Cultural responses
    if (lowerMessage.includes('culture') || lowerMessage.includes('custom') || lowerMessage.includes('etiquette')) {
      return this.handleCulturalChat(message, context, location);
    }

    // Travel planning responses
    if (lowerMessage.includes('itinerary') || lowerMessage.includes('plan') || lowerMessage.includes('trip') || lowerMessage.includes('visit')) {
      return this.handlePlanningChat(message, context, location);
    }

    // Destination-specific queries
    if (location && this.destinationDatabase[location]) {
      return this.handleDestinationChat(message, context, location);
    }

    // Default conversational responses
    return this.handleDefaultChat(message, context, assistantType);
  }

  private handleEmergencyChat(message: string, context: AIContext): string {
    const location = context.location;
    const country = location?.country?.toLowerCase() || 'unknown';
    
    let emergencyNumber = "your local emergency number";
    if (this.safetyDatabase.general.emergencyNumbers[country]) {
      emergencyNumber = this.safetyDatabase.general.emergencyNumbers[country];
    } else if (country.includes('us') || country.includes('america')) {
      emergencyNumber = "911";
    } else if (country.includes('uk') || country.includes('britain')) {
      emergencyNumber = "999";
    } else if (country.includes('europe')) {
      emergencyNumber = "112";
    }

    return `🚨 **EMERGENCY RESPONSE ACTIVATED**

**IMMEDIATE ACTIONS:**
1. **Call Emergency Services NOW**: ${emergencyNumber}
2. **Share Your Location**: Send GPS coordinates to emergency contacts
3. **Stay Calm**: Take deep breaths and assess your situation
4. **Find Safety**: Move to a safe, public area if possible

**Current Location**: ${location?.city || 'Unknown'}, ${location?.country || 'Unknown'}

**If you're in immediate physical danger**: 
- Call ${emergencyNumber} immediately
- Leave the area safely
- Contact authorities

**For Medical Emergencies**: 
- Call ${emergencyNumber} for ambulance
- Contact your embassy if abroad
- Have your ID and medical info ready

**Need Someone to Talk To?**: 
SafeSolo support is available 24/7 for crisis assistance.

**What type of emergency?** 
Type: 'medical', 'safety threat', 'lost', or 'other' for specific guidance.

**Remember**: Your safety is the top priority. Don't hesitate to contact authorities.`;
  }

  private handleSafetyChat(message: string, context: AIContext, location: string): string {
    const destinationData = this.safetyDatabase.destinations[location];
    const generalTips = this.safetyDatabase.general.tips;
    
    let response = `🛡️ **SAFETY GUIDANCE FOR SOLO TRAVELERS**\n\n`;
    
    if (destinationData) {
      response += `**Safety for ${context.location?.city}:**\n`;
      response += `Safety Rating: ${destinationData.safetyRating}/10\n\n`;
      response += `**Location-Specific Tips:**\n`;
      destinationData.tips.forEach((tip: string, index: number) => {
        response += `${index + 1}. ${tip}\n`;
      });
      
      if (destinationData.areas) {
        response += `\n**Safe Areas:** ${destinationData.areas.safe.join(', ')}\n`;
        response += `**Areas Requiring Caution:** ${destinationData.areas.caution.join(', ')}\n`;
      }
      response += `\n`;
    }
    
    response += `**Universal Safety Tips:**\n`;
    generalTips.slice(0, 6).forEach((tip: string, index: number) => {
      response += `${index + 1}. ${tip}\n`;
    });
    
    response += `\n**Emergency Preparedness:**\n`;
    response += `✅ Save local emergency numbers\n`;
    response += `✅ Share itinerary with trusted contacts\n`;
    response += `✅ Keep emergency cash in multiple places\n`;
    response += `✅ Have backup communication methods\n`;
    response += `✅ Know location of nearest embassy\n`;
    
    response += `\n**Risk Level Assessment:** ${this.assessRiskLevel(context)}\n`;
    
    if (message.includes('night') || message.includes('evening')) {
      response += `\n**Night Safety Extra Tips:**\n`;
      response += `🌙 Stay in well-lit, populated areas\n`;
      response += `🌙 Use official transportation services\n`;
      response += `🌙 Let someone know your plans\n`;
      response += `🌙 Trust your instincts about people and places\n`;
    }
    
    return response;
  }

  private handleCulturalChat(message: string, context: AIContext, location: string): string {
    const country = context.location?.country?.toLowerCase() || location;
    const culturalData = this.culturalDatabase[country];
    
    let response = `🌍 **CULTURAL GUIDANCE FOR RESPECTFUL TRAVEL**\n\n`;
    
    if (culturalData) {
      response += `**Cultural Etiquette for ${context.location?.country}:**\n`;
      culturalData.etiquette.forEach((rule: string, index: number) => {
        response += `${index + 1}. ${rule}\n`;
      });
      
      response += `\n**Important Taboos to Avoid:**\n`;
      culturalData.taboos?.forEach((taboo: string, index: number) => {
        response += `❌ ${taboo}\n`;
      });
      
      response += `\n**Essential Phrases:**\n`;
      Object.entries(culturalData.phrases).forEach(([key, phrase]) => {
        const label = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        response += `• ${label}: "${phrase}"\n`;
      });
    } else {
      response += `**Universal Cultural Guidelines:**\n`;
      response += `1. Research local customs before arrival\n`;
      response += `2. Observe and follow local dress codes\n`;
      response += `3. Learn basic greetings in local language\n`;
      response += `4. Respect religious practices and sites\n`;
      response += `5. Understand tipping customs and practices\n`;
      response += `6. Be mindful of photography restrictions\n`;
      response += `7. Respect personal space and social norms\n`;
      response += `8. Show interest and respect for local traditions\n`;
    }
    
    response += `\n**Cultural Safety Tips:**\n`;
    response += `🔒 Dress appropriately to blend in and stay safe\n`;
    response += `🔒 Be aware of cultural gender norms\n`;
    response += `🔒 Respect local laws and regulations\n`;
    response += `🔒 Avoid sensitive political or religious topics\n`;
    
    response += `\n**Building Cultural Connections:**\n`;
    response += `🤝 Join cultural workshops or cooking classes\n`;
    response += `🤝 Visit local markets and community events\n`;
    response += `🤝 Use cultural exchange platforms\n`;
    response += `🤝 Be open, curious, and respectful\n`;
    
    return response;
  }

  private handlePlanningChat(message: string, context: AIContext, location: string): string {
    const destination = context.location?.city || location;
    const destinationData = this.destinationDatabase[destination];
    const lowerMessage = message.toLowerCase();
    
    let response = `🗺️ **TRAVEL PLANNING ASSISTANCE**\n\n`;
    
    // Analyze the specific request
    if (lowerMessage.includes('itinerary') || lowerMessage.includes('day')) {
      // Extract number of days if mentioned
      const dayMatch = message.match(/(\d+)[\s-]*day/i);
      const days = dayMatch ? parseInt(dayMatch[1]) : 3;
      
      response += `**${days}-Day Itinerary for ${destination ? destination.charAt(0).toUpperCase() + destination.slice(1) : 'Your Destination'}:**\n\n`;
      
      if (destinationData) {
        for (let day = 1; day <= Math.min(days, 5); day++) {
          response += `**Day ${day}:**\n`;
          
          if (day === 1) {
            response += `• Morning: Arrival and check-in\n`;
            response += `• Afternoon: ${destinationData.activities[0] || 'Orientation walk'}\n`;
            response += `• Evening: ${destinationData.cuisine || 'Local dinner'}\n\n`;
          } else if (day === 2) {
            response += `• Morning: ${destinationData.activities[1] || 'Major attraction visit'}\n`;
            response += `• Afternoon: ${destinationData.activities[2] || 'Cultural experience'}\n`;
            response += `• Evening: ${destinationData.nightlife || 'Local entertainment'}\n\n`;
          } else {
            const activityIndex = (day - 1) % destinationData.activities.length;
            response += `• Full day: ${destinationData.activities[activityIndex]}\n`;
            response += `• Evening: Free time or optional activities\n\n`;
          }
        }
        
        response += `**Transportation:** ${destinationData.transportation}\n`;
        response += `**Budget Estimate:** ${destinationData.budget}\n`;
        response += `**Best Time:** ${destinationData.bestTime}\n\n`;
      } else {
        response += `I need more information about your destination to create a specific itinerary. Could you tell me which city you're planning to visit?\n\n`;
      }
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('money')) {
      response += `**Budget Planning for Solo Travel:**\n\n`;
      if (destinationData) {
        response += `**${destination} Budget Breakdown:**\n`;
        response += `• ${destinationData.budget}\n`;
        response += `• Accommodation: $30-80/night (hostels to mid-range)\n`;
        response += `• Food: $15-35/day (street food to restaurants)\n`;
        response += `• Transportation: $5-20/day (public transport)\n`;
        response += `• Activities: $10-50/day (free walking tours to paid attractions)\n\n`;
      } else {
        response += `**General Solo Travel Budget Tips:**\n`;
        response += `• Book accommodation with good reviews in safe areas\n`;
        response += `• Mix of street food and restaurants for authentic experience\n`;
        response += `• Use public transportation when safe and available\n`;
        response += `• Look for free walking tours and city passes\n\n`;
      }
    } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      response += `**Food & Dining Recommendations:**\n\n`;
      if (destinationData) {
        response += `**${destination} Culinary Guide:**\n`;
        response += `• Must-try: ${destinationData.cuisine}\n`;
        response += `• Best areas for food: Ask locals or check recent reviews\n`;
        response += `• Solo dining tips: Counter seating, food halls, lunch specials\n\n`;
      }
      response += `**Solo Dining Safety Tips:**\n`;
      response += `• Choose busy, well-lit restaurants\n`;
      response += `• Sit where you can see the entrance\n`;
      response += `• Trust your instincts about food safety\n`;
      response += `• Keep your phone charged for translation apps\n\n`;
    } else if (lowerMessage.includes('transport') || lowerMessage.includes('getting around')) {
      response += `**Transportation Guide:**\n\n`;
      if (destinationData) {
        response += `**${destination} Transportation:**\n`;
        response += `• ${destinationData.transportation}\n\n`;
      }
      response += `**Solo Travel Transportation Tips:**\n`;
      response += `• Download offline maps before traveling\n`;
      response += `• Keep transportation apps handy\n`;
      response += `• Avoid isolated stops, especially at night\n`;
      response += `• Share your location with trusted contacts\n\n`;
    } else {
      // General planning advice
      response += `**Travel Planning Assistance:**\n\n`;
      response += `I can help you with:\n`;
      response += `• Day-by-day itineraries (just ask for "3-day itinerary for [city]")\n`;
      response += `• Budget planning and cost estimates\n`;
      response += `• Restaurant and food recommendations\n`;
      response += `• Transportation options and safety tips\n`;
      response += `• Activity suggestions based on your interests\n\n`;
      
      if (destinationData) {
        response += `**Quick ${destination} highlights:**\n`;
        response += `• ${destinationData.activities.slice(0, 3).join('\n• ')}\n\n`;
      }
      
      response += `What specific aspect of travel planning would you like help with?\n\n`;
    }
    
    response += `**Safety-First Planning:**\n`;
    response += `✅ Research current safety conditions\n`;
    response += `✅ Book first night accommodation in advance\n`;
    response += `✅ Share itinerary with trusted contacts\n`;
    response += `✅ Keep emergency contacts handy\n`;
    
    return response;
  }
      
      response += `**Day 3 - Cultural Immersion**\n`;
      response += `• Visit local markets or cultural sites\n`;
      response += `• Attend workshops or cultural classes\n`;
      response += `• Connect with other travelers or locals safely\n`;
      response += `• Prepare for departure or next destination\n\n`;
    }
    
    response += `**Safety-First Planning Checklist:**\n`;
    response += `✅ Research destination safety and current events\n`;
    response += `✅ Book first night accommodation in advance\n`;
    response += `✅ Get comprehensive travel insurance\n`;
    response += `✅ Register with your embassy if abroad\n`;
    response += `✅ Download offline maps and translation apps\n`;
    response += `✅ Share detailed itinerary with trusted contacts\n`;
    response += `✅ Pack emergency supplies and medications\n`;
    response += `✅ Research local emergency services and customs\n`;
    
    const interests = context.userPreferences?.interests;
    if (interests && interests.length > 0) {
      response += `\n**Personalized Recommendations based on your interests (${interests.join(', ')}):**\n`;
      interests.forEach((interest: string) => {
        response += `🎯 ${this.getInterestRecommendation(interest)}\n`;
      });
    }
    
    return response;
  }

  private handleDestinationChat(message: string, context: AIContext, location: string): string {
    const destinationData = this.destinationDatabase[location];
    
    let response = `📍 **${location.toUpperCase()} TRAVEL GUIDE**\n\n`;
    
    response += `**Top Experiences:**\n`;
    destinationData.activities.forEach((activity: string, index: number) => {
      response += `${index + 1}. ${activity}\n`;
    });
    
    response += `\n**Getting Around:** ${destinationData.transportation}\n`;
    response += `**Best Time to Visit:** ${destinationData.bestTime}\n`;
    response += `**Budget Planning:** ${destinationData.budget}\n`;
    
    // Add safety info if available
    const safetyData = this.safetyDatabase.destinations[location];
    if (safetyData) {
      response += `\n**Safety Rating:** ${safetyData.safetyRating}/10\n`;
      response += `**Key Safety Tips:**\n`;
      safetyData.tips.slice(0, 3).forEach((tip: string) => {
        response += `• ${tip}\n`;
      });
    }
    
    return response;
  }

  private handleDefaultChat(message: string, context: AIContext, assistantType: string): string {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const isGreeting = greetings.some(greeting => message.toLowerCase().includes(greeting));
    
    if (isGreeting) {
      return `Hello! I'm your SafeSolo AI Assistant, specialized in ${assistantType} guidance. 

🛡️ **Safety Assistant**: Risk assessment and safety tips
🗺️ **Travel Planner**: Itineraries and destination advice  
🚨 **Emergency Response**: Crisis help and immediate assistance
🌍 **Cultural Guide**: Local customs and etiquette

What can I help you with today? You can ask me things like:
• "What are the safety tips for Tokyo?"
• "Create a 3-day itinerary for Paris"
• "What should I know about local culture?"
• "Emergency - I need help!"

How can I assist you with your solo travel plans?`;
    }
    
    // Handle specific questions
    if (message.includes('recommend') || message.includes('suggest')) {
      return this.getGeneralRecommendations(context);
    }
    
    if (message.includes('weather') || message.includes('climate')) {
      return `🌤️ **Weather & Climate Advice:**

**General Weather Safety Tips:**
• Check weather forecasts regularly
• Pack appropriate clothing for all conditions
• Have backup plans for outdoor activities
• Understand seasonal patterns of your destination
• Know signs of dangerous weather conditions

**Packing Essentials:**
🧥 Layer-appropriate clothing
☔ Rain protection (umbrella, raincoat)
🧴 Sun protection (sunscreen, hat, sunglasses)
👟 Comfortable, weather-appropriate footwear
🔋 Portable charger (weather can affect battery life)

For specific weather information, please tell me your destination!`;
    }
    
    return `I'm here to help with ${assistantType} guidance for solo travelers! 

You can ask me about:
• Safety tips and risk assessment
• Travel planning and itineraries
• Cultural customs and etiquette
• Emergency assistance and procedures
• Destination-specific advice
• General travel recommendations

What specific aspect of solo travel would you like to discuss?`;
  }

  private getGeneralRecommendations(context: AIContext): string {
    const riskTolerance = context.userPreferences?.riskTolerance || 'medium';
    const interests = context.userPreferences?.interests || [];
    
    let response = `✨ **PERSONALIZED SOLO TRAVEL RECOMMENDATIONS**\n\n`;
    
    response += `**Based on your profile (Risk Tolerance: ${riskTolerance}):**\n\n`;
    
    if (riskTolerance === 'low') {
      response += `**Safe & Comfortable Options:**\n`;
      response += `🏨 Premium accommodations in safe neighborhoods\n`;
      response += `🚗 Private transfers and guided tours\n`;
      response += `🍽️ Hotel restaurants and well-reviewed establishments\n`;
      response += `📱 24/7 concierge and travel support services\n`;
    } else if (riskTolerance === 'high') {
      response += `**Adventure & Exploration Options:**\n`;
      response += `🎒 Backpacker hostels and local guesthouses\n`;
      response += `🚌 Local public transport and shared rides\n`;
      response += `🍜 Street food and local eateries\n`;
      response += `🏔️ Off-the-beaten-path destinations and activities\n`;
    } else {
      response += `**Balanced Travel Options:**\n`;
      response += `🏨 Mix of hotels and quality hostels\n`;
      response += `🚌 Combination of guided tours and independent exploration\n`;
      response += `🍽️ Local restaurants with good reviews\n`;
      response += `📍 Popular destinations with some hidden gems\n`;
    }
    
    if (interests.length > 0) {
      response += `\n**Based on your interests:**\n`;
      interests.forEach((interest: string) => {
        response += `🎯 ${this.getInterestRecommendation(interest)}\n`;
      });
    }
    
    response += `\n**Universal Solo Travel Tips:**\n`;
    response += `✅ Start with easier destinations if you're new to solo travel\n`;
    response += `✅ Join group activities to meet people safely\n`;
    response += `✅ Keep digital and physical copies of important documents\n`;
    response += `✅ Learn basic phrases in local language\n`;
    response += `✅ Trust your instincts about people and situations\n`;
    response += `✅ Have backup plans for accommodation and transport\n`;
    
    return response;
  }

  private getInterestRecommendation(interest: string): string {
    const recommendations: { [key: string]: string } = {
      'food': 'Join cooking classes, food tours, or visit local markets for authentic experiences',
      'culture': 'Visit museums, cultural sites, attend local festivals and traditional performances',
      'adventure': 'Try hiking, water sports, or outdoor activities with reputable tour companies',
      'history': 'Explore historical sites, museums, and take guided heritage walks',
      'art': 'Visit galleries, art districts, and participate in local art workshops',
      'nature': 'Explore national parks, botanical gardens, and nature reserves',
      'photography': 'Join photo walks, visit scenic viewpoints, and capture local life respectfully',
      'shopping': 'Explore local markets, artisan shops, and unique craft stores',
      'nightlife': 'Research safe nightlife areas and join group activities or tours',
      'music': 'Attend local concerts, music festivals, or traditional music performances'
    };
    
    return recommendations[interest.toLowerCase()] || `Explore local ${interest} opportunities through guided tours or community groups`;
  }

  private assessRiskLevel(context: AIContext): string {
    const location = context.location?.city?.toLowerCase();
    const safetyData = location ? this.safetyDatabase.destinations[location] : null;
    
    if (safetyData) {
      const rating = safetyData.safetyRating;
      if (rating >= 8) return "LOW - Very safe destination";
      if (rating >= 6) return "MODERATE - Standard precautions advised";
      if (rating >= 4) return "ELEVATED - Extra caution recommended";
      return "HIGH - Significant safety measures required";
    }
    
    return "MODERATE - Standard solo travel precautions advised";
  }

  async handleEmergency(emergencyContext: EmergencyContext, userContext: AIContext): Promise<any> {
    const location = userContext.location;
    const country = location?.country?.toLowerCase() || '';
    
    let emergencyNumber = "local emergency services";
    Object.keys(this.safetyDatabase.general.emergencyNumbers).forEach(key => {
      if (country.includes(key)) {
        emergencyNumber = this.safetyDatabase.general.emergencyNumbers[key];
      }
    });

    return {
      immediateResponse: `🚨 EMERGENCY RESPONSE: Call ${emergencyNumber} immediately if you're in immediate danger. Stay calm, find safety, and contact authorities.`,
      actionPlan: [
        `Call ${emergencyNumber} for immediate help`,
        "Move to a safe, public location",
        "Contact emergency contacts and share location",
        "Contact embassy if abroad",
        "Document the incident if safe to do so"
      ],
      emergencyContacts: [emergencyNumber, "Embassy Contact", "SafeSolo Emergency Line"],
      localResources: ["Police Station", "Hospital", "Tourist Police", "Embassy"]
    };
  }

  async generateItinerary(params: any): Promise<any> {
    const destination = params.destination.toLowerCase();
    const days = parseInt(params.endDate) - parseInt(params.startDate) || 3;
    
    return {
      itinerary: {
        destination: params.destination,
        duration: `${days} days`,
        activities: this.destinationDatabase[destination]?.activities || [
          "Explore main city center and landmarks",
          "Visit local markets and cultural sites",
          "Join guided tours or group activities",
          "Experience local cuisine safely"
        ]
      },
      safetyTips: this.safetyDatabase.destinations[destination]?.tips || this.safetyDatabase.general.tips.slice(0, 5),
      culturalInsights: this.culturalDatabase[destination]?.etiquette || [
        "Research local customs before arrival",
        "Learn basic greetings in local language",
        "Respect dress codes and social norms"
      ],
      emergencyInfo: {
        contacts: ["Local Police", "Tourist Helpline", "Embassy"],
        numbers: this.safetyDatabase.general.emergencyNumbers
      }
    };
  }
}

export const smartAI = new SmartAIAssistant();
