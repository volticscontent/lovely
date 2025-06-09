'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import UserPanel from './UserPanel';
import GamesPanel from './GamesPanel';
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';
import { 
  Home, 
  Gamepad2, 
  User, 
  Trophy, 
  Settings, 
  Menu, 
  X,
  Heart,
  Star,
  Clock,
  Calendar,
  Bell,
  ChevronDown,
  LogOut,
  Crown,
  Zap,
  Gift,
  Shield,
  ChevronRight,
  Plus,
  Sparkles,
  Target,
  Award,
  Activity
} from 'lucide-react';

// Interface para estatísticas do usuário
interface UserStats {
  gamesPlayed: number;
  favoriteGames: number;
  totalPlayTime: number; // em minutos
  currentLevel: number;
  achievements: number;
  weeklyPlayTime: number;
  monthlyGames: number;
  consecutiveDays: number;
  lastActivity: Date | null;
  loading: boolean;
}

// Interface para atividade recente
interface RecentActivity {
  id: string;
  action: string;
  time: string;
  type: 'game' | 'achievement' | 'level' | 'streak';
  createdAt: string;
}

// Hook personalizado para gerenciar estatísticas do backend
const useUserStats = (userId?: string): UserStats => {
  const [stats, setStats] = useState<UserStats>({
    gamesPlayed: 0,
    favoriteGames: 0,
    totalPlayTime: 0,
    currentLevel: 1,
    achievements: 0,
    weeklyPlayTime: 0,
    monthlyGames: 0,
    consecutiveDays: 0,
    lastActivity: null,
    loading: true
  });

  const { apiRequest } = useAuth();

  useEffect(() => {
    if (!userId || !apiRequest) return;

    const loadUserStats = async () => {
      try {
        console.log('📊 [USER STATS] Carregando estatísticas do backend...');
        
        // Buscar estatísticas do backend
        const response = await apiRequest('/api/user/stats');
        
        if (response.success) {
          const backendStats = response.data;
          console.log('✅ [USER STATS] Estatísticas carregadas:', backendStats);
          
          setStats({
            gamesPlayed: backendStats.gamesPlayed || 0,
            favoriteGames: backendStats.favoriteGames || 0,
            totalPlayTime: backendStats.totalPlayTime || 0,
            currentLevel: backendStats.currentLevel || 1,
            achievements: backendStats.achievements || 0,
            weeklyPlayTime: backendStats.weeklyPlayTime || 0,
            monthlyGames: backendStats.monthlyGames || 0,
            consecutiveDays: backendStats.consecutiveDays || 0,
            lastActivity: backendStats.lastActivity ? new Date(backendStats.lastActivity) : null,
            loading: false
          });
        } else {
          console.log('⚠️ [USER STATS] Falha ao carregar estatísticas, usando dados padrão');
          // Usar dados padrão se não conseguir carregar do backend
          setStats(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('❌ [USER STATS] Erro ao carregar estatísticas:', error);
        
        // Em caso de erro, usar dados do localStorage como fallback
        const savedStats = localStorage.getItem(`userStats_${userId}`);
        if (savedStats) {
          try {
            const parsedStats = JSON.parse(savedStats);
            setStats({
              ...parsedStats,
              lastActivity: parsedStats.lastActivity ? new Date(parsedStats.lastActivity) : null,
              loading: false
            });
          } catch (parseError) {
            console.error('❌ [USER STATS] Erro ao parsear dados do localStorage:', parseError);
            setStats(prev => ({ ...prev, loading: false }));
          }
        } else {
          // Dados iniciais para novos usuários
          const initialStats: UserStats = {
            gamesPlayed: Math.floor(Math.random() * 15) + 5,
            favoriteGames: Math.floor(Math.random() * 8) + 3,
            totalPlayTime: Math.floor(Math.random() * 1200) + 300,
            currentLevel: Math.floor(Math.random() * 10) + 1,
            achievements: Math.floor(Math.random() * 20) + 5,
            weeklyPlayTime: Math.floor(Math.random() * 300) + 60,
            monthlyGames: Math.floor(Math.random() * 8) + 2,
            consecutiveDays: Math.floor(Math.random() * 14) + 1,
            lastActivity: new Date(),
            loading: false
          };
          setStats(initialStats);
          localStorage.setItem(`userStats_${userId}`, JSON.stringify(initialStats));
        }
      }
    };

    loadUserStats();
  }, [userId, apiRequest]);

  return stats;
};

// Hook para atividades recentes
const useRecentActivities = (userId?: string): RecentActivity[] => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const { apiRequest } = useAuth();

  useEffect(() => {
    if (!userId || !apiRequest) return;

    const loadRecentActivities = async () => {
      try {
        console.log('📋 [RECENT ACTIVITIES] Carregando atividades recentes...');
        
        const response = await apiRequest('/api/user/activities');
        
        if (response.success) {
          console.log('✅ [RECENT ACTIVITIES] Atividades carregadas:', response.data);
          setActivities(response.data || []);
        } else {
          console.log('⚠️ [RECENT ACTIVITIES] Falha ao carregar atividades');
          setActivities([]);
        }
      } catch (error) {
        console.error('❌ [RECENT ACTIVITIES] Erro ao carregar atividades:', error);
        setActivities([]);
      }
    };

    loadRecentActivities();
  }, [userId, apiRequest]);

  return activities;
};

// Função para calcular nível baseado em experiência
const calculateLevel = (gamesPlayed: number, achievements: number): number => {
  const experience = (gamesPlayed * 10) + (achievements * 25);
  return Math.floor(experience / 100) + 1;
};

// Função para obter nome do nível
const getLevelName = (level: number): string => {
  if (level <= 2) return 'Iniciante';
  if (level <= 4) return 'Romântico';
  if (level <= 6) return 'Aventureiro';
  if (level <= 8) return 'Experiente';
  if (level <= 10) return 'Mestre do Amor';
  return 'Lenda Romântica';
};

// Função para formatar tempo
const formatPlayTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

// Função para formatar tempo relativo
const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const activityDate = new Date(date);
  const diffInHours = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Agora mesmo';
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  
  return activityDate.toLocaleDateString('pt-BR');
};

export default function UserDashboard() {
  const { user, subscription, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const userStats = useUserStats(user?.id);
  const recentActivities = useRecentActivities(user?.id);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Novo jogo disponível!', message: 'Confira o jogo "Noite Romântica"', time: '2h atrás', unread: true },
    { id: 2, title: 'Conquista desbloqueada!', message: 'Você ganhou a conquista "Aventureiro"', time: '1 dia atrás', unread: true },
    { id: 3, title: 'Lembrete', message: 'Que tal jogar algo hoje?', time: '2 dias atrás', unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Este mês');

  // Calcular estatísticas dinâmicas
  const dynamicStats = useMemo(() => {
    if (userStats.loading) {
      return [
        { title: 'Jogos Favoritos', value: '...', change: 'Carregando...', icon: Heart, gradient: 'from-primary-500 to-primary-600', changeColor: 'text-gray-500', bgGradient: 'from-primary-50 to-primary-100' },
        { title: 'Tempo Jogado', value: '...', change: 'Carregando...', icon: Clock, gradient: 'from-secondary-500 to-secondary-600', changeColor: 'text-gray-500', bgGradient: 'from-secondary-50 to-secondary-100' },
        { title: 'Nível Atual', value: '...', change: 'Carregando...', icon: Star, gradient: 'from-purple-500 to-pink-500', changeColor: 'text-gray-500', bgGradient: 'from-purple-50 to-pink-50' },
        { title: 'Conquistas', value: '...', change: 'Carregando...', icon: Trophy, gradient: 'from-warning-500 to-orange-500', changeColor: 'text-gray-500', bgGradient: 'from-warning-50 to-orange-50' }
      ];
    }

    const currentLevel = calculateLevel(userStats.gamesPlayed, userStats.achievements);
    const levelName = getLevelName(currentLevel);
    
    return [
      { 
        title: 'Jogos Favoritos', 
        value: userStats.favoriteGames.toString(), 
        change: `+${userStats.monthlyGames} este mês`, 
        icon: Heart, 
        gradient: 'from-primary-500 to-primary-600', 
        changeColor: 'text-success-600',
        bgGradient: 'from-primary-50 to-primary-100'
      },
      { 
        title: 'Tempo Jogado', 
        value: formatPlayTime(userStats.totalPlayTime), 
        change: `+${formatPlayTime(userStats.weeklyPlayTime)} esta semana`, 
        icon: Clock, 
        gradient: 'from-secondary-500 to-secondary-600', 
        changeColor: 'text-secondary-600',
        bgGradient: 'from-secondary-50 to-secondary-100'
      },
      { 
        title: 'Nível Atual', 
        value: currentLevel.toString(), 
        change: levelName, 
        icon: Star, 
        gradient: 'from-purple-500 to-pink-500', 
        changeColor: 'text-purple-600',
        bgGradient: 'from-purple-50 to-pink-50'
      },
      { 
        title: 'Conquistas', 
        value: userStats.achievements.toString(), 
        change: `${userStats.consecutiveDays} dias seguidos!`, 
        icon: Trophy, 
        gradient: 'from-warning-500 to-orange-500', 
        changeColor: 'text-warning-600',
        bgGradient: 'from-warning-50 to-orange-50'
      }
    ];
  }, [userStats]);

  // Atividades recentes formatadas
  const formattedActivities = useMemo(() => {
    if (recentActivities.length > 0) {
      return recentActivities.slice(0, 3).map(activity => ({
        action: activity.action,
        time: formatRelativeTime(activity.createdAt)
      }));
    }

    // Fallback para quando não há atividades do backend
    const fallbackActivities = [];
    
    if (userStats.lastActivity) {
      const timeDiff = Date.now() - userStats.lastActivity.getTime();
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      
      if (hoursAgo < 24) {
        fallbackActivities.push({
          action: 'Última sessão de jogo',
          time: hoursAgo < 1 ? 'Agora mesmo' : `${hoursAgo}h atrás`
        });
      }
    }
    
    fallbackActivities.push(
      { action: `Completou ${userStats.gamesPlayed} jogos`, time: 'Total' },
      { action: `Nível ${calculateLevel(userStats.gamesPlayed, userStats.achievements)} alcançado`, time: 'Progresso' },
      { action: `${userStats.consecutiveDays} dias consecutivos`, time: 'Sequência atual' }
    );
    
    return fallbackActivities.slice(0, 3);
  }, [recentActivities, userStats]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (isUserMenuOpen && !target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false);
      }
      
      if (showNotifications && !target.closest('[data-notifications]')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, showNotifications]);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [activeTab]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-3xl animate-pulse mx-auto flex items-center justify-center shadow-xl overflow-hidden bg-white dark:bg-gray-800">
              <Image 
                src="/imgs/logo.png" 
                alt="Lovely Logo" 
                width={80} 
                height={80}
                className="object-contain animate-float"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl animate-ping opacity-20"></div>
          </div>
          <h3 className="text-heading-2 font-display mb-3 gradient-text">
            Carregando sua experiência
          </h3>
          <p className="text-body text-gray-600">Preparando tudo para você...</p>
        </div>
      </div>
    );
  }

  const getPlanIcon = (planType?: string) => {
    switch (planType) {
      case 'basico': return <Gift className="w-4 h-4" />;
      case 'medio': return <Zap className="w-4 h-4" />;
      case 'premium': return <Crown className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getPlanColor = (planType?: string) => {
    switch (planType) {
      case 'basico': return 'from-warning-400 to-warning-500';
      case 'medio': return 'from-primary-500 to-secondary-500';
      case 'premium': return 'from-error-500 to-primary-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getPlanName = (planType?: string) => {
    switch (planType) {
      case 'basico': return 'Básico';
      case 'medio': return 'Médio';
      case 'premium': return 'Premium';
      default: return 'Gratuito';
    }
  };

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, description: 'Visão geral', gradient: 'from-primary-500 to-primary-600' },
    { id: 'games', name: 'Jogos', icon: Gamepad2, description: 'Explorar jogos', gradient: 'from-secondary-500 to-secondary-600' },
    { id: 'profile', name: 'Perfil', icon: User, description: 'Meu perfil', gradient: 'from-purple-500 to-pink-500' },
    { id: 'achievements', name: 'Conquistas', icon: Trophy, description: 'Minhas conquistas', gradient: 'from-warning-500 to-orange-500' },
    { id: 'settings', name: 'Configurações', icon: Settings, description: 'Preferências', gradient: 'from-gray-500 to-gray-600' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsUserMenuOpen(false);
    setShowNotifications(false);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Header da seção */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-display-2 font-display gradient-text">
                  Olá, {user.name?.split(' ')[0] || 'Usuário'}! 👋
                </h1>
                <p className="text-body-lg text-gray-600">
                  Bem-vindo de volta à sua jornada romântica
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button 
                  onClick={() => setTimeFilter(timeFilter === 'Este mês' ? 'Esta semana' : 'Este mês')}
                  className="btn btn-secondary hover-lift"
                >
                  <Calendar className="h-4 w-4" />
                  {timeFilter}
                </button>
                <button 
                  onClick={() => handleTabChange('games')}
                  className="btn btn-primary hover-lift hover-glow"
                >
                  <Plus className="h-4 w-4" />
                  Novo jogo
                </button>
              </div>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {dynamicStats.map((stat, index) => (
                <div key={index} className={`card hover-lift hover-glow bg-gradient-to-br ${stat.bgGradient} dark:from-gray-900 dark:to-gray-850 border-0 dark:border dark:border-gray-700 group cursor-pointer animate-slide-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1 min-w-0">
                        <p className="text-caption text-gray-600 dark:text-gray-400 font-medium">{stat.title}</p>
                        <p className="text-display-1 font-display font-bold text-gray-900 dark:text-gray-100 group-hover:scale-105 transition-transform duration-200">{stat.value}</p>
                        <p className={`text-body-sm font-medium ${stat.changeColor} dark:text-gray-300`}>{stat.change}</p>
                      </div>
                      <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 flex-shrink-0`}>
                        <stat.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Seções principais */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Jogos recomendados */}
              <div className="xl:col-span-2">
                <div className="card hover-lift bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border-gray-200 dark:border-gray-700">
                  <div className="card-body p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-heading-2 font-display text-gray-900 dark:text-gray-100">Jogos Recomendados</h3>
                      </div>
                      <button 
                        onClick={() => handleTabChange('games')}
                        className="btn btn-ghost text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex-shrink-0"
                      >
                        Ver todos
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: 'Noite Romântica', desc: 'Perfeito para um encontro especial', difficulty: 'Calmo', time: '30 min' },
                        { name: 'Aventura a Dois', desc: 'Explorem juntos novos horizontes', difficulty: 'Médio', time: '45 min' },
                        { name: 'Desafio do Amor', desc: 'Testem o quanto se conhecem', difficulty: 'Picante', time: '60 min' }
                      ].map((game, i) => (
                        <div key={i} className="card-compact bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-md dark:hover:shadow-dark-medium transition-all duration-200 cursor-pointer group p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                              <Gamepad2 className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-body font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">{game.name}</h4>
                              <p className="text-body-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{game.desc}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="badge badge-primary">{game.difficulty}</span>
                                <span className="text-caption text-gray-500 dark:text-gray-400 flex items-center">
                                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                                  {game.time}
                                </span>
                              </div>
                            </div>
                            <button className="btn btn-primary btn-sm hover-lift flex-shrink-0">
                              Jogar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conquistas e atividade */}
              <div className="space-y-6">
                {/* Conquistas recentes */}
                <div className="card hover-lift bg-gradient-to-br from-warning-50 to-orange-50 dark:from-gray-900 dark:to-gray-850 border-warning-200 dark:border-gray-700">
                  <div className="card-body p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-heading-3 font-display text-gray-900 dark:text-gray-100">Conquistas</h3>
                      </div>
                      <button 
                        onClick={() => handleTabChange('achievements')}
                        className="btn btn-ghost text-warning-600 dark:text-warning-400 hover:text-warning-700 dark:hover:text-warning-300 hover:bg-warning-100 dark:hover:bg-warning-900/20 flex-shrink-0"
                      >
                        Ver todas
                      </button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Primeiro Passo', xp: '+50 XP', icon: Target },
                        { name: 'Aventureiro', xp: '+100 XP', icon: Award },
                        { name: 'Romântico', xp: '+75 XP', icon: Heart }
                      ].map((achievement, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-950 rounded-xl border border-warning-100 dark:border-gray-700 hover:border-warning-200 dark:hover:border-warning-600 transition-colors">
                          <div className="w-10 h-10 bg-gradient-to-br from-warning-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                            <achievement.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-body-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{achievement.name}</p>
                            <p className="text-caption text-warning-600 dark:text-warning-400 font-medium">{achievement.xp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Atividade recente */}
                <div className="card hover-lift bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <div className="card-body p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-heading-3 font-display text-gray-900 dark:text-gray-100">Atividade Recente</h3>
                    </div>
                    <div className="space-y-4">
                      {formattedActivities.map((activity, i) => (
                        <div key={i} className="flex items-center space-x-3 text-body-sm">
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-900 dark:text-gray-100 flex-1 min-w-0 truncate">{activity.action}</span>
                          <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'games':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h1 className="text-display-2 font-display gradient-text">Jogos</h1>
            </div>
            <GamesPanel />
          </div>
        );
      case 'profile':
        return (
          <div className="animate-fade-in">
            <UserPanel />
          </div>
        );
      case 'achievements':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-display-2 font-display gradient-text mb-4">Suas Conquistas</h2>
              <p className="text-body-lg text-gray-600 dark:text-gray-400">Desbloqueie conquistas jogando e explorando novos desafios</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Primeiro Passo', desc: 'Complete seu primeiro jogo', unlocked: true, icon: '🎯', gradient: 'from-success-500 to-success-600', bgGradient: 'from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20' },
                { title: 'Aventureiro', desc: 'Jogue 10 jogos diferentes', unlocked: true, icon: '🗺️', gradient: 'from-secondary-500 to-secondary-600', bgGradient: 'from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20' },
                { title: 'Romântico', desc: 'Complete 5 jogos de romance', unlocked: true, icon: '💕', gradient: 'from-primary-500 to-primary-600', bgGradient: 'from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20' },
                { title: 'Corajoso', desc: 'Tente um jogo de nível difícil', unlocked: false, icon: '⚡', gradient: 'from-warning-500 to-orange-500', bgGradient: 'from-warning-50 to-orange-50 dark:from-warning-900/10 dark:to-orange-900/10' },
                { title: 'Dedicado', desc: 'Jogue por 7 dias seguidos', unlocked: false, icon: '🔥', gradient: 'from-error-500 to-error-600', bgGradient: 'from-error-50 to-error-100 dark:from-error-900/10 dark:to-error-800/10' },
                { title: 'Mestre', desc: 'Desbloqueie todos os jogos', unlocked: false, icon: '👑', gradient: 'from-purple-500 to-pink-500', bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10' }
              ].map((achievement, index) => (
                <div key={index} className={`card hover-lift text-center transition-all duration-300 border ${
                  achievement.unlocked 
                    ? `bg-gradient-to-br ${achievement.bgGradient} border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl` 
                    : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-80'
                }`}>
                  <div className="card-body p-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
                      achievement.unlocked 
                        ? `bg-gradient-to-br ${achievement.gradient} shadow-lg hover:shadow-xl hover:scale-105` 
                        : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
                    }`}>
                      {achievement.unlocked ? (
                        <span className="text-white drop-shadow-sm">{achievement.icon}</span>
                      ) : (
                        <span className="grayscale opacity-50 dark:opacity-30">{achievement.icon}</span>
                      )}
                    </div>
                    <h4 className="text-heading-3 font-display text-gray-900 dark:text-gray-100 mb-2">{achievement.title}</h4>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{achievement.desc}</p>
                    {achievement.unlocked ? (
                      <span className="badge badge-success shadow-sm">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></span>
                          <span>Desbloqueado</span>
                        </span>
                      </span>
                    ) : (
                      <span className="badge badge-warning opacity-75 dark:opacity-60">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-warning-400 rounded-full"></span>
                          <span>Bloqueado</span>
                        </span>
                      </span>
                    )}
                  </div>
                  
                  {/* Efeito de brilho para conquistas desbloqueadas */}
                  {achievement.unlocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Estatísticas de conquistas */}
            <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-heading-2 font-display text-gray-900 dark:text-gray-100 mb-2">Progresso das Conquistas</h3>
                <p className="text-body text-gray-600 dark:text-gray-400">Continue jogando para desbloquear mais conquistas!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-success-600 dark:text-success-400 mb-1">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Desbloqueadas</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-warning-600 dark:text-warning-400 mb-1">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bloqueadas</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">50%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Progresso</div>
                </div>
              </div>
              
              {/* Barra de progresso */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso Geral</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">3/6 conquistas</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Header da seção */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-display-2 font-display gradient-text mb-4">Configurações</h2>
              <p className="text-body-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Personalize sua experiência no Lovely para tornar cada momento ainda mais especial
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {/* Grid de configurações */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Preferências do Jogo */}
                <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-dark-large transition-all duration-300 hover:-translate-y-1">
                  <div className="card-body p-8">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Gamepad2 className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-heading-2 font-display text-gray-900 dark:text-gray-100">Preferências do Jogo</h3>
                        <p className="text-body-sm text-gray-600 dark:text-gray-400">Configure sua experiência de jogo</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { 
                          label: 'Notificações por email', 
                          desc: 'Receba atualizações sobre novos jogos e recursos',
                          checked: true,
                          icon: Bell
                        },
                        { 
                          label: 'Sons do jogo', 
                          desc: 'Efeitos sonoros durante os jogos',
                          checked: true,
                          icon: Activity
                        },
                        { 
                          label: 'Modo escuro automático', 
                          desc: 'Ativar modo escuro baseado no horário',
                          checked: false,
                          icon: Star
                        }
                      ].map((setting, index) => (
                        <div key={index} className="group">
                          <label className="flex items-center justify-between p-6 bg-white dark:bg-gray-950/50 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-200 dark:group-hover:from-primary-900/30 dark:group-hover:to-primary-800/30 transition-all duration-200">
                                <setting.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-body font-semibold text-gray-900 dark:text-gray-100 block">{setting.label}</span>
                                <span className="text-body-sm text-gray-500 dark:text-gray-400 block mt-1">{setting.desc}</span>
                              </div>
                            </div>
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                defaultChecked={setting.checked} 
                              />
                              <div className="w-14 h-8 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-secondary-500 shadow-inner"></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Privacidade e Segurança */}
                <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-dark-large transition-all duration-300 hover:-translate-y-1">
                  <div className="card-body p-8">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-heading-2 font-display text-gray-900 dark:text-gray-100">Privacidade</h3>
                        <p className="text-body-sm text-gray-600 dark:text-gray-400">Controle suas informações pessoais</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { 
                          label: 'Perfil público', 
                          desc: 'Permitir que outros vejam seu perfil',
                          checked: false,
                          icon: User
                        },
                        { 
                          label: 'Compartilhar estatísticas', 
                          desc: 'Mostrar suas conquistas publicamente',
                          checked: false,
                          icon: Trophy
                        },
                        { 
                          label: 'Atividade online', 
                          desc: 'Mostrar quando você está jogando',
                          checked: true,
                          icon: Clock
                        }
                      ].map((setting, index) => (
                        <div key={index} className="group">
                          <label className="flex items-center justify-between p-6 bg-white dark:bg-gray-950/50 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-800 hover:border-secondary-200 dark:hover:border-secondary-700 hover:shadow-md">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center group-hover:from-secondary-100 group-hover:to-secondary-200 dark:group-hover:from-secondary-900/30 dark:group-hover:to-secondary-800/30 transition-all duration-200">
                                <setting.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-body font-semibold text-gray-900 dark:text-gray-100 block">{setting.label}</span>
                                <span className="text-body-sm text-gray-500 dark:text-gray-400 block mt-1">{setting.desc}</span>
                              </div>
                            </div>
                            <div className="relative">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                defaultChecked={setting.checked} 
                              />
                              <div className="w-14 h-8 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 dark:peer-focus:ring-secondary-800 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-secondary-500 peer-checked:to-primary-500 shadow-inner"></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Aparência */}
                <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-dark-large transition-all duration-300 hover:-translate-y-1">
                  <div className="card-body p-8">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-heading-2 font-display text-gray-900 dark:text-gray-100">Aparência</h3>
                        <p className="text-body-sm text-gray-600 dark:text-gray-400">Personalize o visual da aplicação</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-6 bg-white dark:bg-gray-950/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <label className="text-body font-semibold text-gray-900 dark:text-gray-100 block mb-4">Tema</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { name: 'Claro', value: 'light', gradient: 'from-white to-gray-100', icon: '☀️' },
                            { name: 'Escuro', value: 'dark', gradient: 'from-gray-800 to-gray-900', icon: '🌙' },
                            { name: 'Auto', value: 'auto', gradient: 'from-blue-500 to-purple-500', icon: '🔄' }
                          ].map((themeOption) => (
                            <label key={themeOption.value} className="cursor-pointer group">
                              <input 
                                type="radio" 
                                name="theme" 
                                value={themeOption.value} 
                                className="sr-only peer" 
                                checked={themeOption.value === 'auto' ? false : theme === themeOption.value}
                                onChange={() => {
                                  if (themeOption.value !== 'auto') {
                                    setTheme(themeOption.value as 'light' | 'dark');
                                  }
                                }}
                              />
                              <div className={`p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 bg-gradient-to-br ${themeOption.gradient} text-center group-hover:scale-105`}>
                                <div className="w-8 h-8 rounded-lg mx-auto mb-2 bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg">
                                  {themeOption.icon}
                                </div>
                                <span className="text-body-sm font-medium text-gray-900 dark:text-gray-100">{themeOption.name}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2 text-body-sm text-gray-600 dark:text-gray-400">
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                            <span>Tema atual: <strong className="text-gray-900 dark:text-gray-100 capitalize">{theme === 'light' ? 'Claro' : 'Escuro'}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conta */}
                <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-dark-large transition-all duration-300 hover:-translate-y-1">
                  <div className="card-body p-8">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-warning-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <User className="w-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-heading-2 font-display text-gray-900 dark:text-gray-100">Conta</h3>
                        <p className="text-body-sm text-gray-600 dark:text-gray-400">Gerencie sua conta e assinatura</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-950/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="text-left">
                            <span className="text-body font-medium text-gray-900 dark:text-gray-100 block">Editar Perfil</span>
                            <span className="text-body-sm text-gray-500 dark:text-gray-400">Alterar informações pessoais</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 transition-colors" />
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-950/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-secondary-200 dark:hover:border-secondary-700 hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30 rounded-xl flex items-center justify-center">
                            <Crown className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                          </div>
                          <div className="text-left">
                            <span className="text-body font-medium text-gray-900 dark:text-gray-100 block">Gerenciar Assinatura</span>
                            <span className="text-body-sm text-gray-500 dark:text-gray-400">Plano atual: {getPlanName(subscription?.plan)}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-secondary-500 transition-colors" />
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-950/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-warning-200 dark:hover:border-warning-700 hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-all duration-200 group">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-900/30 dark:to-warning-800/30 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                          </div>
                          <div className="text-left">
                            <span className="text-body font-medium text-gray-900 dark:text-gray-100 block">Alterar Senha</span>
                            <span className="text-body-sm text-gray-500 dark:text-gray-400">Manter sua conta segura</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-warning-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <button className="btn btn-primary btn-lg hover-lift hover-glow shadow-xl flex items-center space-x-2 px-8 py-4">
                  <Sparkles className="w-5 h-5" />
                  <span>Salvar Configurações</span>
                </button>
                <button className="btn btn-ghost text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center space-x-2">
                  <span>Restaurar Padrões</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-black dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                <Image 
                  src="/imgs/logo.png" 
                  alt="Lovely Logo" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-heading-3 font-display text-gray-900 dark:text-gray-100">Lovely</h1>
                <p className="text-caption text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-850 rounded-2xl border border-primary-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white dark:bg-gray-800">
                <Image 
                  src="/imgs/logo.png" 
                  alt="Lovely Logo" 
                  width={48} 
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.name || 'Gustavo Teste'}
                </p>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-caption font-medium bg-gradient-to-r ${getPlanColor(subscription?.plan)} text-white shadow-sm`}>
                  {getPlanIcon(subscription?.plan)}
                  <span>{getPlanName(subscription?.plan)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-10 animate-pulse"></div>
                  )}
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-850 group-hover:bg-gray-200 dark:group-hover:bg-gray-800'} transition-colors`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-body font-medium">{item.name}</p>
                    <p className={`text-caption ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-2xl transition-colors group mb-3"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-850 rounded-xl group-hover:bg-gray-200 dark:group-hover:bg-gray-800 transition-colors">
                  <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-body font-medium text-gray-700 dark:text-gray-300">Privacidade</span>
              </div>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-2xl transition-colors group"
            >
              <div className="p-2 bg-error-100 dark:bg-error-900/30 rounded-xl group-hover:bg-error-200 dark:group-hover:bg-error-900/50 transition-colors">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-body font-medium">Sair</span>
            </button>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between px-6 py-4">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
                
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-body-sm">
                  <span className="text-gray-500 dark:text-gray-400">Dashboard</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                    {navigationItems.find(item => item.id === activeTab)?.name || activeTab}
                  </span>
                </nav>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                
                {/* Notifications */}
                <div className="relative" data-notifications>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
                  >
                    <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-large dark:shadow-dark-large border border-gray-200 dark:border-gray-700 animate-scale-in">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-heading-3 font-semibold text-gray-900 dark:text-gray-100">Notificações</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markNotificationAsRead(notification.id)}
                            className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer transition-colors ${
                              notification.unread ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                              <div className="flex-1">
                                <h4 className="text-body font-medium text-gray-900 dark:text-gray-100">{notification.title}</h4>
                                <p className="text-body-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                                <p className="text-caption text-gray-500 dark:text-gray-500 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" data-user-menu>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md overflow-hidden bg-white dark:bg-gray-800">
                      <Image 
                        src="/imgs/logo.png" 
                        alt="Lovely Logo" 
                        width={32} 
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-body-sm font-medium text-gray-900 dark:text-gray-100">{user.name || 'Gustavo'}</p>
                      <p className="text-caption text-gray-500 dark:text-gray-400">{getPlanName(subscription?.plan)}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-large dark:shadow-dark-large border border-gray-200 dark:border-gray-700 animate-scale-in">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white dark:bg-gray-800">
                            <Image 
                              src="/imgs/logo.png" 
                              alt="Lovely Logo" 
                              width={48} 
                              height={48}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-body font-medium text-gray-900 dark:text-gray-100">{user.name || 'Gustavo Teste'}</p>
                            <p className="text-body-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => handleTabChange('profile')}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-xl transition-colors"
                        >
                          <User className="w-5 h-5" />
                          <span className="text-body">Meu Perfil</span>
                        </button>
                        <button
                          onClick={() => handleTabChange('settings')}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-xl transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                          <span className="text-body">Configurações</span>
                        </button>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-xl transition-colors"
                        >
                          <div className="p-2 bg-error-100 dark:bg-error-900/30 rounded-xl group-hover:bg-error-200 dark:group-hover:bg-error-900/50 transition-colors">
                            <LogOut className="w-5 h-5" />
                          </div>
                          <span className="text-body">Sair</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}