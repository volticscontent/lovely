// Tipos para Facebook Pixel
export interface FacebookPixel {
  (command: 'init', pixelId: string): void;
  (command: 'track', eventName: string, parameters?: Record<string, unknown>): void;
  (command: 'trackCustom', eventName: string, parameters?: Record<string, unknown>): void;
}

// Tipos para UTMify
export interface UTMify {
  (command: 'init', pixelId: string): void;
  (command: 'track', eventName: string, parameters?: Record<string, unknown>): void;
}

// Tipos para Performance API
export interface PerformanceLayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  cancelable: boolean;
}

// Tipos para autenticação
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription?: {
    plan: string;
    status: 'active' | 'inactive' | 'expired';
    expiresAt: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserData: (userData: User) => void;
}

// Tipos para planos
export type PlanId = 'basic' | 'premium' | 'vip';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  popular?: boolean;
  checkoutUrl: string;
}

// Tipos para jogos
export interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'couple' | 'solo' | 'quiz' | 'roleplay';
  difficulty: 'easy' | 'medium' | 'hard';
  minPlayers: number;
  maxPlayers: number;
}

// Tipos para métricas de performance
export interface PerformanceMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  entries?: PerformanceEntry[];
}

export interface PerformanceThreshold {
  good: number;
  needs_improvement: number;
}

export interface PerformanceThresholds {
  [key: string]: PerformanceThreshold;
}

// Tipos para API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

// Tipos para eventos de tracking
export interface TrackingEvent {
  name: string;
  parameters?: Record<string, unknown>;
  timestamp: number;
}

export interface PlanEvent {
  plan_name: string;
  plan_price: number;
  facebook_event: string;
  utmify_event: string;
}

// Tipos para componentes
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Tipos para formulários
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface FormData {
  [key: string]: string | number | boolean;
}

// Tipos para configurações
export interface AppConfig {
  apiUrl: string;
  pixelId: string;
  utmifyId: string;
  environment: 'development' | 'production';
} 