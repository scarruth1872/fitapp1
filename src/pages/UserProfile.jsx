import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  TextField,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useWorkout } from '../contexts/WorkoutContext';
import ActivityFeed from '../components/ActivityFeed';

const MotionPaper = motion.create(Paper);

const UserProfile = () => {
  const { currentUser } = useAuth();
  const { workouts } = useWorkout();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    bio: '',
    goals: '',
    fitnessLevel: 'intermediate'
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      // Update profile logic here
      console.log('Profile updated:', profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate user stats
  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((sum, workout) => sum + workout.exercises.length, 0);
  const completionRate = workouts.length > 0
    ? (workouts.filter(w => w.completed).length / workouts.length * 100).toFixed(1)
    : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <MotionPaper
            elevation={3}
            sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar
              src={currentUser?.photoURL}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <Typography variant="h4" gutterBottom>
                {currentUser?.displayName || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Member since {new Date(currentUser?.metadata?.creationTime).toLocaleDateString()}
              </Typography>
            </Box>
          </MotionPaper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <MotionPaper
            elevation={3}
            sx={{ p: 3, textAlign: 'center' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Typography variant="h6" gutterBottom>Total Workouts</Typography>
            <Typography variant="h3">{totalWorkouts}</Typography>
          </MotionPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionPaper
            elevation={3}
            sx={{ p: 3, textAlign: 'center' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Typography variant="h6" gutterBottom>Total Exercises</Typography>
            <Typography variant="h3">{totalExercises}</Typography>
          </MotionPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionPaper
            elevation={3}
            sx={{ p: 3, textAlign: 'center' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Typography variant="h6" gutterBottom>Completion Rate</Typography>
            <Typography variant="h3">{completionRate}%</Typography>
          </MotionPaper>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ mt: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Activity" />
              <Tab label="Profile Settings" />
              <Tab label="Goals" />
            </Tabs>

            {/* Activity Feed Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <ActivityFeed />
              </Box>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleProfileUpdate}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Goals Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <TextField
                  fullWidth
                  label="Fitness Goals"
                  multiline
                  rows={4}
                  value={profileData.goals}
                  onChange={(e) => setProfileData({ ...profileData, goals: e.target.value })}
                  sx={{ mb: 3 }}
                />
                <Button
                  variant="contained"
                  onClick={handleProfileUpdate}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Goals'}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
