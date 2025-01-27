import { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  useTheme
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { TemplateProvider } from '../contexts/TemplateContext';
import TemplateList from '../components/TemplateList';

const Templates = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    {
      value: 'personal',
      label: 'My Templates',
      icon: <FitnessCenterIcon />
    },
    {
      value: 'public',
      label: 'Browse Templates',
      icon: <PublicIcon />
    }
  ];

  return (
    <TemplateProvider>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Workout Templates
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Create and share your workout templates with the community.
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontSize: '1rem'
                  }
                }}
              >
                {tabs.map(tab => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {tab.icon}
                        <span>{tab.label}</span>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </Box>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TemplateList mode={activeTab} />
            </motion.div>
          </Box>
        </Container>
      </Box>
    </TemplateProvider>
  );
};

export default Templates;
