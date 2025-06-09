"use client";

import { useState, useCallback } from 'react';
import type { CardData } from './CartasConversa';

interface CardInteractionProps {
  cardData: CardData;
  onCardFlip: () => void;
  isMobile?: boolean;
}

export function CardInteraction({ cardData, onCardFlip, isMobile }: CardInteractionProps) {
  const { questions, themeColors, themeEmojis, themeNames, CardPattern } = cardData;
  const [currentQuestion, setCurrentQuestion] = useState<typeof questions[0] | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawCard = useCallback(() => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    onCardFlip();
    
    const randomIndex = Math.floor(Math.random() * questions.length);
    const newQuestion = questions[randomIndex];
    
    setIsFlipped(true);
    setTimeout(() => {
      setCurrentQuestion(newQuestion);
      setIsDrawing(false);
    }, 200);
  }, [isDrawing, onCardFlip, questions]);

  const resetCard = useCallback(() => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    onCardFlip();
    setIsFlipped(false);
    
    setTimeout(() => {
      setCurrentQuestion(null);
      setIsDrawing(false);
    }, 200);
  }, [isDrawing, onCardFlip]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`w-full aspect-[3/4] relative ${isMobile ? 'touch-none' : ''} transition-all duration-300`}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {!isFlipped ? (
          // Carta virada para baixo
          <div 
            className="w-full h-full rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 p-[2px] cursor-pointer hover:from-violet-400 hover:to-purple-600 transition-all duration-300 group relative"
            onClick={drawCard}
            style={{
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.3), 0 5px 15px rgba(0, 0, 0, 0.3)',
              transform: 'translateZ(0)'
            }}
          >
            {/* Sombra da carta */}
            <div 
              className="absolute -inset-1 rounded-xl bg-black/30 blur-md -z-10 transition-all duration-300"
              style={{
                transform: 'translateZ(-10px)'
              }}
            />
            
            <div className="w-full h-full rounded-lg bg-black flex items-center justify-center p-8 text-center relative overflow-hidden">
              <CardPattern color="#fff" />
              
              {/* Brilho superior */}
              <div 
                className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  transform: 'translateZ(1px)'
                }}
              />
              
              <div className="relative z-10 transform transition-transform duration-300">
                <div className="text-white space-y-6">
                  <span className={`block mb-3 filter drop-shadow-lg ${isMobile ? 'text-5xl' : 'text-7xl'}`}>🎴</span>
                  <div className="space-y-3">
                    <p className={`font-medium ${isMobile ? 'text-lg' : 'text-2xl'}`}>Cartas de Conversa</p>
                    <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-white/70`}>Clique para tirar uma carta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Carta virada para cima
          <div className="w-full h-full">
            {currentQuestion && (
              <div 
                className={`w-full h-full rounded-xl bg-gradient-to-br ${themeColors[currentQuestion.theme].gradient} p-[2px] cursor-pointer transition-all duration-300 group relative`}
                onClick={resetCard}
                style={{
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.3), 0 5px 15px rgba(0, 0, 0, 0.3)',
                  transform: 'translateZ(0)'
                }}
              >
                {/* Sombra da carta */}
                <div 
                  className="absolute -inset-1 rounded-xl bg-black/30 blur-md -z-10 transition-all duration-300"
                  style={{
                    transform: 'translateZ(-10px)'
                  }}
                />
                
                <div className="w-full h-full rounded-lg bg-black flex flex-col items-center justify-between p-8 text-center relative overflow-hidden">
                  <CardPattern color={themeColors[currentQuestion.theme].pattern} />
                  
                  {/* Brilho superior */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      transform: 'translateZ(1px)'
                    }}
                  />
                  
                  <div className="relative z-10 space-y-3 transform transition-transform duration-300">
                    <span className={`filter drop-shadow-lg ${isMobile ? 'text-3xl' : 'text-5xl'}`}>{themeEmojis[currentQuestion.theme]}</span>
                    <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-medium bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/70`}>
                      {themeNames[currentQuestion.theme]}
                    </p>
                  </div>
                  
                  <p className={`text-white ${isMobile ? 'text-lg' : 'text-2xl'} font-medium leading-relaxed relative z-10 max-w-sm mx-auto`}>
                    {currentQuestion.text}
                  </p>
                  
                  <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-white/60 relative z-10`}>
                    Clique para tirar outra carta
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 