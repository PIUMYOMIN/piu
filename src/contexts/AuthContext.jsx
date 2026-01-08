// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  });
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v2/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Login failed';
        try {
          const data = JSON.parse(text);
          errorMessage = data.message || errorMessage;
        } catch (e) {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v2/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        register, 
        logout,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);