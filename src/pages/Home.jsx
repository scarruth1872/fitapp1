import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const MatrixRain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const MatrixCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const Home = () => {
  useEffect(() => {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const matrixArray = matrix.split("");

    const fontSize = 10;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: 'AI-Powered Diagnosis',
      description: 'Get instant health insights using our advanced diagnostic system.',
      link: '/diagnosis'
    },
    {
      title: 'Expert Counseling',
      description: 'Connect with certified health professionals for personalized guidance.',
      link: '/counseling'
    },
    {
      title: 'Personal Training',
      description: 'Custom workout plans based on NASM principles and your goals.',
      link: '/training'
    },
    {
      title: 'Health Articles',
      description: 'Stay informed with our curated collection of health and wellness articles.',
      link: '/articles'
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <MatrixRain>
        <MatrixCanvas id="matrixCanvas" />
      </MatrixRain>
      
      <Container sx={{ position: 'relative', zIndex: 1, pt: 8, pb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            sx={{
              mb: 4,
              textShadow: '0 0 10px #00ff00',
            }}
          >
            Welcome to Inspired-Fitness
          </Typography>
          
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 6, color: 'primary.light' }}
          >
            Your journey to optimal health and wellness begins here
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={feature.title} xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(0, 26, 0, 0.8)',
                    border: '1px solid #00ff00',
                    '&:hover': {
                      boxShadow: '0 0 20px #00ff00',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {feature.title}
                    </Typography>
                    <Typography>
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={RouterLink}
                      to={feature.link}
                      size="small"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.light',
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/chat"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.light',
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
              },
            }}
          >
            Start Your Journey
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
