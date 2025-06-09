'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
// import { gameService } from '@/services/api';
// import { GameContent, PlanType } from '@/types';
import { ArrowLeft, Play, Lock, Crown, Zap, Flame, Star, Clock, Users, Heart } from 'lucide-react';

// Tipos básicos inline
type PlanType = 'no-climinha' | 'modo-quente' | 'sem-freio';

interface GameContent {
  id: string;
  title: string;
  description: string;
  mode: string;
  difficulty: string;
  duration: string;
  requiredPlan: PlanType;
  tags?: string[];
  isLocked?: boolean;
}

// Mock do gameService para evitar erros
const gameService = {
  getGameContent: async (mode: string, planType: PlanType) => {
    // Mock data - em produção isso viria da API
    return {
      success: true,
      data: [
        {
          id: `${mode}-1`,
          title: `Jogo ${mode}`,
          description: `Descrição do jogo ${mode}`,
          mode,
          difficulty: 'intermediate',
          duration: '30-45 min',
          requiredPlan: planType,
          tags: ['romance', 'diversão']
        }
      ] as GameContent[]
    };
  }
};

export default function JogosPage() {
  const params = useParams();
  const router = useRouter();
  const { user, subscription, loading, isAuthenticated } = useAuth();
  const [games, setGames] = useState<GameContent[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params.userId as string;
  const plan = params.plan as string;

  const loadGames = useCallback(async () => {
    try {
      setPageLoading(true);
      setError(null);
      
      const userPlanType = subscription?.planType as PlanType || 'sem-freio';
      
      // Carregar jogos para diferentes modos
      const modes = ['exploracao-guiada', 'modo-selvagem', 'roleplay-narracao'] as const;
      const allGames: GameContent[] = [];
      
      for (const mode of modes) {
        try {
          const response = await gameService.getGameContent(mode, userPlanType);
          if (response.success && response.data) {
            allGames.push(...response.data);
          }
        } catch (error) {
          console.error(`Erro ao carregar jogos do modo ${mode}:`, error);
        }
      }
      
      setGames(allGames);
      setFilteredGames(allGames);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      setError('Erro ao carregar jogos. Tente novamente.');
    } finally {
      setPageLoading(false);
    }
  }, [subscription?.planType]);

  useEffect(() => {
    if (loading) {
      console.log('⏳ Aguardando carregamento do contexto...');
      return;
    }

    if (!isAuthenticated) {
      console.log('❌ Usuário não autenticado, redirecionando...');
      router.push('/');
      return;
    }

    if (!user) {
      console.log('❌ Dados do usuário não encontrados');
      router.push('/');
      return;
    }

    // Verificar se o userId da URL corresponde ao usuário logado
    if (user.id !== userId) {
      console.log('❌ ID do usuário não corresponde, redirecionando...');
      router.push('/');
      return;
    }

    // Verificar se o usuário tem acesso ao plano
    if (subscription) {
      const userPlan = subscription.planType;
      if (userPlan !== plan) {
        console.log(`❌ Plano não corresponde: usuário tem ${userPlan}, tentando acessar ${plan}`);
        router.push(`/${userId}/${userPlan}`);
        return;
      }
    }

    if (user && subscription) {
      loadGames();
    }
  }, [user, subscription, loading, isAuthenticated, router, userId, plan, loadGames]);

  const canAccessGame = (gameRequiredPlan: PlanType): boolean => {
    if (!subscription) return false;
    
    const planHierarchy: Record<PlanType, number> = {
      'no-climinha': 1,
      'modo-quente': 2,
      'sem-freio': 3
    };

    const userLevel = planHierarchy[subscription.planType as PlanType] || 1;
    const requiredLevel = planHierarchy[gameRequiredPlan] || 1;

    return userLevel >= requiredLevel;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case 'no-climinha': return <Crown className="h-4 w-4 text-green-400" />;
      case 'modo-quente': return <Zap className="h-4 w-4 text-orange-400" />;
      case 'sem-freio': return <Flame className="h-4 w-4 text-red-400" />;
      default: return <Star className="h-4 w-4 text-red-400" />;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'exploracao-guiada': return 'Exploração Guiada';
      case 'modo-selvagem': return 'Modo Selvagem';
      case 'roleplay-narracao': return 'Roleplay com Narração';
      case 'verdade-desafio': return 'Verdade ou Desafio';
      case 'strip-quiz': return 'Strip Quiz';
      case 'roleta-desejo': return 'Roleta do Desejo';
      case 'dados-kamasutra': return 'Dados Kamasutra';
      case 'mimica-proibida': return 'Mímica Proibida';
      case 'cartas-eroticas': return 'Cartas Eróticas';
      case 'esquenta-alvo': return 'Esquenta Alvo';
      case 'fantasias-secretas': return 'Fantasias Secretas';
      case 'massagem-tantrica': return 'Massagem Tântrica';
      case 'conexao-emocional': return 'Conexão Emocional';
      case 'dez-dates': return 'Dez Dates';
      default: return mode;
    }
  };

  const categories = ['all', 'exploracao-guiada', 'modo-selvagem', 'roleplay-narracao'];

  const filterGames = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredGames(games);
    } else {
      setFilteredGames(games.filter(game => game.mode === category));
    }
  };

  const handleGameClick = (game: GameContent) => {
    const isLocked = !canAccessGame(game.requiredPlan);
    
    if (isLocked) {
      // Mostrar modal de upgrade ou redirecionar para planos
      alert('Este jogo requer um plano superior. Faça upgrade para acessar!');
      return;
    }
    
    // Navegar para a página do jogo com URL dinâmica
    router.push(`/${userId}/${plan}/jogos/${game.id}`);
  };

  const goBack = () => {
    router.push(`/${userId}/${plan}`);
  };

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm opacity-10"></div>
        <div className="text-center relative z-10">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-800 border-t-red-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 animate-pulse"></div>
          </div>
          <p className="text-white text-lg font-medium">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button 
            onClick={loadGames}
            className="btn-gradient px-6 py-3 rounded-lg font-semibold"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 gradient-warm opacity-5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          opacity: 0.3
        }}></div>
      </div>

      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-red-600/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={goBack}
                className="text-white hover:text-red-400 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold">
                <span className="gradient-warm-text">Jogos Disponíveis</span>
              </h1>
              <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium border border-red-600/30">
                {plan === 'no-climinha' ? 'No Climinha' : 
                 plan === 'modo-quente' ? 'Modo Quente' : 
                 plan === 'sem-freio' ? 'Sem Freio' : plan}
              </span>
            </div>
            <div className="text-white text-sm">
              {filteredGames.length} jogos encontrados
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => filterGames(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'Todos' : getModeLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum jogo encontrado para esta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => {
              const isLocked = !canAccessGame(game.requiredPlan);
              
              return (
                <div
                  key={game.id}
                  onClick={() => handleGameClick(game)}
                  className={`card-dark border-red-600/30 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 ${
                    isLocked ? 'opacity-60' : 'hover:border-red-500/50'
                  }`}
                >
                  {/* Game Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                        {game.title}
                        {isLocked && <Lock className="h-4 w-4 text-gray-400" />}
                      </h3>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {game.description}
                      </p>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">{game.duration} min</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                        {getDifficultyLabel(game.difficulty)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlanIcon(game.requiredPlan)}
                        <span className="text-gray-300 text-sm capitalize">
                          {game.requiredPlan.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">2 pessoas</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {game.tags && game.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {game.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs border border-red-600/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition-all ${
                      isLocked
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'btn-gradient hover:scale-105'
                    }`}
                    disabled={isLocked}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Bloqueado</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Jogar Agora</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
} 