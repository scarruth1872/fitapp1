import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';

// Simulated articles data - In a real app, this would come from an API
const articles = [
  {
    id: 1,
    title: 'Understanding Metabolic Health',
    category: 'Nutrition',
    summary: 'Explore the key factors that influence your metabolic health and learn how to optimize it.',
    image: 'https://source.unsplash.com/random/800x600/?metabolism',
  },
  {
    id: 2,
    title: 'The Science of Recovery',
    category: 'Fitness',
    summary: 'Learn about the latest research in exercise recovery and how to implement it in your routine.',
    image: 'https://source.unsplash.com/random/800x600/?recovery',
  },
  {
    id: 3,
    title: 'Mindfulness and Mental Health',
    category: 'Wellness',
    summary: 'Discover how mindfulness practices can improve your mental well-being and reduce stress.',
    image: 'https://source.unsplash.com/random/800x600/?mindfulness',
  },
  // Add more articles as needed
];

const Articles = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category.toLowerCase() === selectedCategory);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        component="h1"
        variant="h3"
        align="center"
        sx={{ mb: 4, color: 'primary.main' }}
      >
        Health & Wellness Articles
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {['all', 'nutrition', 'fitness', 'wellness'].map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? 'contained' : 'outlined'}
            sx={{
              borderColor: 'primary.main',
              color: selectedCategory === category ? 'background.default' : 'primary.main',
            }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </Box>

      <Grid container spacing={4}>
        {filteredArticles.map((article) => (
          <Grid item key={article.id} xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    boxShadow: '0 0 20px #00ff00',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={article.image}
                  alt={article.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" color="primary">
                    {article.title}
                  </Typography>
                  <Typography variant="subtitle2" color="primary.light" sx={{ mb: 1 }}>
                    {article.category}
                  </Typography>
                  <Typography color="text.secondary">
                    {article.summary}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Articles;
