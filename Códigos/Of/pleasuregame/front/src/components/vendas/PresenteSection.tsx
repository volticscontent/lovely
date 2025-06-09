"use client";

import React from 'react';
import Link from 'next/link';
import { trackPresenteCTA } from '@/services/tracking';

const features = [
  {
    icon: "💌",
    text: "Mensagem personalizada"
  },
  {
    icon: "🎁",
    text: "Cartão digital animado"
  },
  {
    icon: "⏰",
    text: "Acesso programado para liberar no momento certo"
  }
];

export default function PresenteSection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Primeiro bloco - Presente Perfeito */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-32">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
            O Presente Que Ninguém Vai Esquecer.
          </h2>

          <p className="text-xl text-neutral-300 mb-8">
            Você pode enviar o app como uma surpresa:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            {features.map((feature, index) => (
              <div
                key={feature.text}
                className="flex items-center space-x-3 bg-gradient-to-r from-red-500/5 to-transparent p-4 rounded-xl border border-red-500/10"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-neutral-200">{feature.text}</span>
              </div>
            ))}
          </div>

          <div>
            <Link
              href="#planos"
              onClick={() => trackPresenteCTA('dar_presente')}
              className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            >
              Quero Dar de Presente
            </Link>
          </div>
        </div>
      </div>

      {/* Segundo bloco - Transição para Planos */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Agora escolha como vocês querem jogar.
          </h2>

          <p className="text-xl text-neutral-300 mb-12">
            Todos os modos, desafios e experiências estão disponíveis em planos pensados para cada tipo de casal.
          </p>

          <div className="relative">
            <div className="absolute -inset-1"></div>
            <Link
              href="#planos"
              onClick={() => trackPresenteCTA('ver_planos')}
              className="relative inline-flex items-center px-12 py-6 rounded-full bg-black border border-white text-white font-bold text-xl md:text-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-red-500/25"
            >
              Ver Planos e Começar o Jogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 