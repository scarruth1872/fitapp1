import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    gold: {
      main: '#FFD700',
      light: '#FFE55C',
      dark: '#FFC000',
      contrastText: '#000',
    },
    silver: {
      main: '#C0C0C0',
      light: '#E0E0E0',
      dark: '#A0A0A0',
      contrastText: '#000',
    },
    bronze: {
      main: '#CD7F32',
      light: '#DDA15E',
      dark: '#BC6C25',
      contrastText: '#000',
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

export default theme;
