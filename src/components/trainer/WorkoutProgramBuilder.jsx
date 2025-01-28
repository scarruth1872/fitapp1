import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { exerciseDatabase } from '../../data/trainerData/exerciseDatabase';

const WorkoutProgramBuilder = () => {
  const [program, setProgram] = useState({
    name: '',
    description: '',
    duration: 1,
    difficulty: 'beginner',
    target: 'general',
    workouts: []
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [currentWorkout, setCurrentWorkout] = useState({
    day: 1,
    exercises: []
  });

  const categories = Object.keys(exerciseDatabase);
  
  const handleProgramChange = (field) => (event) => {
    setProgram({ ...program, [field]: event.target.value });
  };

  const handleAddExercise = () => {
    if (!selectedExercise) return;
    
    const category = exerciseDatabase[selectedCategory];
    const exercise = category.exercises.find(ex => ex.id === selectedExercise);
    
    setCurrentWorkout({
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, {
        ...exercise,
        sets: 3,
        reps: 12,
        rest: 60
      }]
    });
    
    setSelectedExercise('');
  };

  const handleRemoveExercise = (index) => {
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.filter((_, i) => i !== index)
    });
  };

  const handleSaveWorkout = () => {
    if (currentWorkout.exercises.length === 0) return;
    
    setProgram({
      ...program,
      workouts: [...program.workouts, currentWorkout]
    });
    
    setCurrentWorkout({
      day: currentWorkout.day + 1,
      exercises: []
    });
  };

  const handleUpdateExerciseParams = (index, field, value) => {
    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    
    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Workout Program Builder
      </Typography>
      
      {/* Program Details */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Program Name"
              value={program.name}
              onChange={handleProgramChange('name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (weeks)"
              type="number"
              value={program.duration}
              onChange={handleProgramChange('duration')}
              InputProps={{ inputProps: { min: 1, max: 52 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Program Description"
              value={program.description}
              onChange={handleProgramChange('description')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={program.difficulty}
                label="Difficulty"
                onChange={handleProgramChange('difficulty')}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Target</InputLabel>
              <Select
                value={program.target}
                label="Target"
                onChange={handleProgramChange('target')}
              >
                <MenuItem value="general">General Fitness</MenuItem>
                <MenuItem value="strength">Strength</MenuItem>
                <MenuItem value="hypertrophy">Hypertrophy</MenuItem>
                <MenuItem value="endurance">Endurance</MenuItem>
                <MenuItem value="weight-loss">Weight Loss</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Exercise Selection */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Day {currentWorkout.day} Workout
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {exerciseDatabase[category].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Exercise</InputLabel>
              <Select
                value={selectedExercise}
                label="Exercise"
                onChange={(e) => setSelectedExercise(e.target.value)}
                disabled={!selectedCategory}
              >
                {selectedCategory && exerciseDatabase[selectedCategory].exercises.map((exercise) => (
                  <MenuItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddExercise}
          disabled={!selectedExercise}
        >
          Add Exercise
        </Button>
      </Paper>

      {/* Current Workout */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Workout Plan
        </Typography>
        
        {currentWorkout.exercises.map((exercise, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle1">
                  {exercise.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exercise.type}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField
                  label="Sets"
                  type="number"
                  size="small"
                  value={exercise.sets}
                  onChange={(e) => handleUpdateExerciseParams(index, 'sets', e.target.value)}
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField
                  label="Reps"
                  type="number"
                  size="small"
                  value={exercise.reps}
                  onChange={(e) => handleUpdateExerciseParams(index, 'reps', e.target.value)}
                  InputProps={{ inputProps: { min: 1, max: 100 } }}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField
                  label="Rest (sec)"
                  type="number"
                  size="small"
                  value={exercise.rest}
                  onChange={(e) => handleUpdateExerciseParams(index, 'rest', e.target.value)}
                  InputProps={{ inputProps: { min: 0, max: 300 } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveExercise(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
            {index < currentWorkout.exercises.length - 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </Box>
        ))}
        
        {currentWorkout.exercises.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveWorkout}
            sx={{ mt: 2 }}
          >
            Save Day {currentWorkout.day} Workout
          </Button>
        )}
      </Paper>

      {/* Program Summary */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Program Summary
        </Typography>
        
        {program.workouts.map((workout, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Day {workout.day}
            </Typography>
            {workout.exercises.map((exercise, exIndex) => (
              <Chip
                key={exIndex}
                label={`${exercise.name} (${exercise.sets}x${exercise.reps})`}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
            {index < program.workouts.length - 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default WorkoutProgramBuilder;
