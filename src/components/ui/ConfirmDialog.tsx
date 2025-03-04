import React from 'react';
import styled from 'styled-components';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { hideConfirmDialog } from '../../store/slices/uiSlice';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const DialogContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  width: 28rem;
  max-width: calc(100vw - 2rem);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: #fef2f2;
  color: #ef4444;
  margin-right: 1rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const DialogContent = styled.div`
  padding: 0 1.5rem 1.5rem;
`;

const Message = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const ConfirmDialog: React.FC = () => {
  const dispatch = useTypedDispatch();
  const { show, title, message, onConfirm, onCancel } = useTypedSelector((state) => state.ui.confirmDialog);
  
  if (!show) return null;
  
  const handleConfirm = () => {
    onConfirm();
    dispatch(hideConfirmDialog());
  };
  
  const handleCancel = () => {
    onCancel();
    dispatch(hideConfirmDialog());
  };
  
  return (
    <Overlay>
      <DialogContainer>
        <DialogHeader>
          <IconContainer>
            <AlertTriangle size={20} />
          </IconContainer>
          <Title>{title}</Title>
        </DialogHeader>
        <DialogContent>
          <Message>{message}</Message>
          <ButtonGroup>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              Confirm
            </Button>
          </ButtonGroup>
        </DialogContent>
      </DialogContainer>
    </Overlay>
  );
};