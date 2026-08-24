import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../context/AuthContext.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

/**
 * RegisterPage Component
 * 
 * Registration page with form and link to login.
 * Redirects to login on successful registration.
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

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (username, password) => {
    setIsLoading(true);
    try {
      await register(username, password);
      navigate('/login');
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card>
        <Title>Create Account</Title>
        <Subtitle>Start tracking your subscriptions today</Subtitle>
        
        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        <Footer>
          <FooterText>
            Already have an account?{' '}
            <FooterLink to="/login" onClick={clearError}>
              Login
            </FooterLink>
          </FooterText>
        </Footer>
      </Card>
    </PageContainer>
  );
}
