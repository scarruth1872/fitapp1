import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useAchievements } from '../hooks/useAchievements';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const { currentUser } = useAuth();
  const { updateAchievementProgress, checkWorkoutStreak } = useAchievements();

  useEffect(() => {
    if (currentUser) {
      fetchWorkouts();
    }
  }, [currentUser]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const workoutsRef = collection(db, 'workouts');
      const q = query(
        workoutsRef,
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const workoutData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date()
        };
      });

      setWorkouts(workoutData);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (workoutData) => {
    try {
      setError(null);
      const newWorkout = {
        ...workoutData,
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        isPublic: false,
        likes: [],
        comments: []
      };

      const docRef = await addDoc(collection(db, 'workouts'), newWorkout);
      const workout = { id: docRef.id, ...newWorkout };
      setWorkouts(prev => [workout, ...prev]);
      return workout;
    } catch (error) {
      console.error('Error adding workout:', error);
      setError('Failed to add workout');
      throw error;
    }
  };

  const updateWorkout = async (workoutId, workoutData) => {
    try {
      setError(null);
      const workoutRef = doc(db, 'workouts', workoutId);
      await updateDoc(workoutRef, workoutData);
      setWorkouts(prev =>
        prev.map(workout =>
          workout.id === workoutId ? { ...workout, ...workoutData } : workout
        )
      );
    } catch (error) {
      console.error('Error updating workout:', error);
      setError('Failed to update workout');
      throw error;
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      setError(null);
      await deleteDoc(doc(db, 'workouts', workoutId));
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
    } catch (error) {
      console.error('Error deleting workout:', error);
      setError('Failed to delete workout');
      throw error;
    }
  };

  const shareWorkout = async (workoutId) => {
    try {
      setError(null);
      const workout = workouts.find(w => w.id === workoutId);
      if (!workout) throw new Error('Workout not found');

      // Create a new social post document
      const socialPostRef = collection(db, 'social_posts');
      const postData = {
        type: 'workout_share',
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userAvatar: currentUser.photoURL || '',
        workoutId,
        workoutData: {
          name: workout.name,
          type: workout.type,
          exercises: workout.exercises,
          duration: workout.duration,
          intensity: workout.intensity,
          caloriesBurned: workout.caloriesBurned,
          timestamp: workout.timestamp
        },
        createdAt: serverTimestamp(),
        likes: [],
        comments: []
      };

      await addDoc(socialPostRef, postData);

      // Update workout to mark it as shared
      await updateDoc(doc(db, 'workouts', workoutId), {
        isShared: true,
        lastSharedAt: serverTimestamp()
      });

      // Show success notification
      setNotification({
        message: 'Workout shared successfully!',
        type: 'success'
      });

    } catch (error) {
      console.error('Error sharing workout:', error);
      setError(error.message);
      setNotification({
        message: 'Failed to share workout. Please try again.',
        type: 'error'
      });
      throw error;
    }
  };

  const likeWorkout = async (workoutId) => {
    try {
      setError(null);
      const workoutRef = doc(db, 'workouts', workoutId);
      
      // Add user to likes array if not already liked
      await updateDoc(workoutRef, {
        likes: [...workouts.find(w => w.id === workoutId).likes, currentUser.uid]
      });

      setWorkouts(prev =>
        prev.map(workout =>
          workout.id === workoutId
            ? { ...workout, likes: [...workout.likes, currentUser.uid] }
            : workout
        )
      );
    } catch (error) {
      console.error('Error liking workout:', error);
      setError('Failed to like workout');
      throw error;
    }
  };

  const unlikeWorkout = async (workoutId) => {
    try {
      setError(null);
      const workoutRef = doc(db, 'workouts', workoutId);
      
      // Remove user from likes array
      await updateDoc(workoutRef, {
        likes: workouts
          .find(w => w.id === workoutId)
          .likes.filter(uid => uid !== currentUser.uid)
      });

      setWorkouts(prev =>
        prev.map(workout =>
          workout.id === workoutId
            ? {
                ...workout,
                likes: workout.likes.filter(uid => uid !== currentUser.uid)
              }
            : workout
        )
      );
    } catch (error) {
      console.error('Error unliking workout:', error);
      setError('Failed to unlike workout');
      throw error;
    }
  };

  const commentOnWorkout = async (workoutId, comment) => {
    try {
      setError(null);
      const workoutRef = doc(db, 'workouts', workoutId);
      
      const newComment = {
        id: Date.now().toString(),
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userAvatar: currentUser.photoURL,
        text: comment,
        timestamp: serverTimestamp()
      };

      await updateDoc(workoutRef, {
        comments: [...workouts.find(w => w.id === workoutId).comments, newComment]
      });

      setWorkouts(prev =>
        prev.map(workout =>
          workout.id === workoutId
            ? { ...workout, comments: [...workout.comments, newComment] }
            : workout
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
      throw error;
    }
  };

  const completeWorkout = async (workoutId) => {
    try {
      const workoutRef = doc(db, 'workouts', workoutId);
      await updateDoc(workoutRef, {
        completed: true,
        completedAt: serverTimestamp()
      });

      // Update achievements
      await updateAchievementProgress('workout_count');
      await checkWorkoutStreak();

      // Refresh workouts
      fetchWorkouts();
    } catch (error) {
      console.error('Error completing workout:', error);
      throw error;
    }
  };

  const value = {
    workouts,
    loading,
    error,
    notification,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    shareWorkout,
    likeWorkout,
    unlikeWorkout,
    commentOnWorkout,
    completeWorkout,
    fetchWorkouts
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;
