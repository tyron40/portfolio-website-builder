import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { hideNotification } from '../../store/slices/uiSlice';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div<{ $show: boolean; $type: 'success' | 'error' | 'info' }>`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  align-items: center;
  width: 24rem;
  max-width: calc(100vw - 2rem);
  padding: 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: ${({ $show }) => ($show ? slideIn : slideOut)} 0.3s ease-in-out forwards;
  
  ${({ $type }) =>
    $type === 'success' &&
    css`
      background-color: #ecfdf5;
      border-left: 4px solid #10b981;
    `}
  
  ${({ $type }) =>
    $type === 'error' &&
    css`
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
    `}
  
  ${({ $type }) =>
    $type === 'info' &&
    css`
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
    `}
`;

const IconContainer = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  
  ${({ $type }) =>
    $type === 'success' &&
    css`
      color: #10b981;
    `}
  
  ${({ $type }) =>
    $type === 'error' &&
    css`
      color: #ef4444;
    `}
  
  ${({ $type }) =>
    $type === 'info' &&
    css`
      color: #3b82f6;
    `}
`;

const Content = styled.div`
  flex: 1;
`;

const Message = styled.p`
  font-size: 0.875rem;
  color: #1f2937;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
  color: #6b7280;
  background: transparent;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: #1f2937;
  }
  
  &:focus {
    outline: none;
  }
`;

export const Notification: React.FC = () => {
  const dispatch = useTypedDispatch();
  const { show, message, type } = useTypedSelector((state) => state.ui.notification);
  
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);
  
  const handleClose = () => {
    dispatch(hideNotification());
  };
  
  if (!show && !message) return null;
  
  return (
    <NotificationContainer $show={show} $type={type}>
      <IconContainer $type={type}>
        {type === 'success' && <CheckCircle size={20} />}
        {type === 'error' && <AlertCircle size={20} />}
        {type === 'info' && <Info size={20} />}
      </IconContainer>
      <Content>
        <Message>{message}</Message>
      </Content>
      <CloseButton onClick={handleClose}>
        <X size={16} />
      </CloseButton>
    </NotificationContainer>
  );
};