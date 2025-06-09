"use client";

import React, { useEffect, useState } from 'react';

interface Heart {
  id: string;
  x: number;
  size: number;
  opacity: number;
  animationDuration: number;
  delay: number;
  color: string;
}

export default function HeartRain() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  
  // Cores de coração variadas em tons de vermelho e rosa
  const heartColors = [
    '#ff5e5e', // vermelho claro
    '#ff0000', // vermelho
    '#d10000', // vermelho escuro
    '#ff4d6d', // vermelho rosado
    '#ff7096', // rosa
    '#ff9999', // rosa claro
  ];
  
  useEffect(() => {
    // Gera corações com posições e tamanhos aleatórios
    const generateHearts = () => {
      const newHearts: Heart[] = [];
      const heartCount = Math.max(20, Math.min(40, Math.floor(window.innerWidth / 35)));
      
      for (let i = 0; i < heartCount; i++) {
        newHearts.push({
          id: `heart-${i}`,
          x: Math.random() * 100, // posição horizontal em porcentagem
          size: Math.random() * 20 + 15, // tamanho entre 15px e 35px
          opacity: Math.random() * 0.4 + 0.1, // opacidade entre 0.1 e 0.5 (mais sutil)
          animationDuration: Math.random() * 15 + 10, // duração entre 10s e 25s
          delay: Math.random() * 15, // atraso entre 0s e 15s
          color: heartColors[Math.floor(Math.random() * heartColors.length)]
        });
      }
      
      setHearts(newHearts);
    };
    
    generateHearts();
    
    // Regenera corações quando a janela é redimensionada
    const handleResize = () => {
      generateHearts();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="heart-rain-container absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-container absolute"
          style={{
            left: `${heart.x}%`,
            top: '-50px',
            animation: `heart-fall ${heart.animationDuration}s linear ${heart.delay}s infinite`,
            opacity: heart.opacity,
          }}
        >
          <div 
            className="heart"
            style={{
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              animation: `heart-pulse 2s ease-in-out infinite`,
            }}
          >
            <svg 
              viewBox="0 0 32 32" 
              width="100%" 
              height="100%" 
              fill={heart.color}
            >
              <path d="M16,28.261c0,0-14-7.926-14-17.046c0-9.356,13.159-10.399,14-0.454c1.011-9.938,14-8.903,14,0.454
               C30,20.335,16,28.261,16,28.261z" />
            </svg>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes heart-fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
          }
        }
        
        @keyframes heart-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        
        .heart {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center;
          will-change: transform;
        }
      `}</style>
    </div>
  );
} 