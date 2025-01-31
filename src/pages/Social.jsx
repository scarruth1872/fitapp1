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
import WorkoutSocialFeed from '../components/social/WorkoutSocialFeed';

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
    { id: 'feed', label: 'General Feed', icon: <FeedIcon /> },
    { id: 'workouts', label: 'Workout Feed', icon: <FitnessCenterIcon /> },
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
        {socialTabs.map((tab) => (
          <ListItem
            button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            selected={activeView === tab.id}
          >
            <ListItemIcon>{tab.icon}</ListItemIcon>
            <ListItemText primary={tab.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${isMobile ? 0 : 240}px)` },
          ml: { sm: `${isMobile ? 0 : 240}px` },
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
            Social
          </Typography>
          <IconButton
            color="inherit"
            onClick={(e) => setNotificationAnchor(e.currentTarget)}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
          >
            <Avatar
              src={currentUser?.photoURL}
              sx={{ width: 32, height: 32 }}
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
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
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
        }}
      >
        {activeView === 'feed' && <SocialFeed />}
        {activeView === 'workouts' && <WorkoutSocialFeed />}
        {activeView === 'friends' && <FriendSystem />}
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                markAsRead(notification.id);
                setNotificationAnchor(null);
              }}
              sx={{ whiteSpace: 'normal' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography variant="subtitle2">{notification.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.createdAt?.toDate().toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
      >
        <MenuItem onClick={() => {
          setUserMenuAnchor(null);
          navigate('/profile');
        }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          setUserMenuAnchor(null);
          setActiveView('settings');
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Settings</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          setUserMenuAnchor(null);
          handleLogout();
        }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Share Workout Dialog */}
      <WorkoutShare
        open={showShare}
        onClose={() => setShowShare(false)}
        workout={workoutToShare}
      />
    </Box>
  );
};

export default Social;
