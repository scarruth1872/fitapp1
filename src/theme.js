import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00', // Matrix green
      light: '#33ff33',
      dark: '#00cc00',
      contrastText: '#000',
    },
    secondary: {
      main: '#003300', // Darker green
      light: '#004d00',
      dark: '#001a00',
      contrastText: '#fff',
    },
    background: {
      default: '#000000',
      paper: '#001a00',
    },
    text: {
      primary: '#00ff00',
      secondary: '#00cc00',
    },
  },
  typography: {
    fontFamily: '"Courier New", Courier, monospace',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.2rem',
      color: '#00ff00',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0.15rem',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0.1rem',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.05rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: '#004d00',
            boxShadow: '0 0 10px #00ff00',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 26, 0, 0.9)',
          borderRadius: 0,
          border: '1px solid #00ff00',
        },
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
});
