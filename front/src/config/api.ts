import { logger } from '@/utils/logger';

// Configuração do backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

logger.info(`API Base URL: ${API_BASE_URL}`);
logger.info(`Environment: ${process.env.NODE_ENV}`);

// Rotas da API
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    VALIDATE: `${API_BASE_URL}/api/auth/validate`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/api/users/profile`,
  },
  PLANS: {
    LIST: `${API_BASE_URL}/api/plans`,
  },
  HEALTH: `${API_BASE_URL}/health`,
} as const; 