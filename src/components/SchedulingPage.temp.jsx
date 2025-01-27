import React, { useState } from 'react';
import {
  Container,
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';

const availableServices = [
  {
    id: 'individual',
    name: 'Individual Counseling',
    duration: '50 minutes',
    description: 'One-on-one counseling session with a professional counselor',
    modalities: ['virtual', 'in-person']
  },
  {
    id: 'spiritual',
    name: 'Spiritual Counseling',
    duration: '50 minutes',
    description: 'Faith-based counseling and spiritual guidance',
    modalities: ['virtual', 'in-person']
  },
  {
    id: 'group',
    name: 'Group Therapy',
    duration: '90 minutes',
    description: 'Supportive group therapy sessions',
    modalities: ['virtual', 'in-person']
  }
];

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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Here you would typically make an API call to save the appointment
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess(true);
      // Reset form
      setSelectedService('');
      setSelectedModality('');
      setSelectedDate(null);
      setSelectedTime(null);
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
    } catch (err) {
      setError('Failed to schedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Service</InputLabel>
              <Select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                label="Service"
              >
                {availableServices.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name} ({service.duration})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Modality</InputLabel>
              <Select
                value={selectedModality}
                onChange={(e) => setSelectedModality(e.target.value)}
                label="Modality"
                disabled={!selectedService}
              >
                {selectedService && 
                  availableServices
                    .find(s => s.id === selectedService)
                    ?.modalities.map((modality) => (
                      <MenuItem key={modality} value={modality}>
                        {modality === 'virtual' ? 'Virtual Session' : 'In-Person Session'}
                      </MenuItem>
                    ))
                }
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth required />}
              disablePast
              disabled={!selectedModality}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TimePicker
              label="Time"
              value={selectedTime}
              onChange={(newValue) => setSelectedTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth required />}
              disabled={!selectedDate}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !selectedService || !selectedModality || !selectedDate || !selectedTime || !name || !email || !phone}
            >
              {loading ? <CircularProgress size={24} /> : 'Schedule Appointment'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Appointment scheduled successfully!
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default SchedulingPage;
