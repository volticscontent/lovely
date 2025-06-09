"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { API_ROUTES } from '@/config/api';

// Tipos básicos necessários apenas para tipagem no frontend
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      console.log('🔄 Iniciando login...');
      console.log('📧 Email:', email);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      console.log('🔗 URL da API:', `${API_URL}/api/auth/login`);
      
      const requestData = { email, password };
      console.log('📦 Dados enviados:', requestData);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('📊 Status da resposta:', response.status);
      console.log('✅ Response OK:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no login');
      }

      const data = await response.json();
      console.log('📋 Dados recebidos:', data);

      if (data.success && data.data) {
        console.log('✅ Login realizado com sucesso!');
        console.log('👤 Usuário logado:', data.data.user);
        console.log('🔑 Token JWT:', data.data.token);
        
        // REDIRECIONAMENTO SIMPLES E DIRETO
        const redirectUrl = data.data.redirectUrl;
        console.log('🔄 URL de redirecionamento:', redirectUrl);
        
        if (redirectUrl) {
          console.log('🚀 Redirecionando AGORA para:', redirectUrl);
          // Redirecionamento imediato e simples
          window.location.replace(redirectUrl);
        } else {
          throw new Error('URL de redirecionamento não fornecida pelo backend');
        }
      } else {
        throw new Error('Resposta inválida do servidor');
      }
      
    } catch (error) {
      console.error('💥 Erro detalhado no login:', error);
      setLoading(false);
      throw error;
    }
    // Não definimos setLoading(false) aqui porque vamos redirecionar
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      signIn,
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