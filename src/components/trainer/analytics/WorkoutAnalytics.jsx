import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Info as InfoIcon,
  TrendingUp,
  AccessTime,
  LocalFireDepartment,
  EmojiEvents
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const WorkoutAnalytics = ({ workoutLogs, goals, measurements }) => {
  const theme = useTheme();

  const stats = useMemo(() => {
    if (!workoutLogs?.length) return null;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const recentLogs = workoutLogs.filter(log => new Date(log.date) >= thirtyDaysAgo);

    const totalWorkouts = recentLogs.length;
    const totalDuration = recentLogs.reduce((sum, log) => sum + log.duration, 0);
    const totalCalories = recentLogs.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0);
    
    // Calculate streak
    let currentStreak = 0;
    let maxStreak = 0;
    let lastWorkoutDate = null;
    
    recentLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(log => {
      const workoutDate = new Date(log.date);
      if (!lastWorkoutDate) {
        currentStreak = 1;
      } else {
        const dayDiff = Math.floor((lastWorkoutDate - workoutDate) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak);
      lastWorkoutDate = workoutDate;
    });

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      maxStreak,
      avgDuration: totalDuration / totalWorkouts,
      avgCalories: totalCalories / totalWorkouts
    };
  }, [workoutLogs]);

  const progressData = useMemo(() => {
    if (!measurements?.length) return [];

    return measurements.map(m => ({
      date: new Date(m.date).toLocaleDateString(),
      weight: m.values.weight,
      bodyFat: m.values.bodyFat,
      muscle: m.values.muscleMass
    }));
  }, [measurements]);

  const workoutTypeData = useMemo(() => {
    if (!workoutLogs?.length) return [];

    const typeCount = workoutLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCount).map(([type, count]) => ({
      name: type,
      value: count
    }));
  }, [workoutLogs]);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main
  ];

  if (!stats) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Workout Analytics
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Workouts</Typography>
              </Box>
              <Typography variant="h4">{stats.totalWorkouts}</Typography>
              <Typography variant="body2" color="text.secondary">
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Duration</Typography>
              </Box>
              <Typography variant="h4">
                {Math.round(stats.avgDuration)} min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per workout
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalFireDepartment color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Calories Burned</Typography>
              </Box>
              <Typography variant="h4">
                {Math.round(stats.totalCalories)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total calories
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEvents color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Max Streak</Typography>
              </Box>
              <Typography variant="h4">{stats.maxStreak} days</Typography>
              <Typography variant="body2" color="text.secondary">
                Consecutive workouts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Progress Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Progress Tracking</Typography>
              <Tooltip title="Track your weight, body fat %, and muscle mass over time">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke={theme.palette.primary.main}
                  name="Weight"
                />
                <Line
                  type="monotone"
                  dataKey="bodyFat"
                  stroke={theme.palette.error.main}
                  name="Body Fat %"
                />
                <Line
                  type="monotone"
                  dataKey="muscle"
                  stroke={theme.palette.success.main}
                  name="Muscle Mass"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Workout Type Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Workout Types</Typography>
              <Tooltip title="Distribution of different workout types">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workoutTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {workoutTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkoutAnalytics;
