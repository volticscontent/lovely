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
      // Simular autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        email: credentials.email,
        name: 'Usuário Teste'
      });
    } catch (error) {
      throw new Error('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: { email: string; password: string; name: string }) => {
    setIsLoading(true);
    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        email: userData.email,
        name: userData.name
      });
    } catch (error) {
      throw new Error('Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
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