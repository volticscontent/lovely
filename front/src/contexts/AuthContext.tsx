"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (userData: { email: string; password: string; name: string }) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      console.log('Fazendo login com:', credentials.email);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Resposta do backend:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const responseData = await response.json();
      console.log('Dados recebidos completos:', JSON.stringify(responseData, null, 2));
      
      // Tentar diferentes estruturas de resposta
      let userData, token, redirectUrl;
      
      if (responseData.data) {
        // Estrutura: { data: { user: {...}, token: "...", redirectUrl: "..." } }
        const data = responseData.data;
        userData = data.user;
        token = data.token;
        redirectUrl = data.redirectUrl;
        console.log('Usando estrutura com data wrapper');
      } else if (responseData.user) {
        // Estrutura: { user: {...}, token: "...", redirectUrl: "..." }
        userData = responseData.user;
        token = responseData.token;
        redirectUrl = responseData.redirectUrl;
        console.log('Usando estrutura direta');
      } else {
        console.error('Estrutura de resposta não reconhecida:', responseData);
        throw new Error('Formato de resposta inválido do servidor');
      }
      
      // Verificar se temos dados do usuário
      if (!userData || !userData.id) {
        console.error('Dados do usuário não encontrados ou inválidos:', userData);
        throw new Error('Dados do usuário não encontrados na resposta');
      }
      
      // Salvar token se houver
      if (token) {
        localStorage.setItem('authToken', token);
        console.log('Token salvo no localStorage');
      }

      // Setar usuário
      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name
      };
      
      setUser(user);
      console.log('Usuário setado:', user);

      // Redirecionar se houver URL de redirecionamento
      if (redirectUrl) {
        console.log('Redirecionando para:', redirectUrl);
        window.location.href = redirectUrl;
        return; // Importante: sair da função após o redirecionamento
      } else {
        console.log('Nenhuma URL de redirecionamento encontrada');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: { email: string; password: string; name: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar conta');
      }

      const data = await response.json();
      
      // Salvar token se houver
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Setar usuário
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signUp,
      signOut,
      isLoading
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