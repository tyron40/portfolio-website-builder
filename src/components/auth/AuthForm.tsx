import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, Lock, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { registerUser, loginUser, clearError, loginAsGuest } from '../../store/slices/authSlice';

const FormContainer = styled.div`
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.5rem;
  text-align: center;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

const ToggleText = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  margin-left: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:focus {
    outline: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e5e7eb;
  }
  
  span {
    margin: 0 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
`;

interface AuthFormProps {
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useTypedDispatch();
  const { loading, error } = useTypedSelector((state) => state.auth);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction) && onSuccess) {
        onSuccess();
      }
    } else {
      const resultAction = await dispatch(registerUser({ email, password, name }));
      if (registerUser.fulfilled.match(resultAction) && onSuccess) {
        onSuccess();
      }
    }
  };
  
  const handleGuestLogin = async () => {
    const resultAction = await dispatch(loginAsGuest());
    if (loginAsGuest.fulfilled.match(resultAction) && onSuccess) {
      onSuccess();
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    dispatch(clearError());
  };
  
  return (
    <FormContainer>
      <Title>{isLogin ? 'Sign In' : 'Create Account'}</Title>
      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <Input
            label="Name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User size={18} />}
            fullWidth
            required
          />
        )}
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={18} />}
          fullWidth
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={18} />}
          fullWidth
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" fullWidth isLoading={loading}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </Button>
      </Form>
      
      <Divider>
        <span>OR</span>
      </Divider>
      
      <Button 
        variant="secondary" 
        fullWidth 
        onClick={handleGuestLogin}
      >
        Continue as Guest
      </Button>
      
      <ToggleContainer>
        <ToggleText>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
        </ToggleText>
        <ToggleButton type="button" onClick={toggleAuthMode}>
          {isLogin ? 'Sign Up' : 'Sign In'}
        </ToggleButton>
      </ToggleContainer>
    </FormContainer>
  );
};