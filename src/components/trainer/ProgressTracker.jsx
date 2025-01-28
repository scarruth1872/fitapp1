import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tabs,
  Tab,
  useTheme
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  AddAPhoto as AddPhotoIcon,
  PhotoCamera as PhotoIcon,
  FitnessCenter,
  Timeline,
  PhotoLibrary
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { db, storage } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProgressTracker = ({ userProfile, progress, onProgressUpdate }) => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [measurements, setMeasurements] = useState(progress?.measurements || []);
  const [workoutLogs, setWorkoutLogs] = useState(progress?.workoutLogs || []);
  const [progressPhotos, setProgressPhotos] = useState(progress?.photos || []);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleSaveMeasurement = async (measurement) => {
    try {
      const newMeasurements = editingItem
        ? measurements.map(m => m.id === editingItem.id ? measurement : m)
        : [...measurements, { ...measurement, id: Date.now().toString() }];

      await updateDoc(doc(db, 'users', currentUser.uid), {
        'progress.measurements': newMeasurements
      });

      setMeasurements(newMeasurements);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving measurement:', error);
    }
  };

  const handleSaveWorkoutLog = async (log) => {
    try {
      const newLogs = editingItem
        ? workoutLogs.map(l => l.id === editingItem.id ? log : l)
        : [...workoutLogs, { ...log, id: Date.now().toString() }];

      await updateDoc(doc(db, 'users', currentUser.uid), {
        'progress.workoutLogs': newLogs
      });

      setWorkoutLogs(newLogs);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving workout log:', error);
    }
  };

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `progress-photos/${currentUser.uid}/${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const newPhoto = {
        id: Date.now().toString(),
        url,
        date: new Date().toISOString(),
        notes: ''
      };

      const newPhotos = [...progressPhotos, newPhoto];

      await updateDoc(doc(db, 'users', currentUser.uid), {
        'progress.photos': newPhotos
      });

      setProgressPhotos(newPhotos);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const renderMeasurementsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Body Measurements</Typography>
        <Button
          startIcon={<AddPhotoIcon />}
          variant="contained"
          onClick={() => handleOpenDialog('measurement')}
        >
          Add Measurement
        </Button>
      </Box>

      <Grid container spacing={2}>
        {measurements.map((measurement) => (
          <Grid item xs={12} sm={6} md={4} key={measurement.id}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {new Date(measurement.date).toLocaleDateString()}
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(measurement.values).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Typography variant="body2" color="textSecondary">
                        {key}:
                      </Typography>
                      <Typography>
                        {value} {measurement.unit}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog('measurement', measurement)}
                >
                  <AddPhotoIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteMeasurement(measurement)}
                >
                  <AddPhotoIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderWorkoutLogsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Workout Logs</Typography>
        <Button
          startIcon={<AddPhotoIcon />}
          variant="contained"
          onClick={() => handleOpenDialog('workout')}
        >
          Log Workout
        </Button>
      </Box>

      <Grid container spacing={2}>
        {workoutLogs.map((log) => (
          <Grid item xs={12} key={log.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {new Date(log.date).toLocaleDateString()} - {log.type}
                </Typography>
                <Grid container spacing={2}>
                  {log.exercises.map((exercise, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Typography variant="subtitle1">
                        {exercise.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {exercise.sets.map((set, i) => (
                          `Set ${i + 1}: ${set.weight}${set.unit} × ${set.reps}`
                        )).join(', ')}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
                {log.notes && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Notes: {log.notes}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog('workout', log)}
                >
                  <AddPhotoIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteWorkoutLog(log)}
                >
                  <AddPhotoIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderProgressPhotosTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Progress Photos</Typography>
        <Button
          component="label"
          startIcon={<PhotoIcon />}
          variant="contained"
        >
          Upload Photo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleUploadPhoto}
          />
        </Button>
      </Box>

      <Grid container spacing={2}>
        {progressPhotos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Card>
              <CardContent>
                <img
                  src={photo.url}
                  alt={`Progress photo from ${new Date(photo.date).toLocaleDateString()}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {new Date(photo.date).toLocaleDateString()}
                </Typography>
                {photo.notes && (
                  <Typography variant="body2" color="textSecondary">
                    {photo.notes}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleDeletePhoto(photo)}
                >
                  <AddPhotoIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper 
        sx={{ 
          width: '100%',
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.primary.main}`,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Tab 
            icon={<FitnessCenter />} 
            label="Workout Logs" 
            sx={{ 
              '&.MuiTab-root': { 
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem',
              } 
            }} 
          />
          <Tab 
            icon={<Timeline />} 
            label="Measurements" 
            sx={{ 
              '&.MuiTab-root': { 
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem',
              } 
            }} 
          />
          <Tab 
            icon={<PhotoLibrary />} 
            label="Progress Photos" 
            sx={{ 
              '&.MuiTab-root': { 
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem',
              } 
            }} 
          />
        </Tabs>
      </Paper>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ height: '100%' }}
            >
              {activeTab === 0 && renderWorkoutLogsTab()}
              {activeTab === 1 && renderMeasurementsTab()}
              {activeTab === 2 && renderProgressPhotosTab()}
            </motion.div>
          </AnimatePresence>
        )}
      </Box>

      {/* Add Button */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog(
            activeTab === 0 ? 'workout' : 
            activeTab === 1 ? 'measurement' : 
            'photo'
          )}
          startIcon={activeTab === 2 ? <AddPhotoIcon /> : null}
          sx={{
            borderRadius: '28px',
            textTransform: 'none',
            px: 3,
            py: 1,
          }}
        >
          Add {activeTab === 0 ? 'Workout' : activeTab === 1 ? 'Measurement' : 'Photo'}
        </Button>
      </Box>

      {/* Dialogs for adding/editing items */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'workout' ? 'Add Workout Log' :
           dialogType === 'measurement' ? 'Add Measurement' :
           'Add Progress Photo'}
        </DialogTitle>
        <DialogContent>
          {/* Dialog content based on type */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgressTracker;
