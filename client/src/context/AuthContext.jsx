// Authentication context - manages user authentication state globally
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// AuthProvider component - wraps app and provides auth state
export const AuthProvider = ({ children }) => {
  // State management for user and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check authentication status
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Verify token and get user info
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (error) {
      // Token invalid, clear it
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  // Register function
  const register = async (email, password, name) => {
    const response = await authAPI.register(email, password, name);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Value object to provide to context consumers
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin === 1
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

