import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';

const steps = ['Basic Information', 'Symptoms', 'Lifestyle', 'Results'];

const Diagnosis = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    symptoms: '',
    duration: '',
    sleepHours: '',
    exerciseFrequency: '',
    stressLevel: '',
    diet: '',
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Height (cm)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Weight (kg)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Describe your symptoms"
              name="symptoms"
              multiline
              rows={4}
              value={formData.symptoms}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="How long have you experienced these symptoms?"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Average hours of sleep per night"
              name="sleepHours"
              type="number"
              value={formData.sleepHours}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Exercise Frequency</FormLabel>
              <RadioGroup
                name="exerciseFrequency"
                value={formData.exerciseFrequency}
                onChange={handleInputChange}
              >
                <FormControlLabel value="never" control={<Radio />} label="Never" />
                <FormControlLabel value="occasionally" control={<Radio />} label="Occasionally" />
                <FormControlLabel value="regularly" control={<Radio />} label="Regularly" />
                <FormControlLabel value="daily" control={<Radio />} label="Daily" />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Stress Level</FormLabel>
              <RadioGroup
                name="stressLevel"
                value={formData.stressLevel}
                onChange={handleInputChange}
              >
                <FormControlLabel value="low" control={<Radio />} label="Low" />
                <FormControlLabel value="moderate" control={<Radio />} label="Moderate" />
                <FormControlLabel value="high" control={<Radio />} label="High" />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Describe your typical diet"
              name="diet"
              multiline
              rows={4}
              value={formData.diet}
              onChange={handleInputChange}
            />
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'primary.main' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Analysis Results
              </Typography>
              <Typography paragraph>
                Based on the information provided, here are our initial observations and recommendations:
              </Typography>
              {/* Add more detailed analysis based on the collected data */}
              <Typography paragraph>
                Please note that this is an initial assessment and not a medical diagnosis. 
                We recommend consulting with a healthcare professional for a complete evaluation.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {/* Handle scheduling consultation */}}
              >
                Schedule Consultation
              </Button>
            </Paper>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 4, color: 'primary.main' }}>
          Health Assessment
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper
          sx={{
            p: 3,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'primary.main',
          }}
        >
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Diagnosis;
