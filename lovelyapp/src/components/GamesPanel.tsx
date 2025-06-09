'use client';

import React, { useState } from 'react';
import { Search, Heart, Users, Clock, Star, Lock, Play } from 'lucide-react';

interface Game {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  duration: string;
  players: string;
  requiredPlan: 'Gratuito' | 'Premium' | 'VIP';
  isNew?: boolean;
  isTrending?: boolean;
  rating: number;
  isLocked: boolean;
}

const games: Game[] = [
  {
    id: 1,
    title: "Verdade ou Desafio Íntimo",
    description: "Perguntas picantes e desafios ousados para casais que querem se conhecer melhor",
    category: "Intimidade",
    difficulty: "Médio",
    duration: "30-45 min",
    players: "2 jogadores",
    requiredPlan: "Premium",
    isNew: true,
    rating: 4.8,
    isLocked: true
  },
  {
    id: 2,
    title: "Quiz do Relacionamento",
    description: "Teste o quanto vocês se conhecem com perguntas sobre gostos e preferências",
    category: "Conhecimento",
    difficulty: "Fácil",
    duration: "15-20 min",
    players: "2 jogadores",
    requiredPlan: "Gratuito",
    rating: 4.5,
    isLocked: false
  },
  {
    id: 3,
    title: "Fantasias Compartilhadas",
    description: "Explorem juntos seus desejos mais íntimos de forma segura e consensual",
    category: "Fantasia",
    difficulty: "Difícil",
    duration: "45-60 min",
    players: "2 jogadores",
    requiredPlan: "VIP",
    isTrending: true,
    rating: 4.9,
    isLocked: true
  },
  {
    id: 4,
    title: "Massagem Sensual",
    description: "Guia passo a passo para uma sessão de massagem relaxante e excitante",
    category: "Bem-estar",
    difficulty: "Fácil",
    duration: "20-30 min",
    players: "2 jogadores",
    requiredPlan: "Premium",
    rating: 4.7,
    isLocked: true
  },
  {
    id: 5,
    title: "Noite Romântica",
    description: "Crie o ambiente perfeito para uma noite especial com seu parceiro",
    category: "Romance",
    difficulty: "Fácil",
    duration: "60-90 min",
    players: "2 jogadores",
    requiredPlan: "Gratuito",
    rating: 4.6,
    isLocked: false
  },
  {
    id: 6,
    title: "Aventura a Dois",
    description: "Explorem juntos novos horizontes e descubram coisas sobre vocês",
    category: "Aventura",
    difficulty: "Médio",
    duration: "45-60 min",
    players: "2 jogadores",
    requiredPlan: "Gratuito",
    rating: 4.4,
    isLocked: false
  },
  {
    id: 7,
    title: "Desafio do Amor",
    description: "Testem o quanto se conhecem com desafios divertidos e românticos",
    category: "Conhecimento",
    difficulty: "Médio",
    duration: "30-45 min",
    players: "2 jogadores",
    requiredPlan: "Gratuito",
    rating: 4.3,
    isLocked: false
  },
  {
    id: 8,
    title: "Cartas do Desejo",
    description: "Um jogo de cartas especial para despertar a paixão entre vocês",
    category: "Intimidade",
    difficulty: "Médio",
    duration: "25-40 min",
    players: "2 jogadores",
    requiredPlan: "Premium",
    rating: 4.7,
    isLocked: true
  },
  {
    id: 9,
    title: "Roleplay Romântico",
    description: "Interpretem diferentes personagens em cenários românticos",
    category: "Fantasia",
    difficulty: "Difícil",
    duration: "60-120 min",
    players: "2 jogadores",
    requiredPlan: "VIP",
    rating: 4.8,
    isLocked: true
  },
  {
    id: 10,
    title: "Meditação a Dois",
    description: "Conectem-se em um nível mais profundo através da meditação",
    category: "Bem-estar",
    difficulty: "Fácil",
    duration: "20-30 min",
    players: "2 jogadores",
    requiredPlan: "Gratuito",
    rating: 4.2,
    isLocked: false
  },
  {
    id: 11,
    title: "Jantar Sensual",
    description: "Transformem uma refeição comum em uma experiência sensual",
    category: "Romance",
    difficulty: "Médio",
    duration: "90-120 min",
    players: "2 jogadores",
    requiredPlan: "Premium",
    rating: 4.6,
    isLocked: true
  },
  {
    id: 12,
    title: "Caça ao Tesouro Íntima",
    description: "Uma caça ao tesouro especial com pistas picantes pela casa",
    category: "Aventura",
    difficulty: "Médio",
    duration: "45-75 min",
    players: "2 jogadores",
    requiredPlan: "Premium",
    isNew: true,
    rating: 4.5,
    isLocked: true
  },
  {
    id: 13,
    title: "Conversa Profunda",
    description: "Perguntas que levam a conversas significativas e conexão emocional",
    category: "Conhecimento",
    difficulty: "Fácil",
    duration: "30-60 min",
    players: "2 jogadores",
    requiredPlan: "Gratuito",
    rating: 4.4,
    isLocked: false
  },
  {
    id: 14,
    title: "Dança Sensual",
    description: "Aprendam movimentos de dança que aproximam e seduzem",
    category: "Bem-estar",
    difficulty: "Médio",
    duration: "30-45 min",
    players: "2 jogadores",
    requiredPlan: "Premium",
    rating: 4.5,
    isLocked: true
  },
  {
    id: 15,
    title: "Noite de Spa",
    description: "Criem um spa caseiro para relaxar e se conectar",
    category: "Bem-estar",
    difficulty: "Fácil",
    duration: "60-90 min",
    players: "2 jogadores",
    requiredPlan: "Gratuito",
    rating: 4.3,
    isLocked: false
  },
  {
    id: 16,
    title: "Confissões Íntimas",
    description: "Compartilhem segredos e desejos em um ambiente seguro",
    category: "Intimidade",
    difficulty: "Difícil",
    duration: "40-60 min",
    players: "2 jogadores",
    requiredPlan: "VIP",
    isTrending: true,
    rating: 4.9,
    isLocked: true
  },
  {
    id: 17,
    title: "Piquenique Romântico",
    description: "Organizem um piquenique especial, dentro ou fora de casa",
    category: "Romance",
    difficulty: "Fácil",
    duration: "90-120 min",
    players: "2 jogadores",
    requiredPlan: "Gratuito",
    rating: 4.1,
    isLocked: false
  },
  {
    id: 18,
    title: "Jogo da Sedução",
    description: "Um jogo estratégico onde a sedução é a chave para vencer",
    category: "Fantasia",
    difficulty: "Médio",
    duration: "45-60 min",
    players: "2 jogadores",
    requiredPlan: "Premium",
    rating: 4.6,
    isLocked: true
  },
  {
    id: 19,
    title: "Memórias do Relacionamento",
    description: "Relembrem momentos especiais e criem novas memórias juntos",
    category: "Conhecimento",
    difficulty: "Fácil",
    duration: "30-45 min",
    players: "2 jogadores",
    requiredPlan: "Gratuito",
    rating: 4.2,
    isLocked: false
  },
  {
    id: 20,
    title: "Experiência VIP",
    description: "O jogo mais exclusivo com experiências únicas e personalizadas",
    category: "Fantasia",
    difficulty: "Difícil",
    duration: "120+ min",
    players: "2 jogadores",
    requiredPlan: "VIP",
    isNew: true,
    rating: 5.0,
    isLocked: true
  }
];

export default function GamesPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Intimidade', 'Conhecimento', 'Fantasia', 'Bem-estar', 'Romance', 'Aventura'];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const availableGames = filteredGames.filter(game => !game.isLocked);
  const lockedGames = filteredGames.filter(game => game.isLocked);

  const GameCard = ({ game }: { game: Game }) => (
    <div className={`card ${game.isLocked ? 'opacity-60' : ''}`} style={{ padding: '2rem' }}>
      {/* Badges */}
      {game.isNew && (
        <div style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'linear-gradient(135deg, #059669, #047857)',
          color: 'white',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
        }}>
          NOVO
        </div>
      )}
      
      {game.isTrending && (
        <div style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'linear-gradient(135deg, #d97706, #b45309)',
          color: 'white',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
        }}>
          TRENDING
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex items-start gap-6" style={{ marginBottom: '2rem' }}>
        <div style={{
          width: '4.5rem',
          height: '4.5rem',
          background: 'linear-gradient(135deg, #3730a3, #581c87)',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(55, 48, 163, 0.3)',
          flexShrink: 0
        }}>
          <Heart className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1" style={{ minWidth: 0 }}>
          <h3 style={{ 
            fontSize: '1.375rem', 
            fontWeight: '600', 
            marginBottom: '0.75rem', 
            color: '#f9fafb',
            lineHeight: '1.3'
          }}>
            {game.title}
          </h3>
          <p className="text-gray-400" style={{ 
            fontSize: '0.9rem', 
            marginBottom: '1.25rem',
            lineHeight: '1.5'
          }}>
            {game.description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(game.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                  fill={i < Math.floor(game.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400" style={{ fontWeight: '500' }}>
              {game.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Metadados */}
      <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
        <div>
          <div className="text-sm text-gray-400" style={{ marginBottom: '0.5rem', fontWeight: '500' }}>
            Dificuldade
          </div>
          <div className="text-sm font-semibold text-white">{game.difficulty}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400" style={{ marginBottom: '0.5rem', fontWeight: '500' }}>
            Duração
          </div>
          <div className="text-sm font-semibold flex items-center gap-2 text-white">
            <Clock className="w-4 h-4" />
            {game.duration}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400" style={{ marginBottom: '0.5rem', fontWeight: '500' }}>
            Jogadores
          </div>
          <div className="text-sm font-semibold flex items-center gap-2 text-white">
            <Users className="w-4 h-4" />
            {game.players}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400" style={{ marginBottom: '0.5rem', fontWeight: '500' }}>
            Plano
          </div>
          <div className={`text-sm font-semibold ${
            game.requiredPlan === 'Gratuito' ? 'text-green-400' : 
            game.requiredPlan === 'Premium' ? 'text-yellow-400' : 'text-purple-400'
          }`}>
            {game.requiredPlan}
          </div>
        </div>
      </div>

      {/* Botão de ação */}
      <button 
        className={`btn w-full ${game.isLocked ? 'btn-secondary cursor-not-allowed' : 'btn-primary'}`}
        disabled={game.isLocked}
        style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', fontWeight: '600' }}
      >
        {game.isLocked ? (
          <>
            <Lock className="w-5 h-5" />
            Bloqueado
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Jogar Agora
          </>
        )}
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '700', 
          marginBottom: '1rem', 
          color: '#f9fafb',
          lineHeight: '1.1'
        }}>
          Jogos para Casais
        </h1>
        <p className="text-gray-400" style={{ 
          fontSize: '1.25rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Descubra jogos divertidos e íntimos para fortalecer seu relacionamento
        </p>
      </div>

      {/* Barra de pesquisa */}
      <div className="relative" style={{ marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar jogos..."
          className="input"
          style={{ paddingLeft: '3rem', fontSize: '1rem', padding: '1rem 1rem 1rem 3rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtros de categoria */}
      <div className="flex gap-3 justify-center" style={{ marginBottom: '4rem', flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Jogos disponíveis */}
      {availableGames.length > 0 && (
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            marginBottom: '2.5rem', 
            color: '#f9fafb',
            textAlign: 'center'
          }}>
            Jogos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
            {availableGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* Jogos bloqueados */}
      {lockedGames.length > 0 && (
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            marginBottom: '2.5rem', 
            color: '#f9fafb',
            textAlign: 'center'
          }}>
            Jogos Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
            {lockedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {filteredGames.length === 0 && (
        <div className="text-center" style={{ padding: '4rem 0' }}>
          <p className="text-gray-400" style={{ 
            fontSize: '1.25rem', 
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Nenhum jogo encontrado com os filtros selecionados
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todos');
            }}
            className="btn btn-primary"
            style={{ padding: '1rem 2rem', fontSize: '1rem' }}
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
} 