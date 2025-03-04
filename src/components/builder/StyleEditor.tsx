import React from 'react';
import styled from 'styled-components';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { updateComponent } from '../../store/slices/builderSlice';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

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

const ColorInput = styled.input`
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const StyleEditor: React.FC = () => {
  const dispatch = useTypedDispatch();
  const currentPageId = useTypedSelector((state) => state.builder.currentPageId);
  const selectedComponentId = useTypedSelector((state) => state.builder.selectedComponentId);
  const currentPortfolio = useTypedSelector((state) => state.builder.currentPortfolio);
  
  if (!currentPageId || !selectedComponentId || !currentPortfolio) {
    return (
      <Container>
        <Title>Style Editor</Title>
        <NoSelection>Select a component to edit its style</NoSelection>
      </Container>
    );
  }
  
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
  
  if (!selectedComponent) {
    return (
      <Container>
        <Title>Style Editor</Title>
        <NoSelection>Component not found</NoSelection>
      </Container>
    );
  }
  
  const handleStyleChange = (property: string, value: string) => {
    dispatch(
      updateComponent({
        pageId: currentPageId,
        sectionId,
        componentId: selectedComponentId,
        updates: {
          style: {
            ...selectedComponent!.style,
            [property]: value,
          },
        },
      })
    );
  };
  
  return (
    <Container>
      <Title>Style Editor</Title>
      <Form>
        <FormGroup>
          <Label>Background Color</Label>
          <ColorInput
            type="color"
            value={selectedComponent.style.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Text Color</Label>
          <ColorInput
            type="color"
            value={selectedComponent.style.textColor || '#000000'}
            onChange={(e) => handleStyleChange('textColor', e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Padding</Label>
          <Input
            type="text"
            value={selectedComponent.style.padding || '1rem'}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
            placeholder="e.g., 1rem or 10px 20px"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Margin</Label>
          <Input
            type="text"
            value={selectedComponent.style.margin || '0'}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
            placeholder="e.g., 1rem or 10px 20px"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Border Radius</Label>
          <Input
            type="text"
            value={selectedComponent.style.borderRadius || '0'}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            placeholder="e.g., 0.5rem or 8px"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Text Align</Label>
          <Select
            value={selectedComponent.style.textAlign || 'left'}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Font Size</Label>
          <Input
            type="text"
            value={selectedComponent.style.fontSize || '1rem'}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            placeholder="e.g., 1rem or 16px"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Font Weight</Label>
          <Select
            value={selectedComponent.style.fontWeight || 'normal'}
            onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
            <option value="bolder">Bolder</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </Select>
        </FormGroup>
      </Form>
    </Container>
  );
};