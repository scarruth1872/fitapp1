import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)', // Account for navbar height
        textAlign: 'center',
        py: 4,
      }}
    >
      <Typography
        variant="h1"
        component={motion.h1}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{
          fontSize: { xs: '6rem', sm: '8rem' },
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 2,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h4"
        component={motion.h4}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        gutterBottom
      >
        Page Not Found
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        component={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        sx={{ mb: 4, maxWidth: 'sm' }}
      >
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track!
      </Typography>

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
