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
} from '@mui/material';
import {
  Share as ShareIcon,
  Public as PublicIcon,
  People as PeopleIcon,
  Lock as LockIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const WorkoutShare = ({ workout, onClose }) => {
  const { currentUser } = useAuth();
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [error, setError] = useState('');

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

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: <PublicIcon /> },
    { value: 'friends', label: 'Friends Only', icon: <PeopleIcon /> },
    { value: 'private', label: 'Private', icon: <LockIcon /> },
  ];

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Share Workout
          <IconButton onClick={onClose} size="small">
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
            <Typography variant="h6" gutterBottom>
              Workout Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {JSON.stringify(workout, null, 2)}
            </Typography>
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
        <Button onClick={onClose}>
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
