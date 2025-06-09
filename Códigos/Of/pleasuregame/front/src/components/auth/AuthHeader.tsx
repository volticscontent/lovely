"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AuthHeader() {
  const video0Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Função para garantir que o vídeo seja reproduzido
    const playVideo = () => {
      if (video0Ref.current) {
        // Definir currentTime para 0 para garantir que o vídeo comece do início
        video0Ref.current.currentTime = 0;
        // Tentar reproduzir o vídeo com tratamento de erro
        video0Ref.current.play()
          .catch(err => {
            // Fallback silencioso - tenta novamente após 1 segundo
            setTimeout(playVideo, 1000);
          });
      }
    };

    // Iniciar a reprodução do vídeo
    playVideo();

    // Adicionar evento para detectar quando o vídeo está pausado ou congelado
    const handlePause = () => {
      if (video0Ref.current) {
        playVideo();
      }
    };

    if (video0Ref.current) {
      video0Ref.current.addEventListener('pause', handlePause);
    }
    
    return () => {
      // Limpar eventos quando o componente for desmontado
      if (video0Ref.current) {
        video0Ref.current.removeEventListener('pause', handlePause);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="relative h-16 w-16 overflow-visible">
        <video 
          ref={video0Ref}
          preload="auto" 
          autoPlay 
          loop 
          muted
          playsInline 
          src="/videos/hero/dh.webm" 
          className="w-full h-full object-contain scale-125"
        />
      </div>
      <div className="text-white font-bold text-2xl md:text-3xl tracking-wide">
        <span className="text-white">Love</span>
        <span className="text-red-500">ly</span>
      </div>
    </div>
  );
} 