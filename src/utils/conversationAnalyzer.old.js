// Advanced conversation analyzer with Ollama integration
import { counselingResponses, counselorProfile, schedulingQuestions, responseTemplates } from '../data/counselingData';
import { ollamaService } from '../services/ollamaService';

// Enhanced conversation state tracking
const ConversationState = {
  INITIAL: 'initial',
  EXPLORING_NEEDS: 'exploring_needs',
  PROVIDING_GUIDANCE: 'providing_guidance',
  SERVICE_SELECTION: 'service_selection',
  SCHEDULING_INTENT: 'scheduling_intent',
  SCHEDULING_PROCESS: 'scheduling_process',
  SCHEDULING_CONFIRMATION: 'scheduling_confirmation',
  FOLLOW_UP: 'follow_up'
};

// Enhanced pattern recognition for intent
const intentPatterns = {
  scheduling: [
    'appointment', 'schedule', 'book', 'meet', 'consultation', 'session',
    'available', 'time', 'when', 'dates', 'scheduling', 'booking'
  ],
  clinical: [
    'depression', 'anxiety', 'trauma', 'PTSD', 'stress', 'addiction',
    'relationship', 'grief', 'loss', 'crisis', 'mental health', 'therapy',
    'counseling', 'emotional', 'psychological', 'behavioral', 'diagnosis',
    'symptoms', 'treatment', 'medication', 'assessment', 'evaluation'
  ],
  spiritual: [
    'meditation', 'mindfulness', 'spiritual', 'energy', 'healing',
    'chakra', 'balance', 'alignment', 'consciousness', 'awakening',
    'transformation', 'soul', 'divine', 'sacred', 'holistic'
  ],
  preferences: [
    'prefer', 'like', 'want', 'need', 'looking for', 'interested in',
    'virtual', 'online', 'in-person', 'face-to-face', 'time', 'day',
    'morning', 'afternoon', 'evening', 'weekend', 'weekday'
  ]
};

// Detect day and time from message
const detectDateTime = (message) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const times = ['morning', 'afternoon'];
  const lowercaseMessage = message.toLowerCase();

  let detectedDay = null;
  let detectedTime = null;

  // Detect day
  days.forEach(day => {
    if (lowercaseMessage.includes(day)) {
      detectedDay = day.charAt(0).toUpperCase() + day.slice(1);
    }
  });

  // Detect time preference
  times.forEach(time => {
    if (lowercaseMessage.includes(time)) {
      detectedTime = time;
    }
  });

  return { day: detectedDay, time: detectedTime };
};

// Service matching based on needs and preferences
const matchServiceToNeeds = (needs, preferences, hasClinicialNeeds) => {
  const services = counselorProfile.services;
  let bestMatch = null;
  let highestScore = 0;

  Object.entries(services).forEach(([id, service]) => {
    let score = 0;
    
    // Match needs to service benefits and description
    needs.forEach(need => {
      if (service.description.toLowerCase().includes(need.toLowerCase())) {
        score += 3;
      }
      service.benefits.forEach(benefit => {
        if (benefit.toLowerCase().includes(need.toLowerCase())) {
          score += 2;
        }
      });
    });

    // Prioritize individual counseling for clinical needs
    if (hasClinicialNeeds && id === 'individual_counseling') {
      score += 5;
    }

    // Match preferences to service modalities
    if (preferences.modality) {
      if (service.modalities.some(m => 
        m.toLowerCase().includes(preferences.modality.toLowerCase())
      )) {
        score += 3;
      }
    }

    // Consider service duration preferences
    if (preferences.timePreference) {
      const duration = parseInt(service.duration);
      if (duration <= 60 && preferences.timePreference === 'short') {
        score += 2;
      } else if (duration > 60 && preferences.timePreference === 'long') {
        score += 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = { id, ...service };
    }
  });

  return bestMatch;
};

// Enhanced conversation context
class ConversationContext {
  constructor() {
    this.state = ConversationState.INITIAL;
    this.clientNeeds = new Set();
    this.clinicalNeeds = new Set();
    this.spiritualNeeds = new Set();
    this.exploredTopics = new Set();
    this.preferences = {
      modality: null,
      timePreference: null,
      frequency: null
    };
    this.selectedService = null;
    this.schedulingDetails = {
      confirmed: false,
      date: null,
      time: null,
      service: null
    };
    this.ollamaEnabled = true; // Enable Ollama integration
  }

  updateContext(message) {
    try {
      const lowercaseMessage = message.toLowerCase();

      // Detect clinical and spiritual needs
      intentPatterns.clinical.forEach(pattern => {
        if (lowercaseMessage.includes(pattern.toLowerCase())) {
          this.clinicalNeeds.add(pattern);
          this.clientNeeds.add(pattern);
        }
      });

      intentPatterns.spiritual.forEach(pattern => {
        if (lowercaseMessage.includes(pattern.toLowerCase())) {
          this.spiritualNeeds.add(pattern);
          this.clientNeeds.add(pattern);
        }
      });

      // Detect scheduling intent
      const hasSchedulingIntent = intentPatterns.scheduling.some(pattern => 
        lowercaseMessage.includes(pattern.toLowerCase())
      );

      // Update scheduling details if in scheduling process
      if (this.state === ConversationState.SCHEDULING_PROCESS) {
        const { day, time } = detectDateTime(message);
        if (day) this.schedulingDetails.date = day;
        if (time) this.schedulingDetails.time = time;
        
        if (this.schedulingDetails.date && this.schedulingDetails.time) {
          this.state = ConversationState.SCHEDULING_CONFIRMATION;
          return;
        }
      }

      // Update state based on intent and current state
      if (hasSchedulingIntent) {
        if (this.selectedService) {
          this.state = ConversationState.SCHEDULING_PROCESS;
        } else {
          this.state = ConversationState.SERVICE_SELECTION;
        }
        return;
      }

      // Extract preferences
      intentPatterns.preferences.forEach(pattern => {
        if (lowercaseMessage.includes(pattern.toLowerCase())) {
          if (pattern.includes('virtual') || pattern.includes('online')) {
            this.preferences.modality = 'virtual';
          } else if (pattern.includes('in-person') || pattern.includes('face-to-face')) {
            this.preferences.modality = 'in-person';
          } else if (pattern.includes('morning')) {
            this.preferences.timePreference = 'morning';
          } else if (pattern.includes('afternoon')) {
            this.preferences.timePreference = 'afternoon';
          }
        }
      });

      // Progress state if needed
      if (this.state === ConversationState.INITIAL) {
        this.state = ConversationState.EXPLORING_NEEDS;
      } else if (this.clientNeeds.size >= 2 && !this.selectedService) {
        this.state = ConversationState.SERVICE_SELECTION;
      }
    } catch (error) {
      console.error('Error in updateContext:', error);
    }
  }

  async generateResponse(message) {
    try {
      if (!message || typeof message !== 'string') {
        throw new Error('Invalid message format');
      }

      this.updateContext(message);

      // Try to get enhanced response from Ollama first
      if (this.ollamaEnabled) {
        try {
          let ollamaResponse;
          
          // Generate clinical response if clinical needs detected
          if (this.clinicalNeeds.size > 0) {
            const clinicalContext = {
              detectedNeeds: Array.from(this.clinicalNeeds),
              exploredTopics: Array.from(this.exploredTopics),
              currentState: this.state,
              preferences: this.preferences
            };
            
            ollamaResponse = await ollamaService.generateClinicalResponse(
              message,
              clinicalContext
            );
            
            if (ollamaResponse) {
              return ollamaResponse;
            }
          }
          
          // Generate scheduling response if in scheduling state
          if (this.state === ConversationState.SCHEDULING_PROCESS) {
            const schedulingContext = {
              selectedService: this.selectedService,
              schedulingDetails: this.schedulingDetails,
              counselorAvailability: counselorProfile.availability
            };
            
            ollamaResponse = await ollamaService.generateSchedulingResponse(
              message,
              schedulingContext
            );
            
            if (ollamaResponse) {
              return ollamaResponse;
            }
          }
        } catch (error) {
          console.error('Ollama service error:', error);
          // Fall back to default response generation
        }
      }

      // Generate response based on conversation state (fallback)
      switch (this.state) {
        case ConversationState.INITIAL:
          return counselingResponses.greeting[
            Math.floor(Math.random() * counselingResponses.greeting.length)
          ];

        case ConversationState.EXPLORING_NEEDS:
          // If clinical needs detected, ask relevant clinical questions
          if (this.clinicalNeeds.size > 0) {
            return "I hear that you're experiencing some challenges. Could you tell me more about when these feelings or symptoms began? This will help me understand how Shonna can best support you.";
          }
          return schedulingQuestions.initial_assessment[0].questions[
            Math.floor(Math.random() * schedulingQuestions.initial_assessment[0].questions.length)
          ];

        case ConversationState.SERVICE_SELECTION:
          const bestMatch = matchServiceToNeeds(
            Array.from(this.clientNeeds),
            this.preferences,
            this.clinicalNeeds.size > 0
          );
          if (bestMatch) {
            this.selectedService = bestMatch;
            this.schedulingDetails.service = bestMatch.id;
            const template = responseTemplates.service_info.template;
            const benefits = responseTemplates.service_info.benefits_format(bestMatch.benefits);
            return template
              .replace('{service_name}', bestMatch.name)
              .replace('{duration}', bestMatch.duration)
              .replace('{modalities}', bestMatch.modalities.join(', '))
              .replace('{benefits}', benefits);
          }
          return "Based on what you've shared, I'd like to recommend a specific service. Could you tell me if you prefer in-person or virtual sessions?";

        case ConversationState.SCHEDULING_PROCESS:
          if (!this.schedulingDetails.date) {
            const { days, hours } = counselorProfile.availability;
            return responseTemplates.availability_check.template
              .replace('{service_name}', this.selectedService.name)
              .replace('{days}', responseTemplates.availability_check.format_days(days))
              .replace('{hours}', responseTemplates.availability_check.format_hours(hours));
          }
          if (!this.schedulingDetails.time) {
            return `I see you're interested in ${this.schedulingDetails.date}. Would you prefer a morning or afternoon session?`;
          }
          break;

        case ConversationState.SCHEDULING_CONFIRMATION:
          this.schedulingDetails.confirmed = true;
          return `Perfect! I've scheduled your ${this.selectedService.name} session with Shonna for ${this.schedulingDetails.date} ${this.schedulingDetails.time}. You'll receive a confirmation email shortly with all the details. Is there anything else you'd like to know about your upcoming session?`;

        default:
          if (this.clinicalNeeds.size > 0) {
            return "I want to assure you that Shonna has extensive experience in supporting clients through similar challenges. Would you like to schedule a session to discuss this further?";
          }
          return counselingResponses.generalAdvice[
            Math.floor(Math.random() * counselingResponses.generalAdvice.length)
          ];
      }
    } catch (error) {
      console.error('Error in generateResponse:', error);
      return "I apologize, but I encountered an issue. Let me know how I can assist you.";
    }
  }
}

// Export conversation analyzer with Ollama integration
export const conversationAnalyzer = {
  createContext: async () => {
    try {
      const context = new ConversationContext();
      
      // Test Ollama connection
      if (context.ollamaEnabled) {
        const isConnected = await ollamaService.testConnection();
        if (!isConnected) {
          console.warn('Ollama connection failed, falling back to default responses');
          context.ollamaEnabled = false;
        }
      }
      
      return context;
    } catch (error) {
      console.error('Error creating context:', error);
      throw new Error('Failed to initialize conversation context');
    }
  },
  
  analyzeMessage: async (message, context) => {
    try {
      if (!context) {
        throw new Error('Invalid conversation context');
      }
      if (!message || typeof message !== 'string') {
        throw new Error('Invalid message format');
      }
      return await context.generateResponse(message);
    } catch (error) {
      console.error('Error in analyzeMessage:', error);
      return "I apologize, but I encountered an issue. Please try again.";
    }
  }
};
