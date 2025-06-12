"use client";

import React from 'react';
import { Check, X, ChevronRight, Trophy } from 'lucide-react';
import StarsBackground from './plans/StarsBackground';
import HoverBorderGradient from './plans/HoverBorderGradient';
import Link from 'next/link';
import { trackPlanCheckout, trackPlanView } from '@/components/common/PixelManager';
import { type PlanId } from '@/config/pixels';

interface Feature {
  text: string;
  highlight: boolean;
  negative?: boolean;
}

interface Plan {
  id: string;
  name: string;
  displayName: string;
  subtitle: string;
  price: number;
  period: string;
  recommended?: boolean;
  badge?: string;
  buttonText: string;
  paymentUrl: string;
  features: Feature[];
}

const plans: Plan[] = [
  {
    id: 'basico',
    name: "Plano Básico",
    displayName: "🩷 PLANO BÁSICO",
    subtitle: "Para casais que querem experimentar e sentir o gostinho da brincadeira.",
    price: 47.90,
    period: "por mês",
    recommended: false,
    buttonText: "Começar com leveza",
    paymentUrl: "https://go.perfectpay.com.br/PPU38CPQ6NQ",
    features: [
      { text: "Personalização Inteligente (para qualquer casal: hétero, LGBTQIA+, não monogâmicos)", highlight: true },
      { text: "Acesso a 3 jogos básicos: Desafios Picantes, Sex Roleta, Verdade ou Desafio", highlight: true },
      { text: "Níveis disponíveis: Leve e Médio", highlight: true },
      { text: "Não inclui Extremo", highlight: false, negative: true },
      { text: "Não inclui Massagem Tântrica", highlight: false, negative: true },
      { text: "Não inclui Modo de Conexão Emocional", highlight: false, negative: true },
      { text: "Não inclui Sistema de Conquistas", highlight: false, negative: true }
    ]
  },
  {
    id: 'medio',
    name: "Plano Médio",
    displayName: "💜 PLANO MÉDIO",
    subtitle: "Para casais que querem explorar todos os jogos com intensidade completa.",
    price: 57.90,
    period: "por mês",
    recommended: true,
    badge: "🔥 Mais vendido",
    buttonText: "Escolher essa experiência",
    paymentUrl: "https://go.perfectpay.com.br/PPU38CPQ73K",
    features: [
      { text: "Personalização Inteligente (completo)", highlight: true },
      { text: "Acesso a todos os 10 jogos: Desafios Picantes, Sex Roleta, Verdade ou Desafio, RolePlay, Kama 365, Jogar Sozinho, Nível de Safadeza, Strip Quiz, Roleta do Desejo, Mímica Proibida", highlight: true },
      { text: "Níveis disponíveis: Leve, Médio e Extremo", highlight: true },
      { text: "Não inclui Massagem Tântrica", highlight: false, negative: true },
      { text: "Não inclui Modo de Conexão Emocional", highlight: false, negative: true },
      { text: "Não inclui Sistema de Conquistas", highlight: false, negative: true }
    ]
  },
  {
    id: 'premium',
    name: "Plano Premium",
    displayName: "💖 PLANO PREMIUM",
    subtitle: "Para casais que querem a experiência completa com conexão profunda.",
    price: 77.90,
    period: "por mês",
    recommended: false,
    badge: "💎 Experiência completa",
    buttonText: "Quero a experiência completa",
    paymentUrl: "https://go.perfectpay.com.br/PPU38CPQ742",
    features: [
      { text: "🔥 Tudo do Plano Médio +", highlight: false },
      { text: "Massagem Tântrica (guiada, voz masculina/feminina, níveis iniciante a avançado)", highlight: true },
      { text: "Modo de Conexão Emocional (perguntas profundas, jogo \"10 dates para se conectar\")", highlight: true },
      { text: "Sistema de Conquistas e Progressão (desbloqueio de desafios, troféus, modos ocultos)", highlight: true }
    ]
  }
];

export default function PlansSection() {
  // Função para lidar com clique no plano
  const handlePlanClick = (plan: Plan) => {
    const planId = plan.id as PlanId;
    
    // Rastrear checkout do plano
    trackPlanCheckout(planId, plan.name, plan.price);
  };

  // Função para rastrear visualização do plano
  const handlePlanView = (planId: string) => {
    trackPlanView(planId as PlanId);
  };

  return (
    <div id="planos" className="relative w-full rounded-md overflow-hidden">
      <StarsBackground />
      <div className="flex items-center flex-col justify-center gap-16 px-2 md:px-10 py-8 w-full h-full relative">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-white text-3xl md:text-5xl font-bold text-center">
            Escolha Seu Plano
          </h2>
          <p className="text-neutral-300 text-center mt-2 text-lg">
            Desperte a paixão e transforme sua intimidade com jogos únicos e experiências inesquecíveis
          </p>
        </div>

        {/* Cards de Planos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-[1000] max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.id} 
              className={`w-full bg-transparent ${plan.recommended ? 'lg:scale-105 lg:z-10' : ''}`}
              onMouseEnter={() => handlePlanView(plan.id)}
            >
              <button className={`relative flex border content-center hover:bg-black/10 transition dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone rounded-xl w-full transform duration-200 ${plan.recommended ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/50' : 'bg-neutral-900'}`}>
                <div className="text-white z-10 rounded-[inherit] relative py-6 px-6 w-full text-left cursor-pointer bg-neutral-950 transform duration-200">
                  
                  {/* Badge */}
                  {plan.badge && (
                    <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs gap-1 font-semibold flex items-center rounded-full px-3 py-1 z-50 absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Trophy size={12} fill="currentColor" />
                      <p>{plan.badge}</p>
                    </div>
                  )}

                  {/* Header */}
                  <div className="w-full">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                      {plan.displayName}
                    </p>
                    <p className="text-2xl font-bold relative z-20 text-left text-white mt-1">
                      {plan.name}
                    </p>
                    <p className="text-sm text-neutral-400 mt-1">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Preço */}
                  <div className="mt-6 mb-6">
                    <p className="text-3xl font-black text-white">
                      R$ {plan.price.toFixed(2).replace('.', ',')}
                      <span className="font-light text-sm text-neutral-300 ml-1">vitalício</span>
                    </p>
                  </div>

                  {/* Features */}
                  <div className="text-neutral-200 relative z-20">
                    <ul className="list-none space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex gap-3 items-start">
                          <div className={`flex items-center justify-center ${feature.negative ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'} rounded-full h-4 w-4 mt-0.5 flex-shrink-0`}>
                            {feature.negative ? <X size={12} /> : <Check size={12} />}
                          </div>
                          <p className={`text-neutral-300 text-sm leading-relaxed ${feature.highlight ? 'font-semibold text-white' : ''}`}>
                            {feature.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Botão */}
                  <Link
                    href={plan.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handlePlanClick(plan)}
                    className={`px-4 py-3 mt-8 w-full transition duration-200 flex items-center justify-center cursor-pointer rounded-lg font-semibold text-sm shadow-[0px_2px_0px_0px_#FFFFFF40_inset] ${
                      plan.recommended 
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    suppressHydrationWarning
                  >
                    {plan.buttonText}
                    <ChevronRight size={18} className="ml-2" />
                  </Link>
                </div>

                <HoverBorderGradient />
                <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
              </button>
            </div>
          ))}
        </div>

        {/* Garantia */}
        <div className="text-center mt-8">
          <p className="text-neutral-400 text-sm">
            ✨ Garantia de 7 dias • 🔒 Pagamento 100% seguro • 🎯 Suporte especializado
          </p>
        </div>
      </div>
    </div>
  );
} 