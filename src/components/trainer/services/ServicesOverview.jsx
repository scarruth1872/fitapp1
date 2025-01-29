import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme
} from '@mui/material';
import {
  FitnessCenter as TrainingIcon,
  Psychology as CounselingIcon,
  PhotoCamera as PhotographyIcon,
  AttachMoney as PricingIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const services = [
  {
    title: 'Personal Training',
    description: 'We embrace a modern and authentic approach to strength training that is as unique as you are. Our flexible classes are designed to fit seamlessly into your busy lifestyle.',
    icon: <TrainingIcon />,
    features: [
      'Personalized workout programs',
      'Strength training expertise',
      'Progress tracking and adjustments',
      'Nutrition guidance'
    ]
  },
  {
    title: 'Counseling & Life Coaching',
    description: 'Our expert counselors and life coaches are dedicated to helping you navigate life\'s challenges, develop resilience, and achieve your personal and professional goals.',
    icon: <CounselingIcon />,
    features: [
      'Mental health support',
      'Family counseling',
      'Life coaching sessions',
      'Personal development plans'
    ]
  },
  {
    title: 'Photography Services',
    description: 'Capture your fitness journey and progress with professional photography services.',
    icon: <PhotographyIcon />,
    features: [
      'Progress photo sessions',
      'Event photography',
      'Professional editing',
      'Digital delivery'
    ]
  }
];

const businessHours = [
  { day: 'Monday - Friday', hours: '5:00 AM - 7:00 PM' },
  { day: 'Saturday', hours: '5:00 AM - 12:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
];

const ServicesOverview = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 3 }}>
      {/* Mission Statement */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          p: 3,
          mb: 3
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom align="center">
          Inspired-Fitness LLC
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" paragraph>
          Transforming Lives Through Fitness
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph align="center">
          We are on a mission to ignite a revolution in personal health and well-being. By weaving together 
          tailored guidance and integrative strategies, we envision a world where fitness, nutrition, and 
          uplifting lifestyle shifts become the catalysts for profound transformation.
        </Typography>
      </Paper>

      {/* Services Grid */}
      <Grid container spacing={3}>
        {services.map((service, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'secondary.main',
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out'
                }
              }}
            >
              <CardHeader
                avatar={React.cloneElement(service.icon, { color: 'primary' })}
                title={
                  <Typography variant="h6" color="primary">
                    {service.title}
                  </Typography>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                <List dense>
                  {service.features.map((feature, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Business Hours */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          p: 3,
          mt: 3
        }}
      >
        <Typography variant="h6" color="primary" gutterBottom>
          Business Hours
        </Typography>
        <List>
          {businessHours.map((schedule, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <ScheduleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={schedule.day}
                secondary={schedule.hours}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Pricing Information */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          p: 3,
          mt: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PricingIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary">
            Fair & Transparent Pricing
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          We believe in offering fair and transparent prices with no hidden fees or extra charges. 
          Our pricing structure is designed to provide maximum value while maintaining the highest 
          quality of service.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ServicesOverview;
