/**
 * Color Design Tokens
 * 
 * Single source of truth for all color values.
 * Semantic aliases are defined in theme.js for context-specific usage.
 */
export const colors = {
  // Primary palette
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },

  // Neutral palette
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic colors
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },

  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },

  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
  },

  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },

  // Background
  background: {
    default: '#fafafa',
    paper: '#ffffff',
    dark: '#121212',
  },

  // Text
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9e9e9e',
    inverse: '#ffffff',
  },

  // Border
  border: {
    light: '#e0e0e0',
    main: '#bdbdbd',
    dark: '#757575',
  },
};
