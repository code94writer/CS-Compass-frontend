import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I_LoginResponse } from '../types';

interface AuthContextType {
  user: I_LoginResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasSubscription: boolean;
  userToken: string | null;
  login: (userData: I_LoginResponse) => void;
  loginWithToken: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<I_LoginResponse | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('userToken');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
      }
    }
    
    if (savedToken) {
      setUserToken(savedToken);
    }
    
    setLoading(false);
  }, []);

  const login = (userData: I_LoginResponse) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  const loginWithToken = (token: string) => {
    setUserToken(token);
    localStorage.setItem('userToken', token);
    // Create a minimal user object for token-based auth
    const tokenUser: I_LoginResponse = {
      code: 'user',
      subscription: false,
      token: token,
    };
    setUser(tokenUser);
    localStorage.setItem('user', JSON.stringify(tokenUser));
  };

  const logout = () => {
    setUser(null);
    setUserToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
  };

  const isAuthenticated = !!user || !!userToken;
  const isAdmin = user?.code === 'admin';
  const hasSubscription = user?.subscription === true;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    hasSubscription,
    userToken,
    login,
    loginWithToken,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

