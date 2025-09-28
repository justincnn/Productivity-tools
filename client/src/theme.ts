import { createTheme } from '@mui/material/styles';

// DHL Express color palette
const dhlColors = {
  primary: '#FFCC00', // Yellow
  secondary: '#D40511', // Red
  text: '#333333',
  background: '#FFFFFF',
  darkText: '#FFFFFF',
  darkBackground: '#121212',
  darkSurface: '#1E1E1E',
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: dhlColors.primary,
    },
    secondary: {
      main: dhlColors.secondary,
    },
    background: {
      default: dhlColors.background,
      paper: '#F5F5F5',
    },
    text: {
      primary: dhlColors.text,
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: dhlColors.primary,
    },
    secondary: {
      main: dhlColors.secondary,
    },
    background: {
      default: dhlColors.darkBackground,
      paper: dhlColors.darkSurface,
    },
    text: {
      primary: dhlColors.darkText,
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
});
