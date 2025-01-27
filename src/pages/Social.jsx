import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Fab,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  DynamicFeed as FeedIcon,
  People as PeopleIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  FitnessCenter as FitnessCenterIcon,
  Forum as ForumIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import useSocialNotifications from '../hooks/useSocialNotifications';
import SocialFeed from '../components/social/SocialFeed';
import FriendSystem from '../components/social/FriendSystem';
import WorkoutShare from '../components/social/WorkoutShare';

const Social = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useSocialNotifications();
  
  const [activeView, setActiveView] = useState('feed');
  const [showShare, setShowShare] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [workoutToShare, setWorkoutToShare] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/' },
    { id: 'workouts', label: 'Workouts', icon: <FitnessCenterIcon />, path: '/workouts' },
    { id: 'social', label: 'Social', icon: <PeopleIcon />, path: '/social' },
    { id: 'counseling', label: 'Counseling', icon: <ForumIcon />, path: '/counseling' },
  ];

  const socialTabs = [
    { id: 'feed', label: 'Feed', icon: <FeedIcon /> },
    { id: 'friends', label: 'Friends', icon: <PeopleIcon /> },
    { id: 'saved', label: 'Saved Workouts', icon: <BookmarkIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          FitApp
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            selected={item.id === 'social'}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {socialTabs.map((item) => (
          <ListItem
            button
            key={item.id}
            onClick={() => {
              setActiveView(item.id);
              if (isMobile) setMobileOpen(false);
            }}
            selected={activeView === item.id}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'feed':
        return <SocialFeed />;
      case 'friends':
        return <FriendSystem />;
      case 'saved':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6">Saved Workouts</Typography>
            {/* Implement saved workouts view */}
          </Box>
        );
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6">Social Settings</Typography>
            {/* Implement settings view */}
          </Box>
        );
      default:
        return <SocialFeed />;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#000' : theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {socialTabs.find(item => item.id === activeView)?.label || 'Social'}
          </Typography>

          {/* Main Navigation Buttons - Desktop Only */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                color="inherit"
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
                sx={{ 
                  mx: 1,
                  borderBottom: item.id === 'social' ? '2px solid' : 'none',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <IconButton color="inherit" onClick={(e) => setNotificationAnchor(e.currentTarget)}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton 
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            sx={{ ml: 1 }}
          >
            <Avatar
              src={currentUser?.photoURL}
              sx={{ 
                width: 32, 
                height: 32,
                border: theme => theme.palette.mode === 'dark' ? '1px solid #00ff00' : 'none',
              }}
            >
              {currentUser?.displayName?.[0]}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              width: 240,
              backgroundColor: theme => theme.palette.mode === 'dark' ? '#000' : theme.palette.background.paper,
              borderRight: theme => theme.palette.mode === 'dark' ? '1px solid rgba(0, 255, 0, 0.3)' : '1px solid rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: 8,
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#000' : theme.palette.background.default,
        }}
      >
        {renderContent()}
      </Box>

      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 0.8)' : theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 255, 0, 1)' : theme.palette.primary.dark,
          },
        }}
        onClick={() => {
          setWorkoutToShare({
            title: "Today's Workout",
            exercises: [
              { name: 'Push-ups', sets: 3, reps: 12 },
              { name: 'Squats', sets: 4, reps: 15 },
            ],
            duration: '45 minutes',
            intensity: 'Medium',
          });
          setShowShare(true);
        }}
      >
        <AddIcon />
      </Fab>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: {
            maxHeight: 300,
            width: 320,
            mt: 1,
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={() => {
                markAsRead(notification.id);
                setNotificationAnchor(null);
              }}
            >
              <ListItemText 
                primary={notification.title}
                secondary={notification.message}
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <ListItemText primary="No new notifications" />
          </MenuItem>
        )}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
      >
        <MenuItem onClick={() => {
          setActiveView('profile');
          setUserMenuAnchor(null);
        }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={() => {
          setActiveView('settings');
          setUserMenuAnchor(null);
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Workout Share Dialog */}
      {showShare && (
        <WorkoutShare
          workout={workoutToShare}
          onClose={() => {
            setShowShare(false);
            setWorkoutToShare(null);
          }}
        />
      )}
    </Box>
  );
};

export default Social;
