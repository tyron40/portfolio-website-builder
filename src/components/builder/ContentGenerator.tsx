import React, { useState } from 'react';
import styled from 'styled-components';
import { Wand2, Loader } from 'lucide-react';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { updateComponent } from '../../store/slices/builderSlice';
import { showNotification } from '../../store/slices/uiSlice';
import { Button } from '../ui/Button';
import { generatePortfolioContent } from '../../services/aiService';

const Container = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PromptInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

interface ContentGeneratorProps {
  componentType: string;
  onContentGenerated: (content: any) => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ 
  componentType,
  onContentGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const dispatch = useTypedDispatch();
  
  const handleGenerateContent = async () => {
    try {
      setIsGenerating(true);
      const generatedContent = await generatePortfolioContent(componentType, prompt);
      
      onContentGenerated(generatedContent);
      
      dispatch(showNotification({
        message: 'Content generated successfully!',
        type: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: error instanceof Error ? error.message : 'Failed to generate content',
        type: 'error',
      }));
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Container>
      <Title>
        <Wand2 size={16} />
        AI Content Generator
      </Title>
      <PromptInput
        type="text"
        placeholder={`Describe the ${componentType} content you want (optional)`}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button
        onClick={handleGenerateContent}
        fullWidth
        isLoading={isGenerating}
        leftIcon={isGenerating ? <Loader size={16} /> : <Wand2 size={16} />}
      >
        {isGenerating ? 'Generating...' : 'Generate Content'}
      </Button>
    </Container>
  );
};