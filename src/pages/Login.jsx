import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Box,
  Avatar,
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { checkFirebaseConnection } from '../config/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({ isOnline: true, checking: false });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check network connectivity
  useEffect(() => {
    const checkConnection = async () => {
      if (networkStatus.checking) return;
      
      setNetworkStatus(prev => ({ ...prev, checking: true }));
      try {
        const isConnected = await checkFirebaseConnection();
        setNetworkStatus({ isOnline: isConnected, checking: false });
        if (!isConnected) {
          setError('Unable to connect to the server. Please check your internet connection.');
        }
      } catch (error) {
        console.error('Connection check error:', error);
        setNetworkStatus({ isOnline: false, checking: false });
        setError('Connection error. Please try again.');
      }
    };

    checkConnection();
  }, []);

  const handleRetryConnection = async () => {
    setError('');
    setNetworkStatus(prev => ({ ...prev, checking: true }));
    
    try {
      const isConnected = await checkFirebaseConnection();
      setNetworkStatus({ isOnline: isConnected, checking: false });
      
      if (isConnected) {
        setError('');
      } else {
        setError('Still unable to connect. Please check your internet connection.');
      }
    } catch (error) {
      console.error('Retry connection error:', error);
      setNetworkStatus({ isOnline: false, checking: false });
      setError('Connection failed. Please try again later.');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!networkStatus.isOnline) {
      setError('No connection to server. Please check your internet connection and try again.');
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/network-request-failed') {
        setNetworkStatus({ isOnline: false, checking: false });
        setError('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please check your email or sign up.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address. Please check your email.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later or reset your password.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom>
            Sign In
          </Typography>
          
          {/* Network Status Alert */}
          <Collapse in={!networkStatus.isOnline} sx={{ width: '100%', mb: 2 }}>
            <Alert 
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleRetryConnection}
                  disabled={networkStatus.checking}
                  startIcon={networkStatus.checking ? <CircularProgress size={20} /> : <RefreshIcon />}
                >
                  Retry
                </Button>
              }
            >
              Connection Error. Please check your internet.
            </Alert>
          </Collapse>

          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
              bgcolor: 'background.paper',
              mt: 2
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || networkStatus.checking}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || networkStatus.checking}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || networkStatus.checking}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Link component={RouterLink} to="/reset-password" variant="body2">
                Forgot password?
              </Link>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Login;
