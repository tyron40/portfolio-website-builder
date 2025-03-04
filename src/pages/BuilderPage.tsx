import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { 
  fetchPortfolio, 
  updatePortfolio 
} from '../store/slices/portfoliosSlice';
import {
  setCurrentPortfolio,
  setCurrentPageId,
  setSelectedComponentId,
  setIsDragging,
  moveComponent,
  deleteComponent,
  undo,
  redo,
  resetBuilder,
  updatePortfolioSettings,
  publishPortfolio,
  addPage
} from '../store/slices/builderSlice';
import {
  toggleSidebar,
  toggleRightPanel,
  setRightPanelTab,
  togglePreviewMode,
  toggleMobilePreview,
  showNotification,
  showConfirmDialog
} from '../store/slices/uiSlice';
import { ComponentLibrary } from '../components/builder/ComponentLibrary';
import { StyleEditor } from '../components/builder/StyleEditor';
import { ContentEditor } from '../components/builder/ContentEditor';
import { Button } from '../components/ui/Button';
import { Briefcase, Menu, X, Layers, Palette, Settings, Save, Eye, Smartphone, LampDesk as Desktop, ArrowLeft, Undo2, Redo2, Plus, Globe, Trash2, Edit3, ChevronDown, Loader } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
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

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
`;

const LogoIcon = styled.div`
  margin-right: 0.5rem;
`;

const PortfolioName = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div<{ $isOpen: boolean }>`
  width: ${({ $isOpen }) => ($isOpen ? '250px' : '0')};
  height: 100%;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  transition: width 0.3s;
  z-index: 5;
`;

const RightPanel = styled.div<{ $isOpen: boolean }>`
  width: ${({ $isOpen }) => ($isOpen ? '300px' : '0')};
  height: 100%;
  background-color: white;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  transition: width 0.3s;
  z-index: 5;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background-color: ${({ active }) => (active ? '#f9fafb' : 'white')};
  border: none;
  border-bottom: 2px solid ${({ active }) => (active ? '#3b82f6' : 'transparent')};
  color: ${({ active }) => (active ? '#3b82f6' : '#6b7280')};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:focus {
    outline: none;
  }
`;

const TabIcon = styled.div`
  margin-bottom: 0.25rem;
`;

const Canvas = styled.div<{ $isPreviewMode: boolean; $isMobilePreview: boolean }>`
  flex: 1;
  height: 100%;
  background-color: #f3f4f6;
  overflow-y: auto;
  padding: ${({ $isPreviewMode }) => ($isPreviewMode ? '0' : '2rem')};
  display: flex;
  justify-content: center;
  
  ${({ $isMobilePreview, $isPreviewMode }) =>
    $isMobilePreview && $isPreviewMode
      ? `
    padding: 2rem;
    
    &:after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1;
      pointer-events: none;
    }
  `
      : ''}
`;

const CanvasInner = styled.div<{ $isPreviewMode: boolean; $isMobilePreview: boolean }>`
  width: ${({ $isMobilePreview }) => ($isMobilePreview ? '375px' : '100%')};
  max-width: ${({ $isPreviewMode, $isMobilePreview }) =>
    $isPreviewMode ? ($isMobilePreview ? '375px' : '1200px') : '1200px'};
  background-color: white;
  min-height: ${({ $isPreviewMode }) => ($isPreviewMode ? '100%' : 'calc(100% - 4rem)')};
  box-shadow: ${({ $isPreviewMode }) =>
    $isPreviewMode ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'};
  border-radius: ${({ $isPreviewMode }) => ($isPreviewMode ? '0' : '0.5rem')};
  overflow: hidden;
  z-index: ${({ $isMobilePreview }) => ($isMobilePreview ? '2' : '1')};
`;

const PageTabs = styled.div`
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

const PageTab = styled.button<{ active: boolean }>`
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

const AddPageButton = styled.button`
  padding: 0.5rem;
  background-color: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #3b82f6;
  }
  
  &:focus {
    outline: none;
  }
`;

const PageContent = styled.div`
  min-height: 100%;
`;

const Section = styled.div<{ $isDraggingOver?: boolean }>`
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: ${({ $isDraggingOver }) => ($isDraggingOver ? '#eff6ff' : 'white')};
  border: 2px dashed ${({ $isDraggingOver }) => ($isDraggingOver ? '#3b82f6' : 'transparent')};
  transition: all 0.2s;
`;

const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const ComponentWrapper = styled.div<{ $isSelected?: boolean; $isDragging?: boolean }>`
  position: relative;
  margin-bottom: 1rem;
  border: 2px solid ${({ $isSelected }) => ($isSelected ? '#3b82f6' : 'transparent')};
  box-shadow: ${({ $isSelected }) =>
    $isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none'};
  cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'pointer')};
  
  &:hover {
    border-color: ${({ $isSelected }) => ($isSelected ? '#3b82f6' : '#e5e7eb')};
  }
`;

const ComponentActions = styled.div<{ $isVisible?: boolean }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
  transition: opacity 0.2s;
  z-index: 10;
  
  ${ComponentWrapper}:hover & {
    opacity: 1;
  }
`;

const ComponentActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  color: #6b7280;
  cursor: pointer;
  
  &:hover {
    background-color: #f9fafb;
    color: #3b82f6;
  }
  
  &:focus {
    outline: none;
  }
`;

const EmptySection = styled.div`
  padding: 2rem;
  text-align: center;
  border: 2px dashed #e5e7eb;
  border-radius: 0.25rem;
  color: #9ca3af;
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

const SettingsPanel = styled.div`
  padding: 1rem;
`;

const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
`;

const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1f2937;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 6rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1f2937;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  resize: vertical;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1f2937;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const BuilderPage: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const dispatch = useTypedDispatch();
  
  const user = useTypedSelector((state) => state.auth.user);
  const { loading } = useTypedSelector((state) => state.portfolios);
  const currentPortfolio = useTypedSelector((state) => state.builder.currentPortfolio);
  const currentPageId = useTypedSelector((state) => state.builder.currentPageId);
  const selectedComponentId = useTypedSelector((state) => state.builder.selectedComponentId);
  const isDragging = useTypedSelector((state) => state.builder.isDragging);
  const sidebarOpen = useTypedSelector((state) => state.ui.sidebarOpen);
  const rightPanelOpen = useTypedSelector((state) => state.ui.rightPanelOpen);
  const rightPanelTab = useTypedSelector((state) => state.ui.rightPanelTab);
  const previewMode = useTypedSelector((state) => state.ui.previewMode);
  const mobilePreview = useTypedSelector((state) => state.ui.mobilePreview);
  
  const [portfolioName, setPortfolioName] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [portfolioTheme, setPortfolioTheme] = useState('blue');
  const [isPublished, setIsPublished] = useState(false);
  
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
          
          setPortfolioName(portfolio.name);
          setPortfolioDescription(portfolio.description || '');
          setPortfolioTheme(portfolio.theme);
          setIsPublished(portfolio.published);
        })
        .catch((error) => {
          dispatch(showNotification({
            message: `Error loading portfolio: ${error}`,
            type: 'error',
          }));
          navigate('/dashboard');
        });
    }
    
    return () => {
      dispatch(resetBuilder());
    };
  }, [portfolioId, user, dispatch, navigate]);
  
  const handleDragStart = () => {
    dispatch(setIsDragging(true));
  };
  
  const handleDragEnd = (result: any) => {
    dispatch(setIsDragging(false));
    
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    
    if (source.droppableId !== 'component-library') {
      dispatch(
        moveComponent({
          pageId: currentPageId!,
          sourceSectionId: source.droppableId,
          destinationSectionId: destination.droppableId,
          sourceIndex: source.index,
          destinationIndex: destination.index,
        })
      );
    }
  };
  
  const handleComponentClick = (componentId: string) => {
    if (!previewMode) {
      dispatch(setSelectedComponentId(componentId));
      dispatch(setRightPanelOpen(true));
      
      // Determine which tab to open based on the component type
      const component = findComponentById(componentId);
      if (component) {
        if (component.type === 'header' || component.type === 'text' || component.type === 'contact' || component.type === 'about') {
          dispatch(setRightPanelTab('components'));
        } else {
          dispatch(setRightPanelTab('styles'));
        }
      }
    }
  };
  
  const handleDeleteComponent = (componentId: string) => {
    if (!currentPageId) return;
    
    const component = findComponentById(componentId);
    if (!component) return;
    
    let sectionId = '';
    
    // Find the section containing the component
    if (currentPortfolio) {
      for (const page of currentPortfolio.pages) {
        if (page.id === currentPageId) {
          for (const section of page.sections) {
            if (section.components.some((comp) => comp.id === componentId)) {
              sectionId = section.id;
              break;
            }
          }
        }
      }
    }
    
    if (!sectionId) return;
    
    dispatch(
      showConfirmDialog({
        title: 'Delete Component',
        message: `Are you sure you want to delete this ${component.type} component?`,
        onConfirm: () => {
          dispatch(
            deleteComponent({
              pageId: currentPageId,
              sectionId,
              componentId,
            })
          );
          dispatch(setSelectedComponentId(null));
          dispatch(showNotification({
            message: 'Component deleted successfully',
            type: 'success',
          }));
        },
        onCancel: () => {},
      })
    );
  };
  
  const findComponentById = (componentId: string) => {
    if (!currentPortfolio || !currentPageId) return null;
    
    for (const page of currentPortfolio.pages) {
      if (page.id === currentPageId) {
        for (const section of page.sections) {
          for (const component of section.components) {
            if (component.id === componentId) {
              return component;
            }
          }
        }
      }
    }
    
    return null;
  };
  
  const handleSavePortfolio = () => {
    if (!currentPortfolio) return;
    
    dispatch(updatePortfolio(currentPortfolio))
      .unwrap()
      .then(() => {
        dispatch(showNotification({
          message: 'Portfolio saved successfully',
          type: 'success',
        }));
      })
      .catch((error) => {
        dispatch(showNotification({
          message: `Error saving portfolio: ${error}`,
          type: 'error',
        }));
      });
  };
  
  const handlePublishPortfolio = () => {
    if (!currentPortfolio) return;
    
    const action = isPublished ? 'unpublish' : 'publish';
    
    dispatch(
      showConfirmDialog({
        title: `${isPublished ? 'Unpublish' : 'Publish'} Portfolio`,
        message: `Are you sure you want to ${action} "${currentPortfolio.name}"?`,
        onConfirm: () => {
          dispatch(
            publishPortfolio({
              published: !isPublished,
              publishedUrl: isPublished ? undefined : `https://portfoliobuilder.com/${user?.id}/${currentPortfolio.id}`,
            })
          );
          
          setIsPublished(!isPublished);
          
          dispatch(updatePortfolio({
            ...currentPortfolio,
            published: !isPublished,
            publishedUrl: isPublished ? undefined : `https://portfoliobuilder.com/${user?.id}/${currentPortfolio.id}`,
          }));
          
          dispatch(showNotification({
            message: `Portfolio ${action}ed successfully`,
            type: 'success',
          }));
        },
        onCancel: () => {},
      })
    );
  };
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPortfolio) return;
    
    dispatch(
      updatePortfolioSettings({
        name: portfolioName,
        description: portfolioDescription,
        theme: portfolioTheme,
      })
    );
    
    dispatch(updatePortfolio({
      ...currentPortfolio,
      name: portfolioName,
      description: portfolioDescription,
      theme: portfolioTheme,
    }));
    
    dispatch(showNotification({
      message: 'Settings saved successfully',
      type: 'success',
    }));
  };
  
  const handleAddPage = () => {
    const pageName = prompt('Enter page name:');
    if (!pageName) return;
    
    const slug = pageName.toLowerCase().replace(/\s+/g, '-');
    
    dispatch(addPage({ name: pageName, slug }));
    
    dispatch(showNotification({
      message: 'Page added successfully',
      type: 'success',
    }));
  };
  
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
        <LoadingText>Loading portfolio...</LoadingText>
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
            Back
          </Button>
          <Logo>
            <LogoIcon>
              <Briefcase size={20} />
            </LogoIcon>
            PortfolioBuilder
          </Logo>
          <PortfolioName>{currentPortfolio.name}</PortfolioName>
        </HeaderLeft>
        
        <HeaderCenter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(undo())}
            leftIcon={<Undo2 size={16} />}
          >
            Undo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(redo())}
            leftIcon={<Redo2 size={16} />}
          >
            Redo
          </Button>
          <Button
            variant={previewMode ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => dispatch(togglePreviewMode())}
            leftIcon={<Eye size={16} />}
          >
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          {previewMode && (
            <Button
              variant={mobilePreview ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => dispatch(toggleMobilePreview())}
              leftIcon={mobilePreview ? <Desktop size={16} /> : <Smartphone size={16} />}
            >
              {mobilePreview ? 'Desktop' : 'Mobile'}
            </Button>
          )}
        </HeaderCenter>
        
        <HeaderRight>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            leftIcon={sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          >
            {sidebarOpen ? 'Hide Pages' : 'Show Pages'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleRightPanel())}
            leftIcon={rightPanelOpen ? <X size={16} /> : <Layers size={16} />}
          >
            {rightPanelOpen ? 'Hide Panel' : 'Show Panel'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSavePortfolio}
            leftIcon={<Save size={16} />}
          >
            Save
          </Button>
          <Button
            variant={isPublished ? 'danger' : 'primary'}
            size="sm"
            onClick={handlePublishPortfolio}
            leftIcon={<Globe size={16} />}
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        </HeaderRight>
      </Header>
      
      <MainContainer>
        <Sidebar $isOpen={sidebarOpen}>
          <PageTabs>
            {currentPortfolio.pages.map((page) => (
              <PageTab
                key={page.id}
                active={page.id === currentPageId}
                onClick={() => dispatch(setCurrentPageId(page.id))}
              >
                {page.name}
              </PageTab>
            ))}
            <AddPageButton onClick={handleAddPage}>
              <Plus size={16} />
            </AddPageButton>
          </PageTabs>
          
          {/* Page settings could go here */}
        </Sidebar>
        
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Canvas $isPreviewMode={previewMode} $isMobilePreview={mobilePreview}>
            <CanvasInner $isPreviewMode={previewMode} $isMobilePreview={mobilePreview}>
              {currentPage && (
                <PageContent>
                  {!previewMode && (
                    <PageTabs>
                      <SectionLabel>Current Page: {currentPage.name}</SectionLabel>
                    </PageTabs>
                  )}
                  
                  {currentPage.sections.map((section) => (
                    <Droppable key={section.id} droppableId={section.id}>
                      {(provided, snapshot) => (
                        <Section
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          $isDraggingOver={snapshot.isDraggingOver}
                        >
                          {!previewMode && <SectionLabel>{section.name}</SectionLabel>}
                          
                          {section.components.map((component, index) => (
                            <Draggable
                              key={component.id}
                              draggableId={component.id}
                              index={index}
                              isDragDisabled={previewMode}
                            >
                              {(provided, snapshot) => (
                                <ComponentWrapper
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  $isSelected={component.id === selectedComponentId}
                                  $isDragging={snapshot.isDragging}
                                  onClick={() => handleComponentClick(component.id)}
                                >
                                  {!previewMode && (
                                    <ComponentActions $isVisible={component.id === selectedComponentId}>
                                      <ComponentActionButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteComponent(component.id);
                                        }}
                                      >
                                        <Trash2 size={14} />
                                      </ComponentActionButton>
                                    </ComponentActions>
                                  )}
                                  
                                  {/* Render the component based on its type */}
                                  {renderComponent(component)}
                                </ComponentWrapper>
                              )}
                            </Draggable>
                          ))}
                          
                          {provided.placeholder}
                          
                          {section.components.length === 0 && !previewMode && (
                            <EmptySection>
                              Drag and drop components here
                            </EmptySection>
                          )}
                        </Section>
                      )}
                    </Droppable>
                  ))}
                </PageContent>
              )}
            </CanvasInner>
          </Canvas>
        </DragDropContext>
        
        <RightPanel $isOpen={rightPanelOpen}>
          <TabsContainer>
            <Tab
              active={rightPanelTab === 'components'}
              onClick={() => dispatch(setRightPanelTab('components'))}
            >
              <TabIcon>
                <Layers size={16} />
              </TabIcon>
              Components
            </Tab>
            <Tab
              active={rightPanelTab === 'styles'}
              onClick={() => dispatch(setRightPanelTab('styles'))}
            >
              <TabIcon>
                <Palette size={16} />
              </TabIcon>
              Styles
            </Tab>
            <Tab
              active={rightPanelTab === 'settings'}
              onClick={() => dispatch(setRightPanelTab('settings'))}
            >
              <TabIcon>
                <Settings size={16} />
              </TabIcon>
              Settings
            </Tab>
          </TabsContainer>
          
          {rightPanelTab === 'components' && (
            selectedComponentId ? (
              <ContentEditor />
            ) : (
              <ComponentLibrary />
            )
          )}
          
          {rightPanelTab === 'styles' && <StyleEditor />}
          
          {rightPanelTab === 'settings' && (
            <SettingsPanel>
              <SectionTitle>Portfolio Settings</SectionTitle>
              <SettingsForm onSubmit={handleSaveSettings}>
                <FormGroup>
                  <Label>Portfolio Name</Label>
                  <Input
                    type="text"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Textarea
                    value={portfolioDescription}
                    onChange={(e) => setPortfolioDescription(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Theme</Label>
                  <Select
                    value={portfolioTheme}
                    onChange={(e) => setPortfolioTheme(e.target.value)}
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                  </Select>
                </FormGroup>
                <Button type="submit">Save Settings</Button>
              </SettingsForm>
            </SettingsPanel>
          )}
        </RightPanel>
      </MainContainer>
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

export default BuilderPage;