import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  FitnessCenter as FitnessCenterIcon,
  People as PeopleIcon,
  Forum as ForumIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  EventAvailable as BookingIcon,
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
  { title: 'Home', path: '/', icon: <HomeIcon /> },
  { title: 'Articles', path: '/articles', icon: <ArticleIcon /> },
  { title: 'Pricing', path: '/pricing', icon: <PricingIcon /> }
];

const privatePages = [
  { title: 'Diagnosis', path: '/diagnosis', icon: <DiagnosisIcon /> },
  { title: 'Counseling', path: '/counseling', icon: <CounselingIcon /> },
  { title: 'Training', path: '/training', icon: <FitnessCenterIcon /> },
  { title: 'Progress', path: '/progress', icon: <ProgressIcon /> },
  { title: 'Chat', path: '/chat', icon: <ChatIcon /> },
  { title: 'Schedule', path: '/schedule', icon: <ScheduleIcon /> },
  { title: 'Social', path: '/social', icon: <SocialIcon /> },
  { title: 'Book Consultation', path: '/booking', icon: <BookingIcon /> },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, logout } = useAuth();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pages = [...publicPages, ...(currentUser ? privatePages : [])];

  const settings = [
    { title: 'Profile', path: '/profile', icon: <Avatar sx={{ width: 24, height: 24 }} /> },
    { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    { title: 'Logout', action: handleLogout, icon: <LogoutIcon /> },
  ];

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

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          FitApp
        </Typography>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem
            button
            key={page.title}
            onClick={() => {
              navigate(page.path);
              setMobileOpen(false);
            }}
            selected={location.pathname === page.path}
          >
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText primary={page.title} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {settings.map((setting) => (
          <ListItem
            button
            key={setting.title}
            onClick={() => {
              if (setting.action) {
                setting.action();
              } else {
                navigate(setting.path);
              }
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>{setting.icon}</ListItemIcon>
            <ListItemText primary={setting.title} />
          </ListItem>
        ))}
      </List>
    </Box>
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
              {pages.map((page) => (
                <Button
                  key={page.title}
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
                  {page.title}
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
