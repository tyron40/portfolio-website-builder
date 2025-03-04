import React from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { AuthForm } from '../components/auth/AuthForm';
import { Briefcase } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f9fafb;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  margin-right: 0.75rem;
`;

const AuthPage: React.FC = () => {
  const user = useTypedSelector((state) => state.auth.user);
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Container>
      <Logo>
        <LogoIcon>
          <Briefcase size={24} />
        </LogoIcon>
        PortfolioBuilder
      </Logo>
      <AuthForm />
    </Container>
  );
};

export default AuthPage;