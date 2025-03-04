import React from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Type, 
  Image, 
  Grid3x3, 
  Mail, 
  User, 
  Code, 
  Briefcase,
  Layout,
  Heading,
  AlignLeft,
  ImageIcon,
  Grid,
  Send,
  UserCircle,
  Wrench,
  Folder
} from 'lucide-react';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { addComponent } from '../../store/slices/builderSlice';

const Container = styled.div`
  padding: 1rem;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const ComponentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: grab;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-bottom: 0.5rem;
  color: #3b82f6;
`;

const ComponentName = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  text-align: center;
`;

interface ComponentDefinition {
  type: 'header' | 'text' | 'image' | 'gallery' | 'contact' | 'about' | 'skills' | 'projects';
  name: string;
  icon: React.ReactNode;
  defaultContent: any;
  defaultStyle: Record<string, string>;
}

const componentDefinitions: ComponentDefinition[] = [
  {
    type: 'header',
    name: 'Header',
    icon: <Heading size={20} />,
    defaultContent: {
      title: 'Welcome to My Portfolio',
      subtitle: 'I create amazing digital experiences',
      ctaText: 'Learn More',
      ctaLink: '#about',
    },
    defaultStyle: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      padding: '4rem 2rem',
      textAlign: 'center',
    },
  },
  {
    type: 'text',
    name: 'Text Block',
    icon: <AlignLeft size={20} />,
    defaultContent: {
      title: 'Section Title',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    },
    defaultStyle: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      padding: '2rem',
    },
  },
  {
    type: 'image',
    name: 'Image',
    icon: <ImageIcon size={20} />,
    defaultContent: {
      src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
      alt: 'Portfolio Image',
      caption: 'Image Caption',
    },
    defaultStyle: {
      width: '100%',
      borderRadius: '0.5rem',
      margin: '1rem 0',
    },
  },
  {
    type: 'gallery',
    name: 'Gallery',
    icon: <Grid size={20} />,
    defaultContent: {
      images: [
        {
          src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
          alt: 'Gallery Image 1',
          caption: 'Caption 1',
        },
        {
          src: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4',
          alt: 'Gallery Image 2',
          caption: 'Caption 2',
        },
        {
          src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
          alt: 'Gallery Image 3',
          caption: 'Caption 3',
        },
      ],
    },
    defaultStyle: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      padding: '1rem',
    },
  },
  {
    type: 'contact',
    name: 'Contact Form',
    icon: <Send size={20} />,
    defaultContent: {
      title: 'Get in Touch',
      subtitle: 'Fill out the form below to contact me',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'message', label: 'Message', type: 'textarea', required: true },
      ],
      submitText: 'Send Message',
    },
    defaultStyle: {
      backgroundColor: '#f9fafb',
      padding: '2rem',
      borderRadius: '0.5rem',
    },
  },
  {
    type: 'about',
    name: 'About Me',
    icon: <UserCircle size={20} />,
    defaultContent: {
      title: 'About Me',
      bio: 'I am a creative professional with a passion for design and technology. With years of experience in the industry, I bring a unique perspective to every project.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      skills: ['Design', 'Development', 'Photography', 'Marketing'],
    },
    defaultStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
    },
  },
  {
    type: 'skills',
    name: 'Skills',
    icon: <Wrench size={20} />,
    defaultContent: {
      title: 'My Skills',
      skills: [
        { name: 'Web Design', level: 90 },
        { name: 'Frontend Development', level: 85 },
        { name: 'Backend Development', level: 75 },
        { name: 'UI/UX Design', level: 80 },
      ],
    },
    defaultStyle: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '0.5rem',
    },
  },
  {
    type: 'projects',
    name: 'Projects',
    icon: <Folder size={20} />,
    defaultContent: {
      title: 'My Projects',
      projects: [
        {
          title: 'Project 1',
          description: 'A brief description of project 1',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
          link: '#',
        },
        {
          title: 'Project 2',
          description: 'A brief description of project 2',
          image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
          link: '#',
        },
        {
          title: 'Project 3',
          description: 'A brief description of project 3',
          image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
          link: '#',
        },
      ],
    },
    defaultStyle: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '2rem',
    },
  },
];

export const ComponentLibrary: React.FC = () => {
  const dispatch = useTypedDispatch();
  const currentPageId = useTypedSelector((state) => state.builder.currentPageId);
  
  const handleDragEnd = (result: any) => {
    if (!result.destination || !currentPageId) return;
    
    const componentType = result.draggableId;
    const sectionId = result.destination.droppableId;
    
    const componentDef = componentDefinitions.find((comp) => comp.type === componentType);
    if (!componentDef) return;
    
    dispatch(
      addComponent({
        pageId: currentPageId,
        sectionId,
        component: {
          type: componentDef.type,
          content: componentDef.defaultContent,
          style: componentDef.defaultStyle,
        },
      })
    );
  };
  
  return (
    <Container>
      <Title>Components</Title>
      <DragDropContext onDragEnd={handleDragEnd}>
        <ComponentsGrid>
          {componentDefinitions.map((component) => (
            <Draggable key={component.type} draggableId={component.type} index={0}>
              {(provided) => (
                <ComponentItem
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <IconWrapper>{component.icon}</IconWrapper>
                  <ComponentName>{component.name}</ComponentName>
                </ComponentItem>
              )}
            </Draggable>
          ))}
        </ComponentsGrid>
        {/* Hidden droppable for drag source */}
        <Droppable droppableId="component-library">
          {(provided) => (
            <div style={{ display: 'none' }} ref={provided.innerRef}>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};