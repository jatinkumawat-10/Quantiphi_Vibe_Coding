import styled from '@emotion/styled';
import { useAuth } from '../../modules/auth/context/AuthContext.jsx';
import Button from '../Button.jsx';

/**
 * AppLayout Component
 * 
 * Main application layout with header and content area.
 * Shows user info and logout button in header.
 */

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: ${(props) => props.theme.colors.background.paper};
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[6]}`};
  position: sticky;
  top: 0;
  z-index: ${(props) => props.theme.zIndex.sticky};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: ${(props) => props.theme.typography.fontSize.xl};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  color: ${(props) => props.theme.colors.primary[600]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[4]};
`;

const Username = styled.span`
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  color: ${(props) => props.theme.colors.text.secondary};
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => `${props.theme.spacing[6]} ${props.theme.spacing[6]}`};
  width: 100%;
`;

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo>SubTracker</Logo>
          {user && (
            <UserInfo>
              <Username>Welcome, {user.username}</Username>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </UserInfo>
          )}
        </HeaderContent>
      </Header>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
