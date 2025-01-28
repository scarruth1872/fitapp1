import { useEffect, useCallback } from 'react';
import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';

const useTrainerAnalytics = () => {
  const trackGoalSet = useCallback((goals) => {
    logEvent(analytics, 'set_fitness_goals', {
      goals: goals.join(','),
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackWorkoutPlanGenerated = useCallback((plan) => {
    logEvent(analytics, 'generate_workout_plan', {
      workoutDuration: plan.preferences.workoutDuration,
      daysPerWeek: plan.preferences.daysPerWeek,
      equipment: plan.preferences.equipment,
      exerciseCount: plan.workouts.length,
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackWorkoutCompleted = useCallback((workout) => {
    logEvent(analytics, 'complete_workout', {
      workoutType: workout.type,
      duration: workout.duration,
      exerciseCount: workout.exercises.length,
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackProgressUpdate = useCallback((type, data) => {
    logEvent(analytics, 'track_progress', {
      updateType: type,
      dataPoints: Object.keys(data).length,
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackTrainerInteraction = useCallback((action, context) => {
    logEvent(analytics, 'trainer_interaction', {
      action,
      context,
      timestamp: new Date().toISOString()
    });
  }, []);

  return {
    trackGoalSet,
    trackWorkoutPlanGenerated,
    trackWorkoutCompleted,
    trackProgressUpdate,
    trackTrainerInteraction
  };
};

export default useTrainerAnalytics;
