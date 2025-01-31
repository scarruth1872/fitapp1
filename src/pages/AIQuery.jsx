import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AIQueryInterface from '../components/AIQueryInterface';

const AIQuery = () => {
  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)' }}>
      <Typography variant="h4" gutterBottom>
        AI Assistant
      </Typography>
      <Paper 
        elevation={3} 
        sx={{ 
          height: 'calc(100% - 48px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <AIQueryInterface />
      </Paper>
    </Box>
  );
};

export default AIQuery;
