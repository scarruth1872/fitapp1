import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Fade
} from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';
import { motion } from 'framer-motion';

const LoadingState = ({ message = 'Loading...', showIcon = true }) => {
  return (
    <Fade in timeout={300}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        {showIcon && (
          <Box
            component={motion.div}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FitnessCenter
              sx={{
                fontSize: 48,
                color: 'primary.main'
              }}
            />
          </Box>
        )}

        <CircularProgress
          size={showIcon ? 24 : 40}
          thickness={4}
          sx={{ color: 'primary.main' }}
        />

        <Typography
          variant="h6"
          component={motion.div}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </Typography>
      </Paper>
    </Fade>
  );
};

export const ContentLoader = ({ children, loading, error, onRetry }) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Paper
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          borderRadius: 2,
          backgroundColor: 'error.light'
        }}
      >
        <Typography variant="h6" color="error.dark">
          Error loading content
        </Typography>
        <Typography variant="body2" color="error.dark">
          {error.message}
        </Typography>
        {onRetry && (
          <Button
            variant="contained"
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        )}
      </Paper>
    );
  }

  return children;
};

export const SkeletonLoader = ({ variant = 'rectangular', count = 1, ...props }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {Array(count).fill(null).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          animation="wave"
          sx={{ mb: 1 }}
          {...props}
        />
      ))}
    </Box>
  );
};

export default LoadingState;
