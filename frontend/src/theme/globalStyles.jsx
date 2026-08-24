import { Global, css } from '@emotion/react';

/**
 * Global Styles
 * 
 * CSS resets, base font, and box-sizing applied once at the app root.
 * Uses Emotion's Global component for theme-aware global styles.
 */
export default function GlobalStyles() {
  return (
    <Global
      styles={(theme) => css`
        /* CSS Reset */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          font-size: 16px;
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.base};
          line-height: ${theme.typography.lineHeight.normal};
          color: ${theme.colors.text.primary};
          background-color: ${theme.colors.background.default};
          min-height: 100vh;
        }

        #root {
          min-height: 100vh;
        }

        /* Links */
        a {
          color: ${theme.colors.link};
          text-decoration: none;
          transition: color ${theme.transitions.fast};
        }

        a:hover {
          color: ${theme.colors.linkHover};
        }

        /* Images */
        img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        /* Lists */
        ul,
        ol {
          list-style: none;
        }

        /* Forms */
        input,
        button,
        textarea,
        select {
          font: inherit;
          color: inherit;
        }

        button {
          cursor: pointer;
          border: none;
          background: none;
        }

        /* Tables */
        table {
          border-collapse: collapse;
          border-spacing: 0;
        }

        /* Focus styles for accessibility */
        :focus-visible {
          outline: 2px solid ${theme.colors.primary[500]};
          outline-offset: 2px;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme.colors.grey[100]};
        }

        ::-webkit-scrollbar-thumb {
          background: ${theme.colors.grey[400]};
          border-radius: ${theme.radii.full};
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.grey[500]};
        }
      `}
    />
  );
}
