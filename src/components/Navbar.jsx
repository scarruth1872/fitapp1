import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  FitnessCenter as WorkoutIcon,
  Timeline as ProgressIcon,
  Group as SocialIcon,
  Person as ProfileIcon,
  EventNote as ScheduleIcon,
  Chat as ChatIcon,
  Psychology as CounselingIcon,
  MedicalServices as DiagnosisIcon,
  Article as ArticleIcon,
  AttachMoney as PricingIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const publicPages = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Articles', path: '/articles', icon: <ArticleIcon /> },
  { name: 'Pricing', path: '/pricing', icon: <PricingIcon /> }
];

const privatePages = [
  { name: 'Diagnosis', path: '/diagnosis', icon: <DiagnosisIcon /> },
  { name: 'Counseling', path: '/counseling', icon: <CounselingIcon /> },
  { name: 'Training', path: '/training', icon: <WorkoutIcon /> },
  { name: 'Progress', path: '/progress', icon: <ProgressIcon /> },
  { name: 'Chat', path: '/chat', icon: <ChatIcon /> },
  { name: 'Schedule', path: '/schedule', icon: <ScheduleIcon /> },
  { name: 'Social', path: '/social', icon: <SocialIcon /> }
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleCloseUserMenu();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const allPages = [...publicPages, ...(currentUser ? privatePages : [])];

  const drawer = (
    <List>
      {allPages.map((page) => (
        <ListItem
          button
          key={page.name}
          component={RouterLink}
          to={page.path}
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>{page.icon}</ListItemIcon>
          <ListItemText primary={page.name} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              FitApp
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {allPages.map((page) => (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {page.icon}
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              {currentUser ? (
                <>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={currentUser.email} src={currentUser.photoURL}>
                      {currentUser.email?.[0]?.toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem
                      component={RouterLink}
                      to="/profile"
                      onClick={handleCloseUserMenu}
                    >
                      <ListItemIcon>
                        <ProfileIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="contained"
                    color="secondary"
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
