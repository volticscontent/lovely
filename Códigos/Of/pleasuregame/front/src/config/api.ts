// Configuração do backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Rotas da API
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    VALIDATE: `${API_BASE_URL}/api/auth/validate`,
    LOGOUT_ALL: `${API_BASE_URL}/api/auth/logout-all`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/api/users/profile`,
  },
  PLANS: {
    LIST: `${API_BASE_URL}/api/plans`,
  },
  PAGES: {
    LIST: `${API_BASE_URL}/api/pages/list`,
  },
  HEALTH: `${API_BASE_URL}/api/health`,
} as const;

// Rotas que requerem autenticação
export const PROTECTED_ROUTES = [
  '/account',
  '/personalizacao',
  '/pages',
] as const;

// Função para verificar se uma rota é protegida
export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
}; 