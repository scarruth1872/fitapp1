import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonalTrainer from '../components/trainer/PersonalTrainer';
import WorkoutAnalytics from '../components/trainer/analytics/WorkoutAnalytics';
import ChallengeHub from '../components/trainer/social/ChallengeHub';
import AchievementSystem from '../components/trainer/gamification/AchievementSystem';
import ExerciseVisualizer from '../components/trainer/ExerciseVisualizer';
import WorkoutProgramBuilder from '../components/trainer/WorkoutProgramBuilder';
import WorkoutProgramManager from '../components/trainer/WorkoutProgramManager';
import { WorkoutProgramProvider } from '../contexts/WorkoutProgramContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const TrainingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [workoutStats, setWorkoutStats] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const profile = userDoc.exists() ? userDoc.data() : null;
        setUserProfile(profile);

        const workoutsRef = collection(db, 'users', currentUser.uid, 'workouts');
        const workoutsSnap = await getDocs(workoutsRef);
        
        let stats = {
          totalWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0,
          workouts: [],
          lastWorkout: null
        };

        workoutsSnap.forEach(doc => {
          const workout = doc.data();
          stats.totalWorkouts++;
          stats.totalDuration += workout.duration || 0;
          stats.totalCalories += workout.caloriesBurned || 0;
          stats.workouts.push(workout);
          if (!stats.lastWorkout || workout.date > stats.lastWorkout.date) {
            stats.lastWorkout = workout;
          }
        });

        setWorkoutStats(stats);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <WorkoutProgramProvider>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: theme.palette.background.default
        }}
      >
        <Container 
          maxWidth={false} 
          sx={{ 
            height: '100%',
            py: 2,
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <Grid 
            container 
            spacing={2} 
            sx={{ 
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Grid 
              item 
              xs={12} 
              md={8} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ width: '100%', mt: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  centered
                >
                  <Tab label="Exercise Library" />
                  <Tab label="Workout Programs" />
                </Tabs>
              </Box>

              <Box sx={{ mt: 3 }}>
                {activeTab === 0 && <ExerciseVisualizer />}
                {activeTab === 1 && <WorkoutProgramManager />}
              </Box>
            </Grid>
            
            <Grid 
              item 
              xs={12} 
              md={4} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflow: 'hidden'
              }}
            >
              <Paper 
                sx={{ 
                  p: 2,
                  height: '33%',
                  overflow: 'auto',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.primary.main}`,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: theme.palette.background.default,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '4px',
                  },
                }}
              >
                <WorkoutAnalytics stats={workoutStats} />
              </Paper>
              
              <Paper 
                sx={{ 
                  p: 2,
                  height: '33%',
                  overflow: 'auto',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.primary.main}`,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: theme.palette.background.default,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '4px',
                  },
                }}
              >
                <ChallengeHub />
              </Paper>
              
              <Paper 
                sx={{ 
                  p: 2,
                  height: '33%',
                  overflow: 'auto',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.primary.main}`,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: theme.palette.background.default,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '4px',
                  },
                }}
              >
                <AchievementSystem userProfile={userProfile} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </WorkoutProgramProvider>
  );
};

export default TrainingPage;
