import { smartAI } from './src/services/smartAI';

async function testSmartAI() {
  console.log('🤖 Testing Smart AI Assistant...\n');
  
  const context = {
    userId: 'test-user',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      city: 'Paris',
      country: 'France'
    },
    preferences: {
      riskTolerance: 'medium',
      budget: 'moderate',
      interests: ['culture', 'food', 'museums']
    },
    userProfile: {
      name: 'Test User',
      age: 28,
      travelExperience: 'intermediate'
    }
  };

  try {
    // Test safety assistant
    console.log('🛡️ Testing Safety Assistant:');
    const safetyResponse = await smartAI.chat(
      'Is Paris safe for solo female travelers? What precautions should I take?',
      context,
      'safety'
    );
    console.log(safetyResponse);
    console.log('\n' + '='.repeat(80) + '\n');

    // Test cultural assistant
    console.log('🏛️ Testing Cultural Assistant:');
    const culturalResponse = await smartAI.chat(
      'What are the important cultural etiquette rules I should know for visiting Paris?',
      context,
      'cultural'
    );
    console.log(culturalResponse);
    console.log('\n' + '='.repeat(80) + '\n');

    // Test planner assistant
    console.log('🗺️ Testing Planner Assistant:');
    const plannerResponse = await smartAI.chat(
      'Can you suggest a 3-day itinerary for Paris focusing on art and culture?',
      context,
      'planner'
    );
    console.log(plannerResponse);
    console.log('\n' + '='.repeat(80) + '\n');

    // Test emergency assistant
    console.log('🚨 Testing Emergency Assistant:');
    const emergencyResponse = await smartAI.handleEmergency(
      {
        type: 'medical',
        severity: 'high',
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          address: 'Paris, France'
        },
        description: 'Need immediate medical assistance',
        immediateHelp: true
      },
      context
    );
    console.log(emergencyResponse);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSmartAI();
