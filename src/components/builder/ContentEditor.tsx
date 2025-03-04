import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { updateComponent } from '../../store/slices/builderSlice';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ContentGenerator } from './ContentGenerator';
import { Plus, Trash2, X } from 'lucide-react';

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

const NoSelection = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  padding: 2rem 0;
`;

const Form = styled.form`
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
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 6rem;
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

const ArrayItemContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 9999px;
  color: #6b7280;
  cursor: pointer;
  
  &:hover {
    background-color: #e5e7eb;
    color: #ef4444;
  }
  
  &:focus {
    outline: none;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 0.375rem;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
    color: #3b82f6;
    border-color: #3b82f6;
  }
  
  &:focus {
    outline: none;
  }
`;

export const ContentEditor: React.FC = () => {
  const dispatch = useTypedDispatch();
  const currentPageId = useTypedSelector((state) => state.builder.currentPageId);
  const selectedComponentId = useTypedSelector((state) => state.builder.selectedComponentId);
  const currentPortfolio = useTypedSelector((state) => state.builder.currentPortfolio);
  
  const [componentContent, setComponentContent] = useState<any>(null);
  const [componentType, setComponentType] = useState<string>('');
  
  useEffect(() => {
    if (!currentPageId || !selectedComponentId || !currentPortfolio) return;
    
    // Find the selected component
    let selectedComponent = null;
    let sectionId = '';
    
    for (const page of currentPortfolio.pages) {
      if (page.id === currentPageId) {
        for (const section of page.sections) {
          for (const component of section.components) {
            if (component.id === selectedComponentId) {
              selectedComponent = component;
              sectionId = section.id;
              break;
            }
          }
          if (selectedComponent) break;
        }
        if (selectedComponent) break;
      }
    }
    
    if (selectedComponent) {
      setComponentContent(JSON.parse(JSON.stringify(selectedComponent.content)));
      setComponentType(selectedComponent.type);
    }
  }, [currentPageId, selectedComponentId, currentPortfolio]);
  
  const handleContentChange = (path: string, value: any) => {
    if (!componentContent) return;
    
    const newContent = { ...componentContent };
    
    // Handle nested paths like "images.0.src"
    const pathParts = path.split('.');
    let current = newContent;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[pathParts[pathParts.length - 1]] = value;
    setComponentContent(newContent);
  };
  
  const handleSaveContent = () => {
    if (!currentPageId || !selectedComponentId || !currentPortfolio) return;
    
    // Find the section containing the component
    let sectionId = '';
    
    for (const page of currentPortfolio.pages) {
      if (page.id === currentPageId) {
        for (const section of page.sections) {
          if (section.components.some((comp) => comp.id === selectedComponentId)) {
            sectionId = section.id;
            break;
          }
        }
        if (sectionId) break;
      }
    }
    
    if (!sectionId) return;
    
    dispatch(
      updateComponent({
        pageId: currentPageId,
        sectionId,
        componentId: selectedComponentId,
        updates: {
          content: componentContent,
        },
      })
    );
  };
  
  const handleAddArrayItem = (arrayPath: string, defaultItem: any) => {
    if (!componentContent) return;
    
    const newContent = { ...componentContent };
    
    // Handle nested paths
    const pathParts = arrayPath.split('.');
    let current = newContent;
    
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (i === pathParts.length - 1) {
        if (!Array.isArray(current[part])) {
          current[part] = [];
        }
        current[part].push(defaultItem);
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    }
    
    setComponentContent(newContent);
  };
  
  const handleRemoveArrayItem = (arrayPath: string, index: number) => {
    if (!componentContent) return;
    
    const newContent = { ...componentContent };
    
    // Handle nested paths
    const pathParts = arrayPath.split('.');
    let current = newContent;
    
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (i === pathParts.length - 1) {
        if (Array.isArray(current[part]) && current[part].length > 1) {
          current[part].splice(index, 1);
        }
      } else {
        if (!current[part]) {
          return;
        }
        current = current[part];
      }
    }
    
    setComponentContent(newContent);
  };
  
  const handleGeneratedContent = (generatedContent: any) => {
    setComponentContent({
      ...componentContent,
      ...generatedContent
    });
  };
  
  if (!currentPageId || !selectedComponentId || !currentPortfolio || !componentContent) {
    return (
      <Container>
        <Title>Content Editor</Title>
        <NoSelection>Select a component to edit its content</NoSelection>
      </Container>
    );
  }
  
  // Render different forms based on component type
  const renderForm = () => {
    switch (componentType) {
      case 'header':
        return (
          <Form>
            <ContentGenerator 
              componentType="header" 
              onContentGenerated={handleGeneratedContent} 
            />
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={componentContent.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>Subtitle</Label>
              <Textarea
                value={componentContent.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>CTA Text</Label>
              <Input
                type="text"
                value={componentContent.ctaText || ''}
                onChange={(e) => handleContentChange('ctaText', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>CTA Link</Label>
              <Input
                type="text"
                value={componentContent.ctaLink || ''}
                onChange={(e) => handleContentChange('ctaLink', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <Button type="button" onClick={handleSaveContent}>
              Save Changes
            </Button>
          </Form>
        );
      
      case 'text':
        return (
          <Form>
            <ContentGenerator 
              componentType="text" 
              onContentGenerated={handleGeneratedContent} 
            />
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={componentContent.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>Text</Label>
              <Textarea
                value={componentContent.text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
              />
            </FormGroup>
            <Button type="button" onClick={handleSaveContent}>
              Save Changes
            </Button>
          </Form>
        );
      
      case 'image':
        return (
          <Form>
            <FormGroup>
              <Label>Image URL</Label>
              <Input
                type="text"
                value={componentContent.src || ''}
                onChange={(e) => handleContentChange('src', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>Alt Text</Label>
              <Input
                type="text"
                value={componentContent.alt || ''}
                onChange={(e) => handleContentChange('alt', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>Caption (Optional)</Label>
              <Input
                type="text"
                value={componentContent.caption || ''}
                onChange={(e) => handleContentChange('caption', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <Button type="button" onClick={handleSaveContent}>
              Save Changes
            </Button>
          </Form>
        );
      
      case 'gallery':
        return (
          <Form>
            <ContentGenerator 
              componentType="gallery" 
              onContentGenerated={handleGeneratedContent} 
            />
            <FormGroup>
              <Label>Gallery Images</Label>
              {componentContent.images && componentContent.images.map((image: any, index: number) => (
                <ArrayItemContainer key={index}>
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveArrayItem('images', index)}
                  >
                    <X size={14} />
                  </RemoveButton>
                  <FormGroup>
                    <Label>Image URL</Label>
                    <Input
                      type="text"
                      value={image.src || ''}
                      onChange={(e) => handleContentChange(`images.${index}.src`, e.target.value)}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Alt Text</Label>
                    <Input
                      type="text"
                      value={image.alt || ''}
                      onChange={(e) => handleContentChange(`images.${index}.alt`, e.target.value)}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Caption (Optional)</Label>
                    <Input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => handleContentChange(`images.${index}.caption`, e.target.value)}
                      fullWidth
                    />
                  </FormGroup>
                </ArrayItemContainer>
              ))}
              <AddButton
                type="button"
                onClick={() =>
                  handleAddArrayItem('images', {
                    src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
                    alt: 'Gallery Image',
                    caption: '',
                  })
                }
              >
                <Plus size={14} />
                Add Image
              </AddButton>
            </FormGroup>
            <Button type="button" onClick={handleSaveContent}>
              Save Changes
            </Button>
          </Form>
        );
      
      case 'contact':
        return (
          <Form>
            <ContentGenerator 
              componentType="contact" 
              onContentGenerated={handleGeneratedContent} 
            />
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={componentContent.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>Subtitle</Label>
              <Textarea
                value={componentContent.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Form Fields</Label>
              {componentContent.fields && componentContent.fields.map((field: any, index: number) => (
                <ArrayItemContainer key={index}>
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveArrayItem('fields', index)}
                  >
                    <X size={14} />
                  </RemoveButton>
                  <FormGroup>
                    <Label>Field Name</Label>
                    <Input
                      type="text"
                      value={field.name || ''}
                      onChange={(e) => handleContentChange(`fields.${index}.name`, e.target.value)}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Field Label</Label>
                    <Input
                      type="text"
                      value={field.label || ''}
                      onChange={(e) => handleContentChange(`fields.${index}.label`, e.target.value)}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Field Type</Label>
                    <select
                      value={field.type || 'text'}
                      onChange={(e) => handleContentChange(`fields.${index}.type`, e.target.value)}
                      className="w-full h-10 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="textarea">Textarea</option>
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <Label>Required</Label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.required || false}
                        onChange={(e) => handleContentChange(`fields.${index}.required`, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">This field is required</span>
                    </div>
                  </FormGroup>
                </ArrayItemContainer>
              ))}
              <AddButton
                type="button"
                onClick={() =>
                  handleAddArrayItem('fields', {
                    name: 'field',
                    label: 'Field',
                    type: 'text',
                    required: false,
                  })
                }
              >
                <Plus size={14} />
                Add Field
              </AddButton>
            </FormGroup>
            <FormGroup>
              <Label>Submit Button Text</Label>
              <Input
                type="text"
                value={componentContent.submitText || ''}
                onChange={(e) => handleContentChange('submitText', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <Button type="button" onClick={handleSaveContent}>
              Save Changes
            </Button>
          </Form>
        );
      
      case 'about':
        return (
          <Form>
            <ContentGenerator 
              componentType="about" 
              onContentGenerated={handleGeneratedContent} 
            />
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={componentContent.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>Bio</Label>
              <Textarea
                value={componentContent.bio || ''}
                onChange={(e) => handleContentChange('bio', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Image URL</Label>
              <Input
                type="text"
                value={componentContent.image || ''}
                onChange={(e) => handleContentChange('image', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>Skills</Label>
              {componentContent.skills && componentContent.skills.map((skill: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <Input
                    type="text"
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...componentContent.skills];
                      newSkills[index] = e.target.value;
                      handleContentChange('skills', newSkills);
                    }}
                    fullWidth
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = [...componentContent.skills];
                      newSkills.splice(index, 1);
                      handleContentChange('skills', newSkills);
                    }}
                    className="ml-2 p-1 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <AddButton
                type="button"
                onClick={() => {
                  const newSkills = [...(componentContent.skills || []), ''];
                  handleContentChange('skills', newSkills);
                }}
              >
                <Plus size={14} />
                Add Skill
              </AddButton>
            </FormGroup>
            <Button type="button" onClick={handleSaveContent}>
              Save Changes
            </Button>
          </Form>
        );
      
      case 'skills':
        return (
          <Form>
            <ContentGenerator 
              componentType="skills" 
              onContentGenerated={handleGeneratedContent} 
            />
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={componentContent.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>Skills</Label>
              {componentContent.skills && componentContent.skills.map((skill: any, index: number) => (
                <ArrayItemContainer key={index}>
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveArrayItem('skills', index)}
                  >
                    <X size={14} />
                  </RemoveButton>
                  <FormGroup>
                    <Label>Skill Name</Label>
                    <Input
                      type="text"
                      value={skill.name || ''}
                      onChange={(e) => handleContentChange(`skills.${index}.name`, e.target.value)}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Skill Level (0-100)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={skill.level || 0}
                      onChange={(e) => handleContentChange(`skills.${index}.level`, parseInt(e.target.value, 10))}
                      fullWidth
                    />
                  </FormGroup>
                </ArrayItemContainer>
              ))}
              <AddButton
                type="button"
                onClick={() =>
                  handleAddArrayItem('skills', {
                    name: 'New Skill',
                    level: 75,
                  })
                }
              >
                <Plus size={14} />
                Add Skill
              </AddButton>
            </FormGroup>
            <Button type="button" onClick={handleSaveContent}>
              Save Changes
            </Button>
          </Form>
        );
      
      case 'projects':
        return (
          <Form>
            <ContentGenerator 
              componentType="projects" 
              onContentGenerated={handleGeneratedContent} 
            />
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={componentContent.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>Projects</Label>
              {componentContent.projects && componentContent.projects.map((project: any, index: number) => (
                <ArrayItemContainer key={index}>
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveArrayItem('projects', index)}
                  >
                    <X size={14} />
                  </RemoveButton>
                  <FormGroup>
                    <Label>Project Title</Label>
                    <Input
                      type="text"
                      value={project.title || ''}
                      onChange={(e) => handleContentChange(`projects.${index}.title`, e.target.value)}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Description</Label>
                    <Textarea
                      value={project.description || ''}
                      onChange={(e) => handleContentChange(`projects.${index}.description`, e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Image URL</Label>
                    <Input
                      type="text"
                      value={project.image || ''}
                      onChange={(e) => handleContentChange(`projects.${index}.image`, e.target.value)}
                      fullWidth
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Link</Label>
                    <Input
                      type="text"
                      value={project.link || ''}
                      onChange={(e) => handleContentChange(`projects.${index}.link`, e.target.value)}
                      fullWidth
                    />
                  </FormGroup>
                </ArrayItemContainer>
              ))}
              <AddButton
                type="button"
                onClick={() =>
                  handleAddArrayItem('projects', {
                    title: 'New Project',
                    description: 'Project description',
                    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
                    link: '#',
                  })
                }
              >
                <Plus size={14} />
                Add Project
              </AddButton>
            </FormGroup>
            <Button type="button" onClick={handleSaveContent}>
              Save Changes
            </Button>
          </Form>
        );
      
      default:
        return <NoSelection>Unknown component type: {componentType}</NoSelection>;
    }
  };
  
  return (
    <Container>
      <Title>Content Editor - {componentType}</Title>
      {renderForm()}
    </Container>
  );
};