import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ProgressCharts = ({ measurements, workoutLogs }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('1M'); // 1W, 1M, 3M, 6M, 1Y, ALL
  const [selectedMetrics, setSelectedMetrics] = useState(['weight', 'bodyFat']);

  // Process measurement data
  const getMeasurementData = () => {
    const now = new Date();
    const timeRanges = {
      '1W': new Date(now.setDate(now.getDate() - 7)),
      '1M': new Date(now.setMonth(now.getMonth() - 1)),
      '3M': new Date(now.setMonth(now.getMonth() - 3)),
      '6M': new Date(now.setMonth(now.getMonth() - 6)),
      '1Y': new Date(now.setFullYear(now.getFullYear() - 1)),
      'ALL': new Date(0)
    };

    return measurements
      .filter(m => new Date(m.date) >= timeRanges[timeRange])
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(m => ({
        date: new Date(m.date).toLocaleDateString(),
        ...m.values
      }));
  };

  // Process workout data
  const getWorkoutData = () => {
    const now = new Date();
    const timeRanges = {
      '1W': new Date(now.setDate(now.getDate() - 7)),
      '1M': new Date(now.setMonth(now.getMonth() - 1)),
      '3M': new Date(now.setMonth(now.getMonth() - 3)),
      '6M': new Date(now.setMonth(now.getMonth() - 6)),
      '1Y': new Date(now.setFullYear(now.getFullYear() - 1)),
      'ALL': new Date(0)
    };

    return workoutLogs
      .filter(w => new Date(w.date) >= timeRanges[timeRange])
      .reduce((acc, log) => {
        const month = new Date(log.date).toLocaleDateString('en-US', { month: 'short' });
        const type = log.type;
        
        if (!acc[month]) {
          acc[month] = { month };
        }
        
        if (!acc[month][type]) {
          acc[month][type] = 0;
        }
        
        acc[month][type]++;
        return acc;
      }, {});
  };

  // Calculate workout distribution
  const getWorkoutDistribution = () => {
    return workoutLogs.reduce((acc, log) => {
      if (!acc[log.type]) {
        acc[log.type] = 0;
      }
      acc[log.type]++;
      return acc;
    }, {});
  };

  const measurementData = getMeasurementData();
  const workoutData = Object.values(getWorkoutData());
  const workoutDistribution = getWorkoutDistribution();

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Time range selector */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="1W">Last Week</MenuItem>
              <MenuItem value="1M">Last Month</MenuItem>
              <MenuItem value="3M">Last 3 Months</MenuItem>
              <MenuItem value="6M">Last 6 Months</MenuItem>
              <MenuItem value="1Y">Last Year</MenuItem>
              <MenuItem value="ALL">All Time</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Metric selector */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Metrics</InputLabel>
            <Select
              multiple
              value={selectedMetrics}
              onChange={(e) => setSelectedMetrics(e.target.value)}
              label="Metrics"
            >
              <MenuItem value="weight">Weight</MenuItem>
              <MenuItem value="bodyFat">Body Fat</MenuItem>
              <MenuItem value="chest">Chest</MenuItem>
              <MenuItem value="waist">Waist</MenuItem>
              <MenuItem value="hips">Hips</MenuItem>
              <MenuItem value="biceps">Biceps</MenuItem>
              <MenuItem value="thighs">Thighs</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Measurements line chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Measurements Progress
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={measurementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedMetrics.map((metric, index) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={COLORS[index % COLORS.length]}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Workout frequency bar chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Workout Frequency
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="strength" stackId="a" fill={COLORS[0]} />
                <Bar dataKey="cardio" stackId="a" fill={COLORS[1]} />
                <Bar dataKey="hiit" stackId="a" fill={COLORS[2]} />
                <Bar dataKey="flexibility" stackId="a" fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Workout distribution pie chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Workout Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(workoutDistribution).map(([name, value]) => ({
                    name,
                    value
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {Object.keys(workoutDistribution).map((entry, index) => (
                    <Cell key={entry} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProgressCharts;
