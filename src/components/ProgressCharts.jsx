import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useWorkout } from '../contexts/WorkoutContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ProgressCharts = ({ selectedTab = 0 }) => {
  const theme = useTheme();
  const { workouts, loading } = useWorkout();
  const [chartData, setChartData] = useState({
    overview: [],
    exercises: [],
    timeAnalysis: []
  });

  useEffect(() => {
    if (!workouts?.length) return;

    // Prepare data for Overview chart
    const overviewData = workouts
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(workout => ({
        date: new Date(workout.timestamp).toLocaleDateString(),
        exercises: workout.exercises.length,
        duration: workout.duration || 0,
        intensity: workout.intensity === 'high' ? 3 : workout.intensity === 'medium' ? 2 : 1
      }));

    // Prepare data for Exercise Progress chart
    const exerciseMap = new Map();
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const maxWeight = Math.max(...exercise.sets.map(set => set.weight || 0));
        if (!exerciseMap.has(exercise.name)) {
          exerciseMap.set(exercise.name, []);
        }
        exerciseMap.get(exercise.name).push({
          date: new Date(workout.timestamp).toLocaleDateString(),
          weight: maxWeight,
          reps: Math.max(...exercise.sets.map(set => set.reps || 0))
        });
      });
    });

    const exerciseData = Array.from(exerciseMap.entries()).map(([name, data]) => ({
      name,
      data: data.sort((a, b) => new Date(a.date) - new Date(b.date))
    }));

    // Prepare data for Time Analysis chart
    const timeData = workouts.reduce((acc, workout) => {
      const hour = new Date(workout.timestamp).getHours();
      const timeSlot = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      const found = acc.find(item => item.name === timeSlot);
      if (found) {
        found.value++;
      } else {
        acc.push({ name: timeSlot, value: 1 });
      }
      return acc;
    }, []);

    setChartData({
      overview: overviewData,
      exercises: exerciseData,
      timeAnalysis: timeData
    });
  }, [workouts]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  const renderOverviewChart = () => (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h6" gutterBottom>
        Workout Progress Over Time
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData.overview}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="exercises"
            stroke={theme.palette.primary.main}
            name="Exercises"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="duration"
            stroke={theme.palette.secondary.main}
            name="Duration (min)"
          />
        </LineChart>
      </ResponsiveContainer>
    </MotionBox>
  );

  const renderExerciseChart = () => (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h6" gutterBottom>
        Exercise Progress
      </Typography>
      <Grid container spacing={3}>
        {chartData.exercises.slice(0, 4).map((exercise, index) => (
          <Grid item xs={12} md={6} key={exercise.name}>
            <Typography variant="subtitle1" gutterBottom>
              {exercise.name}
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={exercise.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="weight"
                  fill={theme.palette.primary.main}
                  name="Weight (kg)"
                />
                <Bar
                  dataKey="reps"
                  fill={theme.palette.secondary.main}
                  name="Reps"
                />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        ))}
      </Grid>
    </MotionBox>
  );

  const renderTimeAnalysisChart = () => {
    const COLORS = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main
    ];

    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h6" gutterBottom>
          Workout Time Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData.timeAnalysis}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.timeAnalysis.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </MotionBox>
    );
  };

  const renderSelectedChart = () => {
    switch (selectedTab) {
      case 0:
        return renderOverviewChart();
      case 1:
        return renderExerciseChart();
      case 2:
        return renderTimeAnalysisChart();
      default:
        return null;
    }
  };

  return (
    <Box>
      {renderSelectedChart()}
    </Box>
  );
};

export default ProgressCharts;
