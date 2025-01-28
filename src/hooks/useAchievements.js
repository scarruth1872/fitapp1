import { useState, useEffect } from 'react';
import {
  FitnessCenter as WorkoutIcon,
  LocalFireDepartment as FireIcon,
  Groups as SocialIcon,
  Timeline as StreakIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';

const ACHIEVEMENT_TYPES = {
  WORKOUT_COUNT: 'workout_count',
  WORKOUT_STREAK: 'workout_streak',
  SOCIAL_SHARES: 'social_shares',
  PROGRAM_COMPLETIONS: 'program_completions',
  WEIGHT_GOALS: 'weight_goals',
  COMMUNITY_ENGAGEMENT: 'community_engagement'
};

const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'workout_beginner',
    type: ACHIEVEMENT_TYPES.WORKOUT_COUNT,
    name: 'Workout Beginner',
    description: 'Complete your first 5 workouts',
    icon: <WorkoutIcon />,
    targetProgress: 5,
    reward: 'Unlock basic workout templates',
    tier: 1
  },
  {
    id: 'workout_intermediate',
    type: ACHIEVEMENT_TYPES.WORKOUT_COUNT,
    name: 'Workout Warrior',
    description: 'Complete 25 workouts',
    icon: <WorkoutIcon />,
    targetProgress: 25,
    reward: 'Unlock advanced workout templates',
    tier: 2
  },
  {
    id: 'workout_master',
    type: ACHIEVEMENT_TYPES.WORKOUT_COUNT,
    name: 'Workout Master',
    description: 'Complete 100 workouts',
    icon: <WorkoutIcon />,
    targetProgress: 100,
    reward: 'Unlock expert workout templates and custom badge',
    tier: 3
  },
  {
    id: 'streak_starter',
    type: ACHIEVEMENT_TYPES.WORKOUT_STREAK,
    name: 'Streak Starter',
    description: 'Maintain a 7-day workout streak',
    icon: <FireIcon />,
    targetProgress: 7,
    reward: 'Special streak badge',
    tier: 1
  },
  {
    id: 'social_butterfly',
    type: ACHIEVEMENT_TYPES.SOCIAL_SHARES,
    name: 'Social Butterfly',
    description: 'Share 10 workouts with the community',
    icon: <SocialIcon />,
    targetProgress: 10,
    reward: 'Unlock social features and custom sharing templates',
    tier: 1
  },
  {
    id: 'program_master',
    type: ACHIEVEMENT_TYPES.PROGRAM_COMPLETIONS,
    name: 'Program Master',
    description: 'Complete 3 full workout programs',
    icon: <TrophyIcon />,
    targetProgress: 3,
    reward: 'Ability to create and share custom programs',
    tier: 2
  },
  {
    id: 'community_leader',
    type: ACHIEVEMENT_TYPES.COMMUNITY_ENGAGEMENT,
    name: 'Community Leader',
    description: 'Get 50 likes on your shared workouts',
    icon: <StarIcon />,
    targetProgress: 50,
    reward: 'Verified community leader badge',
    tier: 2
  },
  {
    id: 'consistency_king',
    type: ACHIEVEMENT_TYPES.WORKOUT_STREAK,
    name: 'Consistency King',
    description: 'Maintain a 30-day workout streak',
    icon: <StreakIcon />,
    targetProgress: 30,
    reward: 'Exclusive workout programs and custom profile banner',
    tier: 3
  }
];

export const useAchievements = () => {
  const { currentUser } = useAuth();
  const { createNotification } = useNotification();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeUserAchievements = async () => {
    try {
      const userAchievementsRef = doc(db, 'userAchievements', currentUser.uid);
      const achievementsData = DEFAULT_ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        currentProgress: 0,
        completed: false,
        completedAt: null
      }));

      await setDoc(userAchievementsRef, {
        achievements: achievementsData,
        lastUpdated: serverTimestamp()
      });

      return achievementsData;
    } catch (error) {
      console.error('Error initializing achievements:', error);
      throw error;
    }
  };

  const fetchAchievements = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userAchievementsRef = doc(db, 'userAchievements', currentUser.uid);
      const userAchievementsDoc = await getDocs(userAchievementsRef);

      let userAchievements;
      if (!userAchievementsDoc.exists()) {
        userAchievements = await initializeUserAchievements();
      } else {
        userAchievements = userAchievementsDoc.data().achievements;
      }

      setAchievements(userAchievements);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAchievementProgress = async (type, increment = 1) => {
    if (!currentUser) return;

    try {
      const userAchievementsRef = doc(db, 'userAchievements', currentUser.uid);
      const updatedAchievements = achievements.map(achievement => {
        if (achievement.type === type && !achievement.completed) {
          const newProgress = achievement.currentProgress + increment;
          const completed = newProgress >= achievement.targetProgress;

          return {
            ...achievement,
            currentProgress: newProgress,
            completed,
            completedAt: completed ? serverTimestamp() : null
          };
        }
        return achievement;
      });

      await updateDoc(userAchievementsRef, {
        achievements: updatedAchievements,
        lastUpdated: serverTimestamp()
      });

      setAchievements(updatedAchievements);

      // Check for newly completed achievements and create notifications
      const newlyCompleted = updatedAchievements.filter(
        (achievement, index) =>
          achievement.completed && !achievements[index].completed
      );

      // Create notifications for newly completed achievements
      await Promise.all(
        newlyCompleted.map(async (achievement) => {
          await createNotification(currentUser.uid, {
            type: 'achievement',
            achievement: achievement,
            title: 'Achievement Unlocked!',
            message: `You've unlocked the ${achievement.name} achievement!`,
            icon: 'trophy'
          });
        })
      );

      return newlyCompleted;
    } catch (err) {
      console.error('Error updating achievement progress:', err);
      throw err;
    }
  };

  const checkWorkoutStreak = async () => {
    if (!currentUser) return;

    try {
      const workoutsRef = collection(db, 'workouts');
      const userWorkoutsQuery = query(
        workoutsRef,
        where('userId', '==', currentUser.uid),
        where('completed', '==', true)
      );

      const workouts = await getDocs(userWorkoutsQuery);
      const workoutDates = workouts.docs
        .map(doc => doc.data().completedAt.toDate())
        .sort((a, b) => b - a);

      let currentStreak = 0;
      let lastDate = new Date();

      for (const date of workoutDates) {
        const dayDifference = Math.floor(
          (lastDate - date) / (1000 * 60 * 60 * 24)
        );

        if (dayDifference <= 1) {
          currentStreak++;
          lastDate = date;
        } else {
          break;
        }
      }

      // Update streak-based achievements
      const streakAchievements = achievements.filter(
        a => a.type === ACHIEVEMENT_TYPES.WORKOUT_STREAK
      );

      for (const achievement of streakAchievements) {
        if (currentStreak >= achievement.targetProgress && !achievement.completed) {
          await updateAchievementProgress(ACHIEVEMENT_TYPES.WORKOUT_STREAK, currentStreak);
        }
      }
    } catch (err) {
      console.error('Error checking workout streak:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAchievements();
    }
  }, [currentUser]);

  return {
    achievements,
    loading,
    error,
    updateAchievementProgress,
    checkWorkoutStreak,
    refreshAchievements: fetchAchievements
  };
};
