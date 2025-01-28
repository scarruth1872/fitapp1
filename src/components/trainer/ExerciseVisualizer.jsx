import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FitnessCenter,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { exerciseDatabase } from '../../data/trainerData/exerciseDatabase';

const ExerciseVisualizer = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    try {
      if (!exerciseDatabase?.categories) {
        console.error('Exercise database not properly initialized');
        setLoading(false);
        return;
      }

      const categoriesArray = Object.entries(exerciseDatabase.categories).map(([key, category]) => ({
        key,
        ...category
      }));
      setCategories(categoriesArray);

      const groups = new Set();
      Object.values(exerciseDatabase.categories).forEach(category => {
        category.exercises?.forEach(exercise => {
          exercise.primaryMuscles?.forEach(muscle => groups.add(muscle));
          exercise.secondaryMuscles?.forEach(muscle => groups.add(muscle));
        });
      });
      setMuscleGroups(Array.from(groups));
    } catch (error) {
      console.error('Error processing exercise database:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedExercise(null);
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
  };

  const renderExerciseDetails = () => {
    if (!selectedExercise) {
      return (
        <Box sx={{ textAlign: 'center', p: 3, color: theme.palette.text.secondary }}>
          <Info sx={{ fontSize: 40, mb: 2 }} />
          <Typography>Select an exercise to view details</Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom color="primary">
          {selectedExercise.name}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                mb: 2,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.primary.main}`
              }}
            >
              <Typography variant="subtitle1" gutterBottom color="primary">
                Muscles Worked
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Primary:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedExercise.primaryMuscles.map((muscle, index) => (
                    <Chip 
                      key={index} 
                      label={muscle} 
                      color="primary" 
                      size="small" 
                    />
                  ))}
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Secondary:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedExercise.secondaryMuscles.map((muscle, index) => (
                    <Chip 
                      key={index} 
                      label={muscle} 
                      variant="outlined" 
                      size="small" 
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2,
                mb: 2,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.primary.main}`
              }}
            >
              <Typography variant="subtitle1" gutterBottom color="primary">
                Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Type" 
                    secondary={selectedExercise.type} 
                    primaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Equipment" 
                    secondary={selectedExercise.equipment.join(', ')} 
                    primaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Difficulty" 
                    secondary={selectedExercise.difficulty} 
                    primaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Accordion 
          sx={{ 
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.primary.main}`,
            '&:before': { display: 'none' },
            mb: 1
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="primary">Execution</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {selectedExercise.execution.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={`${index + 1}. ${step}`} 
                    primaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          sx={{ 
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.primary.main}`,
            '&:before': { display: 'none' },
            mb: 1
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="primary">Tips & Common Errors</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Tips:
                </Typography>
                <List dense>
                  {selectedExercise.tips.map((tip, index) => (
                    <ListItem key={index}>
                      <CheckCircle sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
                      <ListItemText 
                        primary={tip} 
                        primaryTypographyProps={{ color: 'text.primary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom color="error">
                  Common Errors:
                </Typography>
                <List dense>
                  {selectedExercise.commonErrors.map((error, index) => (
                    <ListItem key={index}>
                      <Warning sx={{ mr: 1, color: 'error.main', fontSize: 16 }} />
                      <ListItemText 
                        primary={error} 
                        primaryTypographyProps={{ color: 'text.primary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          borderBottom: theme => `1px solid ${theme.palette.primary.main}`,
          mb: 2,
          '& .MuiTab-root': {
            color: theme => theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme => theme.palette.primary.main,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: theme => theme.palette.primary.main,
          },
        }}
      >
        {categories.map((category, index) => (
          <Tab 
            key={category.key}
            label={category.name}
            icon={<FitnessCenter />}
          />
        ))}
      </Tabs>

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Paper 
          sx={{ 
            width: 240,
            overflow: 'auto',
            borderRight: `1px solid ${theme.palette.primary.main}`,
            bgcolor: 'background.paper',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.background.default,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.primary.main,
              borderRadius: '4px',
            },
          }}
        >
          <List dense>
            {(() => {
              const currentCategory = categories[selectedTab];
              if (!currentCategory?.exercises) {
                return (
                  <ListItem>
                    <ListItemText 
                      primary="No exercises found"
                      primaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                );
              }
              
              return currentCategory.exercises.map((exercise) => (
                <ListItem
                  key={exercise.id}
                  button
                  selected={selectedExercise?.id === exercise.id}
                  onClick={() => handleExerciseSelect(exercise)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: `${theme.palette.primary.main}15`,
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                    },
                    '&:hover': {
                      bgcolor: `${theme.palette.primary.main}10`,
                    },
                  }}
                >
                  <ListItemText 
                    primary={exercise.name}
                    primaryTypographyProps={{
                      color: selectedExercise?.id === exercise.id 
                        ? 'primary'
                        : 'text.primary'
                    }}
                  />
                </ListItem>
              ));
            })()}
          </List>
        </Paper>

        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.default,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '4px',
          },
        }}>
          {renderExerciseDetails()}
        </Box>
      </Box>
    </Box>
  );
};

export default ExerciseVisualizer;
