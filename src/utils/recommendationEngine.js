import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

class RecommendationEngine {
  constructor(exerciseDb, nutritionDb, wellnessDb) {
    this.exerciseDb = exerciseDb;
    this.nutritionDb = nutritionDb;
    this.wellnessDb = wellnessDb;
    this.userPreferences = null;
    this.userProgress = null;
  }

  async initialize(userId) {
    try {
      const userDoc = await getDocs(query(
        collection(db, 'users'),
        where('id', '==', userId)
      ));

      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        this.userPreferences = userData.preferences;
        this.userProgress = userData.progress;
      }
    } catch (error) {
      console.error('Error initializing recommendation engine:', error);
    }
  }

  recommendWorkouts(goals, equipment, fitnessLevel) {
    const workouts = [];
    const exercisePool = this._filterExercisesByEquipment(equipment);

    goals.forEach(goal => {
      switch (goal) {
        case 'strength':
          workouts.push(this._createStrengthWorkout(exercisePool, fitnessLevel));
          break;
        case 'muscle':
          workouts.push(this._createHypertrophyWorkout(exercisePool, fitnessLevel));
          break;
        case 'endurance':
          workouts.push(this._createEnduranceWorkout(exercisePool, fitnessLevel));
          break;
        case 'weight-loss':
          workouts.push(this._createHIITWorkout(exercisePool, fitnessLevel));
          break;
        case 'flexibility':
          workouts.push(this._createMobilityWorkout(exercisePool, fitnessLevel));
          break;
      }
    });

    return this._optimizeWorkoutPlan(workouts);
  }

  recommendNutrition(goals, dietaryRestrictions = [], currentWeight, targetWeight) {
    const recommendations = {
      macros: this._calculateMacros(goals, currentWeight, targetWeight),
      mealPlan: this._createMealPlan(goals, dietaryRestrictions),
      supplements: this._recommendSupplements(goals),
      hydration: this._calculateHydration(currentWeight, goals)
    };

    return recommendations;
  }

  recommendRecovery(workoutIntensity, soreness, sleepQuality) {
    const recommendations = {
      stretches: this._recommendStretches(soreness),
      restDays: this._calculateRestDays(workoutIntensity),
      sleepStrategy: this._createSleepStrategy(sleepQuality),
      recoveryTechniques: this._recommendRecoveryTechniques(workoutIntensity)
    };

    return recommendations;
  }

  // Private helper methods
  _filterExercisesByEquipment(equipment) {
    return Object.values(this.exerciseDb.categories)
      .flatMap(category => category.exercises)
      .filter(exercise => {
        if (equipment === 'minimal') {
          return exercise.equipment.every(eq => ['none', 'bodyweight', 'dumbbell'].includes(eq));
        } else if (equipment === 'home') {
          return !exercise.equipment.includes('machine');
        }
        return true;
      });
  }

  _createStrengthWorkout(exercises, fitnessLevel) {
    const workout = {
      type: 'strength',
      exercises: this._selectExercises(exercises, 5, 'strength'),
      structure: {
        sets: fitnessLevel === 'beginner' ? 3 : 5,
        repsRange: '4-6',
        rest: 180, // seconds
        tempo: '2-0-1-0' // eccentric-pause-concentric-pause
      }
    };

    return workout;
  }

  _createHypertrophyWorkout(exercises, fitnessLevel) {
    const workout = {
      type: 'hypertrophy',
      exercises: this._selectExercises(exercises, 6, 'muscle'),
      structure: {
        sets: 4,
        repsRange: '8-12',
        rest: 90,
        tempo: '2-0-2-0'
      }
    };

    return workout;
  }

  _createEnduranceWorkout(exercises, fitnessLevel) {
    const workout = {
      type: 'endurance',
      exercises: this._selectExercises(exercises, 8, 'endurance'),
      structure: {
        sets: 3,
        repsRange: '15-20',
        rest: 45,
        tempo: '1-0-1-0'
      }
    };

    return workout;
  }

  _createHIITWorkout(exercises, fitnessLevel) {
    const workout = {
      type: 'hiit',
      exercises: this._selectExercises(exercises, 6, 'cardio'),
      structure: {
        rounds: 4,
        workInterval: 30, // seconds
        restInterval: 15,
        exercises: 6
      }
    };

    return workout;
  }

  _createMobilityWorkout(exercises, fitnessLevel) {
    const workout = {
      type: 'mobility',
      exercises: this._selectExercises(exercises, 8, 'flexibility'),
      structure: {
        sets: 2,
        duration: 30, // seconds per position
        rest: 15
      }
    };

    return workout;
  }

  _selectExercises(pool, count, focus) {
    const filtered = pool.filter(exercise => exercise.focus === focus);
    const selected = [];
    const muscleGroups = new Set();

    // Ensure balanced muscle group distribution
    while (selected.length < count && filtered.length > 0) {
      const candidates = filtered.filter(exercise => 
        !muscleGroups.has(exercise.primaryMuscles[0]) || selected.length >= pool.length / 2
      );

      if (candidates.length === 0) break;

      const exercise = candidates[Math.floor(Math.random() * candidates.length)];
      selected.push(exercise);
      exercise.primaryMuscles.forEach(muscle => muscleGroups.add(muscle));
    }

    return selected;
  }

  _optimizeWorkoutPlan(workouts) {
    // Sort workouts to optimize recovery between similar muscle groups
    const optimized = [...workouts];
    optimized.sort((a, b) => {
      const musclesA = new Set(a.exercises.flatMap(e => e.primaryMuscles));
      const musclesB = new Set(b.exercises.flatMap(e => e.primaryMuscles));
      const overlap = new Set([...musclesA].filter(x => musclesB.has(x))).size;
      return overlap;
    });

    return optimized;
  }

  _calculateMacros(goals, currentWeight, targetWeight) {
    const baseProtein = 2.2; // g/kg
    const baseFat = 0.8; // g/kg
    let calories = 0;
    let proteinMultiplier = 1;
    let fatMultiplier = 1;
    let carbMultiplier = 1;

    if (goals.includes('muscle')) {
      calories = currentWeight * 35;
      proteinMultiplier = 1.2;
      carbMultiplier = 1.2;
    } else if (goals.includes('weight-loss')) {
      calories = currentWeight * 25;
      fatMultiplier = 0.8;
      carbMultiplier = 0.8;
    } else {
      calories = currentWeight * 30;
    }

    return {
      calories,
      protein: Math.round(currentWeight * baseProtein * proteinMultiplier),
      fat: Math.round(currentWeight * baseFat * fatMultiplier),
      carbs: Math.round((calories - 
        (currentWeight * baseProtein * proteinMultiplier * 4) - 
        (currentWeight * baseFat * fatMultiplier * 9)) / 4 * carbMultiplier)
    };
  }

  _createMealPlan(goals, restrictions) {
    // Implementation would use nutritionDb to create meal plans
    return [];
  }

  _recommendSupplements(goals) {
    // Implementation would use nutritionDb to recommend supplements
    return [];
  }

  _calculateHydration(weight, goals) {
    // Base recommendation: 30-35ml per kg of body weight
    const baseHydration = weight * 0.033;
    let adjustment = 0;

    if (goals.includes('endurance')) adjustment += 0.5;
    if (goals.includes('weight-loss')) adjustment += 0.3;

    return Math.round((baseHydration + adjustment) * 1000); // Convert to ml
  }

  _recommendStretches(soreness) {
    // Implementation would use wellnessDb to recommend stretches
    return [];
  }

  _calculateRestDays(intensity) {
    // Implementation would calculate optimal rest days based on workout intensity
    return [];
  }

  _createSleepStrategy(quality) {
    // Implementation would use wellnessDb to create sleep strategies
    return {};
  }

  _recommendRecoveryTechniques(intensity) {
    // Implementation would use wellnessDb to recommend recovery techniques
    return [];
  }
}

export default RecommendationEngine;
