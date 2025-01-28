import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Skeleton,
  Paper,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  FitnessCenter as FitnessCenterIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  EmojiEvents as EmojiEventsIcon,
  ListAlt as ListAltIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSocial } from '../contexts/SocialContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

function UserProfile({ userId, onClose }) {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const { currentUser } = useAuth();
  const { following, toggleFollow } = useSocial();
  const isCurrentUser = userId === currentUser?.uid;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const tabs = [
    { value: 'activity', label: 'Activity', icon: <TimelineIcon /> },
    { value: 'workouts', label: 'Workouts', icon: <FitnessCenterIcon /> },
    { value: 'templates', label: 'Templates', icon: <ListAltIcon /> },
    { value: 'achievements', label: 'Achievements', icon: <EmojiEventsIcon /> }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="text.secondary">
          User not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Profile Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user.photoURL}
            alt={user.displayName}
            sx={{ width: 120, height: 120, mr: 3 }}
          >
            {user.displayName?.[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ mr: 2 }}>
                {user.displayName}
              </Typography>
              {!isCurrentUser && (
                <Button
                  variant={following.includes(userId) ? "outlined" : "contained"}
                  onClick={() => toggleFollow(userId)}
                  startIcon={following.includes(userId) ? <PersonRemoveIcon /> : <PersonAddIcon />}
                >
                  {following.includes(userId) ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Box>
            {user.bio && (
              <Typography color="text.secondary" paragraph>
                {user.bio}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box>
                <Typography variant="h6">
                  {user.workoutCount || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Workouts
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">
                  {user.followers?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Followers
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">
                  {user.following?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Following
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {user.achievements?.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Recent Achievements
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {user.achievements.slice(0, 5).map((achievement, index) => (
                <Chip
                  key={index}
                  icon={<EmojiEventsIcon />}
                  label={achievement.name}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Content Tabs */}
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem'
            }
          }}
        >
          {tabs.map(tab => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </Box>
              }
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'activity' && (
                <ActivityFeed userId={userId} />
              )}
              {activeTab === 'workouts' && (
                <WorkoutList userId={userId} />
              )}
              {activeTab === 'templates' && (
                <TemplateList mode="personal" userId={userId} />
              )}
              {activeTab === 'achievements' && (
                <AchievementList userId={userId} />
              )}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Paper>
    </Box>
  );
}

export default UserProfile;
