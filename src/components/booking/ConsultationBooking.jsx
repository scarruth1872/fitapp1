import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  EventAvailable as EventAvailableIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import useBookingAnalytics from '../../hooks/useBookingAnalytics';

const ConsultationBooking = () => {
  const theme = useTheme();
  const analytics = useBookingAnalytics();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    analytics.trackBookingView('direct');
    
    // Check if Cal script is already loaded
    const existingScript = document.querySelector('script[src="https://cal.com/embed.js"]');
    if (existingScript) {
      setIsLoading(false);
      return;
    }

    // Initialize Cal.com inline widget
    const script = document.createElement('script');
    script.src = 'https://cal.com/embed.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoading(false);
      // Initialize Cal namespace
      if (!window.Cal) {
        window.Cal = (...args) => {
          const queue = window._cal = window._cal || [];
          queue.push(args);
        };
      }
    };
    
    script.onerror = () => {
      setError('Failed to load booking system. Please try again later.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [analytics]);

  const handleConsultationSelect = useCallback((type) => {
    setSelectedType(type);
    analytics.trackConsultationTypeSelected(type.title, type.price);
    
    try {
      // Use Cal namespace safely
      if (window.Cal) {
        window.Cal('init', {
          origin: 'https://cal.com',
        });
        
        window.Cal('openModal', {
          calLink: 'your-cal-username',
          config: {
            layout: 'month_view',
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
          }
        });
      } else {
        setError('Booking system not loaded. Please refresh the page.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to open booking. Please try again.');
    }
  }, [analytics]);

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Container>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const consultationTypes = [
    {
      title: 'Quick Start Session',
      duration: '20 min',
      description: 'Brief introduction and fitness goal assessment. Perfect for understanding how our program can help you.',
      price: 'Free',
      features: [
        'Basic fitness assessment',
        'Program overview',
        'Quick goal setting',
        'Next steps planning'
      ]
    },
    {
      title: 'Fitness Foundation',
      duration: '45 min',
      description: 'Comprehensive fitness assessment and personalized workout planning session.',
      price: '$75',
      features: [
        'Detailed fitness assessment',
        'Personalized workout plan',
        'Nutrition basics',
        'Progress tracking setup'
      ]
    },
    {
      title: 'Elite Performance Package',
      duration: '90 min',
      description: 'In-depth assessment, custom program design, and advanced performance strategies.',
      price: '$150',
      features: [
        'Advanced fitness assessment',
        'Custom program design',
        'Nutrition planning',
        'Recovery strategies',
        'Performance optimization'
      ]
    },
    {
      title: 'Monthly Coaching',
      duration: '4 sessions/month',
      description: 'Ongoing support with weekly check-ins and program adjustments.',
      price: '$299/month',
      features: [
        'Weekly virtual sessions',
        'Program adjustments',
        'Progress monitoring',
        'Priority support',
        'Nutrition guidance'
      ]
    }
  ];

  return (
    <Container 
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      maxWidth="lg" 
      sx={{ py: 4 }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <motion.div variants={itemVariants}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                <Paper 
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/images/shonna-carruth.jpg"
                    alt="Shonna Carruth"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 2,
                      mb: 3,
                    }}
                  />
                  
                  <Typography variant="h5" gutterBottom>
                    Contact Information
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Location"
                        secondary="Virtual Consultations Available"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Business Hours"
                        secondary="Mon-Fri: 9:00 AM - 6:00 PM EST"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email"
                        secondary="contact@fitapp.com"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone"
                        secondary="(555) 123-4567"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={7}>
            <motion.div variants={itemVariants}>
              <Typography variant="h4" gutterBottom>
                Book a Consultation
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Choose the type of consultation that best fits your needs. All sessions include a personalized approach to help you achieve your fitness goals.
              </Typography>
            </motion.div>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <AnimatePresence>
                {consultationTypes.map((type, index) => (
                  <Grid item xs={12} md={6} key={type.title}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        elevation={2}
                        onClick={() => handleConsultationSelect(type)}
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'visible',
                          ...(type.title === 'Monthly Coaching' && {
                            '&::before': {
                              content: '"Most Popular"',
                              position: 'absolute',
                              top: -12,
                              right: 12,
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              zIndex: 1,
                            }
                          })
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {type.title}
                              </Typography>
                              <Typography variant="subtitle2" color="textSecondary">
                                <EventAvailableIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                                {type.duration}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="h6" 
                              color="primary"
                              sx={{
                                fontWeight: 'bold',
                                ...(type.price === 'Free' && {
                                  color: theme.palette.success.main
                                })
                              }}
                            >
                              {type.price}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" paragraph>
                            {type.description}
                          </Typography>
                          
                          <List dense>
                            {type.features.map((feature, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CheckIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={feature} />
                              </ListItem>
                            ))}
                          </List>

                          <Button
                            variant="contained"
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConsultationSelect(type);
                            }}
                            sx={{ 
                              mt: 2,
                              ...(type.title === 'Monthly Coaching' && {
                                backgroundColor: theme.palette.success.main,
                                '&:hover': {
                                  backgroundColor: theme.palette.success.dark,
                                }
                              })
                            }}
                          >
                            Book {type.title}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>

            {/* Cal.com Element Container */}
            <Box id="cal-booking-container" sx={{ height: 600 }} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ConsultationBooking;
