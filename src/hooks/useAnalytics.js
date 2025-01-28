import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import {
  Timeline as TimelineIcon,
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
  Group as GroupIcon
} from '@mui/icons-material';

const calculateCompletionRate = (achievements) => {
  if (!achievements.length) return 0;
  const completed = achievements.filter(a => a.completed).length;
  return (completed / achievements.length) * 100;
};

const calculateRecentUnlocks = (achievements) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return achievements.filter(achievement => 
    achievement.completed &&
    achievement.completedAt?.toDate() >= oneWeekAgo
  ).length;
};

const prepareCategoryData = (achievements) => {
  const categories = achievements.reduce((acc, achievement) => {
    acc[achievement.type] = (acc[achievement.type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categories).map(([name, value]) => ({
    name,
    value
  }));
};

const prepareTimelineData = (achievements) => {
  const timelineMap = new Map();
  const sortedAchievements = [...achievements].sort((a, b) => {
    const dateA = a.completedAt?.toDate() || new Date(0);
    const dateB = b.completedAt?.toDate() || new Date(0);
    return dateA - dateB;
  });

  sortedAchievements.forEach(achievement => {
    const date = achievement.completedAt?.toDate() || new Date(0);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!timelineMap.has(dateStr)) {
      timelineMap.set(dateStr, {
        date: dateStr,
        completed: 0,
        total: 1
      });
    } else {
      const current = timelineMap.get(dateStr);
      timelineMap.set(dateStr, {
        ...current,
        total: current.total + 1
      });
    }

    if (achievement.completed) {
      const current = timelineMap.get(dateStr);
      timelineMap.set(dateStr, {
        ...current,
        completed: current.completed + 1
      });
    }
  });

  return Array.from(timelineMap.values());
};

const calculatePerformanceMetrics = (achievements, workouts) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // Current week metrics
  const currentWeekAchievements = achievements.filter(a => 
    a.completed && a.completedAt?.toDate() >= oneWeekAgo
  ).length;

  const currentWeekWorkouts = workouts.filter(w =>
    w.completed && w.completedAt?.toDate() >= oneWeekAgo
  ).length;

  // Previous week metrics for comparison
  const previousWeekAchievements = achievements.filter(a =>
    a.completed &&
    a.completedAt?.toDate() >= twoWeeksAgo &&
    a.completedAt?.toDate() < oneWeekAgo
  ).length;

  const previousWeekWorkouts = workouts.filter(w =>
    w.completed &&
    w.completedAt?.toDate() >= twoWeeksAgo &&
    w.completedAt?.toDate() < oneWeekAgo
  ).length;

  // Calculate changes
  const achievementChange = previousWeekAchievements === 0
    ? 100
    : ((currentWeekAchievements - previousWeekAchievements) / previousWeekAchievements) * 100;

  const workoutChange = previousWeekWorkouts === 0
    ? 100
    : ((currentWeekWorkouts - previousWeekWorkouts) / previousWeekWorkouts) * 100;

  return [
    {
      name: 'Achievements',
      value: currentWeekAchievements,
      change: Math.round(achievementChange),
      icon: <TrophyIcon color="primary" />
    },
    {
      name: 'Workouts',
      value: currentWeekWorkouts,
      change: Math.round(workoutChange),
      icon: <FireIcon color="primary" />
    },
    {
      name: 'Streak',
      value: calculateStreak(workouts),
      change: 0, // Calculated separately
      icon: <TimelineIcon color="primary" />
    },
    {
      name: 'Social',
      value: calculateSocialScore(achievements),
      change: 0, // Calculated separately
      icon: <GroupIcon color="primary" />
    }
  ];
};

const calculateStreak = (workouts) => {
  if (!workouts.length) return 0;

  const dates = workouts
    .filter(w => w.completed)
    .map(w => w.completedAt.toDate())
    .sort((a, b) => b - a);

  let streak = 1;
  let currentDate = dates[0];

  for (let i = 1; i < dates.length; i++) {
    const dayDiff = Math.floor(
      (currentDate - dates[i]) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) {
      streak++;
      currentDate = dates[i];
    } else if (dayDiff > 1) {
      break;
    }
  }

  return streak;
};

const calculateSocialScore = (achievements) => {
  return achievements.filter(a => 
    a.completed && a.type === 'social'
  ).length;
};

const prepareCommunityData = async (userAchievements) => {
  try {
    const achievementsRef = collection(db, 'userAchievements');
    const achievementsSnapshot = await getDocs(achievementsRef);

    const communityData = achievementsSnapshot.docs.map(doc => doc.data().achievements);
    const categories = ['workout', 'social', 'streak', 'program'];

    return categories.map(category => {
      // User progress
      const userProgress = userAchievements
        .filter(a => a.type === category)
        .filter(a => a.completed)
        .length;

      // Community average
      const communityProgress = communityData.reduce((acc, userAchievements) => {
        const completed = userAchievements
          .filter(a => a.type === category)
          .filter(a => a.completed)
          .length;
        return acc + completed;
      }, 0);

      const communityAverage = communityProgress / communityData.length;

      return {
        category,
        user: userProgress,
        community: Math.round(communityAverage * 10) / 10
      };
    });
  } catch (error) {
    console.error('Error preparing community data:', error);
    return [];
  }
};

export const useAnalytics = () => {
  const { currentUser } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      // Fetch user achievements
      const userAchievementsRef = doc(db, 'userAchievements', currentUser.uid);
      const userAchievementsDoc = await getDoc(userAchievementsRef);
      const achievements = userAchievementsDoc.data()?.achievements || [];

      // Fetch user workouts
      const workoutsRef = collection(db, 'workouts');
      const userWorkoutsQuery = query(
        workoutsRef,
        where('userId', '==', currentUser.uid)
      );
      const workoutsSnapshot = await getDocs(userWorkoutsQuery);
      const workouts = workoutsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Prepare all analytics data
      const progressData = {
        completionRate: calculateCompletionRate(achievements),
        recentUnlocks: calculateRecentUnlocks(achievements)
      };

      const categoryData = prepareCategoryData(achievements);
      const timelineData = prepareTimelineData(achievements);
      const performanceData = calculatePerformanceMetrics(achievements, workouts);
      const communityData = await prepareCommunityData(achievements);

      setAnalyticsData({
        progressData,
        categoryData,
        timelineData,
        performanceData,
        communityData
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAnalyticsData();
    }
  }, [currentUser]);

  return {
    analyticsData,
    loading,
    error,
    refreshAnalytics: fetchAnalyticsData
  };
};
