import React, { createContext, useState, useContext, useEffect } from 'react';
import { v2 } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load user on initial mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const data = await v2.getProfile();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    try {
      const responseData = await v2.register(userData);
      const { token, user } = responseData;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user || {}));
      setUser(user);
      return responseData;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const responseData = await v2.login({ email, password });
      const { token, user } = responseData;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user || {}));
      setUser(user);
      return responseData;
    } finally {
      setLoading(false);
    }
  };

  // Student portal login (student table auth flow)
  const studentPortalLogin = async (identifier, password) => {
    setLoading(true);
    try {
      const responseData = await v2.studentPortalLogin({
        email_or_student_id: identifier,
        // Keep both keys for backend compatibility.
        email: identifier,
        student_id: identifier,
        password,
      });
      const { token, user } = responseData;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user || {}));
      setUser(user);
      return responseData;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    try {
      await v2.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    initialized,
    register,
    login,
    studentPortalLogin,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};