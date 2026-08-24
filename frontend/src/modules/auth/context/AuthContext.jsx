import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/authApi.js';

/**
 * Auth Context
 * 
 * Manages authentication state across the application.
 * Provides login, register, logout functions and user state.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (err) {
        // User is not authenticated - this is expected
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    try {
      const { user: userData } = await authApi.login(username, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (username, password) => {
    setError(null);
    try {
      const userData = await authApi.register(username, password);
      return userData;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout errors - clear local state anyway
    } finally {
      setUser(null);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * 
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
