import * as yup from 'yup';

// Measurement validation schema
export const measurementSchema = yup.object().shape({
  date: yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  unit: yup.string().required('Unit is required').oneOf(['cm', 'in'], 'Invalid unit'),
  values: yup.object().shape({
    weight: yup.number().positive('Weight must be positive').required('Weight is required'),
    bodyFat: yup.number().min(0, 'Body fat must be positive').max(100, 'Body fat cannot exceed 100%'),
    chest: yup.number().positive('Chest measurement must be positive'),
    waist: yup.number().positive('Waist measurement must be positive'),
    hips: yup.number().positive('Hip measurement must be positive'),
    biceps: yup.number().positive('Bicep measurement must be positive'),
    thighs: yup.number().positive('Thigh measurement must be positive')
  }).required('Measurements are required')
});

// Workout log validation schema
export const workoutLogSchema = yup.object().shape({
  date: yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  type: yup.string().required('Workout type is required')
    .oneOf(['strength', 'cardio', 'hiit', 'flexibility'], 'Invalid workout type'),
  duration: yup.number().required('Duration is required')
    .positive('Duration must be positive')
    .max(480, 'Duration cannot exceed 8 hours'),
  exercises: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Exercise name is required'),
      sets: yup.array().of(
        yup.object().shape({
          weight: yup.number().min(0, 'Weight cannot be negative'),
          reps: yup.number().positive('Reps must be positive').max(1000, 'Too many reps'),
          unit: yup.string().required('Unit is required').oneOf(['kg', 'lbs'], 'Invalid unit')
        })
      ).min(1, 'At least one set is required')
    })
  ).min(1, 'At least one exercise is required'),
  notes: yup.string()
});

// Progress photo validation schema
export const progressPhotoSchema = yup.object().shape({
  date: yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  url: yup.string().required('Photo URL is required').url('Invalid URL'),
  notes: yup.string(),
  type: yup.string().oneOf(['front', 'back', 'side'], 'Invalid photo type')
});

// User profile validation schema
export const userProfileSchema = yup.object().shape({
  goals: yup.array().of(
    yup.string().oneOf([
      'strength',
      'muscle',
      'endurance',
      'weight-loss',
      'flexibility'
    ], 'Invalid goal')
  ).min(1, 'At least one goal is required'),
  preferences: yup.object().shape({
    workoutDuration: yup.number().required('Workout duration is required')
      .min(15, 'Workout must be at least 15 minutes')
      .max(180, 'Workout cannot exceed 3 hours'),
    daysPerWeek: yup.number().required('Days per week is required')
      .min(1, 'Must work out at least once per week')
      .max(7, 'Cannot exceed 7 days per week'),
    equipment: yup.string().required('Equipment access is required')
      .oneOf(['minimal', 'home', 'full'], 'Invalid equipment access')
  })
});

// Validation helper functions
export const validateMeasurement = async (data) => {
  try {
    await measurementSchema.validate(data, { abortEarly: false });
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errors: error.inner.reduce((acc, err) => ({
        ...acc,
        [err.path]: err.message
      }), {})
    };
  }
};

export const validateWorkoutLog = async (data) => {
  try {
    await workoutLogSchema.validate(data, { abortEarly: false });
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errors: error.inner.reduce((acc, err) => ({
        ...acc,
        [err.path]: err.message
      }), {})
    };
  }
};

export const validateProgressPhoto = async (data) => {
  try {
    await progressPhotoSchema.validate(data, { abortEarly: false });
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errors: error.inner.reduce((acc, err) => ({
        ...acc,
        [err.path]: err.message
      }), {})
    };
  }
};

export const validateUserProfile = async (data) => {
  try {
    await userProfileSchema.validate(data, { abortEarly: false });
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errors: error.inner.reduce((acc, err) => ({
        ...acc,
        [err.path]: err.message
      }), {})
    };
  }
};
