import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../contexts/WorkoutContext';
import { useExercise } from '../contexts/ExerciseContext';

const MotionBox = motion(Box);

const WorkoutForm = ({ onClose }) => {
  const { addWorkout } = useWorkout();
  const { exercises: exerciseList } = useExercise();
  const [title, setTitle] = useState('');
  const [exercises, setExercises] = useState([{
    name: '',
    sets: [{ weight: '', reps: '' }]
  }]);
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!title.trim()) {
        throw new Error('Please enter a workout title');
      }

      if (!exercises.some(ex => ex.name && ex.sets.some(set => set.reps || set.weight))) {
        throw new Error('Please add at least one exercise with sets');
      }

      // Clean and transform exercise data
      const cleanedExercises = exercises
        .filter(ex => ex.name && ex.sets.some(set => set.reps || set.weight))
        .map(exercise => ({
          name: exercise.name,
          sets: exercise.sets
            .filter(set => set.reps || set.weight)
            .map(set => ({
              reps: parseInt(set.reps) || 0,
              weight: parseFloat(set.weight) || 0
            }))
        }));

      // Create workout object
      const workoutData = {
        title: title.trim(),
        exercises: cleanedExercises,
        duration: parseInt(duration) || 0,
        intensity,
        timestamp: new Date().toISOString(),
        completed: true,
        isPublic: true
      };

      await addWorkout(workoutData);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setExercises([{ name: '', sets: [{ weight: '', reps: '' }] }]);
    setDuration('');
    setIntensity('medium');
    setError(null);
    onClose();
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ weight: '', reps: '' }] }]);
  };

  const removeExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ weight: '', reps: '' });
    setExercises(newExercises);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    if (exercises[exerciseIndex].sets.length > 1) {
      const newExercises = [...exercises];
      newExercises[exerciseIndex].sets.splice(setIndex, 1);
      setExercises(newExercises);
    }
  };

  const handleExerciseChange = (index, value) => {
    const newExercises = [...exercises];
    newExercises[index].name = value;
    setExercises(newExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  return (
    <>
      <DialogTitle>Log Workout</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Workout Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Intensity</InputLabel>
                <Select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  label="Intensity"
                  required
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Exercises
              </Typography>
              <AnimatePresence>
                {exercises.map((exercise, exerciseIndex) => (
                  <MotionBox
                    key={exerciseIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    sx={{ mb: 3 }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={10}>
                        <FormControl fullWidth>
                          <InputLabel>Exercise</InputLabel>
                          <Select
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(exerciseIndex, e.target.value)}
                            label="Exercise"
                            required
                          >
                            {exerciseList.map((ex) => (
                              <MenuItem key={ex.id} value={ex.name}>
                                {ex.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          onClick={() => removeExercise(exerciseIndex)}
                          disabled={exercises.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>

                      {exercise.sets.map((set, setIndex) => (
                        <Grid item xs={12} key={setIndex}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={5}>
                              <TextField
                                fullWidth
                                label="Weight (kg)"
                                type="number"
                                value={set.weight}
                                onChange={(e) =>
                                  handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)
                                }
                              />
                            </Grid>
                            <Grid item xs={5}>
                              <TextField
                                fullWidth
                                label="Reps"
                                type="number"
                                value={set.reps}
                                onChange={(e) =>
                                  handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)
                                }
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton
                                onClick={() => removeSet(exerciseIndex, setIndex)}
                                disabled={exercise.sets.length === 1}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}

                      <Grid item xs={12}>
                        <Button
                          startIcon={<AddIcon />}
                          onClick={() => addSet(exerciseIndex)}
                          variant="outlined"
                          size="small"
                        >
                          Add Set
                        </Button>
                      </Grid>
                    </Grid>
                  </MotionBox>
                ))}
              </AnimatePresence>

              <Button
                startIcon={<AddIcon />}
                onClick={addExercise}
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                Add Exercise
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Workout'}
        </Button>
      </DialogActions>
    </>
  );
};

export default WorkoutForm;
