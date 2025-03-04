import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { fetchPortfolio } from '../store/slices/portfoliosSlice';
import { setCurrentPortfolio, setCurrentPageId } from '../store/slices/builderSlice';
import { showNotification } from '../store/slices/uiSlice';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Smartphone, LampDesk as Desktop, Edit3, Loader } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PortfolioName = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const PreviewContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 2rem;
`;

const PreviewFrame = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '375px' : '100%')};
  max-width: ${({ $isMobile }) => ($isMobile ? '375px' : '1200px')};
  height: 100%;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: auto;
`;

const Navigation = styled.nav`
  display: flex;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  overflow-x: auto;
  white-space: nowrap;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }
`;

const NavLink = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${({ active }) => (active ? 'white' : 'transparent')};
  border: 1px solid ${({ active }) => (active ? '#e5e7eb' : 'transparent')};
  border-bottom: none;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  color: ${({ active }) => (active ? '#1f2937' : '#6b7280')};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.25rem;
  
  &:hover {
    background-color: ${({ active }) => (active ? 'white' : '#f3f4f6')};
  }
  
  &:focus {
    outline: none;
  }
`;

const PageContent = styled.div`
  min-height: 100%;
`;

const Section = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
`;

const LoadingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: #3b82f6;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
`;

const PreviewPage: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  
  const user = useTypedSelector((state) => state.auth.user);
  const { loading } = useTypedSelector((state) => state.portfolios);
  const currentPortfolio = useTypedSelector((state) => state.builder.currentPortfolio);
  const currentPageId = useTypedSelector((state) => state.builder.currentPageId);
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (portfolioId) {
      dispatch(fetchPortfolio(portfolioId))
        .unwrap()
        .then((portfolio) => {
          dispatch(setCurrentPortfolio(portfolio));
          if (portfolio.pages.length > 0) {
            dispatch(setCurrentPageId(portfolio.pages[0].id));
          }
        })
        .catch((error) => {
          dispatch(showNotification({
            message: `Error loading portfolio: ${error}`,
            type: 'error',
          }));
          navigate('/dashboard');
        });
    }
  }, [portfolioId, user, dispatch, navigate]);
  
  const getCurrentPage = () => {
    if (!currentPortfolio || !currentPageId) return null;
    
    return currentPortfolio.pages.find((page) => page.id === currentPageId) || null;
  };
  
  if (loading || !currentPortfolio) {
    return (
      <LoadingState>
        <LoadingIcon>
          <Loader size={32} />
        </LoadingIcon>
        <LoadingText>Loading preview...</LoadingText>
      </LoadingState>
    );
  }
  
  const currentPage = getCurrentPage();
  
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back to Dashboard
          </Button>
          <PortfolioName>{currentPortfolio.name} - Preview</PortfolioName>
        </HeaderLeft>
        
        <HeaderRight>
          <Button
            variant={isMobile ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setIsMobile(!isMobile)}
            leftIcon={isMobile ? <Desktop size={16} /> : <Smartphone size={16} />}
          >
            {isMobile ? 'Desktop View' : 'Mobile View'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/builder/${portfolioId}`)}
            leftIcon={<Edit3 size={16} />}
          >
            Edit Portfolio
          </Button>
        </HeaderRight>
      </Header>
      
      <PreviewContainer>
        <PreviewFrame $isMobile={isMobile}>
          {currentPortfolio.pages.length > 1 && (
            <Navigation>
              {currentPortfolio.pages.map((page) => (
                <NavLink
                  key={page.id}
                  active={page.id === currentPageId}
                  onClick={() => dispatch(setCurrentPageId(page.id))}
                >
                  {page.name}
                </NavLink>
              ))}
            </Navigation>
          )}
          
          {currentPage && (
            <PageContent>
              {currentPage.sections.map((section) => (
                <Section key={section.id}>
                  {section.components.map((component) => (
                    <div key={component.id}>
                      {renderComponent(component)}
                    </div>
                  ))}
                </Section>
              ))}
            </PageContent>
          )}
        </PreviewFrame>
      </PreviewContainer>
    </Container>
  );
};

// Helper function to render components based on their type
const renderComponent = (component: any) => {
  const { type, content, style } = component;
  
  const componentStyle = {
    ...style,
    color: style.textColor || 'inherit',
  };
  
  switch (type) {
    case 'header':
      return (
        <div style={componentStyle}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{content.title}</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>{content.subtitle}</p>
          <button
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {content.ctaText}
          </button>
        </div>
      );
    
    case 'text':
      return (
        <div style={componentStyle}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>{content.title}</h2>
          <p style={{ lineHeight: '1.6' }}>{content.text}</p>
        </div>
      );
    
    case 'image':
      return (
        <div style={componentStyle}>
          <img
            src={content.src}
            alt={content.alt}
            style={{ width: '100%', borderRadius: style.borderRadius || '0.5rem' }}
          />
          {content.caption && (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', textAlign: 'center' }}>
              {content.caption}
            </p>
          )}
        </div>
      );
    
    case 'gallery':
      return (
        <div style={componentStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {content.images.map((image: any, index: number) => (
              <div key={index}>
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.375rem' }}
                />
                {image.caption && (
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', textAlign: 'center' }}>
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'contact':
      return (
        <div style={componentStyle}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{content.title}</h2>
          <p style={{ marginBottom: '1.5rem' }}>{content.subtitle}</p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {content.fields.map((field: any, index: number) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      minHeight: '6rem',
                    }}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <input
                    type={field.type}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                    }}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
            <button
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              {content.submitText}
            </button>
          </form>
        </div>
      );
    
    case 'about':
      return (
        <div style={componentStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{content.title}</h2>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <img
                src={content.image}
                alt="About Me"
                style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '0.5rem' }}
              />
              <div style={{ flex: '1', minWidth: '300px' }}>
                <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{content.bio}</p>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {content.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: '#eff6ff',
                          color: '#3b82f6',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'skills':
      return (
        <div style={componentStyle}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{content.title}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {content.skills.map((skill: any, index: number) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div style={{ height: '0.5rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${skill.level}%`,
                      backgroundColor: '#3b82f6',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'projects':
      return (
        <div style={componentStyle}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{content.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {content.projects.map((project: any, index: number) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{project.title}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{project.description}</p>
                  <a
                    href={project.link}
                    style={{
                      color: '#3b82f6',
                      fontWeight: '500',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    View Project
                    <span style={{ marginLeft: '0.25rem' }}>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    
    default:
      return <div>Unknown component type: {type}</div>;
  }
};

export default PreviewPage;