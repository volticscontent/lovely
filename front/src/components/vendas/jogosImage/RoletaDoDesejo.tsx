"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';

export type RoletaDoDesejoRef = {
  handleSpinClick: () => void;
  resetGame: () => void;
  isSpinning: boolean;
};

type Gender = 'homem' | 'mulher' | null;

interface RoletaDoDesejoProps {
  onGenderSelect?: () => void;
  onReset?: () => void;
  onSpinningChange?: (spinning: boolean) => void;
  isMobile?: boolean;
}

const data = [
  { option: '💝 Vale Night', style: { backgroundColor: '#ff1414', textColor: '#ffffff' } },
  { option: '💆‍♂️ Massagem', style: { backgroundColor: '#000000', textColor: '#ffffff' } },
  { option: '👗 Fantasia', style: { backgroundColor: '#ff1414', textColor: '#ffffff' } },
  { option: '🌹 Surpresa', style: { backgroundColor: '#000000', textColor: '#ffffff' } },
  { option: '🛁 Banho Juntos', style: { backgroundColor: '#ff1414', textColor: '#ffffff' } },
  { option: '☕ Café na Cama', style: { backgroundColor: '#000000', textColor: '#ffffff' } },
  { option: '💆‍♀️ Spa Day', style: { backgroundColor: '#ff1414', textColor: '#ffffff' } },
  { option: '🍷 Jantar', style: { backgroundColor: '#000000', textColor: '#ffffff' } },
];

const RoletaDoDesejo = forwardRef<RoletaDoDesejoRef, RoletaDoDesejoProps>((props, ref) => {
  const { onGenderSelect, onReset, onSpinningChange, isMobile } = props;
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedGender, setSelectedGender] = useState<Gender>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    onSpinningChange?.(isSpinning);
  }, [isSpinning, onSpinningChange]);

  const handleSpinClick = useCallback(() => {
    if (!isSpinning && selectedGender) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setIsSpinning(true);
    }
  }, [isSpinning, selectedGender]);

  const resetGame = useCallback(() => {
    setSelectedGender(null);
    setMustSpin(false);
    setIsSpinning(false);
    setPrizeNumber(0);
    onReset?.();
  }, [onReset]);

  const handleGenderSelect = useCallback((gender: Gender) => {
    if (!isSpinning) {
      setSelectedGender(gender);
      onGenderSelect?.();
    }
  }, [isSpinning, onGenderSelect]);

  const handleRandomGender = useCallback(() => {
    if (!isSpinning) {
      setSelectedGender(Math.random() < 0.5 ? 'homem' : 'mulher');
      onGenderSelect?.();
    }
  }, [isSpinning, onGenderSelect]);

  useImperativeHandle(ref, () => ({
    handleSpinClick: () => {
      if (!isSpinning && selectedGender) {
        handleSpinClick();
      }
    },
    resetGame,
    isSpinning
  }), [handleSpinClick, resetGame, isSpinning, selectedGender]);

  if (!selectedGender) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl p-4">
        <div className="text-center space-y-1 mb-2.5">
          <h3 className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500`}>
            Roleta do Desejo
          </h3>
          <p className="text-white/70 text-xs">
            Escolha quem vai girar a roleta hoje
          </p>
        </div>
        <div className="flex flex-col gap-1.5 w-full max-w-[170px] mx-auto">
          <button
            type="button"
            onClick={() => handleGenderSelect('homem')}
            className="w-full px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 rounded-md text-white text-xs font-semibold hover:from-blue-700 hover:to-red-800 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95"
          >
            Homem 👨
          </button>
          <button
            type="button"
            onClick={() => handleGenderSelect('mulher')}
            className="w-full px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 rounded-md text-white text-xs font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 active:scale-95"
          >
            Mulher 👩
          </button>
          <button
            type="button"
            onClick={handleRandomGender}
            className="w-full px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 rounded-md text-white text-xs font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 active:scale-95"
          >
            Aleatório 🎲
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Container da roleta */}
      <div className="w-full aspect-square relative max-w-[350px] mx-auto mb-6">
        {/* Ponteiro centralizado em cima da roleta */}
        <div className="absolute top-0 left-1/2 -translate-y-[8px] z-20"
             style={{ transform: isMobile ? 'translateX(-50%) translateY(-8px) translateZ(20px) rotateX(-3deg)' : 'translateX(-50%) translateY(-12px) translateZ(30px) rotateX(-5deg)' }}>
          <div className={`${isMobile ? 'w-0 h-0' : 'w-0 h-0'} mx-auto`}
               style={{
                 borderLeft: isMobile ? '8px solid transparent' : '10px solid transparent',
                 borderRight: isMobile ? '8px solid transparent' : '10px solid transparent',
                 borderTop: isMobile ? '12px solid white' : '15px solid white',
                 filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
               }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            backgroundColors={['#ff1414', '#000000']}
            textColors={['#ffffff', '#ffffff']}
            fontSize={isMobile ? 11 : 13}
            fontFamily="Inter"
            outerBorderColor="#ffffff33"
            outerBorderWidth={isMobile ? 2 : 3}
            innerBorderColor="#ffffff22"
            innerBorderWidth={isMobile ? 8 : 12}
            innerRadius={isMobile ? 8 : 8}
            radiusLineColor="#ffffff22"
            radiusLineWidth={isMobile ? 1 : 1}
            perpendicularText={true}
            textDistance={isMobile ? 62 : 70}
            spinDuration={1.2}
            disableInitialAnimation={true}
            onStopSpinning={() => {
              setTimeout(() => {
                setMustSpin(false);
                setIsSpinning(false);
              }, 150);
            }}
            pointerProps={{
              src: "",
              style: {
                width: 0,
                height: 0,
                display: 'none'
              }
            }}
          />
        </div>
      </div>
    </div>
  );
});

RoletaDoDesejo.displayName = 'RoletaDoDesejo';

export default RoletaDoDesejo;