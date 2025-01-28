import { exerciseDatabase } from '../data/trainerData/exerciseDatabase';
import { nutritionDatabase } from '../data/trainerData/nutritionDatabase';
import { wellnessDatabase } from '../data/trainerData/wellnessDatabase';
import { ollamaService } from '../services/ollamaService';

class PersonalTrainerAgent {
  constructor(userProfile) {
    this.userProfile = userProfile;
    this.exerciseDb = exerciseDatabase;
    this.nutritionDb = nutritionDatabase;
    this.wellnessDb = wellnessDatabase;
    this.context = {
      recentWorkouts: [],
      currentGoals: [],
      fitnessLevel: userProfile?.fitnessLevel || 'beginner',
      preferences: userProfile?.preferences || {}
    };
  }

  async processMessage(message) {
    const systemPrompt = this.generateSystemPrompt();
    try {
      const response = await ollamaService.generateResponse(message, systemPrompt);
      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return 'I apologize, but I encountered an error. Please try again.';
    }
  }

  generateSystemPrompt() {
    return `You are an AI personal trainer with expertise in fitness, nutrition, and wellness.
    Your role is to provide personalized guidance and support to help users achieve their fitness goals.

    User Profile:
    - Fitness Level: ${this.context.fitnessLevel}
    - Recent Workouts: ${JSON.stringify(this.context.recentWorkouts)}
    - Current Goals: ${JSON.stringify(this.context.currentGoals)}
    - Preferences: ${JSON.stringify(this.context.preferences)}

    Available Exercise Database: ${JSON.stringify(this.exerciseDb)}
    Available Nutrition Database: ${JSON.stringify(this.nutritionDb)}
    Available Wellness Database: ${JSON.stringify(this.wellnessDb)}

    Provide specific, actionable advice based on the user's context and available data.
    Focus on form, safety, and progressive improvement.`;
  }

  async updateContext(newData) {
    this.context = {
      ...this.context,
      ...newData
    };
  }

  async generateWorkoutPlan() {
    const message = `Generate a personalized workout plan for a ${this.context.fitnessLevel} level user with the following goals: ${JSON.stringify(this.context.currentGoals)}`;
    return this.processMessage(message);
  }

  async provideFormGuidance(exercise) {
    const message = `Provide detailed form guidance for ${exercise}, suitable for a ${this.context.fitnessLevel} level user`;
    return this.processMessage(message);
  }

  async analyzeProgress() {
    const message = `Analyze the user's recent workouts and provide feedback: ${JSON.stringify(this.context.recentWorkouts)}`;
    return this.processMessage(message);
  }

  async provideNutritionAdvice() {
    const message = `Provide nutrition advice based on the user's goals: ${JSON.stringify(this.context.currentGoals)}`;
    return this.processMessage(message);
  }

  async provideMotivation() {
    const message = `Provide personalized motivation based on the user's progress and goals`;
    return this.processMessage(message);
  }
}

export default PersonalTrainerAgent;
