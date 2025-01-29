import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme
} from '@mui/material';
import {
  Psychology as CounselingIcon,
  People as FamilyIcon,
  EmojiObjects as CoachingIcon,
  Favorite as WellnessIcon
} from '@mui/icons-material';

const counselingServices = [
  {
    title: 'Individual Counseling',
    description: 'A safe and confidential space for personal exploration and growth, addressing anxiety, depression, relationship difficulties, and stress management.',
    icon: <CounselingIcon />,
    benefits: [
      'Personalized therapeutic approaches',
      'Develop coping strategies',
      'Improve mental well-being',
      'Build self-awareness'
    ]
  },
  {
    title: 'Family Counseling',
    description: 'Improve communication and resolve conflicts within family units, creating stronger bonds and a more harmonious home life.',
    icon: <FamilyIcon />,
    benefits: [
      'Enhanced family communication',
      'Conflict resolution skills',
      'Stronger family relationships',
      'Parenting support'
    ]
  },
  {
    title: 'Life Coaching',
    description: 'Focus on personal growth and development of actionable strategies for achieving your goals and creating positive life changes.',
    icon: <CoachingIcon />,
    benefits: [
      'Goal setting and achievement',
      'Personal development plans',
      'Career guidance',
      'Work-life balance'
    ]
  }
];

const CounselingServices = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 3 }}>
      {/* Introduction */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WellnessIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
          <Typography variant="h4" color="primary">
            Guidance and Support for Your Journey
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          At Inspired-Fitness LLC, located in the heart of Kernersville, we believe that true wellness 
          encompasses both mental and physical health. Our expert counselors and life coaches are 
          dedicated to helping you navigate life's challenges, develop resilience, and achieve your 
          personal and professional goals.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Whether you're seeking guidance through a difficult transition, looking to enhance your 
          fitness journey, or in need of a supportive partner on your path to self-discovery, our 
          holistic approach integrates tailored coaching, counseling, and personal training to inspire 
          and empower you every step of the way.
        </Typography>
      </Paper>

      {/* Services Grid */}
      <Grid container spacing={3}>
        {counselingServices.map((service, index) => (
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
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Key Benefits:
                </Typography>
                <List dense>
                  {service.benefits.map((benefit, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          p: 3,
          mt: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" color="primary" gutterBottom>
          Ready to Start Your Journey?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Take the first step towards a healthier, more balanced life. Schedule a consultation 
          with one of our expert counselors or life coaches today.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="https://www.inspired-fitness.com/appointment"
          target="_blank"
          sx={{ mt: 2 }}
        >
          Book a Consultation
        </Button>
      </Paper>
    </Box>
  );
};

export default CounselingServices;
