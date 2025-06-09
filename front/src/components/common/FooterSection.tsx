"use client";

import React from 'react';
import Link from 'next/link';

// Valores pré-definidos para evitar problemas de hidratação
const heartParticles = [
  { width: 2.2, height: 5.76, left: 22.65, top: 66.02, duration: 12.21, delay: 0.49 },
  { width: 4.82, height: 3.37, left: 39.21, top: 50.74, duration: 18.40, delay: 0.56 },
  { width: 4.07, height: 4.63, left: 62.29, top: 61.17, duration: 28.84, delay: 3.02 },
  { width: 5.29, height: 6.94, left: 81.28, top: 83.07, duration: 28.16, delay: 0.11 },
  { width: 4.12, height: 6.10, left: 2.15, top: 42.72, duration: 18.26, delay: 2.33 },
  { width: 3.56, height: 3.35, left: 16.97, top: 88.47, duration: 24.34, delay: 0.27 },
  { width: 7.15, height: 6.32, left: 36.57, top: 18.64, duration: 29.45, delay: 2.04 },
  { width: 3.43, height: 5.96, left: 16.67, top: 61.80, duration: 23.56, delay: 2.35 },
  { width: 3.07, height: 2.28, left: 12.47, top: 34.69, duration: 21.78, delay: 1.46 },
  { width: 4.11, height: 5.26, left: 96.41, top: 66.06, duration: 14.49, delay: 4.84 },
  { width: 6.52, height: 6.89, left: 57.46, top: 28.89, duration: 26.05, delay: 4.97 },
  { width: 4.97, height: 3.56, left: 37.51, top: 21.31, duration: 17.46, delay: 2.24 },
  { width: 2.48, height: 5.61, left: 11.41, top: 62.96, duration: 20.20, delay: 0.12 },
  { width: 4.14, height: 6.06, left: 6.82, top: 80.63, duration: 26.67, delay: 2.58 },
  { width: 2.04, height: 3.94, left: 69.89, top: 19.67, duration: 19.07, delay: 2.89 },
  { width: 2.91, height: 6.43, left: 98.54, top: 36.37, duration: 17.90, delay: 4.26 },
  { width: 7.06, height: 6.34, left: 33.31, top: 53.60, duration: 12.07, delay: 4.72 },
  { width: 4.38, height: 5.30, left: 8.44, top: 44.77, duration: 19.46, delay: 4.01 },
  { width: 2.66, height: 6.32, left: 10.40, top: 41.00, duration: 26.31, delay: 3.26 },
  { width: 6.44, height: 5.01, left: 28.28, top: 80.99, duration: 29.61, delay: 2.02 }
];

export default function FooterSection() {
  return (
    <footer className="bg-black text-white py-12 px-4 border-t border-gray-800 relative overflow-hidden">
      {/* Efeito de partículas */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {heartParticles.map((particle, i) => (
          <div 
            key={i}
            className="absolute bg-red-500 rounded-full heart-animation"
            style={{
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 hover-glow">Lovely</h2>
          <div className="h-0.5 w-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto my-4 glow-line"></div>
          <p className="text-gray-400">
            A Lovely é uma plataforma que permite criar páginas personalizadas para pessoas especiais.
          </p>
        </div>
        
        <div className="text-center text-sm text-gray-400">
          <p>Made by <span className="font-medium text-gray-400 hover-glow-text">Pitts Digital LTDA</span></p>
          <p className="mt-1">CNPJ: 58.055.152/0001-71</p>
          
          <div className="mt-6 flex justify-center space-x-6">
            <Link href="#" className="hover:text-white transition-colors footer-link">Termos de uso</Link>
            <Link href="#" className="hover:text-white transition-colors footer-link">Política de privacidade</Link>
          </div>
          
          <div className="mt-6 flex justify-center space-x-6">
            <Link href="#" className="hover:text-white transition-colors hover:text-red-400 footer-link">
              <span className="inline-block transform hover:scale-110 transition-transform">Instagram</span>
            </Link>
            <Link href="#" className="hover:text-white transition-colors hover:text-red-400 footer-link">
              <span className="inline-block transform hover:scale-110 transition-transform">TikTok</span>
            </Link>
          </div>
          
          <p className="mt-8">Copyright © {new Date().getFullYear()} - Lovely.com</p>
        </div>
      </div>
    </footer>
  );
} 