import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  LocalFireDepartment,
  DirectionsRun,
  FitnessCenter,
  Timer,
  TrendingUp,
  Whatshot
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const achievements = {
  workoutStreak: {
    id: 'workoutStreak',
    title: 'Workout Warrior',
    description: 'Complete workouts on consecutive days',
    icon: <LocalFireDepartment />,
    levels: [
      { level: 1, requirement: 3, reward: 100 },
      { level: 2, requirement: 7, reward: 250 },
      { level: 3, requirement: 14, reward: 500 },
      { level: 4, requirement: 30, reward: 1000 },
      { level: 5, requirement: 60, reward: 2000 }
    ]
  },
  totalWorkouts: {
    id: 'totalWorkouts',
    title: 'Fitness Enthusiast',
    description: 'Complete a total number of workouts',
    icon: <FitnessCenter />,
    levels: [
      { level: 1, requirement: 10, reward: 100 },
      { level: 2, requirement: 25, reward: 250 },
      { level: 3, requirement: 50, reward: 500 },
      { level: 4, requirement: 100, reward: 1000 },
      { level: 5, requirement: 200, reward: 2000 }
    ]
  },
  caloriesBurned: {
    id: 'caloriesBurned',
    title: 'Calorie Crusher',
    description: 'Burn total calories across all workouts',
    icon: <Whatshot />,
    levels: [
      { level: 1, requirement: 1000, reward: 100 },
      { level: 2, requirement: 5000, reward: 250 },
      { level: 3, requirement: 10000, reward: 500 },
      { level: 4, requirement: 25000, reward: 1000 },
      { level: 5, requirement: 50000, reward: 2000 }
    ]
  },
  workoutDuration: {
    id: 'workoutDuration',
    title: 'Endurance Master',
    description: 'Accumulate total workout time',
    icon: <Timer />,
    levels: [
      { level: 1, requirement: 60, reward: 100 },
      { level: 2, requirement: 180, reward: 250 },
      { level: 3, requirement: 360, reward: 500 },
      { level: 4, requirement: 720, reward: 1000 },
      { level: 5, requirement: 1440, reward: 2000 }
    ]
  },
  strengthGains: {
    id: 'strengthGains',
    title: 'Strength Champion',
    description: 'Increase your strength across major lifts',
    icon: <TrendingUp />,
    levels: [
      { level: 1, requirement: 10, reward: 100 },
      { level: 2, requirement: 25, reward: 250 },
      { level: 3, requirement: 50, reward: 500 },
      { level: 4, requirement: 75, reward: 1000 },
      { level: 5, requirement: 100, reward: 2000 }
    ]
  }
};

const AchievementSystem = () => {
  const { currentUser } = useAuth();
  const [userAchievements, setUserAchievements] = useState({});
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUnlock, setShowUnlock] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        if (userData) {
          setUserStats({
            currentStreak: userData.currentStreak || 0,
            totalWorkouts: userData.totalWorkouts || 0,
            totalCalories: userData.totalCalories || 0,
            totalDuration: userData.totalDuration || 0,
            strengthProgress: userData.strengthProgress || 0,
            achievements: userData.achievements || {}
          });
          setUserAchievements(userData.achievements || {});
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [currentUser]);

  useEffect(() => {
    if (userStats) {
      checkAchievements();
    }
  }, [userStats]);

  const checkAchievements = () => {
    if (!userStats) return;

    const newAchievements = { ...userAchievements };
    let achievementUnlocked = false;

    Object.entries(achievements).forEach(([key, achievement]) => {
      const currentLevel = userAchievements[key]?.level || 0;
      const userValue = getUserStatValue(key);

      achievement.levels.forEach(level => {
        if (level.level > currentLevel && userValue >= level.requirement) {
          newAchievements[key] = {
            level: level.level,
            progress: userValue,
            unlockedAt: new Date().toISOString()
          };
          achievementUnlocked = true;
          setUnlockedAchievement({ ...achievement, level });
        }
      });
    });

    if (achievementUnlocked) {
      setUserAchievements(newAchievements);
      setShowUnlock(true);
      triggerConfetti();
      updateUserAchievements(newAchievements);
    }
  };

  const updateUserAchievements = async (newAchievements) => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        achievements: newAchievements
      });
    } catch (error) {
      console.error('Error updating achievements:', error);
    }
  };

  const getUserStatValue = (achievementId) => {
    if (!userStats) return 0;

    switch (achievementId) {
      case 'workoutStreak':
        return userStats.currentStreak;
      case 'totalWorkouts':
        return userStats.totalWorkouts;
      case 'caloriesBurned':
        return userStats.totalCalories;
      case 'workoutDuration':
        return userStats.totalDuration;
      case 'strengthGains':
        return userStats.strengthProgress;
      default:
        return 0;
    }
  };

  const calculateProgress = (achievementId) => {
    const achievement = achievements[achievementId];
    const userValue = getUserStatValue(achievementId);
    const currentLevel = userAchievements[achievementId]?.level || 0;
    
    if (currentLevel === 5) return 100;

    const nextLevel = achievement.levels.find(l => l.level > currentLevel);
    if (!nextLevel) return 100;

    const prevRequirement = currentLevel > 0
      ? achievement.levels.find(l => l.level === currentLevel).requirement
      : 0;
    
    const progress = ((userValue - prevRequirement) /
      (nextLevel.requirement - prevRequirement)) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: theme => theme.palette.primary.main }}>
        Achievements
      </Typography>

      <Grid container spacing={2}>
        <AnimatePresence>
          {Object.entries(achievements).map(([key, achievement]) => (
            <Grid item xs={12} sm={6} key={key}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card 
                  sx={{ 
                    bgcolor: 'background.paper',
                    border: theme => `1px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          mr: 2,
                          bgcolor: theme => theme.palette.primary.main,
                          color: theme => theme.palette.primary.contrastText
                        }}
                      >
                        {achievement.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: theme => theme.palette.text.primary }}>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme => theme.palette.text.secondary }}>
                          {achievement.description}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: theme => theme.palette.text.secondary }}>
                        Level {userAchievements[key]?.level || 0} / 5
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={calculateProgress(key)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: theme => theme.palette.background.default,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: theme => theme.palette.primary.main,
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      <Dialog
        open={showUnlock}
        onClose={() => setShowUnlock(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: theme => `1px solid ${theme.palette.primary.main}`,
          }
        }}
      >
        <DialogTitle sx={{ color: theme => theme.palette.primary.main }}>
          Achievement Unlocked!
        </DialogTitle>
        {unlockedAchievement && (
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  mb: 2,
                  mx: 'auto',
                  bgcolor: theme => theme.palette.primary.main,
                  color: theme => theme.palette.primary.contrastText
                }}
              >
                {unlockedAchievement.icon}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {unlockedAchievement.title} - Level {unlockedAchievement.level.level}
              </Typography>
              <Typography variant="body1">
                Reward: {unlockedAchievement.level.reward} points
              </Typography>
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setShowUnlock(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Achievement Unlocked!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AchievementSystem;
