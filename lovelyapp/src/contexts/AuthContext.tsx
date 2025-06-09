"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

// Tipos atualizados para o backend
interface User {
  id: string;
  email: string;
  name: string;
  plan?: string;
  hasActiveSubscription?: boolean;
}

interface Profile {
  id?: string;
  userId?: string;
  partnerName?: string;
  moodToday?: string;
  darinessLevel: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Subscription {
  id: string;
  planType: string;
  plan?: string;
  status: string;
  amount: number;
  startDate: string;
  expiresAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  hasAccess: (requiredPlan?: string) => boolean;
  setUserData: (userData: User) => void;
  apiRequest: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL do backend - usando variável de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
const SALES_URL = process.env.NEXT_PUBLIC_SALES_URL || 'http://localhost:3000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para definir dados do usuário diretamente (usado no callback)
  const setUserData = useCallback((userData: User) => {
    console.log('👤 [AUTH CONTEXT] Definindo dados do usuário diretamente:', userData);
    console.log('👤 [AUTH CONTEXT] hasActiveSubscription:', userData.hasActiveSubscription);
    console.log('👤 [AUTH CONTEXT] plan:', userData.plan);
    setUser(userData);
    setLoading(false);
    
    // Log do estado após definir
    setTimeout(() => {
      console.log('👤 [AUTH CONTEXT] Estado do usuário após setUser:', {
        user: userData,
        isAuthenticated: !!userData,
        hasActiveSubscription: userData.hasActiveSubscription
      });
    }, 100);
  }, []);

  // Função para fazer requisições autenticadas
  const apiRequest = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    console.log('🔍 [API REQUEST] Endpoint:', endpoint);
    
    const token = localStorage.getItem('token');
    console.log('🔍 [API REQUEST] Token presente:', token ? 'SIM' : 'NÃO');

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    console.log('📡 [API REQUEST] Fazendo requisição para:', `${API_URL}${endpoint}`);
    
    const response = await fetch(`${API_URL}${endpoint}`, config);
    console.log('📡 [API REQUEST] Status da resposta:', response.status);
    
    if (!response.ok) {
      console.error('❌ [API REQUEST] Resposta não OK:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [API REQUEST] Resposta recebida:', data);
    return data;
  }, []);

  // Função de logout
  const logout = () => {
    console.log('🚪 [LOGOUT] Fazendo logout...');
    setUser(null);
    setProfile(null);
    setSubscription(null);
    localStorage.removeItem('token');
    console.log('✅ [LOGOUT] Logout realizado, redirecionando...');
    window.location.href = `${API_URL}/auth`;
  };

  // ✅ OTIMIZADO: Carregar dados do usuário com useCallback
  const loadUserData = useCallback(async () => {
    console.log('📊 [LOAD USER DATA] Carregando dados do usuário...');
    
    try {
      // Carregar perfil
      console.log('👤 [LOAD USER DATA] Carregando perfil...');
      const profileData = await apiRequest('/api/profile');
      if (profileData.success) {
        console.log('✅ [LOAD USER DATA] Perfil carregado:', profileData.data);
        setProfile(profileData.data);
      } else {
        console.log('⚠️ [LOAD USER DATA] Falha ao carregar perfil');
      }

      // Carregar assinatura
      try {
        console.log('💳 [LOAD USER DATA] Carregando assinatura...');
        const subscriptionData = await apiRequest('/api/subscription');
        if (subscriptionData.success) {
          console.log('✅ [LOAD USER DATA] Assinatura carregada:', subscriptionData.data);
          setSubscription(subscriptionData.data);
        } else {
          console.log('⚠️ [LOAD USER DATA] Falha ao carregar assinatura');
        }
      } catch (error) {
        // Usuário pode não ter assinatura
        console.log('ℹ️ [LOAD USER DATA] Usuário sem assinatura ativa');
      }
    } catch (error) {
      console.error('💥 [LOAD USER DATA] Erro ao carregar dados do usuário:', error);
    }
  }, [apiRequest]);

  // ✅ OTIMIZADO: Verificar se usuário tem acesso a determinado conteúdo
  const hasAccess = useCallback((requiredPlan?: string): boolean => {
    // ✅ OTIMIZADO: Logs reduzidos para melhor performance
    if (!user || !user.hasActiveSubscription) {
      return false;
    }

    if (!requiredPlan) {
      return true; // Qualquer plano ativo
    }

    const planHierarchy = {
      'basico': 1,
      'medio': 2,
      'premium': 3
    };

    const userPlanLevel = planHierarchy[user.plan as keyof typeof planHierarchy] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0;

    const hasAccess = userPlanLevel >= requiredPlanLevel;
    
    // ✅ Log apenas quando necessário (para debug)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 [HAS ACCESS] ${user.plan} (${userPlanLevel}) >= ${requiredPlan} (${requiredPlanLevel}) = ${hasAccess ? 'LIBERADO' : 'NEGADO'}`);
    }

    return hasAccess;
  }, [user]);

  // Função para atualizar perfil com useCallback
  const updateProfile = useCallback(async (data: Partial<Profile>): Promise<boolean> => {
    if (!user) {
      console.error('❌ [UPDATE PROFILE] Usuário não autenticado');
      return false;
    }

    try {
      console.log('📝 [UPDATE PROFILE] Atualizando perfil:', data);
      
      const response = await apiRequest('/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const updatedProfile = await response.json();
      console.log('✅ [UPDATE PROFILE] Perfil atualizado:', updatedProfile);
      
      setProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error('💥 [UPDATE PROFILE] Erro ao atualizar perfil:', error);
      return false;
    }
  }, [user, apiRequest]);

  // Refresh dos dados do usuário (apenas quando necessário)
  const refreshUserData = useCallback(async () => {
    console.log('🔄 [REFRESH USER DATA] Iniciando refresh dos dados...');
    
    const token = localStorage.getItem('token');
    console.log(`🔄 [REFRESH USER DATA] Token no localStorage: ${token ? 'PRESENTE' : 'AUSENTE'}`);
    
    if (!token) {
      console.log('❌ [REFRESH USER DATA] Sem token, finalizando loading');
      setLoading(false);
      return;
    }

    // Decodificar o token para verificar os dados antes de usar
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('🔍 [REFRESH USER DATA] Dados do token JWT:', {
          userId: payload.userId,
          email: payload.email,
          exp: new Date(payload.exp * 1000).toLocaleString(),
          isExpired: payload.exp * 1000 < Date.now()
        });
        
        if (payload.exp * 1000 < Date.now()) {
          console.error('❌ [REFRESH USER DATA] Token expirado!');
          localStorage.removeItem('token');
          window.location.href = `${API_URL}/auth`;
          return;
        }
      }
    } catch (error) {
      console.error('❌ [REFRESH USER DATA] Token inválido (não é JWT válido):', error);
      localStorage.removeItem('token');
      window.location.href = `${API_URL}/auth`;
      return;
    }

    try {
      console.log('🔄 [REFRESH USER DATA] Validando token e carregando dados do usuário...');
      const response = await apiRequest('/api/auth/validate');
      
      if (response.success) {
        console.log('✅ [REFRESH USER DATA] Token válido, usuário autenticado:', response.data.user);
        setUser(response.data.user);
        await loadUserData();
        console.log('✅ [REFRESH USER DATA] Todos os dados carregados com sucesso');
      } else {
        console.log('❌ [REFRESH USER DATA] Token inválido, removendo e redirecionando');
        localStorage.removeItem('token');
        window.location.href = `${API_URL}/auth`;
      }
    } catch (error) {
      console.error('💥 [REFRESH USER DATA] Erro ao validar token:', error);
      console.log('🔄 [REFRESH USER DATA] Removendo token inválido e redirecionando');
      localStorage.removeItem('token');
      window.location.href = `${API_URL}/auth`;
    } finally {
      console.log('🏁 [REFRESH USER DATA] Finalizando loading');
      setLoading(false);
    }
  }, [apiRequest, loadUserData]);

  // Inicializar contexto de autenticação
  useEffect(() => {
    console.log('🚀 [AUTH CONTEXT] Inicializando AuthContext...');
    
    // VERIFICAR SE HÁ PARÂMETROS DE CALLBACK NA URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasCallbackParams = urlParams.get('token') && urlParams.get('user');
    
    if (hasCallbackParams) {
      console.log('🔄 [AUTH CONTEXT] Parâmetros de callback detectados - deixando CallbackProcessor processar');
      // NÃO FAZER NADA - deixar o CallbackProcessor controlar completamente
      return;
    }
    
    // SÓ PROCESSAR LOCALSTORAGE SE NÃO HOUVER PARÂMETROS DE CALLBACK
    const token = localStorage.getItem('token');
    console.log(`🔍 [AUTH CONTEXT] Verificando localStorage: ${token ? 'TOKEN PRESENTE' : 'SEM TOKEN'}`);
    
    if (!token) {
      console.log('🚫 [AUTH CONTEXT] Sem token no localStorage');
      setLoading(false);
      return;
    }

    console.log('🔍 [AUTH CONTEXT] Token encontrado, validando...');
    refreshUserData();
  }, [refreshUserData]);

  const value: AuthContextType = {
    user,
    profile,
    subscription,
    isAuthenticated: !!user,
    loading,
    logout,
    updateProfile,
    refreshUserData,
    hasAccess,
    setUserData,
    apiRequest,
  };

  console.log('🎯 [AUTH CONTEXT] Estado atual:', {
    user: user ? `${user.name} (${user.email})` : 'null',
    isAuthenticated: !!user,
    loading,
    hasProfile: !!profile,
    hasSubscription: !!subscription
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 