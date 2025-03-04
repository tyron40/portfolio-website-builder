import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Briefcase, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f9fafb;
  text-align: center;
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

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 800;
  color: #3b82f6;
  line-height: 1;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 500px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Logo>
        <LogoIcon>
          <Briefcase size={24} />
        </LogoIcon>
        PortfolioBuilder
      </Logo>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Description>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Description>
      <ButtonGroup>
        <Button as={Link} to="/" leftIcon={<Home size={16} />}>
          Go to Homepage
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default NotFoundPage;