import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  FitnessCenter
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const defaultSet = { weight: '', reps: '', unit: 'kg' };

const WorkoutLogForm = ({ initialData, exerciseDb, onSubmit }) => {
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [type, setType] = useState(initialData?.type || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [exercises, setExercises] = useState(initialData?.exercises || []);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleAddExercise = () => {
    setExercises(prev => [...prev, {
      name: '',
      sets: [{ ...defaultSet }]
    }]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    setExercises(prev => prev.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    ));
  };

  const handleAddSet = (exerciseIndex) => {
    setExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex
        ? { ...exercise, sets: [...exercise.sets, { ...defaultSet }] }
        : exercise
    ));
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex
        ? { ...exercise, sets: exercise.sets.filter((_, si) => si !== setIndex) }
        : exercise
    ));
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    setExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex
        ? {
            ...exercise,
            sets: exercise.sets.map((set, si) => 
              si === setIndex ? { ...set, [field]: value } : set
            )
          }
        : exercise
    ));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      date,
      type,
      duration,
      exercises,
      notes
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Workout Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Workout Type"
            >
              <MenuItem value="strength">Strength</MenuItem>
              <MenuItem value="cardio">Cardio</MenuItem>
              <MenuItem value="hiit">HIIT</MenuItem>
              <MenuItem value="flexibility">Flexibility</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Grid>

        {/* Exercises */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Exercises
          </Typography>
          <AnimatePresence>
            {exercises.map((exercise, exerciseIndex) => (
              <motion.div
                key={exerciseIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl fullWidth>
                          <InputLabel>Exercise</InputLabel>
                          <Select
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(exerciseIndex, 'name', e.target.value)}
                            label="Exercise"
                          >
                            {Object.values(exerciseDb.categories).flatMap(category =>
                              category.exercises.map(ex => (
                                <MenuItem key={ex.id} value={ex.name}>
                                  {ex.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveExercise(exerciseIndex)}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    </Grid>

                    {/* Sets */}
                    {exercise.sets.map((set, setIndex) => (
                      <Grid item xs={12} key={setIndex}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            label="Weight"
                            type="number"
                            value={set.weight}
                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                            sx={{ width: '30%' }}
                          />
                          <FormControl sx={{ width: '20%' }}>
                            <InputLabel>Unit</InputLabel>
                            <Select
                              value={set.unit}
                              onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'unit', e.target.value)}
                              label="Unit"
                            >
                              <MenuItem value="kg">kg</MenuItem>
                              <MenuItem value="lbs">lbs</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            label="Reps"
                            type="number"
                            value={set.reps}
                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                            sx={{ width: '30%' }}
                          />
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                            disabled={exercise.sets.length === 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}

                    <Grid item xs={12}>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => handleAddSet(exerciseIndex)}
                        size="small"
                      >
                        Add Set
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            startIcon={<FitnessCenter />}
            onClick={handleAddExercise}
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Exercise
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button type="submit" variant="contained">
              Save Workout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkoutLogForm;
