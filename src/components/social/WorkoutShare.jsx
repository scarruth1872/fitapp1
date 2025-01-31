import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Share as ShareIcon,
  Public as PublicIcon,
  People as PeopleIcon,
  Lock as LockIcon,
  Close as CloseIcon,
  FitnessCenter as WorkoutIcon,
  Timer as TimerIcon,
  LocalFireDepartment as CaloriesIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const WorkoutShare = ({ workout, onClose, open }) => {
  const { currentUser } = useAuth();
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      setError('');

      const postData = {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userAvatar: currentUser.photoURL,
        description,
        workoutData: workout,
        visibility,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'social_posts'), postData);
      setShareSuccess(true);

      // Reset form
      setDescription('');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to share workout. Please try again.');
      console.error('Error sharing workout:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    setVisibility('public');
    setShareSuccess(false);
    setError('');
    onClose();
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: <PublicIcon /> },
    { value: 'friends', label: 'Friends Only', icon: <PeopleIcon /> },
    { value: 'private', label: 'Private', icon: <LockIcon /> },
  ];

  const renderWorkoutSummary = () => {
    if (!workout) return <Typography color="text.secondary">No workout data available</Typography>;

    return (
      <Box>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          {workout.duration && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon color="action" />
              <Typography variant="body2">{formatDuration(workout.duration)}</Typography>
            </Box>
          )}
          {workout.calories && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CaloriesIcon color="action" />
              <Typography variant="body2">{workout.calories} cal</Typography>
            </Box>
          )}
        </Stack>

        {workout.exercises && workout.exercises.length > 0 && (
          <List dense disablePadding>
            {workout.exercises.map((exercise, index) => (
              <React.Fragment key={index}>
                <ListItem disableGutters>
                  <ListItemText
                    primary={exercise.name}
                    secondary={
                      <Stack direction="row" spacing={1}>
                        {exercise.sets && <Typography variant="caption">{exercise.sets} sets</Typography>}
                        {exercise.reps && <Typography variant="caption">{exercise.reps} reps</Typography>}
                        {exercise.weight && (
                          <Typography variant="caption">{exercise.weight} {exercise.unit || 'lbs'}</Typography>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
                {index < workout.exercises.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    );
  };

  return (
    <Dialog 
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Share Workout
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {shareSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Workout shared successfully!
          </Alert>
        )}

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkoutIcon color="primary" />
              Workout Summary
            </Typography>
            {renderWorkoutSummary()}
          </CardContent>
        </Card>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Add a description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share your thoughts about this workout..."
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle2" gutterBottom>
          Who can see this?
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {visibilityOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              icon={option.icon}
              onClick={() => setVisibility(option.value)}
              color={visibility === option.value ? 'primary' : 'default'}
              variant={visibility === option.value ? 'filled' : 'outlined'}
              sx={{ 
                '& .MuiChip-icon': { 
                  fontSize: 20,
                },
              }}
            />
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<ShareIcon />}
          onClick={handleShare}
          disabled={isSharing || !description.trim()}
        >
          {isSharing ? 'Sharing...' : 'Share Workout'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkoutShare;
