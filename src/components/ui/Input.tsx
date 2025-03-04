import React, { InputHTMLAttributes, forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ $hasLeftIcon?: boolean; $hasRightIcon?: boolean; $hasError?: boolean }>`
  width: 100%;
  height: 2.5rem;
  padding: ${({ $hasLeftIcon, $hasRightIcon }) => {
    if ($hasLeftIcon && $hasRightIcon) return '0 2.5rem';
    if ($hasLeftIcon) return '0 0.75rem 0 2.5rem';
    if ($hasRightIcon) return '0 2.5rem 0 0.75rem';
    return '0 0.75rem';
  }};
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1f2937;
  background-color: #fff;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#ef4444' : '#d1d5db')};
  border-radius: 0.375rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#ef4444' : '#3b82f6')};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)')};
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ position }) =>
    position === 'left'
      ? css`
          left: 0.75rem;
        `
      : css`
          right: 0.75rem;
        `}
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, fullWidth = false, ...rest }, ref) => {
    return (
      <InputContainer $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <InputWrapper>
          {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
          <StyledInput
            ref={ref}
            $hasLeftIcon={!!leftIcon}
            $hasRightIcon={!!rightIcon}
            $hasError={!!error}
            {...rest}
          />
          {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
        </InputWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';