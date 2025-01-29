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
      setShowShareDialog(true);
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <WorkoutFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      {filteredWorkouts.length === 0 ? (
        <Typography variant="body1" textAlign="center" mt={4}>
          No workouts found
        </Typography>
      ) : (
        filteredWorkouts.map((workout) => (
          <MotionPaper
            key={workout.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            sx={{ mb: 2 }}
          >
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={2} width="100%">
                  <Box flex={1}>
                    <Typography variant="h6">{workout.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(workout.timestamp)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWorkout(workout);
                        setShowShareDialog(true);
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWorkout(workout);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2">Type</Typography>
                    <Chip label={workout.type} size="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Intensity</Typography>
                    <Chip label={workout.intensity} size="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Duration</Typography>
                    <Typography>{workout.duration} minutes</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Calories Burned</Typography>
                    <Typography>{workout.caloriesBurned} kcal</Typography>
                  </Box>
                  {workout.notes && (
                    <Box>
                      <Typography variant="subtitle2">Notes</Typography>
                      <Typography>{workout.notes}</Typography>
                    </Box>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </MotionPaper>
        ))
      )}

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Workout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this workout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)}>
        <DialogTitle>Share Workout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to share this workout to your social feed?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Cancel</Button>
          <Button onClick={handleShare} color="primary">Share</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
