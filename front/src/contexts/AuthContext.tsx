"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  hasActiveSubscription?: boolean;
}

interface Profile {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  preferences?: Record<string, unknown>;
}

interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate?: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Profile) => void;
  hasAccess: (accessLevel: string) => boolean;
  refreshUserData: () => Promise<void>;
  setUserData: (userData: User) => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  subscription: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  signUp: async () => {},
  logout: async () => {},
  updateProfile: () => {},
  hasAccess: () => false,
  refreshUserData: async () => {},
  setUserData: () => {},
  clearError: () => {},
});

// Função auxiliar para fazer requisições à API
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  if (typeof window === 'undefined') return new Response();
  
  const token = localStorage.getItem('token');
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  const response = await fetch(`${baseUrl}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  return response;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    subscription: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  // Função para carregar dados do usuário
  const loadUserData = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setState(prev => ({ ...prev, user: null, profile: null, subscription: null, isAuthenticated: false, isLoading: false }));
        return;
      }

      const [userData, profileData, subscriptionData] = await Promise.all([
        apiRequest('/user'),
        apiRequest('/profile'),
        apiRequest('/subscription')
      ]);

      if (userData.ok && profileData.ok && subscriptionData.ok) {
        const [user, profile, subscription] = await Promise.all([
          userData.json(),
          profileData.json(),
          subscriptionData.json()
        ]);

        setState(prev => ({
          ...prev,
          user,
          profile,
          subscription,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        // Se alguma requisição falhar, limpar dados
        setState(prev => ({ ...prev, user: null, profile: null, subscription: null, isAuthenticated: false, isLoading: false }));
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setState(prev => ({ ...prev, user: null, profile: null, subscription: null, isAuthenticated: false, isLoading: false }));
      localStorage.removeItem('token');
    }
  }, []);

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const login = async (credentials: LoginCredentials) => {
    if (typeof window === 'undefined') return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const responseData = await response.json();
      
      let userData, token, redirectUrl;
      
      if (responseData.data) {
        const data = responseData.data;
        userData = data.user;
        token = data.token;
        redirectUrl = data.redirectUrl;
      } else if (responseData.user) {
        userData = responseData.user;
        token = responseData.token;
        redirectUrl = responseData.redirectUrl;
      } else {
        throw new Error('Formato de resposta inválido do servidor');
      }
      
      if (!userData || !userData.id) {
        throw new Error('Dados do usuário não encontrados na resposta');
      }
      
      if (token) {
        localStorage.setItem('token', token);
      }

      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        hasActiveSubscription: userData.hasActiveSubscription,
      };
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
      }));

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Erro ao fazer login'),
        isLoading: false,
      }));
      throw error;
    }
  };

  const signUp = async (userData: { email: string; password: string; name: string }) => {
    if (typeof window === 'undefined') return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar conta');
      }

      const responseData = await response.json();
      
      let user, token;
      
      if (responseData.data) {
        const data = responseData.data;
        user = data.user;
        token = data.token;
      } else if (responseData.user) {
        user = responseData.user;
        token = responseData.token;
      } else {
        throw new Error('Formato de resposta inválido do servidor');
      }
      
      if (!user || !user.id) {
        throw new Error('Dados do usuário não encontrados na resposta');
      }
      
      if (token) {
        localStorage.setItem('token', token);
      }

      const userFormatted = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        hasActiveSubscription: user.hasActiveSubscription,
      };
      
      setState(prev => ({
        ...prev,
        user: userFormatted,
        isAuthenticated: true,
        isLoading: false,
      }));

      router.push('/');
    } catch (error) {
      console.error('Erro no registro:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Erro ao criar conta'),
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
      });
      localStorage.removeItem('token');
      setState({
        user: null,
        profile: null,
        subscription: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.push('/auth');
    } catch (error) {
      console.error('Erro no logout:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Erro ao fazer logout'),
        isLoading: false,
      }));
      throw error;
    }
  };

  const updateProfile = useCallback((profileData: Profile) => {
    setState(prev => ({
      ...prev,
      profile: profileData,
    }));
  }, []);

  const hasAccess = useCallback((accessLevel: string) => {
    if (!state.user?.hasActiveSubscription) return false;
    
    // Verificar nível de acesso baseado no role do usuário
    switch (accessLevel) {
      case 'admin':
        return state.user.role === 'admin';
      case 'user':
        return true;
      default:
        return false;
    }
  }, [state.user]);

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const setUserData = (userData: User) => {
    setState(prev => ({
      ...prev,
      user: userData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        profile: state.profile,
        subscription: state.subscription,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        login,
        signUp,
        logout,
        updateProfile,
        hasAccess,
        refreshUserData: loadUserData,
        setUserData,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 