import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const plans = {
  monthly: [
    {
      title: 'Basic',
      price: 29,
      features: [
        'Access to Articles',
        'Basic Health Assessment',
        'Community Forum Access',
        'Email Support',
      ],
      recommended: false,
    },
    {
      title: 'Pro',
      price: 79,
      features: [
        'Everything in Basic',
        'Personal Training Sessions',
        'Nutrition Consultation',
        'Priority Support',
        'Progress Tracking',
      ],
      recommended: true,
    },
    {
      title: 'Elite',
      price: 149,
      features: [
        'Everything in Pro',
        'Weekly Counseling Sessions',
        'Custom Meal Plans',
        '24/7 Support',
        'Advanced Analytics',
        'Personal Health Coach',
      ],
      recommended: false,
    },
  ],
  annual: [
    {
      title: 'Basic',
      price: 24,
      features: [
        'Access to Articles',
        'Basic Health Assessment',
        'Community Forum Access',
        'Email Support',
      ],
      recommended: false,
    },
    {
      title: 'Pro',
      price: 65,
      features: [
        'Everything in Basic',
        'Personal Training Sessions',
        'Nutrition Consultation',
        'Priority Support',
        'Progress Tracking',
      ],
      recommended: true,
    },
    {
      title: 'Elite',
      price: 125,
      features: [
        'Everything in Pro',
        'Weekly Counseling Sessions',
        'Custom Meal Plans',
        '24/7 Support',
        'Advanced Analytics',
        'Personal Health Coach',
      ],
      recommended: false,
    },
  ],
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const handleBillingChange = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          component="h1"
          variant="h3"
          align="center"
          sx={{ mb: 4, color: 'primary.main' }}
        >
          Membership Plans
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 6,
          }}
        >
          <Typography color="primary">Monthly</Typography>
          <Switch
            checked={isAnnual}
            onChange={handleBillingChange}
            color="primary"
            sx={{ mx: 2 }}
          />
          <Typography color="primary">
            Annual
            <Typography
              component="span"
              variant="caption"
              sx={{ ml: 1, color: 'primary.light' }}
            >
              (Save up to 20%)
            </Typography>
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {plans[isAnnual ? 'annual' : 'monthly'].map((plan, index) => (
            <Grid item key={plan.title} xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ height: '100%' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: plan.recommended ? 'primary.main' : 'divider',
                    '&:hover': {
                      boxShadow: '0 0 20px #00ff00',
                    },
                  }}
                >
                  {plan.recommended && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: -30,
                        transform: 'rotate(45deg)',
                        backgroundColor: 'primary.main',
                        color: 'background.paper',
                        padding: '4px 30px',
                      }}
                    >
                      Recommended
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="h2"
                      color="primary"
                      align="center"
                    >
                      {plan.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        mb: 4,
                      }}
                    >
                      <Typography
                        component="h3"
                        variant="h3"
                        color="primary"
                      >
                        ${plan.price}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary.light"
                        sx={{ ml: 1 }}
                      >
                        /mo
                      </Typography>
                    </Box>
                    <List>
                      {plan.features.map((feature) => (
                        <ListItem key={feature} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <CheckIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            sx={{ color: 'text.primary' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant={plan.recommended ? 'contained' : 'outlined'}
                      size="large"
                      sx={{
                        py: 1.5,
                        backgroundColor: plan.recommended ? 'primary.main' : 'transparent',
                        '&:hover': {
                          backgroundColor: plan.recommended ? 'primary.dark' : 'rgba(0, 255, 0, 0.1)',
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="primary.light" gutterBottom>
            Need a custom plan?
          </Typography>
          <Button
            variant="outlined"
            size="large"
            sx={{
              mt: 2,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.light',
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
              },
            }}
          >
            Contact Us
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Pricing;
