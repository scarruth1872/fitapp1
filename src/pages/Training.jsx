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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  FitnessCenter,
  Timeline,
  EmojiEvents,
  Psychology as AIIcon,
  Person as TrainerIcon,
  Info as AboutIcon,
  LocalOffer as ServicesIcon,
  SupportAgent as CounselingIcon,
  MenuBook as LibraryIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PersonalTrainer from '../components/trainer/PersonalTrainer';
import WorkoutAnalytics from '../components/trainer/analytics/WorkoutAnalytics';
import ChallengeHub from '../components/trainer/social/ChallengeHub';
import AchievementSystem from '../components/trainer/gamification/AchievementSystem';
import TrainerProfile from '../components/trainer/TrainerProfile';
import ServicesOverview from '../components/trainer/services/ServicesOverview';
import CounselingServices from '../components/trainer/services/CounselingServices';
import WorkoutProgramManager from '../components/trainer/WorkoutProgramManager';
import ExerciseLibrary from '../components/ExerciseLibrary';
import { WorkoutProgramProvider } from '../contexts/WorkoutProgramContext';
import { useAuth } from '../contexts/AuthContext';
import { useWorkout } from '../contexts/WorkoutContext';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const TrainingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const { workouts } = useWorkout();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        if (!currentUser) return;
        const userStatsRef = doc(db, 'userStats', currentUser.uid);
        const statsDoc = await getDoc(userStatsRef);
        if (statsDoc.exists()) {
          setUserStats(statsDoc.data());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading user stats:', error);
        setLoading(false);
      }
    };

    loadUserStats();
  }, [currentUser]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        pt: 2,
        pb: 4
      }}
    >
      <Container maxWidth="xl">
        <WorkoutProgramProvider>
          <Grid container spacing={2}>
            {/* Sidebar Navigation - Reordered to be first on mobile */}
            <Grid item xs={12} md={3} order={{ xs: 1, md: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'sticky',
                  top: 16
                }}
              >
                <List component="nav" sx={{ p: 0 }}>
                  {[
                    { value: 'trainer', label: 'AI TRAINER', icon: <AIIcon />, subtitle: 'GET PERSONALIZED GUIDANCE' },
                    { value: 'programs', label: 'PROGRAMS', icon: <FitnessCenter />, subtitle: 'VIEW WORKOUT PROGRAMS' },
                    { value: 'library', label: 'EXERCISES', icon: <LibraryIcon />, subtitle: 'BROWSE EXERCISE LIBRARY' },
                    { value: 'analytics', label: 'ANALYTICS', icon: <Timeline />, subtitle: 'TRACK YOUR PROGRESS' },
                    { value: 'challenges', label: 'CHALLENGES', icon: <EmojiEvents />, subtitle: 'JOIN FITNESS CHALLENGES' },
                    { value: 'about', label: 'ABOUT US', icon: <AboutIcon />, subtitle: 'LEARN ABOUT INSPIRED-FITNESS' },
                    { value: 'services', label: 'OUR SERVICES', icon: <ServicesIcon />, subtitle: 'EXPLORE OUR OFFERINGS' },
                    { value: 'counseling', label: 'COUNSELING', icon: <CounselingIcon />, subtitle: 'MENTAL WELLNESS SUPPORT' },
                  ].map((item) => (
                    <ListItem
                      key={item.value}
                      button
                      selected={activeSection === item.value}
                      onClick={() => setActiveSection(item.value)}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'primary.main',
                        '&:last-child': { borderBottom: 0 },
                        '&.Mui-selected': {
                          bgcolor: 'primary.dark',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        },
                        py: 1.5
                      }}
                    >
                      <ListItemIcon sx={{ color: activeSection === item.value ? 'primary.contrastText' : 'primary.main' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography 
                            variant="subtitle2" 
                            color={activeSection === item.value ? 'primary.contrastText' : 'primary.main'} 
                            sx={{ letterSpacing: 1, fontWeight: 600 }}
                          >
                            {item.label}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="caption" 
                            color={activeSection === item.value ? 'rgba(255,255,255,0.7)' : 'text.secondary'} 
                            sx={{ fontSize: '0.7rem' }}
                          >
                            {item.subtitle}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Main Content Area */}
            <Grid item xs={12} md={9} order={{ xs: 2, md: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  minHeight: { xs: 'auto', md: 'calc(100vh - 32px)' },
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%' }}
                  >
                    {activeSection === 'trainer' && <PersonalTrainer />}
                    {activeSection === 'analytics' && <WorkoutAnalytics />}
                    {activeSection === 'programs' && <WorkoutProgramManager />}
                    {activeSection === 'library' && <ExerciseLibrary />}
                    {activeSection === 'challenges' && <ChallengeHub />}
                    {activeSection === 'about' && <TrainerProfile />}
                    {activeSection === 'services' && <ServicesOverview />}
                    {activeSection === 'counseling' && <CounselingServices />}
                  </motion.div>
                </AnimatePresence>
              </Paper>
            </Grid>
          </Grid>
        </WorkoutProgramProvider>
      </Container>
    </Box>
  );
};

export default TrainingPage;
