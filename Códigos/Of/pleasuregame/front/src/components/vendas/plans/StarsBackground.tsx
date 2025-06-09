"use client";

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const stars: Star[] = [];
    const numStars = 200;
    
    // Função para redimensionar o canvas
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    // Inicializa as estrelas
    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: Math.random() * 0.5 + 0.1
        });
      }
    };

    // Desenha uma estrela
    const drawStar = (star: Star) => {
      if (!ctx) return;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.7})`;
      ctx.fill();
    };

    // Atualiza a posição das estrelas
    const updateStar = (star: Star) => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    };

    // Loop de animação
    const animate = () => {
      if (!ctx) return;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        drawStar(star);
        updateStar(star);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Inicializa tudo
    resizeCanvas();
    initStars();
    animate();

    // Event listener para redimensionamento
    window.addEventListener('resize', () => {
      resizeCanvas();
      initStars();
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full absolute inset-0"
      style={{ pointerEvents: 'none' }}
    />
  );
} 