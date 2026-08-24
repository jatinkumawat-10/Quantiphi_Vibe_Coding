import { RouterProvider } from 'react-router-dom';
import ThemeProvider from './theme/ThemeProvider.jsx';
import { AuthProvider } from './modules/auth/context/AuthContext.jsx';
import router from './router/routes.jsx';

/**
 * App Component
 * 
 * Root component that wraps the application with:
 * - ThemeProvider (Emotion theme)
 * - AuthProvider (authentication context)
 * - RouterProvider (React Router)
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
