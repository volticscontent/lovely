'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { 
  User, 
  Heart, 
  Settings, 
  Edit, 
  Save, 
  X, 
  Crown, 
  Star, 
  TrendingUp,
  Bell,
  Shield,
  Info,
  Calendar,
  Trophy,
  Flame,
  Gift,
  Zap,
  Camera,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Award,
  Target,
  Clock,
  Activity,
  ChevronRight,
  Plus,
  Check
} from 'lucide-react';

export default function UserPanel() {
  const { user, profile, subscription, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [darinessLevel, setDarinessLevel] = useState(1);

  useEffect(() => {
    if (profile) {
      setPartnerName(profile.partnerName || '');
      setDarinessLevel(profile.darinessLevel || 1);
    }
  }, [profile]);

  const getPlanName = (planType?: string) => {
    switch (planType) {
      case 'basico': return 'Básico';
      case 'medio': return 'Médio';
      case 'premium': return 'Premium';
      default: return 'Gratuito';
    }
  };

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
      case 'basico': return 'from-warning-500 to-orange-500';
      case 'medio': return 'from-primary-500 to-secondary-500';
      case 'premium': return 'from-error-500 to-primary-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleSave = async () => {
    const success = await updateProfile({
      partnerName,
      darinessLevel
    });
    
    if (success) {
      setIsEditing(false);
    }
  };

  const getDarinessLabel = (level: number) => {
    if (level <= 2) return 'Romântico';
    if (level <= 4) return 'Aventureiro';
    if (level <= 6) return 'Ousado';
    if (level <= 8) return 'Picante';
    return 'Extremo';
  };

  const getDarinessColor = (level: number) => {
    if (level <= 2) return 'text-success-500 dark:text-success-400';
    if (level <= 4) return 'text-primary-500 dark:text-primary-400';
    if (level <= 6) return 'text-warning-500 dark:text-warning-400';
    if (level <= 8) return 'text-orange-500 dark:text-orange-400';
    return 'text-error-500 dark:text-error-400';
  };

  const getDarinessGradient = (level: number) => {
    if (level <= 2) return 'from-success-500 to-emerald-500';
    if (level <= 4) return 'from-primary-500 to-secondary-500';
    if (level <= 6) return 'from-warning-500 to-orange-500';
    if (level <= 8) return 'from-orange-500 to-error-500';
    return 'from-error-500 to-primary-500';
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header do Perfil */}
      <div className="relative">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-3xl"></div>
        
        <div className="relative card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-dark-large transition-all duration-300 p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar e informações básicas */}
            <div className="flex flex-col items-center text-center lg:text-left">
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  <Image 
                    src="/imgs/logo.png" 
                    alt="Profile Avatar" 
                    width={128} 
                    height={128}
                    className="object-contain p-4"
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border-2 border-gray-200 dark:border-gray-600">
                  <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <h1 className="text-display-1 font-display text-gray-900 dark:text-gray-100">{user.name}</h1>
                <p className="text-body text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                <div className="flex items-center gap-2 text-body-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Brasil</span>
                </div>
              </div>
            </div>

            {/* Informações do plano e estatísticas rápidas */}
            <div className="flex-1 w-full space-y-6">
              {/* Plano atual */}
              <div className={`relative overflow-hidden bg-gradient-to-r ${getPlanColor(subscription?.planType)} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      {getPlanIcon(subscription?.planType)}
                    </div>
                    <div>
                      <h3 className="text-heading-2 font-display">Plano {getPlanName(subscription?.planType)}</h3>
                      <p className="text-white/80">Acesso completo aos recursos</p>
                    </div>
                  </div>
                  {subscription?.planType !== 'premium' && (
                    <button className="btn bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-sm">
                      <Crown className="w-4 h-4" />
                      Upgrade
                    </button>
                  )}
                </div>
              </div>

              {/* Estatísticas rápidas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Jogos', value: '12', icon: Trophy, gradient: 'from-success-500 to-emerald-500' },
                  { label: 'Sequência', value: '7d', icon: Flame, gradient: 'from-orange-500 to-error-500' },
                  { label: 'Tempo', value: '24h', icon: Clock, gradient: 'from-primary-500 to-secondary-500' },
                  { label: 'Nível', value: '5', icon: Star, gradient: 'from-warning-500 to-orange-500' }
                ].map((stat, index) => (
                  <div key={index} className="card bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-md dark:hover:shadow-dark-medium transition-all duration-200 p-4 text-center group">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-heading-2 font-display text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
                    <div className="text-body-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Configurações do Perfil */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Perfil do Casal */}
          <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-dark-large transition-all duration-300 hover:-translate-y-1">
            <div className="card-body p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-heading-1 font-display text-gray-900 dark:text-gray-100">Perfil do Casal</h2>
                    <p className="text-body text-gray-600 dark:text-gray-400">Configure suas preferências românticas</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                    isEditing 
                      ? 'bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-900/50' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                </button>
              </div>

              <div className="space-y-8">
                {/* Nome do Parceiro */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-body font-semibold text-gray-900 dark:text-gray-100">
                    <Heart className="w-4 h-4 text-primary-500" />
                    <span>Nome do Parceiro(a)</span>
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="Digite o nome do seu amor"
                        className="w-full px-4 py-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 dark:text-primary-400" />
                    </div>
                  ) : (
                    <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-heading-3 font-display text-gray-900 dark:text-gray-100">
                            {partnerName || 'Não informado'}
                          </span>
                          {partnerName && (
                            <p className="text-body-sm text-primary-600 dark:text-primary-400">Seu amor especial ❤️</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nível de Ousadia */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-body font-semibold text-gray-900 dark:text-gray-100">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>Nível de Ousadia</span>
                    </label>
                    <span className={`px-3 py-1 rounded-full text-body-sm font-semibold ${getDarinessColor(darinessLevel)} bg-current/10`}>
                      {getDarinessLabel(darinessLevel)}
                    </span>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={darinessLevel}
                          onChange={(e) => setDarinessLevel(Number(e.target.value))}
                          className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(59 130 246) 25%, rgb(245 158 11) 50%, rgb(249 115 22) 75%, rgb(239 68 68) 100%)`
                          }}
                        />
                        <div className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-full shadow-lg" style={{ left: `calc(${((darinessLevel - 1) / 9) * 100}% - 12px)` }}></div>
                      </div>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-success-500 font-medium">Romântico</span>
                        <span className="text-heading-3 font-display text-gray-900 dark:text-gray-100">{darinessLevel}/10</span>
                        <span className="text-error-500 font-medium">Extremo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-heading-2 font-display text-gray-900 dark:text-gray-100">{darinessLevel}/10</span>
                        <span className={`text-body font-semibold ${getDarinessColor(darinessLevel)}`}>
                          {getDarinessLabel(darinessLevel)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-4 flex-1 rounded-full transition-all duration-300 ${
                              i < darinessLevel 
                                ? `bg-gradient-to-r ${getDarinessGradient(darinessLevel)} shadow-sm` 
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="w-full btn btn-primary btn-lg hover-lift hover-glow shadow-xl flex items-center justify-center space-x-2 py-4"
                  >
                    <Save className="w-5 h-5" />
                    <span>Salvar Alterações</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Estatísticas Detalhadas */}
          <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-dark-large transition-all duration-300 hover:-translate-y-1">
            <div className="card-body p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-heading-1 font-display text-gray-900 dark:text-gray-100">Suas Estatísticas</h2>
                  <p className="text-body text-gray-600 dark:text-gray-400">Acompanhe seu progresso romântico</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    title: 'Jogos Completos', 
                    value: '12', 
                    change: '+3 este mês',
                    icon: Trophy, 
                    gradient: 'from-success-500 to-emerald-500',
                    bgGradient: 'from-success-50 to-emerald-50 dark:from-success-900/20 dark:to-emerald-900/20'
                  },
                  { 
                    title: 'Dias Consecutivos', 
                    value: '7', 
                    change: 'Sequência atual',
                    icon: Flame, 
                    gradient: 'from-orange-500 to-error-500',
                    bgGradient: 'from-orange-50 to-error-50 dark:from-orange-900/20 dark:to-error-900/20'
                  },
                  { 
                    title: 'Tempo Total', 
                    value: '24h', 
                    change: '+5h esta semana',
                    icon: Clock, 
                    gradient: 'from-primary-500 to-secondary-500',
                    bgGradient: 'from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20'
                  }
                ].map((stat, index) => (
                  <div key={index} className={`card bg-gradient-to-br ${stat.bgGradient} border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-dark-medium transition-all duration-300 hover:-translate-y-1 p-6 text-center group`}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-display-1 font-display text-gray-900 dark:text-gray-100 mb-2">{stat.value}</div>
                    <div className="text-body font-medium text-gray-900 dark:text-gray-100 mb-1">{stat.title}</div>
                    <div className="text-body-sm text-gray-600 dark:text-gray-400">{stat.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-8">
          
          {/* Configurações Rápidas */}
          <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-dark-large transition-all duration-300 hover:-translate-y-1">
            <div className="card-body p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-warning-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-heading-2 font-display text-gray-900 dark:text-gray-100">Configurações</h3>
                  <p className="text-body-sm text-gray-600 dark:text-gray-400">Acesso rápido</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { 
                    name: 'Notificações', 
                    icon: Bell, 
                    gradient: 'from-primary-500 to-secondary-500',
                    description: 'Gerencie alertas'
                  },
                  { 
                    name: 'Privacidade', 
                    icon: Shield, 
                    gradient: 'from-success-500 to-emerald-500',
                    description: 'Controle de dados'
                  },
                  { 
                    name: 'Sobre o App', 
                    icon: Info, 
                    gradient: 'from-warning-500 to-orange-500',
                    description: 'Informações gerais'
                  }
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-gray-900/70 transition-all duration-200 group text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-body font-medium text-gray-900 dark:text-gray-100 block">{item.name}</span>
                        <span className="text-body-sm text-gray-500 dark:text-gray-400">{item.description}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conquistas Recentes */}
          <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-dark-large transition-all duration-300 hover:-translate-y-1">
            <div className="card-body p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-heading-2 font-display text-gray-900 dark:text-gray-100">Conquistas</h3>
                  <p className="text-body-sm text-gray-600 dark:text-gray-400">Últimas desbloqueadas</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Primeiro Passo', icon: '🎯', date: 'Hoje' },
                  { name: 'Aventureiro', icon: '🗺️', date: 'Ontem' },
                  { name: 'Romântico', icon: '💕', date: '2 dias atrás' }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center text-2xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <span className="text-body font-medium text-gray-900 dark:text-gray-100 block">{achievement.name}</span>
                      <span className="text-body-sm text-gray-500 dark:text-gray-400">{achievement.date}</span>
                    </div>
                    <Check className="w-5 h-5 text-success-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 