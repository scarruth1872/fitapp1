import React from 'react';
import { Container, Box, Paper, Typography, Grid, Avatar, Card, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import CounselingAgent from '../components/CounselingAgent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import HealingIcon from '@mui/icons-material/Healing';
import MeditationIcon from '@mui/icons-material/SelfImprovement';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import placeholderImage from '../assets/images/placeholder-counselor.svg';

// Placeholder image until we have the actual photo
const counselorImage = placeholderImage;

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(25),
  height: theme.spacing(25),
  margin: 'auto',
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[3]
}));

const CounselingSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  '& .MuiTypography-h4': {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 600
  }
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const ContactButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 3),
  borderRadius: 25
}));

const Counseling = () => {
  const specialties = [
    { icon: <HealingIcon color="primary" />, text: "Holistic Health & Wellness" },
    { icon: <MeditationIcon color="primary" />, text: "Mind-Body-Spirit Integration" },
    { icon: <StarIcon color="primary" />, text: "Spiritual Growth & Development" },
    { icon: <FavoriteIcon color="primary" />, text: "Emotional Healing & Balance" },
    { icon: <CheckCircleIcon color="primary" />, text: "Personal Transformation" }
  ];

  const education = [
    "Master's in Clinical Social Work",
    "Licensed Clinical Social Worker (LCSW)",
    "Certified Holistic Health Practitioner",
    "Advanced Training in Spiritual Counseling",
    "Quantum Healing Certification"
  ];

  const handleContact = (type) => {
    switch(type) {
      case 'email':
        window.location.href = 'mailto:shonna@inspired-fitness.com';
        break;
      case 'phone':
        window.location.href = 'tel:+1234567890';
        break;
      default:
        break;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Counselor Profile Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <StyledAvatar alt="Shonna Carruth" src={counselorImage} />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Shonna Carruth, LCSW
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Holistic Wellness Counselor & Spiritual Guide
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Dedicated to guiding individuals on their journey of healing and transformation through an integrative approach that honors the mind, body, and spirit connection. With over a decade of experience in holistic wellness and clinical social work, I combine traditional therapeutic methods with spiritual wisdom to support your complete well-being.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <ContactButton
                    variant="contained"
                    color="primary"
                    startIcon={<EmailIcon />}
                    onClick={() => handleContact('email')}
                  >
                    Email Me
                  </ContactButton>
                  <ContactButton
                    variant="outlined"
                    color="primary"
                    startIcon={<PhoneIcon />}
                    onClick={() => handleContact('phone')}
                  >
                    Schedule a Call
                  </ContactButton>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Specialties Section */}
        <Grid item xs={12} md={6}>
          <CounselingSection>
            <Typography variant="h4">Areas of Expertise</Typography>
            <List>
              {specialties.map((specialty, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {specialty.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={specialty.text}
                  />
                </ListItem>
              ))}
            </List>
          </CounselingSection>
        </Grid>

        {/* Education Section */}
        <Grid item xs={12} md={6}>
          <CounselingSection>
            <Typography variant="h4">Education & Certifications</Typography>
            <List>
              {education.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <SchoolIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CounselingSection>
        </Grid>

        {/* Services Grid */}
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mb: 3 }}>Services Offered</Typography>
          <Grid container spacing={3}>
            {[
              {
                title: "Individual Counseling",
                description: "One-on-one sessions focused on personal growth, emotional healing, and spiritual development. Together we'll explore your unique path to wellness and create a personalized plan for transformation."
              },
              {
                title: "Holistic Wellness",
                description: "Integrated approach addressing physical, mental, emotional, and spiritual well-being. Learn practical tools and techniques for maintaining balance in all aspects of your life."
              },
              {
                title: "Spiritual Guidance",
                description: "Support in exploring your spiritual path, understanding life purpose, and deepening consciousness. Connect with your higher self and discover the wisdom within."
              },
              {
                title: "Energy Healing",
                description: "Quantum healing techniques and energy work for deep transformation and balance. Experience profound healing through advanced energy modalities and spiritual practices."
              }
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ServiceCard elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2">
                      {service.description}
                    </Typography>
                  </CardContent>
                </ServiceCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Location & Hours */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Location & Hours
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Office Location"
                      secondary="123 Wellness Way, Suite 100, Anytown, USA"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Office Hours"
                      secondary="Monday - Friday: 9:00 AM - 6:00 PM"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  Virtual sessions are available for clients who prefer online counseling. All sessions are conducted in a safe, confidential, and supportive environment.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => handleContact('schedule')}
                >
                  Schedule a Free Consultation
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Counseling Agent Section */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '600px',
              backgroundColor: 'background.default',
              overflow: 'hidden',
              mt: 4
            }}
          >
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Virtual Wellness Assistant
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Experience our AI-powered wellness assistant, integrating spiritual wisdom with professional counseling approaches. Available 24/7 to provide guidance and support on your wellness journey.
              </Typography>
            </Box>
            <CounselingAgent />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Counseling;
