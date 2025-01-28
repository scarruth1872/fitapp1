import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAchievements } from '../../hooks/useAchievements';
import { useRewards } from '../../hooks/useRewards';

const RewardCard = ({ reward, onClaim, onView }) => {
  const theme = useTheme();
  const isUnlocked = reward.unlockedAt !== null;
  const canClaim = isUnlocked && !reward.claimed;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          bgcolor: isUnlocked ? 'success.light' : 'background.paper',
          opacity: reward.claimed ? 0.8 : 1,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            pt: '56.25%', // 16:9 aspect ratio
            bgcolor: theme.palette.primary.main,
          }}
        >
          <CardMedia
            component="img"
            image={reward.imageUrl}
            alt={reward.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              filter: !isUnlocked ? 'grayscale(100%)' : 'none',
            }}
          />
          {!isUnlocked && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <LockIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
          )}
          {reward.claimed && (
            <Chip
              label="Claimed"
              color="success"
              icon={<CheckCircleIcon />}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h6" component="div">
              {reward.name}
            </Typography>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => onView(reward)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {reward.description}
          </Typography>

          <Box mt="auto">
            <Typography variant="caption" display="block" gutterBottom>
              Required Achievement: {reward.requiredAchievement}
            </Typography>
            {canClaim && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => onClaim(reward)}
                startIcon={<StarIcon />}
              >
                Claim Reward
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RewardDetailsDialog = ({ reward, open, onClose }) => {
  if (!reward) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{reward.name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box p={2}>
          <CardMedia
            component="img"
            image={reward.imageUrl}
            alt={reward.name}
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 2,
            }}
          />
          <Typography variant="body1" paragraph>
            {reward.description}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Requirements
          </Typography>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              • Complete the "{reward.requiredAchievement}" achievement
            </Typography>
            {reward.additionalRequirements?.map((req, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                • {req}
              </Typography>
            ))}
          </Box>
          <Typography variant="subtitle2" gutterBottom>
            Rewards
          </Typography>
          <Box>
            {reward.benefits.map((benefit, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                • {benefit}
              </Typography>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const AchievementRewards = () => {
  const { achievements } = useAchievements();
  const {
    rewards,
    loading,
    error,
    claimReward,
    refreshRewards
  } = useRewards();
  const [selectedReward, setSelectedReward] = useState(null);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    refreshRewards();
  }, [achievements]);

  const handleClaimReward = async (reward) => {
    try {
      await claimReward(reward.id);
      setClaimDialogOpen(false);
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const handleViewReward = (reward) => {
    setSelectedReward(reward);
    setDetailsDialogOpen(true);
  };

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
        <Typography color="error">Error loading rewards: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Achievement Rewards
        </Typography>
        <TrophyIcon fontSize="large" color="primary" />
      </Box>

      <Grid container spacing={3}>
        {rewards.map((reward) => (
          <Grid item xs={12} sm={6} md={4} key={reward.id}>
            <RewardCard
              reward={reward}
              onClaim={() => {
                setSelectedReward(reward);
                setClaimDialogOpen(true);
              }}
              onView={handleViewReward}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={claimDialogOpen}
        onClose={() => setClaimDialogOpen(false)}
      >
        <DialogTitle>Claim Reward</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to claim "{selectedReward?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClaimDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleClaimReward(selectedReward)}
            variant="contained"
            color="primary"
          >
            Claim
          </Button>
        </DialogActions>
      </Dialog>

      <RewardDetailsDialog
        reward={selectedReward}
        open={detailsDialogOpen}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedReward(null);
        }}
      />
    </Box>
  );
};

export default AchievementRewards;
