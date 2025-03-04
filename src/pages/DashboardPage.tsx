import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { fetchPortfolios, createPortfolio, deletePortfolio } from '../store/slices/portfoliosSlice';
import { signOut } from '../store/slices/authSlice';
import { showConfirmDialog, showNotification } from '../store/slices/uiSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Briefcase, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  Globe, 
  Loader 
} from 'lucide-react';

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

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #f9fafb;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
`;

const CreatePortfolioSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 250px;
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PortfolioCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const PortfolioHeader = styled.div<{ theme: string }>`
  height: 8rem;
  background: ${({ theme }) => {
    switch (theme) {
      case 'blue':
        return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'green':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'purple':
        return 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)';
      case 'red':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'orange':
        return 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
      default:
        return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const PortfolioBody = styled.div`
  padding: 1.5rem;
`;

const PortfolioTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const PortfolioDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
  min-height: 2.5rem;
`;

const PortfolioMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PortfolioActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  text-align: center;
`;

const EmptyStateIcon = styled.div`
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

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const EmptyStateDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
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

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const { portfolios, loading } = useTypedSelector((state) => state.portfolios);
  
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('blue');
  
  useEffect(() => {
    if (user) {
      dispatch(fetchPortfolios(user.id));
    } else {
      navigate('/auth');
    }
  }, [user, dispatch, navigate]);
  
  const handleCreatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!newPortfolioName.trim()) {
      dispatch(showNotification({
        message: 'Please enter a portfolio name',
        type: 'error',
      }));
      return;
    }
    
    dispatch(createPortfolio({
      userId: user.id,
      name: newPortfolioName,
      description: newPortfolioDescription,
      theme: selectedTheme,
    }));
    
    setNewPortfolioName('');
    setNewPortfolioDescription('');
    setSelectedTheme('blue');
    
    dispatch(showNotification({
      message: 'Portfolio created successfully',
      type: 'success',
    }));
  };
  
  const handleDeletePortfolio = (portfolioId: string, portfolioName: string) => {
    dispatch(
      showConfirmDialog({
        title: 'Delete Portfolio',
        message: `Are you sure you want to delete "${portfolioName}"? This action cannot be undone.`,
        onConfirm: () => {
          dispatch(deletePortfolio(portfolioId));
          dispatch(showNotification({
            message: 'Portfolio deleted successfully',
            type: 'success',
          }));
        },
        onCancel: () => {},
      })
    );
  };
  
  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/');
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <Container>
      <Header>
        <Logo>
          <LogoIcon>
            <Briefcase size={24} />
          </LogoIcon>
          PortfolioBuilder
        </Logo>
        <UserSection>
          <UserName>Hello, {user.name}</UserName>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LogOut size={16} />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </UserSection>
      </Header>
      
      <Content>
        <PageTitle>My Portfolios</PageTitle>
        
        <CreatePortfolioSection>
          <SectionTitle>Create New Portfolio</SectionTitle>
          <Form onSubmit={handleCreatePortfolio}>
            <FormGroup>
              <Input
                label="Portfolio Name"
                placeholder="Enter portfolio name"
                value={newPortfolioName}
                onChange={(e) => setNewPortfolioName(e.target.value)}
                fullWidth
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                label="Description (Optional)"
                placeholder="Enter a brief description"
                value={newPortfolioDescription}
                onChange={(e) => setNewPortfolioDescription(e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                className="w-full h-10 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
              </select>
            </FormGroup>
            <Button type="submit" leftIcon={<Plus size={16} />}>
              Create Portfolio
            </Button>
          </Form>
        </CreatePortfolioSection>
        
        {loading ? (
          <LoadingState>
            <LoadingIcon>
              <Loader size={32} />
            </LoadingIcon>
            <LoadingText>Loading your portfolios...</LoadingText>
          </LoadingState>
        ) : portfolios.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <Briefcase size={32} />
            </EmptyStateIcon>
            <EmptyStateTitle>No portfolios yet</EmptyStateTitle>
            <EmptyStateDescription>
              Create your first portfolio to get started with PortfolioBuilder.
            </EmptyStateDescription>
            <Button leftIcon={<Plus size={16} />} onClick={() => document.getElementById('portfolio-name')?.focus()}>
              Create Your First Portfolio
            </Button>
          </EmptyState>
        ) : (
          <PortfolioGrid>
            {portfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id}>
                <PortfolioHeader theme={portfolio.theme}>
                  {portfolio.name.charAt(0)}
                </PortfolioHeader>
                <PortfolioBody>
                  <PortfolioTitle>{portfolio.name}</PortfolioTitle>
                  <PortfolioDescription>
                    {portfolio.description || 'No description provided'}
                  </PortfolioDescription>
                  <PortfolioMeta>
                    <MetaItem>
                      <Calendar size={12} />
                      {formatDate(portfolio.updatedAt)}
                    </MetaItem>
                    {portfolio.published && (
                      <MetaItem>
                        <Globe size={12} />
                        Published
                      </MetaItem>
                    )}
                  </PortfolioMeta>
                  <PortfolioActions>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Edit3 size={14} />}
                      onClick={() => navigate(`/builder/${portfolio.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Eye size={14} />}
                      onClick={() => navigate(`/preview/${portfolio.id}`)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<Trash2 size={14} />}
                      onClick={() => handleDeletePortfolio(portfolio.id, portfolio.name)}
                    >
                      Delete
                    </Button>
                  </PortfolioActions>
                </PortfolioBody>
              </PortfolioCard>
            ))}
          </PortfolioGrid>
        )}
      </Content>
    </Container>
  );
};

export default DashboardPage;