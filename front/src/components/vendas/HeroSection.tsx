"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PhoneMockups from './PhoneMockups';
import HeartRain from './hero/HeartRain';
import { trackHeroCTA, trackSectionView } from '@/components/common/PixelManager';

// Custom Hook para efeito de digitação otimizado
function useTypewriter(words: string[], typingSpeed = 150, deletingSpeed = 75, delayBetween = 2500) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const target = words[currentIndex];
    let timer: NodeJS.Timeout;
    
    if (isDeleting) {
      if (currentText.length === 0) {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % words.length);
      } else {
        timer = setTimeout(() => {
          setCurrentText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (currentText === target) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetween);
      } else {
        timer = setTimeout(() => {
          setCurrentText((prev) => prev + target.charAt(prev.length));
        }, typingSpeed);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentText, currentIndex, isDeleting, words, typingSpeed, deletingSpeed, delayBetween]);
  
  return currentText;
}

export default function HeroSection() {
  const words = ["alguém especial", "seu amigo", "quem você ama"];
  const displayText = useTypewriter(words, 150, 75, 2500);
  const [isMobile, setIsMobile] = useState(false);
  
  // Verificar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Rastrear visualização da seção Hero
  useEffect(() => {
    trackSectionView('Hero');
  }, []);

  // Função para rolagem suave até a seção "plans"
  const scrollToPlans = () => {
    // Rastrear clique no CTA principal
    trackHeroCTA();
    
    const plansSection = document.getElementById('planos');
    if (plansSection) {
      plansSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  useEffect(() => {
    // Adiciona uma classe específica para o background fixo no mobile
    const addMobileStyles = () => {
      // Adiciona estilos CSS diretamente para garantir que funcione em dispositivos móveis
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        @media (max-width: 768px) {
          .mobile-bg-fixed {
            background:#000000;
            background-size: 400% 400%;
            background-attachment: fixed;
            animation: gradientAnimation 15s ease infinite;
          } 
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(25deg);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(100%) rotate(25deg);
            opacity: 0;
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.4;
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(styleEl);
    };
    
    addMobileStyles();
    
    // Cleanup function
    return () => {
      const styleElements = document.getElementsByTagName('style');
      for (let i = 0; i < styleElements.length; i++) {
        const element = styleElements[i];
        if (element && element.textContent && element.textContent.includes('mobile-bg-fixed')) {
          element.remove();
          break;
        }
      }
    };
  }, []);

  return (
    <>
      <section id="hero-section" className="relative py-12 md:py-28 px-5 sm:px-6 lg:px-8 overflow-hidden bg-black section-dark mobile-bg-fixed min-h-[80vh]">
        {/* Padrão de linhas de fundo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            opacity: 0.3
          }}></div>
        </div>

        {/* Máscara radial */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]"></div>
        
        {/* Efeito Spotlight */}
        <div className="pointer-events-none fixed inset-0 h-screen w-screen z-20">
          {/* Lado esquerdo */}
          <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
              style={{ 
                transform: 'translateY(-50%) translateX(-50%) rotate(-45deg)',
                background: 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(255, 179, 179, 0.08) 0px, rgba(255, 26, 26, 0.02) 50%, rgba(230, 0, 0, 0) 80%)',
                width: '140vmax',
                height: '140vmax'
              }}
            ></div>
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
              style={{ 
                transform: 'translateY(-50%) translateX(-50%) rotate(45deg)',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 179, 179, 0.04) 0px, rgba(230, 0, 0, 0.02) 80%, transparent 100%)',
                width: '140vmax',
                height: '140vmax'
              }}
            ></div>
          </div>

          {/* Efeito de brilho adicional */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
            style={{ 
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(255, 179, 179, 0.05) 0%, transparent 100%)',
              width: '120vmax',
              height: '120vmax',
              opacity: 0.6
            }}
          ></div>
        </div>

        {/* Efeito de chuva de corações */}
        <HeartRain />

        {/* Conteúdo principal */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-36 relative z-50 min-h-[calc(50vh-15rem)]" data-sentry-component="Hero">
          <div className="w-full pt-[10px] lg:w-1/2 lg:pt-0 lg:ml-25">
            <button className="relative flex border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit rounded-full">
              <div className="w-auto z-10 px-4 py-2 rounded-[inherit] bg-black text-white text-xs flex items-center space-x-2">
                <span>Jogos para casais</span>
              </div>
              <div className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]" style={{ filter: 'blur(2px)', position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(17.6138% 44.8061% at 12.3727% 38.4643%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)' }}></div>
              <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]"></div>
            </button>
            
            <h1 className="text-white text-5xl lg:text-6xl font-sans pt-3 relative z-20 font-bold tracking-tight">
              Jogos eróticos
            </h1>
            
            <div className="relative font-bold tracking-tight text-5xl lg:text-6xl font-sans text-red-500 pb-8 z-20">
              <span>para casais</span>
              <span className="animate-pulse">|</span>
            </div>
            
            <p className="max-w-xl text-left text-base relative md:text-lg text-neutral-300">
              Transforme o Dia dos Namorados em um novo começo para a relação.
            </p>
            
            <button 
              type="button" 
              onClick={scrollToPlans}
              className="relative mt-6 w-full lg:w-[50%] inline-flex h-[3.2rem] overflow-hidden rounded-lg p-[2px] focus:outline-none focus:ring-0"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'manipulation',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
            >
              <span 
                className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#ffcbcb_0%,#b23939_50%,#ffcbcb_100%)]"
                style={{
                  animation: 'spin 2s linear infinite',
                  WebkitAnimation: 'spin 2s linear infinite',
                  WebkitTransform: 'translateZ(0)',
                  transform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              ></span>
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black px-3 py-1 text-sm font-semibold text-white backdrop-blur-3xl relative z-10">
                <span>Quero jogar!</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-chevron-right ml-4">
                  <path d="M9 6l6 6l-6 6"></path>
                </svg>
              </span>
            </button>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center mt-10 gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="relative w-8 h-8 rounded-full border-2 border-white/20 shadow-sm overflow-hidden" style={{ zIndex: 6 - index }}>
                      <Image
                        alt={`Pessoa ${index}`}
                        src={`/images/approved/${index}.webp`}
                        width={32}
                        height={32}
                        className="object-cover"
                        priority={true}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-4 h-4 fill-amber-400 text-amber-400">
                        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"></path>
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-white/80">Aprovado por 37.412 pessoas</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mockups de celulares */}
          <PhoneMockups />
        </div>
      </section>
      
      <div className="section-divider" />
    </>
  );
}