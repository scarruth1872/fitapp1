import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import { motion } from 'framer-motion';
import { useWorkout } from '../contexts/WorkoutContext';
import { useState, useEffect, useMemo } from 'react';
import WorkoutFilters from './WorkoutFilters';

const MotionPaper = motion(Paper);

export default function WorkoutList() {
  const { workouts, loading, deleteWorkout, shareWorkout } = useWorkout();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    types: [],
    intensity: [],
    duration: [0, 180],
    calories: [0, 1000],
    dateFrom: null,
    dateTo: null,
    sort: 'date-desc'
  });

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      // Search filter
      if (filters.search && !workout.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Types filter
      if (filters.types.length > 0 && !filters.types.includes(workout.type)) {
        return false;
      }

      // Intensity filter
      if (filters.intensity.length > 0 && !filters.intensity.includes(workout.intensity)) {
        return false;
      }

      // Duration filter
      const duration = workout.duration || 0;
      if (duration < filters.duration[0] || duration > filters.duration[1]) {
        return false;
      }

      // Calories filter
      const calories = workout.caloriesBurned || 0;
      if (calories < filters.calories[0] || calories > filters.calories[1]) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && workout.timestamp < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && workout.timestamp > filters.dateTo) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sort) {
        case 'date-asc':
          return a.timestamp - b.timestamp;
        case 'date-desc':
          return b.timestamp - a.timestamp;
        case 'duration-asc':
          return (a.duration || 0) - (b.duration || 0);
        case 'duration-desc':
          return (b.duration || 0) - (a.duration || 0);
        case 'calories-asc':
          return (a.caloriesBurned || 0) - (b.caloriesBurned || 0);
        case 'calories-desc':
          return (b.caloriesBurned || 0) - (a.caloriesBurned || 0);
        default:
          return 0;
      }
    });
  }, [workouts, filters]);

  const handleDelete = async () => {
    if (!selectedWorkout) return;

    try {
      await deleteWorkout(selectedWorkout.id);
      setShowDeleteDialog(false);
      setSelectedWorkout(null);
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const handleShare = async () => {
    if (!selectedWorkout) return;

    try {
      await shareWorkout(selectedWorkout.id);
      setShowShareDialog(false);
      setSelectedWorkout(null);
    } catch (error) {
      console.error('Error sharing workout:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setFilters(prev => ({ ...prev, sort: newSort }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      types: [],
      intensity: [],
      duration: [0, 180],
      calories: [0, 1000],
      dateFrom: null,
      dateTo: null,
      sort: 'date-desc'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (workouts.length === 0) {
    return (
      <Typography 
        variant="h6" 
        textAlign="center" 
        color="primary.main"
        sx={{ my: 4 }}
      >
        No workouts logged yet. Start by adding one!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <WorkoutFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
        Workout History
      </Typography>

      {filteredWorkouts.map((workout, index) => (
        <MotionPaper
          key={workout.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          sx={{
            mb: 2,
            backgroundColor: 'rgba(0, 26, 0, 0.9)',
            border: '1px solid #00ff00',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Accordion 
            sx={{ 
              backgroundColor: 'transparent',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '100%', pr: 2 }}
              >
                <Typography color="primary.main">
                  {formatDate(workout.date)}
                </Typography>
                <Chip 
                  label={`${workout.exercises.length} exercises`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    color: 'primary.main',
                  }}
                />
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              {workout.exercises.map((exercise, exIndex) => (
                <Box key={exIndex} sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold',
                      mb: 1,
                    }}
                  >
                    {exercise.type}
                  </Typography>

                  <Stack spacing={1}>
                    {exercise.sets.map((set, setIndex) => (
                      <Typography 
                        key={setIndex}
                        variant="body2"
                        color="primary.main"
                      >
                        Set {setIndex + 1}: {set.reps} reps @ {set.weight} lbs
                      </Typography>
                    ))}
                  </Stack>

                  {exercise.notes && (
                    <Typography 
                      variant="body2" 
                      color="primary.light"
                      sx={{ mt: 1, fontStyle: 'italic' }}
                    >
                      Notes: {exercise.notes}
                    </Typography>
                  )}
                </Box>
              ))}

              <Stack 
                direction="row" 
                justifyContent="flex-end"
                sx={{ mt: 2 }}
              >
                <Button
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    setSelectedWorkout(workout);
                    setShowShareDialog(true);
                  }}
                >
                  Share
                </Button>
                <IconButton
                  onClick={() => {
                    setSelectedWorkout(workout);
                    setShowDeleteDialog(true);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </MotionPaper>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Delete Workout</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this workout? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Share Confirmation Dialog */}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      >
        <DialogTitle>Share Workout</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Share this workout with your followers? The workout will be visible on your profile and in your followers' feeds.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Note: Once shared, the workout will be public and visible to other users.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Cancel</Button>
          <Button onClick={handleShare} color="primary" variant="contained">Share</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
