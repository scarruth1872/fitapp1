import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import SchedulingPage from '../components/SchedulingPage';

const Scheduling = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Schedule an Appointment
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Book a session with our counseling professionals
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <SchedulingPage />
        </Box>
      </Paper>
    </Container>
  );
};

export default Scheduling;
