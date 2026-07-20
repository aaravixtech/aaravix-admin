/**
 * Auth Context & Hook
 * Manages authentication state via HTTP-only cookies.
 * Validates session on mount, provides login/logout.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session on app load
  const checkAuth = useCallback(async () => {
    try {
      const admin = await authService.getMe();
      setUser(admin);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    // After login, fetch user info (cookie is set by backend)
    const admin = await authService.getMe();
    setUser(admin);
    return result;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Even if request fails, clear local state
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
