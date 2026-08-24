import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage.jsx';
import RegisterPage from '../modules/auth/pages/RegisterPage.jsx';
import DashboardPage from '../modules/subscriptions/pages/DashboardPage.jsx';
import ProtectedRoute from '../components/Layout/ProtectedRoute.jsx';

/**
 * Router Configuration
 * 
 * Defines all application routes with protection for authenticated routes.
 */

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
