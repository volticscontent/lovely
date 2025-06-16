"use client";

import React, { memo, useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// URLs dos GIFs - movidas para fora do componente para evitar recriação
const GIF_URLS = [
  "https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-01.gif",
  "https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-02_1.gif",
  "https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEOS-SITE-03_1.gif"
] as const;

const GIF_DESCRIPTIONS = [
  "Demonstração do app - Tela de Início",
  "Demonstração do app - Tela de Jogos", 
  "Demonstração do app - Tela de Resultados"
] as const;

const PhoneMockupsClient = memo(() => {
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Marca como montado no cliente
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Alterna entre os GIFs a cada 4 segundos
  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      setCurrentGifIndex((prevIndex) => (prevIndex + 1) % GIF_URLS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isMounted]);

  // Renderização consistente durante a hidratação
  if (!isMounted) {
    return (
      <div className="relative lg:flex items-center w-full lg:w-1/2 justify-center h-[290px] md:h-[240px] lg:h-auto lg:mt-0 overflow-visible">
        <div 
          className="mockup-container absolute w-[85%] max-w-[240px] lg:max-w-[240px] lg:rotate-[3deg] aspect-[9/16] lg:mt-2 transition-all duration-700 ease-out translate-x-[110px] lg:translate-x-[-10px] top-[10px] md:top-[20px] lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 opacity-0"
          style={{
            zIndex: 10,
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 8px 25px, rgba(225, 29, 72, 0.1) 0px 0px 20px',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
          }}
        >
          <Image 
            alt="Moldura do celular" 
            className="absolute z-50 w-full h-full pointer-events-none" 
            src="/images/mockup.webp"
            width={240}
            height={427}
            priority={true}
            sizes="(max-width: 768px) 85px, 240px"
            style={{ objectFit: 'contain' }}
            quality={95}
          />
          
          <div 
            className="mockup-content absolute rounded-[18px] lg:rounded-[28px] overflow-hidden cursor-pointer z-40 bg-black"
            style={{
              top: '3.5%',
              left: '6.5%',
              width: '87%',
              height: '93.5%',
              boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <Image 
              alt={GIF_DESCRIPTIONS[0]}
              className="w-full h-full object-cover"
              src={GIF_URLS[0]}
              width={200}
              height={400}
              sizes="(max-width: 768px) 75px, 200px"
              unoptimized
              loading="eager"
              style={{ 
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
              quality={85}
            />
            
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 50%, transparent 100%)',
                mixBlendMode: 'overlay'
              }}
            />
          </div>
          
          <div 
            className="absolute inset-0 rounded-[20px] lg:rounded-[32px] pointer-events-none z-30 opacity-60"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.05) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20 lg:opacity-80">
            {GIF_URLS.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === 0 ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative lg:flex items-center w-full lg:w-2/2 justify-center h-[220px] md:h-[250px] lg:h-auto lg:mt-0 overflow-visible">
      <div 
        className={`mockup-container absolute w-[85%] max-w-[240px] lg:max-w-[240px] lg:rotate-[3deg] aspect-[9/16] lg:mt-2 transition-all duration-700 ease-out translate-x-[110px] lg:translate-x-[-10px] top-[10px] md:top-[20px] lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 hover:z-50 hover:scale-105 hover:rotate-0 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          zIndex: 10,
          boxShadow: 'rgba(0, 0, 0, 0.25) 0px 8px 25px, rgba(225, 29, 72, 0.1) 0px 0px 20px',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
        }}
      >
        <Image 
          alt="Moldura do celular" 
          className="absolute z-50 w-full h-full pointer-events-none" 
          src="/images/mockup.webp"
          width={240}
          height={427}
          priority={true}
          sizes="(max-width: 768px) 85px, 240px"
          style={{ objectFit: 'contain' }}
          quality={95}
        />
        
        <div 
          className="mockup-content absolute rounded-[18px] lg:rounded-[28px] overflow-hidden cursor-pointer z-40 bg-black"
          style={{
            top: '2.2%',
            left: '6.5%',
            width: '87%',
            height: '93.5%',
            boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <Image 
            alt={GIF_DESCRIPTIONS[currentGifIndex]}
            className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
            src={GIF_URLS[currentGifIndex]}
            width={200}
            height={400}
            sizes="(max-width: 768px) 75px, 200px"
            unoptimized
            loading="eager"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
            quality={85}
            key={currentGifIndex}
            onLoad={() => setIsLoaded(true)}
          />
          
        </div>
        
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20 lg:opacity-80">
          {GIF_URLS.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentGifIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

PhoneMockupsClient.displayName = 'PhoneMockupsClient';

// Exporta com dynamic import para evitar problemas de hidratação
const PhoneMockups = dynamic(() => Promise.resolve(PhoneMockupsClient), {
  ssr: true
});

export default PhoneMockups;