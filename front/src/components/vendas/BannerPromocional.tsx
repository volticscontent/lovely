"use client";

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Importações CSS necessárias
import 'swiper/css';

export default function BannerPromocional() {
  const [isClosed, setIsClosed] = useState(false);
  
  // Formata a data para dia/mês/ano
  const hoje = new Date();
  const dia = hoje.getDate().toString().padStart(2, '0');
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const ano = hoje.getFullYear();
  const dataFormatada = `${dia}/${mes}/${ano}`;
  
  // Calcula a data final da promoção (7 dias a partir de hoje)
  const dataFinal = new Date(hoje);
  dataFinal.setDate(dataFinal.getDate() + 7);
  const diaFinal = dataFinal.getDate().toString().padStart(2, '0');
  const mesFinal = (dataFinal.getMonth() + 1).toString().padStart(2, '0');
  const dataPromoFormatada = `${diaFinal}/${mesFinal}/${ano}`;
  
  if (isClosed) return null;
  
  return (
    <div className="bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 text-white text-center relative overflow-hidden shadow-lg">
      {/* Decorações de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute h-8 w-8 rounded-full bg-white/10 blur-md -top-6 left-1/4"></div>
        <div className="absolute h-8 w-8 rounded-full bg-white/10 blur-md -bottom-4 left-1/3"></div>
        <div className="absolute h-8 w-8 rounded-full bg-white/10 blur-md -top-5 right-1/4"></div>
        <div className="absolute h-8 w-8 rounded-full bg-white/10 blur-md -bottom-3 right-1/3"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          speed={800}
          loop={true}
          className="banner-swiper"
        >
          <SwiperSlide>
            <div className="banner-content">
              <span className="banner-icon animate-pulse">💝</span>
              <span className="banner-text">
                Apenas hoje <span className="font-bold">{dataFormatada}</span> - Tudo com até <span className="font-bold text-yellow-300">70% OFF</span>
              </span>
            </div>
          </SwiperSlide>
          
          <SwiperSlide>
            <div className="banner-content">
              <span className="banner-icon animate-bounce">🎁</span>
              <span className="banner-text">Use o cupom</span>
              <span className="coupon-code">Lovely10</span>
              <span className="banner-text">e ganhe 10% extra!</span>
            </div>
          </SwiperSlide>
          
          <SwiperSlide>
            <div className="banner-content">
              <span className="banner-icon animate-pulse">⏰</span>
              <span className="banner-text">Oferta por tempo limitado: até</span>
              <span className="font-bold text-yellow-300">{dataPromoFormatada}</span>
            </div>
          </SwiperSlide>
          
          <SwiperSlide>
            <div className="banner-content">
              <span className="banner-icon animate-pulse">⭐</span>
              <span className="banner-text">Mais de</span>
              <span className="highlight-text">10.000</span>
              <span className="banner-text">clientes satisfeitos!</span>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      
      <button 
        onClick={() => setIsClosed(true)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white p-1 focus:outline-none hidden sm:block"
        title="Fechar banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
} 