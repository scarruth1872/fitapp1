import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion } from 'framer-motion';
import { useWorkoutTemplate } from '../contexts/WorkoutTemplateContext';
import { useExercise } from '../contexts/ExerciseContext';
import { useNavigate } from 'react-router-dom';

const WorkoutTemplates = () => {
  const { templates, loading, createTemplate, deleteTemplate, startWorkoutFromTemplate } = useWorkoutTemplate();
  const { exercises } = useExercise();
  const navigate = useNavigate();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    exercises: []
  });
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseSets, setExerciseSets] = useState('3');
  const [exerciseReps, setExerciseReps] = useState('10');

  const handleAddExercise = () => {
    if (!selectedExercise) return;

    const exercise = exercises.find(ex => ex.name === selectedExercise);
    const exerciseToAdd = {
      name: exercise.name,
      sets: Array(Number(exerciseSets)).fill({
        reps: Number(exerciseReps),
        weight: 0,
        completed: false
      })
    };

    setNewTemplate(prev => ({
      ...prev,
      exercises: [...prev.exercises, exerciseToAdd]
    }));

    setSelectedExercise('');
  };

  const handleRemoveExercise = (index) => {
    setNewTemplate(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleCreateTemplate = async () => {
    try {
      await createTemplate(newTemplate);
      setShowCreateDialog(false);
      setNewTemplate({ name: '', description: '', exercises: [] });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleStartWorkout = async (template) => {
    try {
      const workoutId = await startWorkoutFromTemplate(template);
      navigate('/training', { state: { workoutId } });
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: 'primary.main' }}>
          Workout Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
        >
          Create Template
        </Button>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} md={6} key={template.id}>
              <motion.div variants={itemVariants}>
                <Card sx={{ height: '100%', backgroundColor: 'background.paper' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {template.description}
                    </Typography>
                    <List dense>
                      {template.exercises.map((exercise, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={exercise.name}
                            secondary={`${exercise.sets.length} sets × ${exercise.sets[0].reps} reps`}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleStartWorkout(template)}
                      >
                        Start Workout
                      </Button>
                      <IconButton
                        onClick={() => deleteTemplate(template.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Create Template Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Workout Template</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={newTemplate.description}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Exercise</InputLabel>
                  <Select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    label="Exercise"
                  >
                    {exercises.map((exercise) => (
                      <MenuItem key={exercise.name} value={exercise.name}>
                        {exercise.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  fullWidth
                  label="Sets"
                  type="number"
                  value={exerciseSets}
                  onChange={(e) => setExerciseSets(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  fullWidth
                  label="Reps"
                  type="number"
                  value={exerciseReps}
                  onChange={(e) => setExerciseReps(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAddExercise}
                  sx={{ height: '100%' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom>
              Exercises:
            </Typography>
            <List>
              {newTemplate.exercises.map((exercise, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={exercise.name}
                    secondary={`${exercise.sets.length} sets × ${exercise.sets[0].reps} reps`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateTemplate}
            variant="contained"
            disabled={!newTemplate.name || newTemplate.exercises.length === 0}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutTemplates;
