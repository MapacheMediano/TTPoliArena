// src/theme/theme.ts
'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7B1E3B',      // Guinda IPN
      light: '#A23A5C',
      dark: '#5A0F28',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D4A84B',      // Dorado acento
      light: '#E0C078',
      dark: '#B08930',
    },
    background: {
      default: '#1A0A10',   // Fondo oscuro con tinte guinda
      paper: '#2A1520',     // Tarjetas/superficies
    },
    text: {
      primary: '#F5F0F2',
      secondary: '#C4B0B8',
    },
    error: {
      main: '#FF6B6B',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7B1E3B 0%, #A23A5C 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5A0F28 0%, #7B1E3B 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.05)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7B1E3B',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#A23A5C',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;