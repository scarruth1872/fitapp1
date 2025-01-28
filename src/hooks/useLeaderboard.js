import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  Timestamp
} from 'firebase/firestore';

const calculatePoints = (achievements) => {
  const pointValues = {
    workout: 100,
    streak: 150,
    social: 75,
    program: 200,
    challenge: 250
  };

  return achievements.reduce((total, achievement) => {
    return total + (achievement.completed ? (pointValues[achievement.type] || 100) : 0);
  }, 0);
};

const getDateRange = (timeframe) => {
  const now = new Date();
  const startDate = new Date();

  switch (timeframe) {
    case 'weekly':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1);
      break;
    default: // allTime
      startDate.setFullYear(2020); // or any reasonable start date
  }

  return {
    start: Timestamp.fromDate(startDate),
    end: Timestamp.fromDate(now)
  };
};

export const useLeaderboard = (timeframe = 'weekly', category = 'all', scope = 'global') => {
  const { currentUser } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousRankings, setPreviousRankings] = useState(new Map());

  const fetchUserAchievements = async (userId, dateRange) => {
    try {
      const userAchievementsRef = doc(db, 'userAchievements', userId);
      const userAchievementsDoc = await getDoc(userAchievementsRef);

      if (!userAchievementsDoc.exists()) {
        return [];
      }

      let achievements = userAchievementsDoc.data().achievements;

      // Filter by timeframe if not all-time
      if (timeframe !== 'allTime') {
        achievements = achievements.filter(achievement => {
          return (
            achievement.completedAt &&
            achievement.completedAt.toDate() >= dateRange.start.toDate() &&
            achievement.completedAt.toDate() <= dateRange.end.toDate()
          );
        });
      }

      // Filter by category if not all
      if (category !== 'all') {
        achievements = achievements.filter(achievement => achievement.type === category);
      }

      return achievements;
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  };

  const fetchUserStreak = async (userId) => {
    try {
      const workoutsRef = collection(db, 'workouts');
      const userWorkoutsQuery = query(
        workoutsRef,
        where('userId', '==', userId),
        where('completed', '==', true),
        orderBy('completedAt', 'desc'),
        limit(30) // Reasonable limit for streak calculation
      );

      const workouts = await getDocs(userWorkoutsQuery);
      const workoutDates = workouts.docs
        .map(doc => doc.data().completedAt.toDate())
        .sort((a, b) => b - a);

      let streak = 0;
      let lastDate = new Date();

      for (const date of workoutDates) {
        const dayDifference = Math.floor(
          (lastDate - date) / (1000 * 60 * 60 * 24)
        );

        if (dayDifference <= 1) {
          streak++;
          lastDate = date;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating user streak:', error);
      return 0;
    }
  };

  const fetchFriends = async (userId) => {
    try {
      const userFriendsRef = doc(db, 'userFriends', userId);
      const userFriendsDoc = await getDoc(userFriendsRef);

      if (!userFriendsDoc.exists()) {
        return [];
      }

      return userFriendsDoc.data().friends || [];
    } catch (error) {
      console.error('Error fetching user friends:', error);
      return [];
    }
  };

  const fetchLeaderboardData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const dateRange = getDateRange(timeframe);

      // Get users to include in leaderboard
      let usersQuery;
      if (scope === 'friends') {
        const friendIds = await fetchFriends(currentUser.uid);
        usersQuery = query(
          collection(db, 'users'),
          where('uid', 'in', [...friendIds, currentUser.uid])
        );
      } else {
        usersQuery = query(collection(db, 'users'));
      }

      const usersSnapshot = await getDocs(usersQuery);
      const userPromises = usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const achievements = await fetchUserAchievements(userData.uid, dateRange);
        const streak = await fetchUserStreak(userData.uid);

        return {
          uid: userData.uid,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          achievements,
          achievementCount: achievements.filter(a => a.completed).length,
          points: calculatePoints(achievements),
          streak
        };
      });

      const users = await Promise.all(userPromises);

      // Sort users by points and achievement count
      const sortedUsers = users.sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        return b.achievementCount - a.achievementCount;
      });

      // Calculate rank changes
      const updatedUsers = sortedUsers.map((user, index) => {
        const previousRank = previousRankings.get(user.uid);
        const rankChange = previousRank ? previousRank - (index + 1) : 0;
        return { ...user, rankChange };
      });

      // Update previous rankings
      const newRankings = new Map(
        updatedUsers.map((user, index) => [user.uid, index + 1])
      );
      setPreviousRankings(newRankings);

      setLeaderboardData(updatedUsers);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchLeaderboardData();
    }
  }, [currentUser, timeframe, category, scope]);

  return {
    leaderboardData,
    loading,
    error,
    refreshLeaderboard: fetchLeaderboardData
  };
};
