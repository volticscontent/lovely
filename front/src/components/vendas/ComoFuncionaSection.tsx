"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { trackComoFuncionaCTA, trackDesafiosCTA } from '@/services/tracking';

const GameModeCard = ({ mode, index }: { mode: any; index: number }) => (
  <div
    key={mode.title}
    className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300 cursor-pointer min-w-[300px] md:min-w-[350px] flex-shrink-0"
    onClick={() => trackComoFuncionaCTA(mode.title)}
  >
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center group-hover:from-red-500/30 group-hover:to-red-600/30 transition-all duration-300">
        {mode.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
          {mode.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {mode.description}
        </p>
      </div>
    </div>
  </div>
);

const challenges = [
  {
    question: "Você toparia um desafio de dominação com tempo cronometrado?",
    icon: (
      <div className="w-8 h-8 mb-4 text-red-500 text-2xl flex items-center justify-center">
        ⏰
      </div>
    ),
    gradient: "from-red-500/20 via-red-500/10 to-transparent"
  },
  {
    question: "Já imaginou realizar uma fantasia sem que seu parceiro saiba qual você escolheu?",
    icon: (
      <div className="w-8 h-8 mb-4 text-red-500 text-2xl flex items-center justify-center">
        ⭐
      </div>
    ),
    gradient: "from-pink-500/20 via-pink-500/10 to-transparent"
  },
  {
    question: "E se uma narração envolvente conduzisse vocês por um cenário quente e provocante?",
    icon: (
      <div className="w-8 h-8 mb-4 text-red-500 text-2xl flex items-center justify-center">
        🎵
      </div>
    ),
    gradient: "from-purple-500/20 via-purple-500/10 to-transparent"
  }
];

const gameModes = [
  {
    icon: (
      <div className="text-red-500 text-xl">🃏</div>
    ),
    title: "Desafios Picantes (cartas)",
    description: "Desafios picantes em formato de cartas para apimentar a relação."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">🎯</div>
    ),
    title: "Sex Roleta",
    description: "Gire a roleta e deixe a sorte decidir a próxima aventura."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">❓</div>
    ),
    title: "Verdade ou Desafio",
    description: "Descubra segredos ou cumpra desafios picantes."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">🎭</div>
    ),
    title: "RolePlay",
    description: "Incorpore personagens e explore fantasias."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">💕</div>
    ),
    title: "Kama 365 (posições Kama Sutra)",
    description: "Descubra e experimente novas posições do Kama Sutra."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">👤</div>
    ),
    title: "Jogar Sozinho",
    description: "Explore seu corpo e seus desejos de forma individual."
  },
   {
    icon: (
      <div className="text-red-500 text-xl">📊</div>
    ),
    title: "Nível de Safadeza (teste)",
    description: "Descubra o quão safado(a) você e seu parceiro(a) são."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">👕</div>
    ),
    title: "Strip Quiz",
    description: "Responda perguntas e veja quem tira a roupa primeiro."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">🎲</div>
    ),
    title: "Roleta do Desejo",
    description: "Deixe a roleta decidir os desejos que serão realizados."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">🤫</div>
    ),
    title: "Mímica Proibida",
    description: "Adivinhe as palavras e frases picantes através de mímicas."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">💆</div>
    ),
    title: "Massagem Tântrica",
    description: "Aprenda e pratique massagens tântricas para uma conexão mais profunda."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">💖</div>
    ),
    title: "Modo de Conexão Emocional",
    description: "Fortaleça a intimidade e conexão emocional com seu parceiro(a)."
  },
  {
    icon: (
      <div className="text-red-500 text-xl">🏆</div>
    ),
    title: "Sistema de Conquistas e Progressão",
    description: "Desbloqueie conquistas e acompanhe sua progressão nos jogos."
  }
];

export default function ComoFuncionaSection() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dividir os jogos em duas linhas
  const firstRowGames = gameModes.slice(0, Math.ceil(gameModes.length / 2));
  const secondRowGames = gameModes.slice(Math.ceil(gameModes.length / 2));

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Seção de Desafios */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <div
                key={challenge.question}
                className="group"
              >
                <div className={`h-full bg-gradient-to-b ${challenge.gradient} p-8 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-red-500/20 transition-all duration-300`}>
                  <div className="flex flex-col items-start">
                    {challenge.icon}
                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-red-400 transition-colors">
                      {challenge.question}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="#planos"
              onClick={() => trackDesafiosCTA()}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            >
              Ver Planos
            </Link>
          </div>
        </div>

        {/* Seção de Jogos */}
        <div className="text-center mb-2">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Conheça os jogos que vão transformar sua relação
          </h2>
          
          {/* Advertorial Card */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-red-500/20">
            <span className="text-red-400 text-sm">
              Interface adaptada para casais hetero, LGBTQIA+ e não monogâmicos
            </span>
          </div>
        </div>

        {/* Game Modes Carousel - Versão com controle de hidratação */}
        {isClient && (
          <div className="h-[28rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden mt-12">
            {/* Primeira linha de cards */}
            <div className="scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
              <div className="flex gap-6 py-4 w-max carousel-scroll-reverse">
                {firstRowGames.concat(firstRowGames).map((mode, index) => (
                  <GameModeCard key={`first-${mode.title}-${index}`} mode={mode} index={index} />
                ))}
              </div>
            </div>

            {/* Segunda linha de cards */}
            <div className="scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
              <div className="flex gap-6 py-4 w-max carousel-scroll-forward">
                {secondRowGames.concat(secondRowGames).map((mode, index) => (
                  <GameModeCard key={`second-${mode.title}-${index}`} mode={mode} index={index} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Fallback para SSR */}
        {!isClient && (
          <div className="h-[28rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
              {gameModes.slice(0, 6).map((mode, index) => (
                <GameModeCard key={`fallback-${mode.title}`} mode={mode} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll-reverse {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1.5rem)); }
        }

        @keyframes scroll-forward {
          0% { transform: translateX(calc(-50% - 1.5rem)); }
          100% { transform: translateX(0); }
        }

        .carousel-scroll-reverse {
          animation: scroll-reverse 45s linear infinite;
          animation-delay: 0.1s;
        }

        .carousel-scroll-forward {
          animation: scroll-forward 40s linear infinite;
          animation-delay: 0.2s;
        }

        .carousel-scroll-reverse:hover,
        .carousel-scroll-forward:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}