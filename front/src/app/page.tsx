"use client";

import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/vendas/HeroSection';
import ComoFuncionaSection from '@/components/vendas/ComoFuncionaSection';
import ValorSection from '@/components/vendas/ValorSection';
import TestimonialsSection from '@/components/vendas/TestimonialsSection';
import PresenteSection from '@/components/vendas/PresenteSection';
import PlansSection from '@/components/vendas/PlansSection';
import FaqSection from '@/components/vendas/FaqSection';
import FooterSection from '@/components/common/FooterSection';

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <main className="min-h-screen bg-black text-white w-full overflow-x-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-600 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Carregando experiência...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Como funciona */}
      <ComoFuncionaSection />

      {/* Valor */}
      <ValorSection />

      {/* Depoimentos */}
      <TestimonialsSection />

      {/* Presente */}
      <PresenteSection />

      {/* Planos */}
      <PlansSection />

      {/* FAQ */}
      <FaqSection />
      
      {/* Footer */}
      <FooterSection />
    </main>
  );
}
