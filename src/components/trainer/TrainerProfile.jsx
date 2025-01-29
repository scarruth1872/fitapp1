import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  CheckCircleOutline as CheckIcon,
  FitnessCenter as TrainingIcon,
  Psychology as ExpertiseIcon
} from '@mui/icons-material';

const businessHours = [
  { day: 'Monday - Friday', hours: '5:00 AM - 7:00 PM' },
  { day: 'Saturday', hours: '5:00 AM - 12:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
];

const TrainerProfile = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: 2,
        p: 3,
        mb: 2
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" color="primary" gutterBottom>
            Welcome to Inspired-Fitness LLC
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We embrace a modern and authentic approach to strength training that is as unique as you are. 
            Our flexible classes are designed to fit seamlessly into your busy lifestyle, offering the perfect 
            blend of professional guidance and progressive techniques.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="primary" gutterBottom>
            Our Approach
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <TrainingIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Personalized Training"
                secondary="Tailored programs that match your unique goals and fitness level"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ExpertiseIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Expert Guidance"
                secondary="Professional support to ensure proper form and technique"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Comprehensive Support"
                secondary="From strength training to nutrition guidance"
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="primary" gutterBottom>
            Business Hours
          </Typography>
          <List>
            {businessHours.map((schedule, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <TimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={schedule.day}
                  secondary={schedule.hours}
                />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" color="primary" gutterBottom>
            About Strength Training
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Strength training is a fundamental component of personal training that focuses on building muscle, 
            enhancing endurance, and improving overall fitness. Our trainers design tailored strength training 
            programs to meet individual goals, whether it's increasing muscle mass, losing weight, or improving 
            athletic performance. Through various exercises including weightlifting, resistance bands, and 
            bodyweight workouts, we ensure you not only develop physical strength but also gain confidence 
            and motivation.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TrainerProfile;
