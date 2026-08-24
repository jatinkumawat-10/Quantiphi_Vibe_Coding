import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../context/AuthContext.jsx';
import LoginForm from '../components/LoginForm.jsx';

/**
 * LoginPage Component
 * 
 * Login page with form and link to register.
 * Redirects to dashboard on successful login.
 */

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing[6]};
  background-color: ${(props) => props.theme.colors.background.default};
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: ${(props) => props.theme.colors.background.paper};
  border-radius: ${(props) => props.theme.radii.xl};
  box-shadow: ${(props) => props.theme.shadows.lg};
  padding: ${(props) => props.theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize['2xl']};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const Subtitle = styled.p`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing[6]};
`;

const Footer = styled.div`
  text-align: center;
  margin-top: ${(props) => props.theme.spacing[6]};
`;

const FooterText = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const FooterLink = styled(Link)`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.primary[600]};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};

  &:hover {
    color: ${(props) => props.theme.colors.primary[700]};
  }
`;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (username, password) => {
    setIsLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to track your subscriptions</Subtitle>
        
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        <Footer>
          <FooterText>
            Don't have an account?{' '}
            <FooterLink to="/register" onClick={clearError}>
              Register
            </FooterLink>
          </FooterText>
        </Footer>
      </Card>
    </PageContainer>
  );
}
