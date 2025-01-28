import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { EventAvailable as BookingIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useBookingAnalytics from '../hooks/useBookingAnalytics';

const BookingLanding = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { trackBookingView, trackBookingStart } = useBookingAnalytics();

  const handleBookNow = useCallback(() => {
    trackBookingStart('landing_page');
    navigate('/booking');
  }, [navigate, trackBookingStart]);

  React.useEffect(() => {
    trackBookingView('landing_page');
  }, [trackBookingView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const features = [
    {
      title: 'Personal Training',
      description: 'One-on-one sessions tailored to your goals',
      icon: '🏋️‍♂️',
    },
    {
      title: 'Nutrition Planning',
      description: 'Custom meal plans and dietary guidance',
      icon: '🥗',
    },
    {
      title: 'Progress Tracking',
      description: 'Regular assessments and goal updates',
      icon: '📈',
    },
    {
      title: 'Flexible Scheduling',
      description: 'Book sessions at your convenience',
      icon: '📅',
    },
  ];

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        pt: { xs: 8, md: 12 },
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Transform Your Fitness Journey
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h5"
                color="textSecondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Book your personalized fitness consultation today and take the first step towards achieving your goals.
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                variant="contained"
                size="large"
                onClick={handleBookNow}
                startIcon={<BookingIcon />}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1.2rem',
                  borderRadius: '50px',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s',
                  },
                }}
              >
                Book Your Session Now
              </Button>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}
            >
              {features.map((feature, index) => (
                <Paper
                  key={feature.title}
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Quick Access Floating Button */}
      <Box
        component={motion.div}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 32 },
          right: { xs: 16, md: 32 },
          zIndex: theme.zIndex.fab,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleBookNow}
          startIcon={<BookingIcon />}
          sx={{
            borderRadius: '50px',
            py: 2,
            px: 3,
            boxShadow: theme.shadows[8],
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: theme.shadows[12],
            },
          }}
        >
          {isMobile ? <BookingIcon /> : 'Quick Book'}
        </Button>
      </Box>
    </Box>
  );
};

export default BookingLanding;
