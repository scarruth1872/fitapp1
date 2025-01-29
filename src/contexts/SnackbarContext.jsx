import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'error' | 'warning' | 'info' | 'success'
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const value = {
    showSnackbar,
    hideSnackbar,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            bgcolor: theme => {
              switch (snackbar.severity) {
                case 'error':
                  return theme.palette.error.main;
                case 'warning':
                  return theme.palette.warning.main;
                case 'success':
                  return theme.palette.success.main;
                default:
                  return theme.palette.info.main;
              }
            },
            color: theme => {
              switch (snackbar.severity) {
                case 'error':
                  return theme.palette.error.contrastText;
                case 'warning':
                  return theme.palette.warning.contrastText;
                case 'success':
                  return theme.palette.success.contrastText;
                default:
                  return theme.palette.info.contrastText;
              }
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
