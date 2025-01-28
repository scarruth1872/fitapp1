import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tooltip as MuiTooltip,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';

const WorkoutHeatmap = ({ workoutLogs }) => {
  const theme = useTheme();
  const [heatmapData, setHeatmapData] = useState([]);
  const [maxIntensity, setMaxIntensity] = useState(0);

  useEffect(() => {
    const generateHeatmapData = () => {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 364); // Get last 52 weeks + today

      // Create array of dates
      const dates = [];
      for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }

      // Create intensity map
      const intensityMap = workoutLogs.reduce((acc, log) => {
        const date = new Date(log.date).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        // Calculate workout intensity based on duration and type
        let intensity = log.duration / 60; // Base intensity on hours
        switch (log.type) {
          case 'hiit':
            intensity *= 1.5;
            break;
          case 'strength':
            intensity *= 1.2;
            break;
          case 'cardio':
            intensity *= 1.0;
            break;
          case 'flexibility':
            intensity *= 0.8;
            break;
          default:
            intensity *= 1.0;
        }
        acc[date] += intensity;
        return acc;
      }, {});

      // Find max intensity
      const max = Math.max(...Object.values(intensityMap));
      setMaxIntensity(max);

      // Generate data for each date
      return dates.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        return {
          date,
          intensity: intensityMap[dateStr] || 0
        };
      });
    };

    setHeatmapData(generateHeatmapData());
  }, [workoutLogs]);

  const getIntensityColor = (intensity) => {
    const colors = {
      0: theme.palette.grey[200],
      1: theme.palette.primary[100],
      2: theme.palette.primary[200],
      3: theme.palette.primary[300],
      4: theme.palette.primary[400],
      5: theme.palette.primary[500]
    };

    const level = Math.min(5, Math.floor((intensity / maxIntensity) * 5));
    return colors[level];
  };

  const getWeeks = () => {
    const weeks = [];
    let currentWeek = [];
    
    heatmapData.forEach((day, index) => {
      currentWeek.push(day);
      if (day.date.getDay() === 6 || index === heatmapData.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Workout Activity
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto repeat(52, 1fr)',
            gap: 1,
            py: 2
          }}
        >
          {/* Days of week labels */}
          <Box sx={{ gridColumn: '1', display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gap: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Typography
                key={day}
                variant="caption"
                sx={{
                  textAlign: 'right',
                  pr: 1,
                  height: '10px',
                  lineHeight: '10px'
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>

          {/* Heatmap cells */}
          {getWeeks().map((week, weekIndex) => (
            <Box
              key={weekIndex}
              sx={{
                gridColumn: weekIndex + 2,
                display: 'grid',
                gridTemplateRows: 'repeat(7, 1fr)',
                gap: 1
              }}
            >
              {Array(7).fill(null).map((_, dayIndex) => {
                const day = week[dayIndex];
                if (!day) return <Box key={dayIndex} sx={{ height: '10px' }} />;

                return (
                  <MuiTooltip
                    key={dayIndex}
                    title={
                      day.intensity > 0
                        ? `${formatDate(day.date)}\n${day.intensity.toFixed(1)} hours of activity`
                        : formatDate(day.date)
                    }
                  >
                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.2 }}
                      sx={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: getIntensityColor(day.intensity),
                        borderRadius: '2px',
                        cursor: 'pointer'
                      }}
                    />
                  </MuiTooltip>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
        <Typography variant="caption">Less</Typography>
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <Box
            key={level}
            sx={{
              width: '10px',
              height: '10px',
              backgroundColor: getIntensityColor((level / 5) * maxIntensity),
              borderRadius: '2px'
            }}
          />
        ))}
        <Typography variant="caption">More</Typography>
      </Box>
    </Paper>
  );
};

export default WorkoutHeatmap;
