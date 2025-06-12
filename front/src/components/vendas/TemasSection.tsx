"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TemasSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [rotations, setRotations] = useState({ card1: { x: 0, y: 0 }, card2: { x: 0, y: 0 } });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, cardId: 'card1' | 'card2') => {
    if (isMobile) return;

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
  }, [isMobile]);

  const handleMouseLeave = useCallback((cardId: 'card1' | 'card2') => {
    setRotations(prev => ({
      ...prev,
      [cardId]: { x: 0, y: 0 }
    }));
  }, []);

  const getCardTransform = useCallback((cardId: 'card1' | 'card2') => {
    if (isMobile) return 'none';
    return `rotateX(${rotations[cardId].x}deg) rotateY(${rotations[cardId].y}deg)`;
  }, [rotations, isMobile]);

  return (
    <section className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Background com efeito parallax */}
      <div className="absolute inset-0">
        <Image
          src="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/gif1.gif"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority={false}
          quality={85}
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col lg:flex-row min-h-screen">
        {/* Lado Esquerdo - Temas */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center mb-8 lg:mb-0">
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Temas
                </span>
                <br />
                <span className="text-white">
                  Românticos
                </span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
                Explore diferentes cenários e aventuras criadas especialmente para casais
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm font-medium border border-pink-500/30">
                💕 Romance
              </span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                🔥 Aventura
              </span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                🌟 Diversão
              </span>
            </div>

            <div className="pt-6">
              <Link 
                href="/planos"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Explorar Temas
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Lado Direito - Preview dos Temas */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-auto" style={{ perspective: '1000px' }}>
            
            {/* Card Principal - Tema Romântico */}
            <div
              className="w-full aspect-[3/4] relative"
              onMouseMove={(e) => handleMouseMove(e, 'card1')}
              onMouseLeave={() => handleMouseLeave('card1')}
              style={{
                transform: getCardTransform('card1'),
                transformStyle: 'preserve-3d',
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative">
                <Image
                  src="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/gif2.gif"
                  alt="Tema Romântico"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Romance Clássico</h3>
                  <p className="text-gray-200 text-sm">
                    Cenários elegantes e românticos para momentos especiais
                  </p>
                </div>
              </div>
            </div>

            {/* Card Secundário - Tema Aventura */}
            <div
              className="absolute -bottom-8 -right-8 w-3/4 aspect-[3/4] z-10"
              onMouseMove={(e) => handleMouseMove(e, 'card2')}
              onMouseLeave={() => handleMouseLeave('card2')}
              style={{
                transform: getCardTransform('card2'),
                transformStyle: 'preserve-3d',
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative">
                <Image
                  src="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/gif3.gif"
                  alt="Tema Aventura"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold mb-1">Aventura & Fantasia</h3>
                  <p className="text-gray-200 text-xs">
                    Explore novos horizontes juntos
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
} 