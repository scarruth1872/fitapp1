import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Close as CloseIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  LocalFireDepartment as FireIcon,
  FitnessCenter as WorkoutIcon,
  Groups as SocialIcon,
  Timeline as StreakIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useAchievements } from '../../hooks/useAchievements';
import { useRewards } from '../../hooks/useRewards';
import AchievementRewards from './AchievementRewards';

const AchievementCard = ({ achievement, onView }) => {
  const theme = useTheme();
  const progress = (achievement.currentProgress / achievement.targetProgress) * 100;
  const isCompleted = achievement.completed;

  return (
    <Card
      onClick={() => onView(achievement)}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
        position: 'relative',
        bgcolor: isCompleted ? 'success.light' : 'background.paper',
      }}
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        {isCompleted && (
          <CheckCircleIcon
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'success.main',
            }}
          />
        )}
        <Box display="flex" alignItems="center" mb={1}>
          {achievement.icon}
          <Typography variant="h6" ml={1}>
            {achievement.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {achievement.description}
        </Typography>
        <Box>
          <Typography variant="caption" display="block" gutterBottom>
            Progress: {achievement.currentProgress} / {achievement.targetProgress}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                bgcolor: isCompleted ? 'success.main' : 'primary.main',
              },
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

const AchievementSystem = () => {
  const {
    achievements,
    loading: achievementsLoading,
    error: achievementsError,
    refreshAchievements
  } = useAchievements();

  const {
    rewards,
    loading: rewardsLoading,
    error: rewardsError,
    checkAchievementRewards
  } = useRewards();

  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [viewMode, setViewMode] = useState('achievements'); // 'achievements', 'rewards'

  useEffect(() => {
    refreshAchievements();
  }, []);

  useEffect(() => {
    if (achievements.length > 0) {
      checkAchievementRewards(achievements);
    }
  }, [achievements]);

  const handleViewAchievement = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const loading = achievementsLoading || rewardsLoading;
  const error = achievementsError || rewardsError;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          {viewMode === 'achievements' ? 'Achievements' : 'Rewards'}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Tabs
            value={viewMode}
            onChange={(e, newValue) => setViewMode(newValue)}
          >
            <Tab
              value="achievements"
              label="Achievements"
              icon={<TrophyIcon />}
            />
            <Tab
              value="rewards"
              label="Rewards"
              icon={<StarIcon />}
            />
          </Tabs>
          <Badge
            badgeContent={achievements.filter(a => a.completed).length}
            color="primary"
          >
            <TrophyIcon fontSize="large" />
          </Badge>
        </Box>
      </Box>

      {viewMode === 'achievements' ? (
        <Grid container spacing={3}>
          {achievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <AchievementCard
                achievement={achievement}
                onView={handleViewAchievement}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <AchievementRewards />
      )}

      <Dialog
        open={Boolean(selectedAchievement)}
        onClose={() => setSelectedAchievement(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAchievement && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{selectedAchievement.name}</Typography>
                <IconButton onClick={() => setSelectedAchievement(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box p={2}>
                <Typography variant="body1" paragraph>
                  {selectedAchievement.description}
                </Typography>
                <Box my={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(selectedAchievement.currentProgress / selectedAchievement.targetProgress) * 100}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="caption" display="block" mt={1}>
                    {selectedAchievement.currentProgress} / {selectedAchievement.targetProgress}
                  </Typography>
                </Box>
                <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Rewards
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAchievement.reward}
                  </Typography>
                  {selectedAchievement.completed && (
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedAchievement(null);
                          setViewMode('rewards');
                        }}
                        startIcon={<StarIcon />}
                      >
                        View Available Rewards
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AchievementSystem;
