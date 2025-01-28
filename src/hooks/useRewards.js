import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

const DEFAULT_REWARDS = [
  {
    id: 'custom_workout_creator',
    name: 'Custom Workout Creator',
    description: 'Create and share your own custom workout programs',
    imageUrl: '/rewards/custom-workout.jpg',
    requiredAchievement: 'Workout Master',
    benefits: [
      'Create custom workout programs',
      'Share programs with the community',
      'Access to advanced exercise library',
      'Custom program templates'
    ],
    tier: 1
  },
  {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Access detailed workout and progress analytics',
    imageUrl: '/rewards/analytics.jpg',
    requiredAchievement: 'Consistency King',
    benefits: [
      'Detailed performance metrics',
      'Progress predictions',
      'Custom progress reports',
      'Compare with community averages'
    ],
    tier: 2
  },
  {
    id: 'social_features',
    name: 'Social Features Pro',
    description: 'Enhanced social features and community engagement',
    imageUrl: '/rewards/social.jpg',
    requiredAchievement: 'Social Butterfly',
    benefits: [
      'Create workout groups',
      'Host virtual workouts',
      'Advanced sharing options',
      'Community challenges'
    ],
    tier: 1
  },
  {
    id: 'exclusive_programs',
    name: 'Exclusive Programs',
    description: 'Access to premium workout programs',
    imageUrl: '/rewards/premium.jpg',
    requiredAchievement: 'Program Master',
    benefits: [
      'Premium workout programs',
      'Expert-designed routines',
      'Exclusive exercises',
      'Priority support'
    ],
    tier: 2
  },
  {
    id: 'custom_profile',
    name: 'Profile Customization',
    description: 'Customize your profile with exclusive features',
    imageUrl: '/rewards/profile.jpg',
    requiredAchievement: 'Community Leader',
    benefits: [
      'Custom profile themes',
      'Animated profile badges',
      'Special status indicators',
      'Profile showcases'
    ],
    tier: 1
  },
  {
    id: 'achievement_master',
    name: 'Achievement Master',
    description: 'Special rewards for completing all base achievements',
    imageUrl: '/rewards/master.jpg',
    requiredAchievement: 'All Base Achievements',
    benefits: [
      'Special profile badge',
      'Early access to new features',
      'Community mentor status',
      'Custom workout animations'
    ],
    tier: 3
  }
];

const useRewards = () => {
  const { currentUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeUserRewards = async () => {
    try {
      const userRewardsRef = doc(db, 'userRewards', currentUser.uid);
      const rewardsData = DEFAULT_REWARDS.map(reward => ({
        ...reward,
        unlockedAt: null,
        claimed: false,
        claimedAt: null
      }));

      await setDoc(userRewardsRef, {
        rewards: rewardsData,
        lastUpdated: serverTimestamp()
      });

      return rewardsData;
    } catch (error) {
      console.error('Error initializing rewards:', error);
      throw error;
    }
  };

  const fetchRewards = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userRewardsRef = doc(db, 'userRewards', currentUser.uid);
      const userRewardsDoc = await getDocs(userRewardsRef);

      let userRewards;
      if (!userRewardsDoc.exists()) {
        userRewards = await initializeUserRewards();
      } else {
        userRewards = userRewardsDoc.data().rewards;
      }

      setRewards(userRewards);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievementRewards = async (achievements) => {
    if (!currentUser) return;

    try {
      const userRewardsRef = doc(db, 'userRewards', currentUser.uid);
      const updatedRewards = rewards.map(reward => {
        const requiredAchievement = achievements.find(
          a => a.name === reward.requiredAchievement
        );

        if (requiredAchievement?.completed && !reward.unlockedAt) {
          return {
            ...reward,
            unlockedAt: serverTimestamp()
          };
        }
        return reward;
      });

      await updateDoc(userRewardsRef, {
        rewards: updatedRewards,
        lastUpdated: serverTimestamp()
      });

      setRewards(updatedRewards);

      // Return newly unlocked rewards
      return updatedRewards.filter(
        (reward, index) => reward.unlockedAt && !rewards[index].unlockedAt
      );
    } catch (err) {
      console.error('Error checking achievement rewards:', err);
      throw err;
    }
  };

  const claimReward = async (rewardId) => {
    if (!currentUser) return;

    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward || !reward.unlockedAt || reward.claimed) {
        throw new Error('Reward cannot be claimed');
      }

      const userRewardsRef = doc(db, 'userRewards', currentUser.uid);
      const updatedRewards = rewards.map(r =>
        r.id === rewardId
          ? { ...r, claimed: true, claimedAt: serverTimestamp() }
          : r
      );

      await updateDoc(userRewardsRef, {
        rewards: updatedRewards,
        lastUpdated: serverTimestamp()
      });

      // Update user's features/permissions based on the claimed reward
      await updateUserFeatures(rewardId);

      setRewards(updatedRewards);
    } catch (err) {
      console.error('Error claiming reward:', err);
      throw err;
    }
  };

  const updateUserFeatures = async (rewardId) => {
    try {
      const userFeaturesRef = doc(db, 'userFeatures', currentUser.uid);
      const features = {
        custom_workout_creator: ['create_programs', 'share_programs', 'advanced_exercises'],
        advanced_analytics: ['detailed_metrics', 'predictions', 'reports'],
        social_features: ['groups', 'virtual_workouts', 'challenges'],
        exclusive_programs: ['premium_programs', 'exclusive_exercises'],
        custom_profile: ['themes', 'badges', 'showcases'],
        achievement_master: ['early_access', 'mentor_status', 'animations']
      };

      await updateDoc(userFeaturesRef, {
        [`features.${rewardId}`]: true,
        enabledFeatures: features[rewardId] || [],
        lastUpdated: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating user features:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRewards();
    }
  }, [currentUser]);

  return {
    rewards,
    loading,
    error,
    checkAchievementRewards,
    claimReward,
    refreshRewards: fetchRewards
  };
};

export default useRewards;
