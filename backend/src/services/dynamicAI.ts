import { AIContext, EmergencyContext } from './smartAI.js';

// Create a message-aware AI assistant that gives different responses based on content
export class DynamicAIAssistant {
  
  // Analyze message and provide contextual responses
  async chat(
    message: string,
    context: AIContext,
    assistantType: 'safety' | 'planner' | 'emergency' | 'cultural' = 'safety'
  ): Promise<string> {
    const lowerMessage = message.toLowerCase();
    const location = context.location?.city || 'your destination';
    
    console.log(`🤖 Dynamic AI (${assistantType}): "${message}"`);

    // Emergency responses - only trigger on explicit emergency requests or very urgent keywords
    if (assistantType === 'emergency' || 
        lowerMessage.includes('emergency') || 
        lowerMessage.includes('urgent help') ||
        lowerMessage.includes('danger') ||
        lowerMessage.includes('lost and scared') ||
        lowerMessage.match(/\b(sos|911|112)\b/)) {
      return this.getEmergencyResponse(message, context);
    }

    // Safety responses
    if (assistantType === 'safety') {
      return this.getSafetyResponse(message, context, location);
    }

    // Cultural responses  
    if (assistantType === 'cultural') {
      return this.getCulturalResponse(message, context, location);
    }

    // Planning responses
    if (assistantType === 'planner') {
      return this.getPlanningResponse(message, context, location);
    }

    return this.getGeneralResponse(message, context);
  }

  private getSafetyResponse(message: string, context: AIContext, location: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('tokyo')) {
      return `🛡️ **TOKYO SAFETY GUIDE**

**Overall Safety:** Tokyo is one of the world's safest cities! 🟢

**Key Safety Tips:**
• Crime rate is extremely low - violent crime is rare
• Pickpocketing can occur in crowded areas like Shibuya, Shinjuku
• Train system is very safe, even late at night
• Natural disasters: Be earthquake-aware, know evacuation procedures
• Stay alert during festivals and major events (crowds)

**Safe Areas:** Shibuya, Harajuku, Ginza, Asakusa - all very tourist-friendly
**Night Safety:** Generally safe to walk alone, but stick to well-lit areas

**Emergency Numbers:** 
• Police: 110 • Fire/Ambulance: 119 • Tourist Hotline: 050-3816-2787

**Solo Female Travel:** Tokyo is considered one of the safest cities for solo female travelers worldwide!`;
    }

    if (lowerMessage.includes('paris')) {
      return `🛡️ **PARIS SAFETY GUIDE**

**Overall Safety:** Moderately safe with standard precautions 🟡

**Key Safety Tips:**
• Pickpocketing is common near tourist sites (Eiffel Tower, Louvre, Metro)
• Avoid displaying expensive items, keep bags zipped and in front
• Metro is generally safe, but be cautious late at night
• Tourist scams: Petition signers, gold ring scams, distraction theft

**Areas to be cautious:** Châtelet-Les Halles, Gare du Nord at night, some suburbs
**Safe areas:** Marais, Saint-Germain, 7th arrondissement

**Emergency Numbers:**
• Police: 17 • Medical: 15 • Fire: 18 • Tourist Police: +33 1 53 71 53 71

**Solo Female Travel:** Generally safe with normal city precautions. Trust your instincts!`;
    }

    if (lowerMessage.includes('london')) {
      return `🛡️ **LONDON SAFETY GUIDE**

**Overall Safety:** Very safe with awareness 🟢

**Key Safety Tips:**
• Pickpocketing in tourist areas and on public transport
• Be aware of your surroundings, especially in crowded areas
• Tube is generally safe, but avoid empty carriages late at night
• Weather: Always carry an umbrella and warm clothes

**Safe Areas:** Most of central London, Covent Garden, South Bank, Camden
**Areas needing caution:** Some areas late at night, check local advice

**Emergency Numbers:**
• Emergency: 999 • Non-emergency Police: 101 • NHS: 111

**Solo Female Travel:** London is very safe for solo female travelers with standard city precautions.`;
    }

    // Generic safety response
    return `🛡️ **SOLO TRAVEL SAFETY TIPS**

**General Precautions:**
• Research your destination's current safety situation
• Share your itinerary with trusted contacts
• Keep emergency contacts easily accessible
• Trust your instincts - if something feels off, leave
• Stay in well-reviewed accommodations in safe areas

**While Traveling:**
• Keep copies of important documents separate from originals
• Don't flash expensive items or large amounts of cash
• Use official transportation when possible
• Stay connected - keep your phone charged
• Learn basic local phrases including emergency words

**Accommodation Safety:**
• Book first night in advance
• Choose places with good reviews and security
• Know your neighborhood layout
• Locate nearest police station, hospital, embassy

Which specific destination are you asking about? I can provide more targeted safety advice!`;
  }

  private getCulturalResponse(message: string, context: AIContext, location: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('japan') || lowerMessage.includes('tokyo')) {
      return `🏮 **JAPANESE CULTURAL ETIQUETTE**

**Essential Customs:**
• Bowing is common - a slight nod is fine for tourists
• Remove shoes when entering homes, some restaurants, temples
• Don't eat or drink while walking
• Quiet behavior on trains - no phone calls

**Dining Etiquette:**
• Say "Itadakimasu" before eating, "Gochisousama" after
• Don't stick chopsticks upright in rice
• Slurping noodles is acceptable and shows appreciation
• Tipping is not customary and can be offensive

**Temple/Shrine Etiquette:**
• Bow before entering shrine gates
• Purify hands and mouth at water basin
• Make offerings quietly and respectfully
• Photography may be restricted - ask or look for signs

**Essential Phrases:**
• Hello: "Konnichiwa" • Thank you: "Arigato gozaimasu"
• Excuse me: "Sumimasen" • Sorry: "Gomen nasai"`;
    }

    if (lowerMessage.includes('france') || lowerMessage.includes('paris')) {
      return `🇫🇷 **FRENCH CULTURAL ETIQUETTE**

**Social Customs:**
• Always greet with "Bonjour" when entering shops/restaurants
• Use "Vous" (formal) unless invited to use "Tu" (informal)
• French people value politeness - always say please/thank you
• Personal space is important - avoid being overly familiar

**Dining Culture:**
• Wait for "Bon appétit" before eating
• Keep hands visible on the table while dining
• Don't cut salad with a knife - fold it with your fork
• Bread goes directly on the table, not on your plate

**Social Interactions:**
• Dress well - French people value style and presentation
• Don't speak loudly in public spaces
• Making an effort to speak French is highly appreciated
• Avoid sensitive topics about politics or religion with strangers

**Essential Phrases:**
• Hello: "Bonjour" • Thank you: "Merci"
• Please: "S'il vous plaît" • Excuse me: "Excusez-moi"`;
    }

    // Generic cultural response
    return `🌍 **CULTURAL AWARENESS TIPS**

**Research Before You Go:**
• Learn about local customs, traditions, and taboos
• Understand appropriate dress codes, especially for religious sites
• Know basic greetings and polite phrases
• Research tipping customs and dining etiquette

**Respectful Travel:**
• Observe and follow local behavior cues
• Ask permission before photographing people
• Respect religious and cultural sites
• Be open-minded and non-judgmental

**Building Connections:**
• Show genuine interest in local culture
• Be patient with language barriers
• Support local businesses and artisans
• Join cultural activities or workshops when possible

**Common Courtesy:**
• Dress appropriately for the local culture
• Learn basic phrases in the local language
• Be respectful of local customs even if different from yours
• Show appreciation for local hospitality

Which specific destination are you asking about? I can provide more detailed cultural guidance!`;
  }

  private getPlanningResponse(message: string, context: AIContext, location: string): string {
    const lowerMessage = message.toLowerCase();

    // Check for specific destinations
    if (lowerMessage.includes('tokyo')) {
      return `🗾 **3-DAY TOKYO ITINERARY**

**Day 1 - Traditional Tokyo**
• Morning: Visit Senso-ji Temple in Asakusa
• Afternoon: Explore traditional Ueno district and museums
• Evening: Dinner in Shibuya and experience the famous crossing

**Day 2 - Modern Tokyo**
• Morning: Tsukiji Outer Market for fresh sushi breakfast
• Afternoon: Harajuku fashion district and Meiji Shrine
• Evening: Tokyo Skytree or Tokyo Tower for city views

**Day 3 - Local Experiences**
• Morning: Day trip to Nikko or Kamakura (historic temples)
• Afternoon: Ginza for shopping or Akihabara for tech culture
• Evening: Traditional izakaya dinner in Shinjuku

**Transportation:** Get a JR Pass for unlimited train travel
**Budget:** $80-150/day including accommodation
**Best Time:** Spring (cherry blossoms) or Fall (mild weather)`;
    }

    if (lowerMessage.includes('paris')) {
      return `🗼 **3-DAY PARIS ITINERARY**

**Day 1 - Classic Paris**
• Morning: Eiffel Tower and Trocadéro Gardens
• Afternoon: Seine River cruise and Notre-Dame area
• Evening: Dinner in Saint-Germain district

**Day 2 - Art & Culture**
• Morning: Louvre Museum (book skip-the-line tickets)
• Afternoon: Walk through Tuileries to Champs-Élysées
• Evening: Montmartre and Sacré-Cœur at sunset

**Day 3 - Local Experiences**
• Morning: Marais district walking tour
• Afternoon: Luxembourg Gardens and Latin Quarter
• Evening: Cooking class or wine tasting experience

**Transportation:** Metro day passes, very efficient system
**Budget:** $100-180/day including accommodation
**Best Time:** Late spring or early fall for pleasant weather`;
    }

    if (lowerMessage.includes('barcelona')) {
      return `🏛️ **3-DAY BARCELONA ITINERARY**

**Day 1 - Gaudí's Masterpieces**
• Morning: Sagrada Familia (book timed entry tickets)
• Afternoon: Park Güell and Gràcia neighborhood
• Evening: Tapas tour in Gothic Quarter

**Day 2 - Old Town & Beach**
• Morning: Gothic Quarter and Barcelona Cathedral
• Afternoon: Las Ramblas and Boquería Market
• Evening: Barceloneta Beach and seafood dinner

**Day 3 - Art & Local Life**
• Morning: Picasso Museum and El Born district
• Afternoon: Passeig de Gràcia shopping and Casa Batlló
• Evening: Flamenco show or local music venue

**Transportation:** Metro and walking, very walkable city
**Budget:** $70-140/day including accommodation
**Best Time:** Late spring through early fall`;
    }

    // Generic planning response
    if (lowerMessage.includes('itinerary') || lowerMessage.includes('plan') || lowerMessage.includes('day')) {
      return `🗺️ **TRAVEL PLANNING ASSISTANCE**

I'd love to help you create a personalized itinerary! To give you the best recommendations, could you tell me:

**Essential Details:**
• Which city/destination are you visiting?
• How many days will you be there?
• What are your main interests? (culture, food, history, nightlife, nature, etc.)
• What's your approximate budget per day?
• Any specific things you want to see or do?

**Popular Destinations I Can Help With:**
• Tokyo, Japan - Traditional culture meets modern innovation
• Paris, France - Art, culture, and incredible cuisine
• Barcelona, Spain - Architecture, beaches, and vibrant life
• London, UK - History, museums, and diverse neighborhoods
• Rome, Italy - Ancient history and amazing food

**Planning Tips:**
✅ Book accommodation for first night in advance
✅ Research local transportation options
✅ Check if popular attractions need advance booking
✅ Leave some time for spontaneous discoveries
✅ Plan for different weather scenarios

Just tell me your destination and I'll create a detailed day-by-day itinerary for you!`;
    }

    return `🎯 **TRAVEL PLANNING HELP**

I can assist you with:
• **Day-by-day itineraries** for major cities
• **Budget planning** and cost estimates  
• **Transportation** advice and options
• **Accommodation** recommendations
• **Food & dining** suggestions
• **Activity planning** based on your interests

What specific aspect of your trip planning do you need help with?`;
  }

  private getEmergencyResponse(message: string, context: AIContext): string {
    const location = context.location?.city || 'your location';
    
    return `🚨 **EMERGENCY ASSISTANCE**

**IMMEDIATE ACTIONS:**
1. **Stay Calm** - Keep a clear head to make good decisions
2. **Assess Situation** - Are you in immediate physical danger?
3. **Get to Safety** - Move to a public, well-lit area if possible

**LOCAL EMERGENCY NUMBERS:**
• **Universal Emergency: 112** (works in most countries)
• **Police: 110/911/999** (varies by country)
• **Medical: Call local emergency services**

**IF YOU'RE LOST:**
• Use your phone's GPS/maps app
• Look for landmarks, street signs, or business names
• Ask locals or go into a shop/restaurant for help
• Contact your accommodation for directions

**COMMUNICATION:**
• Contact someone you trust immediately
• Share your location via phone if possible
• Keep your phone charged (find a place to charge if needed)

**IMPORTANT:**
• Trust your instincts about people and situations
• Don't hesitate to make noise/draw attention if threatened
• Embassy contact info should be saved in your phone

**What specific help do you need right now?** I can provide more targeted assistance based on your situation.

Are you safe? Do you need me to help you find local emergency contacts for ${location}?`;
  }

  private getGeneralResponse(message: string, context: AIContext): string {
    return `👋 **Hello! I'm your SafeSolo AI Assistant**

I can help you with:
🛡️ **Safety advice** - destination-specific tips and precautions
🗺️ **Travel planning** - itineraries, budgets, and recommendations  
🌍 **Cultural guidance** - local customs, etiquette, and traditions
🚨 **Emergency assistance** - crisis response and local emergency info

**Just ask me something like:**
• "Is Tokyo safe for solo travelers?"
• "Create a 3-day itinerary for Paris"
• "What are the cultural customs in Japan?"
• "Emergency: I need help!"

**What would you like help with today?**`;
  }

  // Emergency handler (separate method for compatibility)
  async handleEmergency(emergencyContext: EmergencyContext, userContext: AIContext): Promise<any> {
    return {
      immediateResponse: "🚨 EMERGENCY RESPONSE: Call local emergency services immediately if you're in immediate danger. Stay calm, find safety, and contact authorities.",
      actionPlan: [
        'Call local emergency services for immediate help',
        'Move to a safe, public location',
        'Contact emergency contacts and share location',
        'Contact embassy if abroad',
        'Document the incident if safe to do so'
      ],
      emergencyContacts: [
        'Local Emergency Services: 112 (Universal)',
        'Embassy Contact',
        'SafeSolo Emergency Line: +1-800-SAFE-SOLO'
      ],
      localResources: ['Police Station', 'Hospital', 'Tourist Police', 'Embassy']
    };
  }

  // Itinerary generator (for compatibility)
  async generateItinerary(params: any): Promise<any> {
    const { destination, days = 3, interests = [] } = params;
    
    return {
      destination,
      days,
      itinerary: `I'd be happy to create a ${days}-day itinerary for ${destination}! 
      
To give you the best recommendations, could you tell me more about your interests: ${interests.join(', ')}?

For now, here's a general framework:
- Day 1: Arrival and orientation
- Day 2: Main attractions and cultural sites  
- Day 3: Local experiences and hidden gems

Would you like me to create a detailed day-by-day plan? Just ask: "Create a detailed itinerary for ${destination}"!`,
      createdAt: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const dynamicAI = new DynamicAIAssistant();
