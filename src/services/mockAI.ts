// Mock AI Service for Development
export interface AIResponse {
  response: string;
  type?: 'emergency' | 'safety' | 'itinerary' | 'cultural';
  suggestions?: string[];
  confidence?: number;
}

class MockAIService {
  private travelKeywords = {
    safety: ['safe', 'security', 'danger', 'risk', 'crime', 'emergency', 'help', 'protect'],
    planning: ['plan', 'itinerary', 'schedule', 'visit', 'trip', 'travel', 'book', 'hotel', 'flight'],
    cultural: ['culture', 'custom', 'tradition', 'language', 'food', 'etiquette', 'local', 'respect'],
    emergency: ['emergency', 'urgent', 'help', 'police', 'hospital', 'embassy', 'lost', 'stolen']
  };

  private safetyResponses = [
    "Based on current safety data, I recommend staying in well-lit, populated areas and keeping your emergency contacts readily available.",
    "For your safety, consider using verified transportation services and inform someone about your travel plans.",
    "Here are some safety tips: Keep copies of important documents, avoid displaying valuable items, and trust your instincts.",
    "I recommend researching local emergency numbers and the location of your nearest embassy or consulate."
  ];

  private planningResponses = [
    "I'd be happy to help you plan your trip! Let me suggest some must-visit attractions and safe neighborhoods for your destination.",
    "For a well-rounded itinerary, I recommend balancing tourist attractions with local experiences, while prioritizing safety-verified locations.",
    "Based on your preferences, here's a suggested daily schedule with safety-conscious timing and transportation options.",
    "Let me help you create a trip plan that includes safety checkpoints, verified accommodations, and female-friendly spaces."
  ];

  private culturalResponses = [
    "Understanding local customs is important for respectful and safe travel. Here are some key cultural insights for your destination.",
    "To navigate cultural differences safely, I recommend learning basic local etiquette and dress codes appropriate for the region.",
    "Cultural awareness can enhance your safety. Here are important customs and social norms to be aware of during your visit.",
    "Respecting local traditions not only shows courtesy but can also help you blend in safely. Here's what you should know."
  ];

  private emergencyResponses = [
    "🚨 EMERGENCY PROTOCOL ACTIVATED 🚨\n\n1. If you're in immediate danger, call local emergency services\n2. Contact your emergency contacts\n3. Reach out to your embassy if abroad\n4. Stay calm and find a safe location\n\nLocal Emergency Numbers:\n• Police: 112 (Europe), 911 (US/Canada)\n• Medical: Contact local emergency services\n• Embassy: Check your government's travel website",
    "🆘 IMMEDIATE SAFETY STEPS:\n\n1. Move to a safe, public location\n2. Call emergency services if needed\n3. Contact someone you trust\n4. Document the situation if safe to do so\n\nI'm here to help guide you through this. What specific assistance do you need?",
    "🚨 EMERGENCY ASSISTANCE:\n\n• If medical emergency: Seek immediate medical attention\n• If crime/safety threat: Contact police and move to safety\n• If lost: Find landmarks and contact someone you trust\n• If documents stolen: Contact embassy and police\n\nYour safety is the priority. What's your current situation?"
  ];

  async processMessage(
    message: string, 
    assistantType: string = 'general',
    userContext?: any
  ): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const lowerMessage = message.toLowerCase();
    
    // Emergency handling
    if (assistantType === 'emergency' || this.containsKeywords(lowerMessage, this.travelKeywords.emergency)) {
      return {
        response: this.getRandomResponse(this.emergencyResponses),
        type: 'emergency',
        suggestions: ['Contact Emergency Services', 'Find Safe Location', 'Call Embassy', 'Alert Emergency Contacts'],
        confidence: 0.95
      };
    }

    // Safety queries
    if (this.containsKeywords(lowerMessage, this.travelKeywords.safety)) {
      return {
        response: this.getRandomResponse(this.safetyResponses) + this.addLocationContext(userContext),
        type: 'safety',
        suggestions: ['Safety Tips', 'Emergency Contacts', 'Safe Areas', 'Transportation Safety'],
        confidence: 0.85
      };
    }

    // Planning queries
    if (this.containsKeywords(lowerMessage, this.travelKeywords.planning)) {
      return {
        response: this.getRandomResponse(this.planningResponses) + this.addPlanningDetails(lowerMessage, userContext),
        type: 'itinerary',
        suggestions: ['Create Itinerary', 'Book Accommodations', 'Find Attractions', 'Transportation Options'],
        confidence: 0.80
      };
    }

    // Cultural queries
    if (this.containsKeywords(lowerMessage, this.travelKeywords.cultural)) {
      return {
        response: this.getRandomResponse(this.culturalResponses) + this.addCulturalDetails(userContext),
        type: 'cultural',
        suggestions: ['Local Customs', 'Dress Codes', 'Language Tips', 'Cultural Etiquette'],
        confidence: 0.75
      };
    }

    // General travel assistance
    return {
      response: this.generateGeneralResponse(message, userContext),
      suggestions: ['Safety Information', 'Plan Trip', 'Cultural Guide', 'Emergency Help'],
      confidence: 0.70
    };
  }

  private containsKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private addLocationContext(userContext?: any): string {
    if (userContext?.location) {
      return `\n\nFor ${userContext.location.city}, ${userContext.location.country}, I also recommend checking current local safety alerts and weather conditions.`;
    }
    return "\n\nI recommend researching your specific destination for the most current safety information.";
  }

  private addPlanningDetails(message: string, userContext?: any): string {
    let details = "\n\n";
    
    if (message.includes('hotel') || message.includes('accommodation')) {
      details += "🏨 For accommodations, I recommend:\n• Safety-verified hotels with good reviews\n• Well-lit entrances and secure areas\n• Female-friendly properties when traveling solo\n\n";
    }
    
    if (message.includes('transport') || message.includes('flight')) {
      details += "✈️ For transportation:\n• Book verified transport services\n• Share travel details with emergency contacts\n• Keep important documents secure\n\n";
    }
    
    if (userContext?.location) {
      details += `📍 Specific to ${userContext.location.city}: I can provide location-specific recommendations and safety insights.`;
    }

    return details;
  }

  private addCulturalDetails(userContext?: any): string {
    const details = "\n\n🌍 Cultural Guidelines:\n• Research local dress codes\n• Learn basic greetings in the local language\n• Understand tipping customs\n• Respect religious and cultural sites\n• Be aware of local laws and regulations";
    
    if (userContext?.location) {
      return details + `\n\n📍 For ${userContext.location.city}, I can provide specific cultural insights and customs.`;
    }
    
    return details;
  }

  private generateGeneralResponse(_message: string, userContext?: any): string {
    const responses = [
      "I'm here to help with your travel questions! I can assist with safety advice, trip planning, cultural insights, and emergency guidance.",
      "As your SafeSolo AI Assistant, I specialize in safe travel recommendations, personalized itineraries, and real-time safety support.",
      "I can help you plan safer travels with personalized recommendations based on your preferences and current location.",
      "Let me assist you with travel planning, safety considerations, cultural guidance, or any other travel-related questions you might have."
    ];

    let response = this.getRandomResponse(responses);
    
    if (userContext?.location) {
      response += `\n\nI see you're interested in ${userContext.location.city}. I can provide specific local insights and safety recommendations for this destination.`;
    }

    return response + "\n\nWhat specific aspect of your travel would you like help with?";
  }

  async processEmergency(_emergencyContext: any): Promise<AIResponse> {
    // Simulate API delay for emergency (faster response)
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      response: this.getRandomResponse(this.emergencyResponses),
      type: 'emergency',
      suggestions: [
        'Call Local Emergency Services',
        'Contact Embassy',
        'Find Safe Location',
        'Alert Emergency Contacts'
      ],
      confidence: 1.0
    };
  }
}

export const mockAIService = new MockAIService();
