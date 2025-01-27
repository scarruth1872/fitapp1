import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tab,
  Tabs,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProgressCharts from '../components/ProgressCharts';
import { useWorkout } from '../contexts/WorkoutContext';

const MotionPaper = motion(Paper);

const Progress = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { workouts, loading } = useWorkout();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (!workouts?.length) return {
      totalWorkouts: 0,
      totalExercises: 0,
      avgDuration: 0,
      completionRate: 0
    };

    const total = workouts.length;
    const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const completed = workouts.filter(w => w.completed).length;

    return {
      totalWorkouts: total,
      totalExercises: totalExercises,
      avgDuration: total ? Math.round(totalDuration / total) : 0,
      completionRate: total ? Math.round((completed / total) * 100) : 0
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Workouts',
      value: stats.totalWorkouts,
      icon: <TimelineIcon />,
      color: 'primary.main'
    },
    {
      title: 'Total Exercises',
      value: stats.totalExercises,
      icon: <FitnessCenterIcon />,
      color: 'secondary.main'
    },
    {
      title: 'Avg. Duration',
      value: `${stats.avgDuration} min`,
      icon: <TimerIcon />,
      color: 'error.main'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: <TrendingUpIcon />,
      color: 'success.main'
    }
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: 'primary.main', mb: 4 }}
      >
        Progress Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <MotionPaper
              elevation={3}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: `${stat.color}15`,
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {React.cloneElement(stat.icon, {
                        sx: { fontSize: 30, color: stat.color }
                      })}
                    </Box>
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Exercise Progress" />
          <Tab label="Time Analysis" />
        </Tabs>
      </Paper>

      <MotionPaper
        elevation={3}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box p={3}>
          <ProgressCharts selectedTab={selectedTab} />
        </Box>
      </MotionPaper>
    </Container>
  );
};

export default Progress;
