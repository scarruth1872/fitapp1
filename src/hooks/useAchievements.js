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
    icon: 'workout',
    targetProgress: 5,
    reward: 'Unlock basic workout templates',
    tier: 1
  },
  {
    id: 'workout_intermediate',
    type: ACHIEVEMENT_TYPES.WORKOUT_COUNT,
    name: 'Workout Warrior',
    description: 'Complete 25 workouts',
    icon: 'workout',
    targetProgress: 25,
    reward: 'Unlock advanced workout templates',
    tier: 2
  },
  {
    id: 'workout_master',
    type: ACHIEVEMENT_TYPES.WORKOUT_COUNT,
    name: 'Workout Master',
    description: 'Complete 100 workouts',
    icon: 'workout',
    targetProgress: 100,
    reward: 'Unlock expert workout templates and custom badge',
    tier: 3
  },
  {
    id: 'streak_starter',
    type: ACHIEVEMENT_TYPES.WORKOUT_STREAK,
    name: 'Streak Starter',
    description: 'Maintain a 7-day workout streak',
    icon: 'fire',
    targetProgress: 7,
    reward: 'Special streak badge',
    tier: 1
  },
  {
    id: 'social_butterfly',
    type: ACHIEVEMENT_TYPES.SOCIAL_SHARES,
    name: 'Social Butterfly',
    description: 'Share 10 workouts with the community',
    icon: 'social',
    targetProgress: 10,
    reward: 'Unlock social features and custom sharing templates',
    tier: 1
  },
  {
    id: 'program_master',
    type: ACHIEVEMENT_TYPES.PROGRAM_COMPLETIONS,
    name: 'Program Master',
    description: 'Complete 3 full workout programs',
    icon: 'trophy',
    targetProgress: 3,
    reward: 'Ability to create and share custom programs',
    tier: 2
  },
  {
    id: 'community_leader',
    type: ACHIEVEMENT_TYPES.COMMUNITY_ENGAGEMENT,
    name: 'Community Leader',
    description: 'Get 50 likes on your shared workouts',
    icon: 'star',
    targetProgress: 50,
    reward: 'Verified community leader badge',
    tier: 2
  },
  {
    id: 'consistency_king',
    type: ACHIEVEMENT_TYPES.WORKOUT_STREAK,
    name: 'Consistency King',
    description: 'Maintain a 30-day workout streak',
    icon: 'streak',
    targetProgress: 30,
    reward: 'Exclusive workout programs and custom profile banner',
    tier: 3
  }
];

const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'workout':
      return <WorkoutIcon />;
    case 'fire':
      return <FireIcon />;
    case 'social':
      return <SocialIcon />;
    case 'streak':
      return <StreakIcon />;
    case 'star':
      return <StarIcon />;
    case 'trophy':
      return <TrophyIcon />;
    default:
      return <StarIcon />;
  }
};

export const useAchievements = () => {
  const { currentUser } = useAuth();
  const { createNotification } = useNotification();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showAchievementNotification = (achievement) => {
    createNotification({
      title: '🏆 Achievement Unlocked!',
      message: `Congratulations! You've earned the "${achievement.name}" achievement!`,
      type: 'success'
    });
  };

  const initializeUserAchievements = async () => {
    try {
      const userAchievementsRef = doc(collection(db, 'userAchievements'));
      const achievementsData = DEFAULT_ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        currentProgress: 0,
        completed: false,
        completedAt: null,
        iconComponent: getIconComponent(achievement.icon)
      }));

      await setDoc(userAchievementsRef, {
        userId: currentUser.uid,
        achievements: achievementsData,
        updatedAt: serverTimestamp()
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
      setError(null);

      const userAchievementsRef = collection(db, 'userAchievements');
      const q = query(userAchievementsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);

      let userAchievements;
      if (querySnapshot.empty) {
        userAchievements = await initializeUserAchievements();
      } else {
        const data = querySnapshot.docs[0].data();
        userAchievements = data.achievements.map(achievement => ({
          ...achievement,
          iconComponent: getIconComponent(achievement.icon)
        }));
      }

      setAchievements(userAchievements);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAchievementProgress = async (type, incrementValue = 1) => {
    if (!currentUser) return;

    try {
      const userAchievementsRef = collection(db, 'userAchievements');
      const q = query(userAchievementsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const docRef = querySnapshot.empty 
        ? doc(userAchievementsRef) 
        : doc(db, 'userAchievements', querySnapshot.docs[0].id);

      const updatedAchievements = achievements.map(achievement => {
        if (achievement.type === type && !achievement.completed) {
          const newProgress = achievement.currentProgress + incrementValue;
          const completed = newProgress >= achievement.targetProgress;

          if (completed && !achievement.completed) {
            showAchievementNotification(achievement);
          }

          return {
            ...achievement,
            currentProgress: newProgress,
            completed,
            completedAt: completed ? serverTimestamp() : null
          };
        }
        return achievement;
      });

      await updateDoc(docRef, {
        achievements: updatedAchievements,
        updatedAt: serverTimestamp()
      });

      setAchievements(updatedAchievements);
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      setError(error.message);
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
    updateAchievementProgress
  };
};

export default useAchievements;
