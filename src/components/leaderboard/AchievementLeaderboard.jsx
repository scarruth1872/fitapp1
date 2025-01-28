import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Tab,
  Tabs,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Public as GlobalIcon,
  People as FriendsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useAuth } from '../../contexts/AuthContext';

const LeaderboardItem = ({ user, rank, isCurrentUser, animate }) => {
  const theme = useTheme();
  
  const rankColors = {
    1: theme.palette.gold.main,
    2: theme.palette.silver.main,
    3: theme.palette.bronze.main
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.3 }}
    >
      <ListItem
        component={Paper}
        elevation={isCurrentUser ? 3 : 1}
        sx={{
          mb: 1,
          bgcolor: isCurrentUser ? 'primary.light' : 'background.paper',
          borderRadius: 1,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            bgcolor: isCurrentUser ? 'primary.light' : 'action.hover'
          }
        }}
      >
        {rank <= 3 && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              bgcolor: rankColors[rank]
            }}
          />
        )}
        
        <ListItemAvatar>
          <Avatar
            src={user.photoURL}
            sx={{
              border: rank <= 3 ? `2px solid ${rankColors[rank]}` : 'none'
            }}
          >
            {user.displayName?.[0]}
          </Avatar>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1" component="span" fontWeight="bold">
                {user.displayName}
              </Typography>
              {user.streak > 0 && (
                <Tooltip title={`${user.streak} day streak!`}>
                  <Chip
                    icon={<TimelineIcon />}
                    label={user.streak}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Tooltip>
              )}
            </Box>
          }
          secondary={
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                icon={<TrophyIcon />}
                label={`${user.achievementCount} Achievements`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<StarIcon />}
                label={`${user.points} Points`}
                size="small"
                variant="outlined"
              />
            </Box>
          }
        />

        <ListItemSecondaryAction>
          <Box display="flex" alignItems="center" gap={1}>
            {user.rankChange !== 0 && (
              <Tooltip title={`${Math.abs(user.rankChange)} positions ${user.rankChange > 0 ? 'up' : 'down'}`}>
                <IconButton
                  size="small"
                  color={user.rankChange > 0 ? 'success' : 'error'}
                >
                  {user.rankChange > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </IconButton>
              </Tooltip>
            )}
            <Typography
              variant="h6"
              component="span"
              sx={{
                color: rankColors[rank] || 'text.primary',
                fontWeight: 'bold'
              }}
            >
              #{rank}
            </Typography>
          </Box>
        </ListItemSecondaryAction>
      </ListItem>
    </motion.div>
  );
};

const TimeframeSelector = ({ timeframe, onTimeframeChange }) => {
  const timeframes = [
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'allTime', label: 'All Time' }
  ];

  return (
    <Tabs
      value={timeframe}
      onChange={(e, value) => onTimeframeChange(value)}
      variant="fullWidth"
      sx={{ mb: 3 }}
    >
      {timeframes.map(({ value, label }) => (
        <Tab
          key={value}
          value={value}
          label={label}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
              fontWeight: 'bold'
            }
          }}
        />
      ))}
    </Tabs>
  );
};

const CategoryFilter = ({ category, onCategoryChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const categories = [
    { value: 'all', label: 'All Achievements' },
    { value: 'workout', label: 'Workout Achievements' },
    { value: 'social', label: 'Social Achievements' },
    { value: 'streak', label: 'Streak Achievements' }
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    onCategoryChange(value);
    handleClose();
  };

  return (
    <>
      <Button
        startIcon={<FilterIcon />}
        endIcon={<StarIcon />}
        onClick={handleClick}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        {categories.find(c => c.value === category)?.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {categories.map(({ value, label }) => (
          <MenuItem
            key={value}
            onClick={() => handleSelect(value)}
            selected={value === category}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const ScopeSelector = ({ scope, onScopeChange }) => {
  return (
    <Tabs
      value={scope}
      onChange={(e, value) => onScopeChange(value)}
      aria-label="leaderboard scope"
      sx={{ mb: 2 }}
    >
      <Tab
        value="global"
        label="Global"
        icon={<GlobalIcon />}
      />
      <Tab
        value="friends"
        label="Friends"
        icon={<FriendsIcon />}
      />
    </Tabs>
  );
};

const AchievementLeaderboard = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [category, setCategory] = useState('all');
  const [scope, setScope] = useState('global');
  const { currentUser } = useAuth();
  const {
    leaderboardData,
    loading,
    error,
    refreshLeaderboard
  } = useLeaderboard(timeframe, category, scope);

  useEffect(() => {
    refreshLeaderboard();
  }, [timeframe, category, scope]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">Error loading leaderboard: {error}</Typography>
      </Box>
    );
  }

  const currentUserRank = leaderboardData.findIndex(
    user => user.uid === currentUser?.uid
  ) + 1;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Achievement Leaderboard
        </Typography>
        <TrophyIcon fontSize="large" color="primary" />
      </Box>

      <TimeframeSelector
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <CategoryFilter
          category={category}
          onCategoryChange={setCategory}
        />
        <ScopeSelector
          scope={scope}
          onScopeChange={setScope}
        />
      </Box>

      <AnimatePresence>
        <List>
          {leaderboardData.map((user, index) => (
            <LeaderboardItem
              key={user.uid}
              user={user}
              rank={index + 1}
              isCurrentUser={user.uid === currentUser?.uid}
              animate={true}
            />
          ))}
        </List>
      </AnimatePresence>

      {currentUserRank > 10 && (
        <Box mt={2} p={2} component={Paper} elevation={1}>
          <Typography variant="subtitle1" gutterBottom>
            Your Ranking
          </Typography>
          <LeaderboardItem
            user={leaderboardData[currentUserRank - 1]}
            rank={currentUserRank}
            isCurrentUser={true}
            animate={false}
          />
        </Box>
      )}
    </Box>
  );
};

export default AchievementLeaderboard;
