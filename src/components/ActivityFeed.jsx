import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Paper,
  Box,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  FitnessCenter as WorkoutIcon,
  ThumbUp as LikeIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useWorkout } from '../contexts/WorkoutContext';
import { useAuth } from '../contexts/AuthContext';

const MotionListItem = motion(ListItem);

const ActivityFeed = () => {
  const { workouts } = useWorkout();
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!workouts?.length) return;

    // Transform workouts into activity items
    const activityItems = workouts
      .filter(workout => workout.isPublic)
      .map(workout => ({
        id: workout.id,
        type: 'workout',
        title: workout.title,
        timestamp: workout.timestamp,
        user: {
          id: workout.userId,
          name: currentUser.displayName,
          avatar: currentUser.photoURL
        },
        data: {
          exercises: workout.exercises.length,
          duration: workout.duration,
          intensity: workout.intensity
        },
        likes: workout.likes?.length || 0,
        comments: workout.comments?.length || 0,
        isLiked: workout.likes?.includes(currentUser.uid)
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    setActivities(activityItems);
  }, [workouts, currentUser]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // difference in seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
      <List sx={{ width: '100%' }}>
        {activities.map((activity, index) => (
          <MotionListItem
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            alignItems="flex-start"
            sx={{ mb: 2 }}
          >
            <ListItemAvatar>
              <Avatar src={activity.user.avatar}>
                <WorkoutIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" component="span" fontWeight="bold">
                    {activity.user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    completed a workout
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {formatTimeAgo(activity.timestamp)}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {activity.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip
                      size="small"
                      icon={<WorkoutIcon />}
                      label={`${activity.data.exercises} exercises`}
                    />
                    <Chip
                      size="small"
                      label={`${activity.data.duration} min`}
                    />
                    <Chip
                      size="small"
                      label={activity.data.intensity}
                      color={
                        activity.data.intensity === 'high' ? 'error' :
                        activity.data.intensity === 'medium' ? 'warning' : 'success'
                      }
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton size="small">
                      <LikeIcon color={activity.isLiked ? 'primary' : 'inherit'} />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {activity.likes}
                    </Typography>
                    <IconButton size="small">
                      <CommentIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {activity.comments}
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </MotionListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ActivityFeed;
