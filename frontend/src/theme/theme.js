import { colors } from './tokens/colors.js';
import { spacing } from './tokens/spacing.js';
import { typography } from './tokens/typography.js';

/**
 * Main Emotion Theme Object
 * 
 * Composes design tokens into a single consumable theme.
 * Access via `props.theme` in styled components or `useTheme()` hook.
 */
const theme = {
  // Colors with semantic aliases
  colors: {
    ...colors,
    // Semantic aliases for easier usage
    warningAmber: colors.warning.main,
    mutedGrey: colors.grey[400],
    activeGreen: colors.success.main,
    pausedGrey: colors.grey[300],
    link: colors.primary[600],
    linkHover: colors.primary[700],
    border: colors.border.light,
    inputBorder: colors.border.main,
    inputFocus: colors.primary[500],
  },

  // Spacing scale
  spacing,

  // Typography
  typography: {
    ...typography,
    h1: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
    },
    h2: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
    },
    h3: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
    },
    h4: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
    },
    body: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
    },
    bodySmall: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
    },
    caption: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
    },
    button: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
      textTransform: 'uppercase',
    },
  },

  // Border radius
  radii: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },

  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },
};

export default theme;
