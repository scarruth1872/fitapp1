import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Info as InfoIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Speed as SpeedIcon,
  Stars as StarsIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../../hooks/useAnalytics';

const ProgressOverview = ({ data }) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Achievement Progress</Typography>
          <TrophyIcon color="primary" />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Overall Completion
              </Typography>
              <Box display="flex" alignItems="center">
                <Box flexGrow={1} mr={2}>
                  <LinearProgress
                    variant="determinate"
                    value={data.completionRate}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2">
                  {Math.round(data.completionRate)}%
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Recent Unlocks
            </Typography>
            <Typography variant="h4" color="primary">
              {data.recentUnlocks}
              <Typography variant="caption" color="text.secondary" ml={1}>
                this week
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const CategoryDistribution = ({ data }) => {
  const theme = useTheme();
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Achievement Categories
        </Typography>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProgressTimeline = ({ data }) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Achievement Timeline
        </Typography>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke={theme.palette.primary.main}
                name="Completed"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke={theme.palette.secondary.main}
                name="Total Available"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

const PerformanceMetrics = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Performance Metrics
        </Typography>
        <Grid container spacing={2}>
          {data.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.name}>
              <Box
                p={2}
                bgcolor="background.paper"
                borderRadius={1}
                boxShadow={1}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  {metric.icon}
                  <Typography variant="subtitle2" ml={1}>
                    {metric.name}
                  </Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {metric.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metric.change > 0 ? '+' : ''}{metric.change}% vs last week
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const CommunityComparison = ({ data }) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Community Comparison
        </Typography>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar
                dataKey="user"
                name="Your Progress"
                fill={theme.palette.primary.main}
              />
              <Bar
                dataKey="community"
                name="Community Average"
                fill={theme.palette.secondary.main}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

const AchievementAnalytics = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const {
    analyticsData,
    loading,
    error,
    refreshAnalytics
  } = useAnalytics();

  useEffect(() => {
    refreshAnalytics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error loading analytics: {error}</Typography>
      </Box>
    );
  }

  const {
    progressData,
    categoryData,
    timelineData,
    performanceData,
    communityData
  } = analyticsData;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Achievement Analytics
        </Typography>
        <SpeedIcon fontSize="large" color="primary" />
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab
          value="overview"
          label="Overview"
          icon={<TrendingUpIcon />}
        />
        <Tab
          value="performance"
          label="Performance"
          icon={<SpeedIcon />}
        />
        <Tab
          value="community"
          label="Community"
          icon={<GroupIcon />}
        />
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {selectedTab === 'overview' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProgressOverview data={progressData} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CategoryDistribution data={categoryData} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProgressTimeline data={timelineData} />
              </Grid>
            </Grid>
          )}

          {selectedTab === 'performance' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <PerformanceMetrics data={performanceData} />
              </Grid>
              <Grid item xs={12}>
                <ProgressTimeline data={timelineData} />
              </Grid>
            </Grid>
          )}

          {selectedTab === 'community' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CommunityComparison data={communityData} />
              </Grid>
            </Grid>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default AchievementAnalytics;
