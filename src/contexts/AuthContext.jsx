import React, { createContext, useState, useContext, useEffect } from 'react';
import { v2 } from '../utils/api';
import { ACCOUNT_TYPES, resolveAccountType } from '../utils/authRouting';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const persistSession = ({ token, user, accountType }) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');

  localStorage.setItem('user', JSON.stringify(user || {}));
  localStorage.setItem('account_type', accountType);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const hasUsableToken = token && token !== 'undefined' && token !== 'null';
      if (!hasUsableToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('account_type');
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const data = await v2.getProfile();
        const nextUser = data.user;
        const nextAccountType = resolveAccountType(nextUser, data.account_type || ACCOUNT_TYPES.STAFF);
        setUser(nextUser);
        setAccountType(nextAccountType);
        localStorage.setItem('user', JSON.stringify(nextUser || {}));
        localStorage.setItem('account_type', nextAccountType);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('account_type');
        setUser(null);
        setAccountType(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadUser();
  }, []);

  const register = async (userData) => {
    setLoading(true);
    try {
      const responseData = await v2.register(userData);
      const { token, user: nextUser } = responseData;
      const nextAccountType = resolveAccountType(nextUser, responseData.account_type || ACCOUNT_TYPES.STAFF);
      persistSession({ token, user: nextUser, accountType: nextAccountType });
      setUser(nextUser);
      setAccountType(nextAccountType);
      return responseData;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const responseData = await v2.login({ email, password });
      const { token, user: nextUser } = responseData;
      const nextAccountType = resolveAccountType(nextUser, responseData.account_type || ACCOUNT_TYPES.STAFF);
      persistSession({ token, user: nextUser, accountType: nextAccountType });
      setUser(nextUser);
      setAccountType(nextAccountType);
      return responseData;
    } finally {
      setLoading(false);
    }
  };

  const studentPortalLogin = async (studentId, password) => {
    setLoading(true);
    try {
      const responseData = await v2.studentPortalLogin({
        student_id: studentId,
        password,
      });
      const { token, user: nextUser } = responseData;
      const nextAccountType = resolveAccountType(nextUser, responseData.account_type || ACCOUNT_TYPES.STUDENT);
      persistSession({ token, user: nextUser, accountType: nextAccountType });
      setUser(nextUser);
      setAccountType(nextAccountType);
      return responseData;
    } finally {
      setLoading(false);
    }
  };

  const logoutLocal = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('account_type');
    setUser(null);
    setAccountType(null);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await v2.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logoutLocal();
      setLoading(false);
    }
  };

  const value = {
    user,
    accountType,
    loading,
    initialized,
    register,
    login,
    studentPortalLogin,
    logout,
    logoutLocal,
    isAuthenticated: !!user,
    isStudent: accountType === ACCOUNT_TYPES.STUDENT,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
