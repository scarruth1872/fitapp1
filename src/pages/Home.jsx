import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <Container>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to FitApp
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Your personal fitness journey starts here
          </Typography>
        </motion.div>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Track Workouts
                </Typography>
                <Typography variant="body2">
                  Log your exercises, track progress, and achieve your fitness goals.
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={RouterLink} to="/training" size="small">
                  Start Training
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Achievements
                </Typography>
                <Typography variant="body2">
                  Earn achievements, compete with friends, and stay motivated.
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={RouterLink} to="/achievements" size="small">
                  View Achievements
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Analytics
                </Typography>
                <Typography variant="body2">
                  Get detailed insights into your performance and progress.
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={RouterLink} to="/analytics" size="small">
                  View Analytics
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
