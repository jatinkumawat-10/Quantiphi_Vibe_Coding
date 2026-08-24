import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../modules/auth/context/AuthContext.jsx';
import styled from '@emotion/styled';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects to /login if user is not authenticated.
 * Shows loading state while checking auth status.
 */

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background.default};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${(props) => props.theme.colors.grey[200]};
  border-top-color: ${(props) => props.theme.colors.primary[600]};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
