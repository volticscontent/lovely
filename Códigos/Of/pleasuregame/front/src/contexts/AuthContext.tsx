"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/api';
import Cookies from 'js-cookie';

// Tipos básicos necessários apenas para tipagem no frontend
interface User {
  id: string;
  email: string;
  name: string;
  subscription?: {
    type: string;
    status: string;
  };
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('auth_token');
      if (token) {
        try {
          const response = await fetch(API_ROUTES.AUTH.VALIDATE, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            Cookies.remove('auth_token');
          }
        } catch (error) {
          // Fallback silencioso para erro de inicialização
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Credenciais inválidas');
      }

      const data = await response.json();
      
      Cookies.set('auth_token', data.token, { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
      });
      
      setUser(data.user);
      
      // Usar redirectUrl do backend se disponível
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        router.push('/account');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const response = await fetch(API_ROUTES.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registrar usuário');
      }

      const responseData = await response.json();
      Cookies.set('auth_token', responseData.token, { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
      });
      setUser(responseData.user);
      
      // Usar redirectUrl do backend se disponível
      if (responseData.redirectUrl) {
        window.location.href = responseData.redirectUrl;
      } else {
        router.push('/account');
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const token = Cookies.get('auth_token');
      if (token) {
        await fetch(API_ROUTES.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      Cookies.remove('auth_token');
      setUser(null);
      router.push('/auth');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 