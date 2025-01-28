class ExerciseRecommender {
  constructor(exerciseDb) {
    this.exerciseDb = exerciseDb;
    this.userHistory = [];
    this.userPreferences = {};
    this.muscleGroupFrequency = {};
  }

  setUserHistory(history) {
    this.userHistory = history;
    this._updateMuscleGroupFrequency();
  }

  setUserPreferences(preferences) {
    this.userPreferences = preferences;
  }

  recommendWorkout(type, duration, equipment) {
    const baseExercises = this._filterExercises(type, equipment);
    const workout = {
      type,
      duration,
      exercises: []
    };

    // Calculate time per exercise
    const exerciseCount = this._calculateExerciseCount(duration, type);
    const exercises = this._selectExercises(baseExercises, exerciseCount);
    
    workout.exercises = this._structureWorkout(exercises, type);
    return workout;
  }

  _filterExercises(type, equipment) {
    return Object.values(this.exerciseDb.categories)
      .flatMap(category => category.exercises)
      .filter(exercise => {
        // Filter by type
        if (!exercise.types.includes(type)) return false;

        // Filter by equipment
        if (equipment === 'minimal') {
          return exercise.equipment.every(eq => ['none', 'bodyweight', 'dumbbell'].includes(eq));
        } else if (equipment === 'home') {
          return !exercise.equipment.includes('machine');
        }
        return true;
      });
  }

  _calculateExerciseCount(duration, type) {
    const timePerExercise = {
      strength: 10,
      cardio: 15,
      hiit: 5,
      flexibility: 8
    };

    return Math.floor(duration / (timePerExercise[type] || 10));
  }

  _selectExercises(exercises, count) {
    const selected = [];
    const muscleGroups = new Set();
    const recentlyUsed = new Set(
      this.userHistory
        .slice(-3)
        .flatMap(workout => workout.exercises.map(ex => ex.id))
    );

    // Score and sort exercises
    const scoredExercises = exercises.map(exercise => ({
      exercise,
      score: this._calculateExerciseScore(exercise, recentlyUsed)
    })).sort((a, b) => b.score - a.score);

    // Select exercises ensuring muscle group balance
    while (selected.length < count && scoredExercises.length > 0) {
      const candidates = scoredExercises.filter(({ exercise }) => 
        !this._hasOverlappingMuscles(exercise, muscleGroups) || selected.length >= count * 0.7
      );

      if (candidates.length === 0) break;

      const { exercise } = candidates[0];
      selected.push(exercise);
      exercise.primaryMuscles.forEach(muscle => muscleGroups.add(muscle));
      scoredExercises.splice(scoredExercises.indexOf(candidates[0]), 1);
    }

    return selected;
  }

  _calculateExerciseScore(exercise, recentlyUsed) {
    let score = 100;

    // Penalize recently used exercises
    if (recentlyUsed.has(exercise.id)) {
      score -= 50;
    }

    // Boost exercises targeting underworked muscles
    exercise.primaryMuscles.forEach(muscle => {
      const frequency = this.muscleGroupFrequency[muscle] || 0;
      score += (1 - frequency) * 20;
    });

    // Consider exercise difficulty
    const difficultyScore = {
      beginner: this.userPreferences.level === 'beginner' ? 20 : -10,
      intermediate: this.userPreferences.level === 'intermediate' ? 20 : 0,
      advanced: this.userPreferences.level === 'advanced' ? 20 : -20
    };
    score += difficultyScore[exercise.difficulty] || 0;

    // Boost compound exercises
    if (exercise.primaryMuscles.length > 2) {
      score += 15;
    }

    return score;
  }

  _hasOverlappingMuscles(exercise, muscleGroups) {
    return exercise.primaryMuscles.some(muscle => muscleGroups.has(muscle));
  }

  _updateMuscleGroupFrequency() {
    const totalWorkouts = this.userHistory.length;
    if (totalWorkouts === 0) return;

    // Count muscle group usage
    const muscleUsage = {};
    this.userHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.primaryMuscles.forEach(muscle => {
          muscleUsage[muscle] = (muscleUsage[muscle] || 0) + 1;
        });
      });
    });

    // Convert to frequency
    Object.keys(muscleUsage).forEach(muscle => {
      this.muscleGroupFrequency[muscle] = muscleUsage[muscle] / totalWorkouts;
    });
  }

  _structureWorkout(exercises, type) {
    return exercises.map(exercise => {
      const structure = {
        id: exercise.id,
        name: exercise.name,
        equipment: exercise.equipment,
        primaryMuscles: exercise.primaryMuscles,
        secondaryMuscles: exercise.secondaryMuscles,
        instructions: exercise.instructions,
        tips: exercise.tips,
        commonErrors: exercise.commonErrors
      };

      // Add type-specific parameters
      switch (type) {
        case 'strength':
          structure.sets = 4;
          structure.repsRange = '6-8';
          structure.rest = 120;
          structure.tempo = '2-0-2-0';
          break;
        case 'cardio':
          structure.duration = 300;
          structure.intensity = 'moderate';
          structure.rest = 60;
          break;
        case 'hiit':
          structure.rounds = 4;
          structure.workInterval = 30;
          structure.restInterval = 15;
          break;
        case 'flexibility':
          structure.duration = 45;
          structure.sets = 3;
          structure.holdTime = 30;
          break;
        default:
          structure.sets = 3;
          structure.repsRange = '10-12';
          structure.rest = 90;
      }

      return structure;
    });
  }
}

export default ExerciseRecommender;
