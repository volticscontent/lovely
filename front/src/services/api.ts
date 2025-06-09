import axios from 'axios';

// Usar a mesma configuração do config/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lovely.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Se receber 401, limpa o token e redireciona para login
      localStorage.removeItem('lovely.token');
      localStorage.removeItem('lovely.user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export { api }; 