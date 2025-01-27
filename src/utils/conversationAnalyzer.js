import { counselingData } from '../data/counselingData';
import { ollamaService } from '../services/ollamaService';

class ConversationContext {
  constructor() {
    this.context = {
      userPreferences: {},
      identifiedNeeds: new Set(),
      askedQuestions: new Set(),
      suggestedServices: new Set(),
      schedulingState: {
        inProgress: false,
        selectedService: null,
        duration: null,
        modality: null,
      },
      conversationStage: 'initial',
      lastResponseType: null,
      errorCount: 0,
    };
    this.ollamaEnabled = true;
  }

  resetContext() {
    this.context = {
      userPreferences: {},
      identifiedNeeds: new Set(),
      askedQuestions: new Set(),
      suggestedServices: new Set(),
      schedulingState: {
        inProgress: false,
        selectedService: null,
        duration: null,
        modality: null,
      },
      conversationStage: 'initial',
      lastResponseType: null,
      errorCount: 0,
    };
  }

  async generateResponse(message, conversationHistory = []) {
    try {
      // Prepare clinical context
      const clinicalContext = {
        identifiedNeeds: Array.from(this.context.identifiedNeeds),
        suggestedServices: Array.from(this.context.suggestedServices),
        conversationStage: this.context.conversationStage,
        userPreferences: this.context.userPreferences,
      };

      let ollamaResponse = null;
      
      // Try to get enhanced response from Ollama
      if (this.ollamaEnabled) {
        try {
          ollamaResponse = await ollamaService.generateClinicalInsights(message, JSON.stringify(clinicalContext));
        } catch (error) {
          console.error('Ollama service error:', error);
          this.context.errorCount++;
          if (this.context.errorCount >= 3) {
            this.ollamaEnabled = false;
          }
        }
      }

      // If we have a valid Ollama response, process it
      if (ollamaResponse?.message) {
        this.updateContext(ollamaResponse);
        return {
          message: ollamaResponse.message,
          action: ollamaResponse.action,
        };
      }

      // Fallback to rule-based response generation
      return this.generateFallbackResponse(message);
    } catch (error) {
      console.error('Error in generateResponse:', error);
      return {
        message: "I apologize, but I'm having trouble processing your request. Could you please rephrase that?",
        action: null,
      };
    }
  }

  updateContext(response) {
    if (response.identifiedNeeds) {
      response.identifiedNeeds.forEach(need => this.context.identifiedNeeds.add(need));
    }

    if (response.suggestedServices) {
      response.suggestedServices.forEach(service => this.context.suggestedServices.add(service));
    }

    if (response.schedulingState) {
      this.context.schedulingState = {
        ...this.context.schedulingState,
        ...response.schedulingState,
      };
    }

    if (response.userPreferences) {
      this.context.userPreferences = {
        ...this.context.userPreferences,
        ...response.userPreferences,
      };
    }

    this.context.conversationStage = response.nextStage || this.context.conversationStage;
    this.context.lastResponseType = response.responseType;
  }

  generateFallbackResponse(message) {
    const normalizedMessage = message.toLowerCase();
    let response = {
      message: '',
      action: null,
    };

    // Check for scheduling intent
    if (this.detectSchedulingIntent(normalizedMessage)) {
      this.context.schedulingState.inProgress = true;
      response.message = this.getSchedulingPrompt();
      response.action = 'schedule';
      return response;
    }

    // Check for service inquiries
    const matchedService = this.matchService(normalizedMessage);
    if (matchedService) {
      this.context.suggestedServices.add(matchedService.name);
      response.message = this.generateServiceResponse(matchedService);
      return response;
    }

    // Generate a contextual question if we haven't asked many
    if (this.context.askedQuestions.size < 3) {
      const question = this.generateContextualQuestion();
      if (question) {
        this.context.askedQuestions.add(question);
        response.message = question;
        return response;
      }
    }

    // Fallback response
    response.message = "I understand you're looking for support. Could you tell me more about what brings you here today?";
    return response;
  }

  detectSchedulingIntent(message) {
    const schedulingKeywords = ['schedule', 'appointment', 'book', 'meet', 'session', 'consultation'];
    return schedulingKeywords.some(keyword => message.includes(keyword));
  }

  matchService(message) {
    return counselingData.services.find(service => 
      service.keywords.some(keyword => message.includes(keyword))
    );
  }

  generateServiceResponse(service) {
    return `${service.description}\n\nWould you like to schedule a ${service.name} session? I can help you book an appointment.`;
  }

  generateContextualQuestion() {
    const questions = [
      "How long have you been experiencing these feelings?",
      "What kind of support are you looking for specifically?",
      "Have you tried counseling or therapy before?",
      "Would you prefer individual or group sessions?",
      "Do you have a preference for in-person or virtual sessions?",
    ].filter(q => !this.context.askedQuestions.has(q));

    return questions[Math.floor(Math.random() * questions.length)];
  }

  getSchedulingPrompt() {
    const service = this.context.schedulingState.selectedService;
    if (service) {
      return `Great! I'll help you schedule a ${service} session. Let's find a time that works for you.`;
    }
    return "I'll help you schedule an appointment. You can choose from our available services and find a time that works best for you.";
  }
}

export const conversationAnalyzer = new ConversationContext();
