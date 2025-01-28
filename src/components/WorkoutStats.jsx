import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  LocalFireDepartment as FireIcon,
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useWorkout } from '../contexts/WorkoutContext';

// Create a motion component by passing Box as a component prop
const MotionBox = motion(Box);

const WorkoutStats = () => {
  const theme = useTheme();
  const { workouts, loading } = useWorkout();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    averageIntensity: 0
  });

  useEffect(() => {
    if (!workouts) return;

    const calculateStats = () => {
      const totalWorkouts = workouts.length;
      const totalDuration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
      const totalCalories = workouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
      
      const intensityMap = {
        'Light': 1,
        'Moderate': 2,
        'Intense': 3,
        'Very Intense': 4
      };
      
      const totalIntensity = workouts.reduce((sum, workout) => {
        return sum + (intensityMap[workout.intensity] || 0);
      }, 0);
      
      const averageIntensity = totalWorkouts > 0 ? totalIntensity / totalWorkouts : 0;

      setStats({
        totalWorkouts,
        totalDuration,
        totalCalories,
        averageIntensity
      });
    };

    calculateStats();
  }, [workouts]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Workouts',
      value: stats.totalWorkouts,
      icon: <TimelineIcon />,
      color: theme.palette.primary.main
    },
    {
      title: 'Total Duration',
      value: `${stats.totalDuration} min`,
      icon: <TimerIcon />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Calories Burned',
      value: `${stats.totalCalories} cal`,
      icon: <FireIcon />,
      color: theme.palette.error.main
    },
    {
      title: 'Average Intensity',
      value: ['Light', 'Moderate', 'Intense', 'Very Intense'][Math.floor(stats.averageIntensity) - 1] || 'N/A',
      icon: <FitnessCenterIcon />,
      color: theme.palette.success.main
    }
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              sx={{
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                    mr: 2
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
              <Typography variant="h4" component="div">
                {stat.value}
              </Typography>
            </MotionBox>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default WorkoutStats;
