import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { Briefcase, ArrowRight, Layers, Users, Globe, Code, Wand2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { loginAsGuest } from '../store/slices/authSlice';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
`;

const LogoIcon = styled.div`
  margin-right: 0.75rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  max-width: 800px;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  max-width: 600px;
  opacity: 0.9;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Features = styled.section`
  padding: 5rem 2rem;
  background-color: white;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1f2937;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  background-color: #eff6ff;
  color: #3b82f6;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const CTA = styled.section`
  padding: 5rem 2rem;
  background-color: #f9fafb;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const CTADescription = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Footer = styled.footer`
  padding: 2rem;
  background-color: #1f2937;
  color: white;
  text-align: center;
`;

const FooterText = styled.p`
  opacity: 0.7;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  
  const handleTryAsGuest = async () => {
    const resultAction = await dispatch(loginAsGuest());
    if (loginAsGuest.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };
  
  return (
    <Container>
      <Header>
        <Logo>
          <LogoIcon>
            <Briefcase size={24} />
          </LogoIcon>
          PortfolioBuilder
        </Logo>
        <Nav>
          {user ? (
            <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
              <Button onClick={() => navigate('/auth')}>Sign Up</Button>
            </>
          )}
        </Nav>
      </Header>
      
      <Hero>
        <HeroTitle>Create a stunning portfolio website in minutes</HeroTitle>
         <HeroSubtitle>
          Drag-and-drop website builder specifically designed for creative professionals to showcase their work.
        </HeroSubtitle>
        <ButtonGroup>
          <Button size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
          <Button variant="secondary" size="lg" onClick={handleTryAsGuest}>
            Try as Guest
          </Button>
        </ButtonGroup>
      </Hero>
      
      <Features>
        <SectionTitle>Why choose PortfolioBuilder?</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>
              <Layers size={32} />
            </FeatureIcon>
            <FeatureTitle>Drag & Drop Builder</FeatureTitle>
            <FeatureDescription>
              Build your portfolio with our intuitive drag and drop interface. No coding required.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <Wand2 size={32} />
            </FeatureIcon>
            <FeatureTitle>AI Content Generation</FeatureTitle>
            <FeatureDescription>
              Generate professional portfolio content with our AI assistant. Perfect for getting started quickly.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <Globe size={32} />
            </FeatureIcon>
            <FeatureTitle>Instant Publishing</FeatureTitle>
            <FeatureDescription>
              Publish your portfolio with one click and share it with the world instantly.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <Code size={32} />
            </FeatureIcon>
            <FeatureTitle>Customizable</FeatureTitle>
            <FeatureDescription>
              Customize every aspect of your portfolio to match your personal brand and style.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Features>
      
      <CTA>
        <CTATitle>Ready to showcase your work?</CTATitle>
        <CTADescription>
          Join thousands of creative professionals who have built stunning portfolios with our platform.
        </CTADescription>
        <ButtonGroup>
          <Button size="lg" rightIcon={<ArrowRight size={16} />} onClick={handleGetStarted}>
            Start Building Now
          </Button>
          <Button variant="secondary" size="lg" onClick={handleTryAsGuest}>
            Try Without Signing Up
          </Button>
        </ButtonGroup>
      </CTA>
      
      <Footer>
        <FooterText>© 2025 PortfolioBuilder. All rights reserved.</FooterText>
      </Footer>
    </Container>
  );
};

export default HomePage;