import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  as?: React.ElementType;
}

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  $isLoading?: boolean;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  
  ${({ variant }) =>
    variant === 'primary' &&
    css`
      background-color: #3b82f6;
      color: white;
      border: 1px solid #3b82f6;
      
      &:hover:not(:disabled) {
        background-color: #2563eb;
        border-color: #2563eb;
      }
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
      }
    `}
  
  ${({ variant }) =>
    variant === 'secondary' &&
    css`
      background-color: white;
      color: #1f2937;
      border: 1px solid #d1d5db;
      
      &:hover:not(:disabled) {
        background-color: #f3f4f6;
      }
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.5);
      }
    `}
  
  ${({ variant }) =>
    variant === 'danger' &&
    css`
      background-color: #ef4444;
      color: white;
      border: 1px solid #ef4444;
      
      &:hover:not(:disabled) {
        background-color: #dc2626;
        border-color: #dc2626;
      }
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5);
      }
    `}
  
  ${({ variant }) =>
    variant === 'ghost' &&
    css`
      background-color: transparent;
      color: #4b5563;
      border: 1px solid transparent;
      
      &:hover:not(:disabled) {
        background-color: #f3f4f6;
      }
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.5);
      }
    `}
  
  ${({ variant }) =>
    variant === 'link' &&
    css`
      background-color: transparent;
      color: #3b82f6;
      border: none;
      padding: 0;
      height: auto;
      
      &:hover:not(:disabled) {
        text-decoration: underline;
      }
      
      &:focus {
        outline: none;
      }
    `}
  
  ${({ size }) =>
    size === 'sm' &&
    css`
      font-size: 0.875rem;
      height: 2rem;
      padding: 0 0.75rem;
    `}
  
  ${({ size }) =>
    size === 'md' &&
    css`
      font-size: 0.875rem;
      height: 2.5rem;
      padding: 0 1rem;
    `}
  
  ${({ size }) =>
    size === 'lg' &&
    css`
      font-size: 1rem;
      height: 3rem;
      padding: 0 1.5rem;
    `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${({ $isLoading }) =>
    $isLoading &&
    css`
      position: relative;
      color: transparent;
      
      &::after {
        content: '';
        position: absolute;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border: 2px solid currentColor;
        border-right-color: transparent;
        animation: spin 0.75s linear infinite;
      }
      
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}
`;

const IconWrapper = styled.span<{ position: 'left' | 'right' }>`
  display: inline-flex;
  align-items: center;
  margin-left: ${({ position }) => (position === 'right' ? '0.5rem' : '0')};
  margin-right: ${({ position }) => (position === 'left' ? '0.5rem' : '0')};
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  as,
  ...rest
}) => {
  return (
    <StyledButton
      as={as}
      variant={variant}
      size={size}
      $isLoading={isLoading}
      $fullWidth={fullWidth}
      disabled={isLoading || disabled}
      {...rest}
    >
      {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
      {children}
      {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
    </StyledButton>
  );
};