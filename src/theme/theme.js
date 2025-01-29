import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00',
      dark: '#003300',
      light: '#33ff33',
      contrastText: '#000000',
    },
    secondary: {
      main: '#00cc00',
      dark: '#006600',
      light: '#00ff00',
      contrastText: '#000000',
    },
    background: {
      default: '#001100',
      paper: '#002200',
    },
    text: {
      primary: '#00ff00',
      secondary: '#00cc00',
    },
    divider: '#004400',
  },
  typography: {
    fontFamily: 'monospace',
    h6: {
      fontWeight: 600,
      letterSpacing: 1,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: 0.5,
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    body1: {
      letterSpacing: 0.5,
    },
    body2: {
      letterSpacing: 0.25,
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#004400',
            },
            '&:hover fieldset': {
              borderColor: '#00ff00',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00ff00',
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#003300',
            '&:hover': {
              backgroundColor: '#004400',
            },
          },
        },
      },
    },
  },
});

export default theme;
