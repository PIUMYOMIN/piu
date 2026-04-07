import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const AuthInitializer = ({ children, fallback }) => {
  const { initialized } = useAuth();
  
  if (!initialized) {
    return fallback || null;
  }
  
  return children;
};