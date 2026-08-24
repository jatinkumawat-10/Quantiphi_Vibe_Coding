import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import theme from './theme.js';
import GlobalStyles from './globalStyles.jsx';

/**
 * Theme Provider
 * 
 * Wraps the application with Emotion's ThemeProvider and GlobalStyles.
 * Makes the theme accessible via `props.theme` in styled components
 * or `useTheme()` hook in any component.
 */
export default function ThemeProvider({ children }) {
  return (
    <EmotionThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </EmotionThemeProvider>
  );
}
