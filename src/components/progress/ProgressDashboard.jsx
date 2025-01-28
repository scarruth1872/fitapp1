import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  Add as AddIcon,
  Edit as EditIcon,
  FitnessCenter,
  DirectionsRun,
  MonitorWeight,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    weight: [],
    workouts: [],
    measurements: [],
    goals: []
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({});

  // Fetch progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const weightQuery = query(
          collection(db, 'weightLogs'),
          where('userId', '==', currentUser.uid),
          orderBy('date', 'desc'),
          limit(30)
        );

        const workoutQuery = query(
          collection(db, 'workoutLogs'),
          where('userId', '==', currentUser.uid),
          orderBy('date', 'desc'),
          limit(30)
        );

        const measurementQuery = query(
          collection(db, 'measurements'),
          where('userId', '==', currentUser.uid),
          orderBy('date', 'desc'),
          limit(30)
        );

        const goalsQuery = query(
          collection(db, 'goals'),
          where('userId', '==', currentUser.uid),
          where('status', '==', 'active')
        );

        const [weightDocs, workoutDocs, measurementDocs, goalDocs] = await Promise.all([
          getDocs(weightQuery),
          getDocs(workoutQuery),
          getDocs(measurementQuery),
          getDocs(goalsQuery)
        ]);

        setProgressData({
          weight: weightDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          workouts: workoutDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          measurements: measurementDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })),
          goals: goalDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [currentUser]);

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setFormData({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
    setFormData({});
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        userId: currentUser.uid,
        date: new Date().toISOString()
      };

      let collectionName = '';
      switch (dialogType) {
        case 'weight':
          collectionName = 'weightLogs';
          break;
        case 'measurement':
          collectionName = 'measurements';
          break;
        case 'goal':
          collectionName = 'goals';
          data.status = 'active';
          data.progress = 0;
          break;
        default:
          return;
      }

      await addDoc(collection(db, collectionName), data);
      
      // Refresh data
      window.location.reload();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const getChartData = (type) => {
    const data = progressData[type];
    if (!data || data.length === 0) return null;

    const labels = data.map(item => format(new Date(item.date), 'MM/dd'));
    const values = data.map(item => item.value || item.weight || 0);

    return {
      labels: labels.reverse(),
      datasets: [
        {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          data: values.reverse(),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  const getWorkoutStats = () => {
    const workouts = progressData.workouts;
    if (!workouts || workouts.length === 0) return { total: 0, average: 0 };

    const total = workouts.length;
    const totalDuration = workouts.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const average = Math.round(totalDuration / total);

    return { total, average };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Goals Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Active Goals</Typography>
          <IconButton onClick={() => handleOpenDialog('goal')}>
            <AddIcon />
          </IconButton>
        </Box>
        <Timeline position="alternate">
          {progressData.goals.map((goal, index) => (
            <TimelineItem key={goal.id}>
              <TimelineSeparator>
                <TimelineDot color={goal.progress >= 100 ? "success" : "primary"} />
                {index < progressData.goals.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" component="span">
                  {goal.name}
                </Typography>
                <Typography>{goal.description}</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(goal.progress, 100)} 
                  sx={{ mt: 1 }}
                />
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FitnessCenter sx={{ mr: 1 }} />
                <Typography variant="h6">Workouts</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {getWorkoutStats().total}
              </Typography>
              <Typography color="text.secondary">
                Avg. {getWorkoutStats().average} min/session
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MonitorWeight sx={{ mr: 1 }} />
                <Typography variant="h6">Weight</Typography>
                <IconButton size="small" sx={{ ml: 'auto' }} onClick={() => handleOpenDialog('weight')}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {progressData.weight[0]?.weight || '-'} kg
              </Typography>
              <Typography color="text.secondary">
                Last updated: {progressData.weight[0] ? format(new Date(progressData.weight[0].date), 'MM/dd/yyyy') : '-'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TimelineIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Measurements</Typography>
                <IconButton size="small" sx={{ ml: 'auto' }} onClick={() => handleOpenDialog('measurement')}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {progressData.measurements.length}
              </Typography>
              <Typography color="text.secondary">
                Last updated: {progressData.measurements[0] ? format(new Date(progressData.measurements[0].date), 'MM/dd/yyyy') : '-'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Weight Progress</Typography>
            {getChartData('weight') ? (
              <Line data={getChartData('weight')} options={{ responsive: true }} />
            ) : (
              <Typography color="text.secondary">No weight data available</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Workout Frequency</Typography>
            {progressData.workouts.length > 0 ? (
              <Bar 
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [{
                    label: 'Workouts per Day',
                    data: [0, 0, 0, 0, 0, 0, 0].map((_, index) => 
                      progressData.workouts.filter(w => new Date(w.date).getDay() === index).length
                    ),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)'
                  }]
                }}
                options={{ responsive: true }}
              />
            ) : (
              <Typography color="text.secondary">No workout data available</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Input Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'weight' && 'Add Weight Entry'}
          {dialogType === 'measurement' && 'Add Measurements'}
          {dialogType === 'goal' && 'Add New Goal'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'weight' && (
            <TextField
              autoFocus
              margin="dense"
              name="weight"
              label="Weight (kg)"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleFormChange}
            />
          )}
          {dialogType === 'measurement' && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="chest"
                label="Chest (cm)"
                type="number"
                fullWidth
                variant="standard"
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="waist"
                label="Waist (cm)"
                type="number"
                fullWidth
                variant="standard"
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="hips"
                label="Hips (cm)"
                type="number"
                fullWidth
                variant="standard"
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="biceps"
                label="Biceps (cm)"
                type="number"
                fullWidth
                variant="standard"
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="thighs"
                label="Thighs (cm)"
                type="number"
                fullWidth
                variant="standard"
                onChange={handleFormChange}
              />
            </>
          )}
          {dialogType === 'goal' && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Goal Name"
                fullWidth
                variant="standard"
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                variant="standard"
                onChange={handleFormChange}
              />
              <TextField
                margin="dense"
                name="target"
                label="Target Value"
                type="number"
                fullWidth
                variant="standard"
                onChange={handleFormChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgressDashboard;
