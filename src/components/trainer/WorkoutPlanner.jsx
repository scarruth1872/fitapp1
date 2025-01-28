import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  FitnessCenter,
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const steps = ['Goals & Preferences', 'Schedule', 'Plan Review'];

const WorkoutPlanner = ({ userProfile, exerciseDb, onPlanGenerate, workoutPlan }) => {
  const { currentUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [goals, setGoals] = useState(userProfile?.goals || []);
  const [preferences, setPreferences] = useState(userProfile?.preferences || {
    workoutDuration: 60,
    daysPerWeek: 3,
    equipment: 'minimal'
  });
  const [schedule, setSchedule] = useState([]);
  const [generatedPlan, setGeneratedPlan] = useState(workoutPlan);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSavePlan();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleGoalChange = (event) => {
    const { value } = event.target;
    setGoals(value);
  };

  const handlePreferenceChange = (name) => (event) => {
    const value = event.target.value;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (day, value) => {
    setSchedule(prev => {
      const newSchedule = [...prev];
      const index = newSchedule.findIndex(s => s.day === day);
      if (index >= 0) {
        if (value) {
          newSchedule[index] = { day, ...value };
        } else {
          newSchedule.splice(index, 1);
        }
      } else if (value) {
        newSchedule.push({ day, ...value });
      }
      return newSchedule;
    });
  };

  const generateWorkoutPlan = () => {
    // Implement workout plan generation logic
    const plan = {
      goals,
      preferences,
      schedule,
      workouts: Object.values(exerciseDb.categories).flatMap(category =>
        category.exercises
          .filter(exercise => {
            // Filter exercises based on equipment availability
            if (preferences.equipment === 'minimal') {
              return exercise.equipment.every(eq => ['none', 'bodyweight', 'dumbbell'].includes(eq));
            }
            return true;
          })
          .slice(0, 3) // Take first 3 exercises from each category
      ).map(exercise => ({
        ...exercise,
        sets: 3,
        reps: '8-12',
        rest: 60
      }))
    };

    setGeneratedPlan(plan);
    onPlanGenerate(plan);
  };

  const handleSavePlan = async () => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        'workoutPlan': generatedPlan,
        'preferences': preferences,
        'goals': goals
      });
    } catch (error) {
      console.error('Error saving workout plan:', error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Set Your Fitness Goals
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Goals</InputLabel>
              <Select
                multiple
                value={goals}
                onChange={handleGoalChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="strength">Build Strength</MenuItem>
                <MenuItem value="muscle">Build Muscle</MenuItem>
                <MenuItem value="endurance">Improve Endurance</MenuItem>
                <MenuItem value="weight-loss">Weight Loss</MenuItem>
                <MenuItem value="flexibility">Increase Flexibility</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>
              Workout Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Workout Duration (minutes)
                </Typography>
                <Slider
                  value={preferences.workoutDuration}
                  onChange={(e, value) => handlePreferenceChange('workoutDuration')({ target: { value } })}
                  valueLabelDisplay="auto"
                  step={15}
                  marks
                  min={30}
                  max={120}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Days per Week</InputLabel>
                  <Select
                    value={preferences.daysPerWeek}
                    onChange={handlePreferenceChange('daysPerWeek')}
                  >
                    {[2, 3, 4, 5, 6].map(day => (
                      <MenuItem key={day} value={day}>{day} days</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Equipment Access</InputLabel>
                  <Select
                    value={preferences.equipment}
                    onChange={handlePreferenceChange('equipment')}
                  >
                    <MenuItem value="minimal">Minimal (Bodyweight & Dumbbells)</MenuItem>
                    <MenuItem value="home">Home Gym</MenuItem>
                    <MenuItem value="full">Full Gym</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Schedule Your Workouts
            </Typography>
            <Grid container spacing={2}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <Grid item xs={12} sm={6} md={4} key={day}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{day}</Typography>
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Workout Type</InputLabel>
                        <Select
                          value={schedule.find(s => s.day === day)?.type || ''}
                          onChange={(e) => handleScheduleChange(day, { type: e.target.value })}
                        >
                          <MenuItem value="">Rest Day</MenuItem>
                          <MenuItem value="strength">Strength</MenuItem>
                          <MenuItem value="cardio">Cardio</MenuItem>
                          <MenuItem value="flexibility">Flexibility</MenuItem>
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Plan
            </Typography>
            {!generatedPlan ? (
              <Button
                variant="contained"
                color="primary"
                onClick={generateWorkoutPlan}
                startIcon={<FitnessCenter />}
              >
                Generate Plan
              </Button>
            ) : (
              <Grid container spacing={2}>
                {schedule
                  .filter(s => s.type)
                  .map((day, index) => (
                    <Grid item xs={12} key={day.day}>
                      <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        elevation={3}
                        sx={{ p: 2 }}
                      >
                        <Typography variant="h6" gutterBottom>
                          {day.day} - {day.type}
                        </Typography>
                        <Grid container spacing={2}>
                          {generatedPlan.workouts
                            .filter(exercise => exercise.type === day.type)
                            .map(exercise => (
                              <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                                <Card>
                                  <CardContent>
                                    <Typography variant="subtitle1">
                                      {exercise.name}
                                    </Typography>
                                    <Typography color="textSecondary">
                                      {exercise.sets} sets × {exercise.reps} reps
                                    </Typography>
                                  </CardContent>
                                  <CardActions>
                                    <IconButton
                                      size="small"
                                      onClick={() => setEditingWorkout(exercise)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </CardActions>
                                </Card>
                              </Grid>
                            ))}
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={3} sx={{ p: 3 }}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Save Plan' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default WorkoutPlanner;
