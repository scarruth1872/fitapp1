import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
  }
}));

const availableServices = [
  {
    id: 'individual',
    name: 'Individual Counseling',
    duration: '50 minutes',
    description: 'One-on-one counseling session with Shonna Carruth',
    modalities: ['virtual', 'in-person']
  },
  {
    id: 'spiritual',
    name: 'Spiritual Guidance',
    duration: '60 minutes',
    description: 'Spiritual counseling and energy healing session',
    modalities: ['in-person']
  },
  {
    id: 'crisis',
    name: 'Crisis Support',
    duration: '30 minutes',
    description: 'Immediate support for urgent situations',
    modalities: ['virtual']
  }
];

const businessHours = {
  1: { // Monday
    start: '09:00',
    end: '17:00',
    breaks: [{ start: '12:00', end: '13:00' }]
  },
  2: { // Tuesday
    start: '09:00',
    end: '17:00',
    breaks: [{ start: '12:00', end: '13:00' }]
  },
  3: { // Wednesday
    start: '09:00',
    end: '17:00',
    breaks: [{ start: '12:00', end: '13:00' }]
  },
  4: { // Thursday
    start: '09:00',
    end: '17:00',
    breaks: [{ start: '12:00', end: '13:00' }]
  },
  5: { // Friday
    start: '09:00',
    end: '17:00',
    breaks: [{ start: '12:00', end: '13:00' }]
  }
};

const SchedulingPage = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    setSelectedModality(''); // Reset modality when service changes
  };

  const getAvailableModalities = () => {
    const service = availableServices.find(s => s.id === selectedService);
    return service ? service.modalities : [];
  };

  const isTimeSlotAvailable = (date, time) => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return false; // Weekend

    const hours = businessHours[dayOfWeek];
    if (!hours) return false;

    const timeStr = format(time, 'HH:mm');
    return timeStr >= hours.start && timeStr <= hours.end &&
           !hours.breaks.some(break_ => 
             timeStr >= break_.start && timeStr <= break_.end);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Here you would typically make an API call to save the appointment
      const appointment = {
        service: selectedService,
        modality: selectedModality,
        date: selectedDate,
        time: selectedTime,
        name,
        email,
        phone,
        notes
      };

      console.log('Scheduling appointment:', appointment);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSnackbar({
        open: true,
        message: 'Appointment scheduled successfully!',
        severity: 'success'
      });

      // Reset form
      setSelectedService('');
      setSelectedModality('');
      setSelectedDate(null);
      setSelectedTime(null);
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      setSnackbar({
        open: true,
        message: 'Error scheduling appointment. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Schedule an Appointment
        </Typography>
        
        <StyledPaper>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Service Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Service</InputLabel>
                  <Select
                    value={selectedService}
                    onChange={handleServiceChange}
                    label="Service"
                    required
                  >
                    {availableServices.map(service => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name} ({service.duration})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Modality Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Modality</InputLabel>
                  <Select
                    value={selectedModality}
                    onChange={(e) => setSelectedModality(e.target.value)}
                    label="Modality"
                    required
                    disabled={!selectedService}
                  >
                    {getAvailableModalities().map(modality => (
                      <MenuItem key={modality} value={modality}>
                        {modality.charAt(0).toUpperCase() + modality.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Selection */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disablePast
                  shouldDisableDate={(date) => 
                    date.getDay() === 0 || date.getDay() === 6
                  }
                />
              </Grid>

              {/* Time Selection */}
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Time"
                  value={selectedTime}
                  onChange={setSelectedTime}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disabled={!selectedDate}
                  shouldDisableTime={(time) => 
                    selectedDate && !isTimeSlotAvailable(selectedDate, time)
                  }
                />
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedService('');
                      setSelectedModality('');
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setNotes('');
                    }}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !selectedService || !selectedModality || !selectedDate || !selectedTime || !name || !email || !phone}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Schedule Appointment'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default SchedulingPage;
