import { useState } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Tabs,
  Tab,
  Dialog
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimelineIcon from '@mui/icons-material/Timeline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SaveIcon from '@mui/icons-material/Save';
import { motion } from 'framer-motion';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutList from '../components/WorkoutList';
import WorkoutStats from '../components/WorkoutStats';
import ProgressCharts from '../components/ProgressCharts';
import ExerciseLibrary from '../components/ExerciseLibrary';
import WorkoutTemplates from '../components/WorkoutTemplates';

function Training() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
              Training Dashboard
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowWorkoutForm(true)}
              sx={{ backgroundColor: 'primary.main' }}
            >
              Log Workout
            </Button>
          </Box>

          <WorkoutStats />

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={selectedTab} 
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab icon={<TimelineIcon />} label="Progress" />
              <Tab icon={<FitnessCenterIcon />} label="History" />
              <Tab icon={<MenuBookIcon />} label="Exercise Library" />
              <Tab icon={<SaveIcon />} label="Templates" />
            </Tabs>
          </Box>

          {selectedTab === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ProgressCharts />
            </motion.div>
          )}

          {selectedTab === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <WorkoutList />
            </motion.div>
          )}

          {selectedTab === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ExerciseLibrary />
            </motion.div>
          )}

          {selectedTab === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <WorkoutTemplates />
            </motion.div>
          )}
        </motion.div>
      </Box>

      <Dialog 
        open={showWorkoutForm} 
        onClose={() => setShowWorkoutForm(false)}
        maxWidth="md"
        fullWidth
      >
        <WorkoutForm 
          open={showWorkoutForm} 
          onClose={() => setShowWorkoutForm(false)} 
        />
      </Dialog>
    </Container>
  );
}

export default Training;
