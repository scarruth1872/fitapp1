import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  Tab,
  Tabs,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  FitnessCenter,
  Timer,
  CalendarToday
} from '@mui/icons-material';
import { useWorkoutProgram } from '../../contexts/WorkoutProgramContext';
import WorkoutProgramBuilder from './WorkoutProgramBuilder';

const WorkoutProgramManager = () => {
  const {
    programs,
    templates,
    loading,
    error,
    deleteProgram,
    shareAsTemplate,
    useTemplate
  } = useWorkoutProgram();

  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [dialogType, setDialogType] = useState('');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (type, program = null) => {
    setDialogType(type);
    setSelectedProgram(program);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgram(null);
    setDialogType('');
  };

  const handleDeleteProgram = async (programId) => {
    try {
      await deleteProgram(programId);
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const handleShareAsTemplate = async (programId) => {
    try {
      await shareAsTemplate(programId);
      handleCloseDialog();
    } catch (error) {
      console.error('Error sharing program:', error);
    }
  };

  const handleUseTemplate = async (templateId) => {
    try {
      await useTemplate(templateId);
      handleCloseDialog();
    } catch (error) {
      console.error('Error using template:', error);
    }
  };

  const renderProgramCard = (program, isTemplate = false) => (
    <Grid item xs={12} sm={6} md={4} key={program.id}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {program.name}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {program.description}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<FitnessCenter />}
              label={program.difficulty}
              size="small"
            />
            <Chip
              icon={<Timer />}
              label={`${program.duration} weeks`}
              size="small"
            />
            <Chip
              icon={<CalendarToday />}
              label={`${program.workouts.length} workouts`}
              size="small"
            />
          </Box>
        </CardContent>
        <CardActions>
          {!isTemplate ? (
            <>
              <Tooltip title="Edit Program">
                <IconButton 
                  onClick={() => handleOpenDialog('edit', program)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share as Template">
                <IconButton
                  onClick={() => handleShareAsTemplate(program.id)}
                  size="small"
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Program">
                <IconButton
                  onClick={() => handleOpenDialog('delete', program)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Use Template">
              <IconButton
                onClick={() => handleUseTemplate(program.id)}
                size="small"
                color="primary"
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading workout programs: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="My Programs" />
          <Tab label="Templates" />
          <Tab label="Create New" />
        </Tabs>
      </Box>

      {selectedTab === 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            My Workout Programs
          </Typography>
          <Grid container spacing={3}>
            {programs.length > 0 ? (
              programs.map(program => renderProgramCard(program))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    You haven't created any workout programs yet.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedTab(2)}
                    sx={{ mt: 2 }}
                  >
                    Create Your First Program
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}

      {selectedTab === 1 && (
        <>
          <Typography variant="h5" gutterBottom>
            Program Templates
          </Typography>
          <Grid container spacing={3}>
            {templates.length > 0 ? (
              templates.map(template => renderProgramCard(template, true))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No templates available yet.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}

      {selectedTab === 2 && (
        <WorkoutProgramBuilder />
      )}

      {/* Confirmation Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {dialogType === 'delete' && (
          <>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete "{selectedProgram?.name}"? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={() => handleDeleteProgram(selectedProgram.id)}
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default WorkoutProgramManager;
