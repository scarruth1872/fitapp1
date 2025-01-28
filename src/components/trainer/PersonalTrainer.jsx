import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import {
  Chat as ChatIcon,
  FitnessCenter,
  Timeline,
  Assessment
} from '@mui/icons-material';
import TrainerChat from './TrainerChat';
import ExerciseVisualizer from './ExerciseVisualizer';
import WorkoutPlanner from './WorkoutPlanner';
import ProgressTracker from './ProgressTracker';

const PersonalTrainer = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <TrainerChat />;
      case 1:
        return <WorkoutPlanner />;
      case 2:
        return <ExerciseVisualizer />;
      case 3:
        return <ProgressTracker />;
      default:
        return <TrainerChat />;
    }
  };

  return (
    <Paper 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: theme => `1px solid ${theme.palette.primary.main}`,
        bgcolor: theme => theme.palette.background.paper
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          borderBottom: theme => `1px solid ${theme.palette.primary.main}`,
          '& .MuiTab-root': {
            color: theme => theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme => theme.palette.primary.main,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: theme => theme.palette.primary.main,
          },
        }}
      >
        <Tab icon={<ChatIcon />} label="Chat" />
        <Tab icon={<FitnessCenter />} label="Plan" />
        <Tab icon={<Timeline />} label="Exercise" />
        <Tab icon={<Assessment />} label="Progress" />
      </Tabs>
      
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {renderContent()}
      </Box>
    </Paper>
  );
};

export default PersonalTrainer;
