import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const defaultMeasurements = {
  weight: '',
  bodyFat: '',
  chest: '',
  waist: '',
  hips: '',
  biceps: '',
  thighs: ''
};

const MeasurementForm = ({ initialData, onSubmit }) => {
  const [measurements, setMeasurements] = useState(initialData?.values || defaultMeasurements);
  const [unit, setUnit] = useState(initialData?.unit || 'cm');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [customFields, setCustomFields] = useState(
    Object.keys(initialData?.values || {})
      .filter(key => !Object.keys(defaultMeasurements).includes(key))
  );

  const handleMeasurementChange = (field) => (event) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAddCustomField = () => {
    const newField = `custom${customFields.length + 1}`;
    setCustomFields(prev => [...prev, newField]);
    setMeasurements(prev => ({
      ...prev,
      [newField]: ''
    }));
  };

  const handleRemoveCustomField = (field) => {
    setCustomFields(prev => prev.filter(f => f !== field));
    setMeasurements(prev => {
      const { [field]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      date,
      unit,
      values: measurements
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Unit</InputLabel>
            <Select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              label="Unit"
            >
              <MenuItem value="cm">Centimeters (cm)</MenuItem>
              <MenuItem value="in">Inches (in)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Default measurements */}
        {Object.keys(defaultMeasurements).map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <TextField
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type="number"
              value={measurements[field]}
              onChange={handleMeasurementChange(field)}
              InputProps={{
                endAdornment: field === 'weight' ? 'kg' : unit
              }}
            />
          </Grid>
        ))}

        {/* Custom measurements */}
        {customFields.map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label={`Custom Measurement ${field.replace('custom', '')}`}
                type="number"
                value={measurements[field]}
                onChange={handleMeasurementChange(field)}
                InputProps={{
                  endAdornment: unit
                }}
              />
              <IconButton
                color="error"
                onClick={() => handleRemoveCustomField(field)}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddCustomField}
            sx={{ mt: 1 }}
          >
            Add Custom Measurement
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button type="submit" variant="contained">
              Save Measurements
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MeasurementForm;
