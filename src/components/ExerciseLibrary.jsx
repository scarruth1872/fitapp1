import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  InputAdornment,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Stack,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  FitnessCenter as FitnessCenterIcon,
  AccessTime as AccessTimeIcon,
  Speed as SpeedIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
  Info as InfoIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useExercise } from '../contexts/ExerciseContext';

const ExerciseLibrary = () => {
  const {
    exercises,
    loading,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useExercise();

  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleCloseDialog = () => {
    setSelectedExercise(null);
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

  const renderChipList = (items, color = 'default') => {
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 1 }}>
        {items.map((item, index) => (
          <Chip
            key={index}
            label={item}
            size="small"
            color={color}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Search and Filter Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search exercises, muscles, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              {categories?.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Exercise Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            exercises?.map((exercise) => (
              <Grid item xs={12} sm={6} md={4} key={exercise.id}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleExerciseClick(exercise)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {exercise.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {exercise.equipment?.map((item, index) => (
                          <Chip
                            key={index}
                            icon={<FitnessCenterIcon />}
                            label={item}
                            size="small"
                            color="primary"
                          />
                        ))}
                        <Chip
                          label={exercise.type}
                          size="small"
                          color="secondary"
                        />
                        <Tooltip title="Difficulty Level">
                          <Chip
                            icon={<StarIcon />}
                            label={exercise.difficulty}
                            size="small"
                            color={
                              exercise.difficulty === 'beginner' ? 'success' :
                              exercise.difficulty === 'intermediate' ? 'warning' :
                              'error'
                            }
                          />
                        </Tooltip>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Primary muscles: {exercise.primaryMuscles?.join(', ')}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>
      </motion.div>

      {/* Exercise Detail Dialog */}
      <Dialog
        open={Boolean(selectedExercise)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedExercise && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedExercise.name}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                {/* Basic Info */}
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Overview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          <FitnessCenterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Equipment
                        </Typography>
                        {renderChipList(selectedExercise.equipment)}
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          <SpeedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Difficulty
                        </Typography>
                        <Chip
                          label={selectedExercise.difficulty}
                          color={
                            selectedExercise.difficulty === 'beginner' ? 'success' :
                            selectedExercise.difficulty === 'intermediate' ? 'warning' :
                            'error'
                          }
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                {/* Muscles */}
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Muscles Worked
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Primary Muscles
                      </Typography>
                      {renderChipList(selectedExercise.primaryMuscles, 'primary')}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Secondary Muscles
                      </Typography>
                      {renderChipList(selectedExercise.secondaryMuscles, 'secondary')}
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Instructions */}
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Instructions
                  </Typography>
                  <List>
                    {selectedExercise.preparation?.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))}
                    {selectedExercise.execution?.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {index + 1}.
                        </ListItemIcon>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Tips and Common Errors */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Tips
                    </Typography>
                    <List>
                      {selectedExercise.tips?.map((tip, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <InfoIcon color="info" />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom color="error">
                      Common Errors
                    </Typography>
                    <List>
                      {selectedExercise.commonErrors?.map((error, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WarningIcon color="error" />
                          </ListItemIcon>
                          <ListItemText primary={error} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>

                {/* Benefits and Variations */}
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Benefits
                  </Typography>
                  <List>
                    {selectedExercise.benefits?.map((benefit, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Variations
                  </Typography>
                  {renderChipList(selectedExercise.variations, 'info')}
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ExerciseLibrary;
