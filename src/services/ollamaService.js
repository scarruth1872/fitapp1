// Ollama integration service using official Ollama Node.js client
import { Ollama } from 'ollama';

class OllamaService {
  constructor() {
    this.ollama = new Ollama();
    this.model = 'deepseek-r1:1.5b';
  }

  async generateResponse(message, systemPrompt = '') {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: false,
        options: {
          temperature: 0.7,
          top_k: 50,
          top_p: 0.7,
          num_ctx: 4096,
        }
      });

      // Remove thinking outputs (lines starting with <think>)
      const cleanedResponse = response.message.content
        .split('\n')
        .filter(line => !line.trim().startsWith('<think>'))
        .join('\n')
        .trim();

      return cleanedResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  async generateClinicalResponse(message, context) {
    const systemPrompt = `You are a counseling assistant for Shonna Carruth, specializing in both clinical and spiritual support.
    Your role is to understand client needs, provide empathetic responses, and guide them towards appropriate services.
    
    Current context:
    ${JSON.stringify(context, null, 2)}
    
    Guidelines:
    1. Maintain a professional, empathetic tone
    2. Focus on understanding and validating feelings
    3. Provide appropriate clinical insights when relevant
    4. Guide towards professional support when needed
    5. Be mindful of scope of practice
    6. Encourage scheduling a session when appropriate
    7. NEVER show your thinking process in the response
    8. Keep responses concise and focused
    
    Remember: You are supporting clients until they can meet with Shonna Carruth.`;

    return this.generateResponse(message, systemPrompt);
  }

  async generateSchedulingResponse(message, context) {
    const systemPrompt = `You are a scheduling assistant for Shonna Carruth's counseling practice.
    
    Available Schedule:
    ${JSON.stringify(context.counselorAvailability, null, 2)}
    
    Current Scheduling Context:
    ${JSON.stringify(context.schedulingDetails, null, 2)}
    
    Selected Service:
    ${JSON.stringify(context.selectedService, null, 2)}
    
    Guidelines:
    1. Help clients find suitable appointment times
    2. Consider client preferences for day/time
    3. Verify service type and duration
    4. Confirm scheduling details clearly
    5. Provide clear next steps
    6. NEVER show your thinking process
    7. Keep responses concise and action-oriented
    
    Remember: Be efficient and professional in scheduling process.`;

    return this.generateResponse(message, systemPrompt);
  }

  async testConnection() {
    try {
      const response = await this.generateResponse('Hello', 'You are a helpful assistant.');
      return response !== undefined;
    } catch (error) {
      console.error('Ollama connection test failed:', error);
      return false;
    }
  }
}

export const ollamaService = new OllamaService();
