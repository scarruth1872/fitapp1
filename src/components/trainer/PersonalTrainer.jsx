import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  useTheme,
  Tooltip,
  Zoom,
  Chip,
  Stack
} from '@mui/material';
import {
  Psychology as AIIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as NutritionIcon,
  Timeline as ProgressIcon,
  EmojiEvents as ChallengeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import TrainerChat from './TrainerChat';
import ExerciseVisualizer from './ExerciseVisualizer';
import WorkoutPlanner from './WorkoutPlanner';
import ProgressTracker from './ProgressTracker';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkout } from '../../contexts/WorkoutContext';

const PersonalTrainer = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const { currentUser } = useAuth();
  const { workouts } = useWorkout();
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [trainerStatus, setTrainerStatus] = useState({
    mood: 'excited',
    message: "I'm here to help you achieve your fitness goals!"
  });

  useEffect(() => {
    if (workouts.length > 0) {
      generateAISuggestions();
    }
  }, [workouts]);

  const generateAISuggestions = () => {
    const suggestions = [];
    
    // Analyze workout patterns
    const recentWorkouts = workouts.slice(-5);
    const workoutTypes = new Set(recentWorkouts.map(w => w.type));
    
    if (workoutTypes.size < 3) {
      suggestions.push({
        type: 'variety',
        message: "I notice you're focusing on specific workout types. Let's add some variety to target different muscle groups!",
        action: 'View Workout Types'
      });
    }

    // Check workout frequency
    const now = new Date();
    const lastWorkout = workouts[workouts.length - 1];
    const daysSinceLastWorkout = Math.floor((now - lastWorkout.timestamp) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastWorkout > 3) {
      suggestions.push({
        type: 'consistency',
        message: "It's been a few days since your last workout. Ready to get back on track?",
        action: 'Start Workout'
      });
    }

    setAiSuggestions(suggestions);
  };

  const quickActions = [
    { icon: <WorkoutIcon />, label: 'Create a workout plan', action: () => setActiveTab(1) },
    { icon: <NutritionIcon />, label: 'Nutrition advice', action: () => {} },
    { icon: <ProgressIcon />, label: 'View my progress', action: () => setActiveTab(3) },
    { icon: <ChallengeIcon />, label: 'Join a challenge', action: () => {} }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            <Box sx={{ height: '100%', p: 0 }}>
              <TrainerChat suggestions={aiSuggestions} trainerStatus={trainerStatus} />
            </Box>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            <Box sx={{ height: '100%', p: 0 }}>
              <WorkoutPlanner />
            </Box>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            <Box sx={{ height: '100%', p: 0 }}>
              <ExerciseVisualizer />
            </Box>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            <Box sx={{ height: '100%', p: 0 }}>
              <ProgressTracker />
            </Box>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 0 }}>
      {/* Quick Actions */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'primary.dark',
          bgcolor: 'background.paper'
        }}
      >
        {quickActions.map((action, index) => (
          <Chip
            key={index}
            icon={action.icon}
            label={action.label}
            onClick={action.action}
            sx={{
              bgcolor: 'background.default',
              color: 'primary.main',
              border: 1,
              borderColor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          />
        ))}
      </Stack>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </Box>

      {/* AI Suggestions Indicator */}
      {aiSuggestions.length > 0 && (
        <Tooltip
          TransitionComponent={Zoom}
          title={aiSuggestions[0].message}
          placement="top"
        >
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            onClick={() => setActiveTab(0)}
          >
            <AIIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default PersonalTrainer;
