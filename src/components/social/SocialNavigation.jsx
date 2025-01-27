import React, { useState } from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from '@mui/material';
import {
  DynamicFeed as FeedIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import SocialFeed from './SocialFeed';
import FriendSystem from './FriendSystem';

const SocialNavigation = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState(0); // This would be populated from your notification system

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <SocialFeed />;
      case 1:
        return <FriendSystem />;
      default:
        return <SocialFeed />;
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      {renderContent()}
      
      <Paper 
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} 
        elevation={3}
      >
        <BottomNavigation
          value={activeTab}
          onChange={(event, newValue) => {
            setActiveTab(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction 
            label="Feed" 
            icon={<FeedIcon />} 
          />
          <BottomNavigationAction 
            label="Friends" 
            icon={<PeopleIcon />} 
          />
          <BottomNavigationAction 
            label="Notifications" 
            icon={
              <Badge badgeContent={notifications} color="error">
                <NotificationsIcon />
              </Badge>
            } 
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default SocialNavigation;
