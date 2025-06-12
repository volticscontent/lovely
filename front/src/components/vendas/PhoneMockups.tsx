"use client";

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

// Hook para detectar se é dispositivo móvel
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
  }, []);
  
  return isMobile;
}

export default function PhoneMockups() {
  const image1Ref = useRef<HTMLImageElement | null>(null);
  const image2Ref = useRef<HTMLImageElement | null>(null);
  const image3Ref = useRef<HTMLImageElement | null>(null);
  
  const isMobile = useIsMobile();
  
  const [gifError, setGifError] = useState({ gif1: false, gif2: false, gif3: false });

  // URLs dos GIFs
  const gifUrls = {
    gif1: "https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-01.gif",
    gif2: "https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-02_1.gif",
    gif3: "https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEOS-SITE-03_1.gif"
  };

  const handleImageError = (gifKey: keyof typeof gifError) => {
    setGifError(prev => ({ ...prev, [gifKey]: true }));
  };

  return (
    <div 
      className="relative lg:flex items-center w-full lg:w-1/2 justify-center h-[180px] md:h-[220px] lg:h-auto lg:mt-0 overflow-visible"
    >
      {/* Smartphone 1 - Esquerdo */}
      <div 
        className="absolute w-[80%] max-w-[100px] lg:max-w-[220px] lg:rotate-[-8deg] lg:translate-x-[-180px] top-[15px] md:top-[25px] lg:top-1/2 lg:-translate-y-1/2 left-[10px] md:left-[20px] lg:left-1/2 aspect-[9/16] transition-all duration-300 hover:z-50 hover:scale-110"
        style={{
          zIndex: 3,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.08) 0px 1px 3px'
        }}
      >
        <Image 
          alt="mockup" 
          className="absolute z-50 w-full h-full" 
          src="/images/mockup.webp"
          fill
          priority
          sizes="(max-width: 768px) 100px, 220px"
        />
        <div className="relative w-[97%] h-[99%] rounded-2xl overflow-hidden cursor-not-allowed z-40">
          {gifError.gif1 ? (
            <div className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Demonstração 1</span>
            </div>
          ) : (
            <Image 
              ref={image1Ref}
              alt="Demonstração do app - Tela 1"
              className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full object-cover"
              src={gifUrls.gif1}
              fill
              priority={!isMobile}
              sizes="(max-width: 768px) 100px, 220px"
              onError={() => handleImageError('gif1')}
              unoptimized
            />
          )}
        </div>
      </div>

      {/* Smartphone 2 - Central */}
      <div 
        className="absolute w-[80%] max-w-[100px] lg:max-w-[220px] lg:rotate-[5deg] aspect-[9/16] lg:mt-3 transition-all translate-x-[120px] lg:translate-x-[-20px] top-[15px] md:top-[25px] lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 duration-300 hover:z-50 hover:scale-110"
        style={{
          zIndex: 2,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.08) 0px 1px 3px'
        }}
      >
        <Image 
          alt="mockup" 
          className="absolute z-50 w-full h-full" 
          src="/images/mockup.webp"
          fill
          priority
          sizes="(max-width: 768px) 100px, 220px"
        />
        <div className="relative w-[97%] h-[99%] rounded-2xl overflow-hidden cursor-not-allowed z-40">
          {gifError.gif2 ? (
            <div className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Demonstração 2</span>
            </div>
          ) : (
            <Image 
              ref={image2Ref}
              alt="Demonstração do app - Tela 2"
              className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full object-cover"
              src={gifUrls.gif2}
              fill
              priority={!isMobile}
              sizes="(max-width: 768px) 100px, 220px"
              onError={() => handleImageError('gif2')}
              unoptimized
            />
          )}
        </div>
      </div>

      {/* Smartphone 3 - Direito */}
      <div 
        className="absolute w-[80%] max-w-[100px] lg:max-w-[220px] lg:rotate-[18deg] aspect-[9/16] lg:mt-12 translate-x-[240px] lg:translate-x-[140px] top-[15px] md:top-[25px] lg:top-1/2 lg:-translate-y-1/2 lg:left-1/2 transition-all duration-300 hover:z-50 hover:scale-110"
        style={{
          zIndex: 1,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.08) 0px 1px 3px'
        }}
      >
        <Image 
          alt="mockup" 
          className="absolute z-50 w-full h-full" 
          src="/images/mockup.webp"
          fill
          priority
          sizes="(max-width: 768px) 100px, 220px"
        />
        <div className="relative w-[97%] h-[99%] rounded-2xl overflow-hidden cursor-not-allowed z-40">
          {gifError.gif3 ? (
            <div className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Demonstração 3</span>
            </div>
          ) : (
            <Image 
              ref={image3Ref}
              alt="Demonstração do app - Tela 3"
              className="absolute top-0.5 left-0.5 lg:left-1 lg:top-2 rounded-md lg:rounded-3xl w-full h-full object-cover"
              src={gifUrls.gif3}
              fill
              sizes="(max-width: 768px) 100px, 220px"
              onError={() => handleImageError('gif3')}
              unoptimized
            />
          )}
        </div>
      </div>
    </div>
  );
}