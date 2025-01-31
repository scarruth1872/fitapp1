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
  getDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';

const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'workout_beginner',
    type: 'workout_count',
    name: 'Workout Beginner',
    description: 'Complete your first 5 workouts',
    icon: 'workout',
    targetProgress: 5,
    reward: 'Unlock basic workout templates',
    tier: 1,
    currentProgress: 0,
    completed: false,
    completedAt: null
  },
  {
    id: 'workout_intermediate',
    type: 'workout_count',
    name: 'Workout Warrior',
    description: 'Complete 25 workouts',
    icon: 'workout',
    targetProgress: 25,
    reward: 'Unlock advanced workout templates',
    tier: 2,
    currentProgress: 0,
    completed: false,
    completedAt: null
  },
  {
    id: 'workout_master',
    type: 'workout_count',
    name: 'Workout Master',
    description: 'Complete 100 workouts',
    icon: 'workout',
    targetProgress: 100,
    reward: 'Unlock expert workout templates and custom badge',
    tier: 3,
    currentProgress: 0,
    completed: false,
    completedAt: null
  },
  {
    id: 'streak_starter',
    type: 'workout_streak',
    name: 'Streak Starter',
    description: 'Maintain a 7-day workout streak',
    icon: 'fire',
    targetProgress: 7,
    reward: 'Special streak badge',
    tier: 1,
    currentProgress: 0,
    completed: false,
    completedAt: null
  },
  {
    id: 'social_butterfly',
    type: 'social_shares',
    name: 'Social Butterfly',
    description: 'Share 10 workouts with the community',
    icon: 'social',
    targetProgress: 10,
    reward: 'Unlock social features and custom sharing templates',
    tier: 1,
    currentProgress: 0,
    completed: false,
    completedAt: null
  },
  {
    id: 'program_master',
    type: 'program_completions',
    name: 'Program Master',
    description: 'Complete 3 full workout programs',
    icon: 'trophy',
    targetProgress: 3,
    reward: 'Ability to create and share custom programs',
    tier: 2,
    currentProgress: 0,
    completed: false,
    completedAt: null
  },
  {
    id: 'community_leader',
    type: 'community_engagement',
    name: 'Community Leader',
    description: 'Get 50 likes on your shared workouts',
    icon: 'star',
    targetProgress: 50,
    reward: 'Verified community leader badge',
    tier: 2,
    currentProgress: 0,
    completed: false,
    completedAt: null
  },
  {
    id: 'consistency_king',
    type: 'workout_streak',
    name: 'Consistency King',
    description: 'Maintain a 30-day workout streak',
    icon: 'streak',
    targetProgress: 30,
    reward: 'Exclusive workout programs and custom profile banner',
    tier: 3,
    currentProgress: 0,
    completed: false,
    completedAt: null
  }
];

const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'workout':
      return WorkoutIcon;
    case 'fire':
      return FireIcon;
    case 'social':
      return SocialIcon;
    case 'streak':
      return StreakIcon;
    case 'star':
      return StarIcon;
    case 'trophy':
      return TrophyIcon;
    default:
      return StarIcon;
  }
};

export const useAchievements = () => {
  const { currentUser } = useAuth();
  const { createNotification } = useNotification();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeUserAchievements = async () => {
    try {
      if (!currentUser) return;

      const userAchievementsRef = doc(db, 'user_achievements', currentUser.uid);
      const initialAchievements = DEFAULT_ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        currentProgress: 0,
        completed: false,
        completedAt: null
      }));

      await setDoc(userAchievementsRef, {
        achievements: initialAchievements,
        lastUpdated: serverTimestamp()
      });

      return initialAchievements;
    } catch (error) {
      console.error('Error initializing achievements:', error);
      setError('Failed to initialize achievements');
      return null;
    }
  };

  const fetchAchievements = async () => {
    try {
      if (!currentUser) {
        setAchievements([]);
        setLoading(false);
        return;
      }

      const userAchievementsRef = doc(db, 'user_achievements', currentUser.uid);
      const docSnap = await getDoc(userAchievementsRef);

      if (!docSnap.exists()) {
        const initialAchievements = await initializeUserAchievements();
        if (initialAchievements) {
          setAchievements(initialAchievements);
        }
      } else {
        const achievementsData = docSnap.data();
        setAchievements(achievementsData.achievements || []);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [currentUser]);

  const updateAchievement = async (achievementId, progress) => {
    try {
      if (!currentUser) return;

      const achievement = achievements.find(a => a.id === achievementId);
      if (!achievement) return;

      const newProgress = Math.min(achievement.targetProgress, progress);
      const completed = newProgress >= achievement.targetProgress;

      const updatedAchievement = {
        ...achievement,
        currentProgress: newProgress,
        completed,
        completedAt: completed ? serverTimestamp() : null
      };

      const userAchievementsRef = doc(db, 'user_achievements', currentUser.uid);
      const updatedAchievements = achievements.map(a => 
        a.id === achievementId ? updatedAchievement : a
      );

      await updateDoc(userAchievementsRef, {
        achievements: updatedAchievements,
        lastUpdated: serverTimestamp()
      });

      if (completed && !achievement.completed) {
        createNotification({
          title: '🏆 Achievement Unlocked!',
          message: `Congratulations! You've earned the "${achievement.name}" achievement!`,
          type: 'achievement',
          achievement: updatedAchievement
        });
      }

      setAchievements(updatedAchievements);
    } catch (error) {
      console.error('Error updating achievement:', error);
      setError('Failed to update achievement');
    }
  };

  return {
    achievements,
    loading,
    error,
    updateAchievement,
    getIconComponent
  };
};

export default useAchievements;
