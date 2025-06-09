"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { RoletaDoDesejoRef } from './jogosImage/RoletaDoDesejo';

const RoletaDoDesejo = dynamic(
  () => import('./jogosImage/RoletaDoDesejo'),
  { ssr: false }
);

const CartasConversa = dynamic(
  () => import('./jogosImage/CartasConversa'),
  { ssr: false }
);

interface GameState {
  isSpinning: boolean;
  hasSelectedGender: boolean;
  isFlipping: boolean;
  isLoading: boolean;
  error: string | null;
}

const useGameState = () => {
  const [state, setState] = useState<GameState>({
    isSpinning: false,
    hasSelectedGender: false,
    isFlipping: false,
    isLoading: false,
    error: null
  });

  const updateState = (newState: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const handleSpinStateChange = useCallback((spinning: boolean) => {
    updateState({ 
      isSpinning: spinning,
      isLoading: spinning,
      error: null 
    });
  }, []);

  const handleGenderSelect = useCallback(() => {
    updateState({ 
      hasSelectedGender: true,
      error: null 
    });
  }, []);

  const handleReset = useCallback(() => {
    updateState({
      isSpinning: false,
      hasSelectedGender: false,
      isFlipping: false,
      isLoading: false,
      error: null
    });
  }, []);

  const handleCardFlip = useCallback(() => {
    updateState({ isFlipping: true });
    setTimeout(() => {
      updateState({ isFlipping: false });
    }, 200);
  }, []);

  return {
    state,
    handlers: {
      handleSpinStateChange,
      handleGenderSelect,
      handleReset,
      handleCardFlip
    }
  };
};

export default function TemasSection() {
  const roletaRef = useRef<RoletaDoDesejoRef>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [rotations, setRotations] = useState({ card1: { x: 0, y: 0 }, card2: { x: 0, y: 0 } });
  
  const { 
    state: { isSpinning, hasSelectedGender, isFlipping, isLoading, error },
    handlers
  } = useGameState();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, cardId: 'card1' | 'card2') => {
    if (isSpinning || isMobile) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = Math.round(((y - centerY) / centerY) * 10);
    const rotateY = Math.round(((centerX - x) / centerX) * 10);

    setRotations(prev => {
      if (prev[cardId].x === rotateX && prev[cardId].y === rotateY) {
        return prev;
      }
      return {
        ...prev,
        [cardId]: { x: rotateX, y: rotateY }
      };
    });
  }, [isSpinning, isMobile]);

  const handleMouseLeave = useCallback((cardId: 'card1' | 'card2') => {
    setRotations(prev => ({
      ...prev,
      [cardId]: { x: 0, y: 0 }
    }));
  }, []);

  const getCardTransform = useCallback((cardId: 'card1' | 'card2') => {
    if (isSpinning || isMobile) return 'none';
    return `rotateX(${rotations[cardId].x}deg) rotateY(${rotations[cardId].y}deg)`;
  }, [rotations, isSpinning, isMobile]);

  return (
    <section className="w-full flex flex-col items-center justify-center py-12" data-sentry-component="Themes">
      {error && (
        <div className="w-full max-w-7xl mx-auto px-4 mb-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 text-sm">
            {error}
          </div>
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto px-4">
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-200 to-white text-3xl lg:text-5xl font-sans py-2 relative z-20 font-bold tracking-tight">
          Os mais jogados
        </h2>
        <p className="max-w-xl mx-auto text-center text-base md:text-lg text-neutral-200 mb-8">
          Divertidos, personalizados e criativos! Esses são os preferidos pelos nossos usuários.
        </p>
        {/* Grid sem container de scroll - sem overflow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full" style={{ pointerEvents: 'auto', touchAction: 'pan-y' }}>
          {/* Card Roleta do Desejo */}
          <div className="flex items-center justify-center" style={{ perspective: '1000px', overflow: 'visible', pointerEvents: 'auto', touchAction: 'pan-y' }}>
            <div 
              className={`flex items-stretch justify-center relative transition-all duration-200 ease-linear inter-var w-full h-full ${isLoading ? 'opacity-70' : ''}`}
              style={{ 
                transformStyle: 'preserve-3d', 
                transform: isMobile ? 'none' : getCardTransform('card1'),
                transition: 'transform 0.2s ease-out',
                overflow: 'visible',
                pointerEvents: 'auto',
                touchAction: 'pan-y'
              }}
              onMouseMove={(e) => !isMobile && handleMouseMove(e, 'card1')}
              onMouseLeave={() => !isMobile && handleMouseLeave('card1')}
            >
              <div className="[transform-style:preserve-3d] relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.2] w-full sm:w-[36rem] rounded-xl p-8 border flex flex-col" style={{ overflow: 'visible', height: 'auto', pointerEvents: 'auto', touchAction: 'pan-y' }}>
                <div className="relative flex-none" style={{ transform: isMobile ? 'none' : 'translateZ(50px)', pointerEvents: 'auto' }}>
                  <h3 className="text-white text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">Roleta do Desejo</h3>
                  <p className="text-white/60 text-sm mt-1">
                    Gire a roleta e descubra uma posição aleatória para apimentar o momento.
                  </p>
                </div>
                <div className="relative mt-6 flex-1 flex flex-col items-center justify-center py-4" style={{ transform: isMobile ? 'none' : 'translateZ(30px)', pointerEvents: 'auto', touchAction: 'pan-y' }}>
                  <div className="w-full max-w-[340px] mx-auto" style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}>
                    <RoletaDoDesejo 
                      ref={roletaRef}
                      isMobile={isMobile}
                      onSpinningChange={handlers.handleSpinStateChange}
                      onGenderSelect={handlers.handleGenderSelect}
                      onReset={handlers.handleReset}
                    />
                  </div>
                  
                  {/* Botões nos cantos com efeito 3D - só aparecem quando jogador foi selecionado */}
                  {hasSelectedGender && (
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end" style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}>
                      <button
                        onClick={() => roletaRef.current?.resetGame()}
                        className={`text-white/70 font-medium transition-all duration-300 active:scale-95 cursor-pointer relative z-50 ${isMobile ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} rounded-md hover:text-white/90 hover:bg-white/5`}
                        style={{ transform: isMobile ? 'none' : 'translateZ(40px) rotateX(-5deg)', pointerEvents: 'auto', touchAction: 'manipulation' }}
                        disabled={isSpinning}
                      >
                        Trocar jogador
                      </button>
                      <button
                        onClick={() => roletaRef.current?.handleSpinClick()}
                        className={`${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-md text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 active:scale-95 cursor-pointer relative z-50 ${
                          isSpinning 
                            ? 'bg-gray-500/50 cursor-not-allowed backdrop-blur-sm' 
                            : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                        }`}
                        style={{ transform: isMobile ? 'none' : 'translateZ(40px) rotateX(-5deg)', pointerEvents: 'auto', touchAction: 'manipulation' }}
                        disabled={isSpinning}
                      >
                        {isSpinning ? 'Girando...' : 'Girar roleta! 🎯'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card Cartas de Conversa */}
          <div className="flex items-center justify-center" style={{ perspective: '1000px', overflow: 'visible', pointerEvents: 'auto', touchAction: 'pan-y' }}>
            <div 
              className={`flex items-stretch justify-center relative transition-all duration-200 ease-linear inter-var w-full h-full ${(isSpinning || isMobile || isFlipping) ? '' : ''}`}
              style={{ 
                transformStyle: 'preserve-3d', 
                transform: isMobile ? 'none' : getCardTransform('card2'),
                transition: 'transform 0.2s ease-out',
                overflow: 'visible',
                pointerEvents: 'auto',
                touchAction: 'pan-y'
              }}
              onMouseMove={(e) => !isMobile && handleMouseMove(e, 'card2')}
              onMouseLeave={() => !isMobile && handleMouseLeave('card2')}
            >
              <div className="[transform-style:preserve-3d] relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.2] w-full sm:w-[36rem] rounded-xl p-8 border flex flex-col" style={{ overflow: 'visible', height: 'auto', pointerEvents: 'auto', touchAction: 'pan-y' }}>
                <div className="relative flex-none" style={{ transform: isMobile ? 'none' : 'translateZ(50px)', pointerEvents: 'auto' }}>
                  <div className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    Date 10
                  </div>
                  <p className="text-white/60 text-sm mt-1 max-w-sm">
                    Tire uma carta de até 10 assuntos sobre vocês e aprofunde sua conexão com perguntas especiais! Uma ótima pedida para se conhecer melhor em um encontro.
                  </p>
                </div>

                <div className="relative mt-6 flex-1 flex items-center justify-center" style={{ transform: isMobile ? 'none' : 'translateZ(30px)', overflow: 'visible', pointerEvents: 'auto', touchAction: 'pan-y' }}>
                  <div className={`${isMobile ? 'w-full max-w-[280px]' : 'w-full max-w-[400px]'} mx-auto`} style={{ overflow: 'visible', pointerEvents: 'auto', touchAction: 'manipulation' }}>
                    <CartasConversa onCardFlip={handlers.handleCardFlip} isMobile={isMobile} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 