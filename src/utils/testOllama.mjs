import { ollamaService } from '../services/ollamaService.js';

async function testOllamaIntegration() {
  console.log('Testing Ollama Integration...\n');

  // Test connection
  console.log('1. Testing connection...');
  const isConnected = await ollamaService.testConnection();
  console.log('Connection status:', isConnected ? 'SUCCESS' : 'FAILED');

  if (!isConnected) {
    console.error('Failed to connect to Ollama. Please ensure Ollama is running.');
    return;
  }

  // Test clinical response
  console.log('\n2. Testing clinical response...');
  const clinicalContext = {
    detectedNeeds: ['anxiety', 'depression'],
    exploredTopics: ['stress', 'sleep'],
    currentState: 'EXPLORING_NEEDS',
    preferences: {
      modality: 'virtual',
      timePreference: 'morning'
    }
  };

  try {
    const clinicalResponse = await ollamaService.generateClinicalResponse(
      "I've been feeling really anxious and depressed lately, and it's affecting my sleep.",
      clinicalContext
    );
    console.log('Clinical Response:', clinicalResponse);
  } catch (error) {
    console.error('Clinical response test failed:', error);
  }

  // Test scheduling response
  console.log('\n3. Testing scheduling response...');
  const schedulingContext = {
    counselorAvailability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: ['9:00 AM - 12:00 PM', '1:00 PM - 4:00 PM']
    },
    schedulingDetails: {
      date: null,
      time: null,
      confirmed: false
    },
    selectedService: {
      name: 'Individual Counseling',
      duration: '50 minutes',
      modalities: ['virtual', 'in-person']
    }
  };

  try {
    const schedulingResponse = await ollamaService.generateSchedulingResponse(
      "I'd like to schedule a virtual session for next week, preferably in the morning.",
      schedulingContext
    );
    console.log('Scheduling Response:', schedulingResponse);
  } catch (error) {
    console.error('Scheduling response test failed:', error);
  }
}

// Run the test
console.log('Starting Ollama integration tests...\n');
testOllamaIntegration()
  .then(() => console.log('\nTests completed'))
  .catch(error => console.error('Test suite error:', error));
