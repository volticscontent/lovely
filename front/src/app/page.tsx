"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserDashboard from '@/components/UserDashboard';
import HeroSection from '@/components/vendas/HeroSection';
import ComoFuncionaSection from '@/components/vendas/ComoFuncionaSection';
import ValorSection from '@/components/vendas/ValorSection';
import TestimonialsSection from '@/components/vendas/TestimonialsSection';
import PresenteSection from '@/components/vendas/PresenteSection';
import PlansSection from '@/components/vendas/PlansSection';
import FaqSection from '@/components/vendas/FaqSection';
import FooterSection from '@/components/common/FooterSection';

// Dados dos jogos para o carrossel
const firstRowGames = [
  {
    icon: <div className="text-red-500 text-xl">🃏</div>,
    title: "Desafios Picantes (cartas)",
    description: "Desafios picantes em formato de cartas para apimentar a relação."
  },
  {
    icon: <div className="text-red-500 text-xl">🎯</div>,
    title: "Sex Roleta",
    description: "Gire a roleta e deixe a sorte decidir a próxima aventura."
  },
  {
    icon: <div className="text-red-500 text-xl">❓</div>,
    title: "Verdade ou Desafio",
    description: "Descubra segredos ou cumpra desafios picantes."
  },
  {
    icon: <div className="text-red-500 text-xl">🎭</div>,
    title: "RolePlay",
    description: "Incorpore personagens e explore fantasias."
  },
  {
    icon: <div className="text-red-500 text-xl">💕</div>,
    title: "Kama 365 (posições Kama Sutra)",
    description: "Descubra e experimente novas posições do Kama Sutra."
  },
  {
    icon: <div className="text-red-500 text-xl">👤</div>,
    title: "Jogar Sozinho",
    description: "Explore seu corpo e seus desejos de forma individual."
  }
];

const secondRowGames = [
  {
    icon: <div className="text-red-500 text-xl">📊</div>,
    title: "Nível de Safadeza (teste)",
    description: "Descubra o quão safado(a) você e seu parceiro(a) são."
  },
  {
    icon: <div className="text-red-500 text-xl">👕</div>,
    title: "Strip Quiz",
    description: "Responda perguntas e veja quem tira a roupa primeiro."
  },
  {
    icon: <div className="text-red-500 text-xl">🎲</div>,
    title: "Roleta do Desejo",
    description: "Deixe a roleta decidir os desejos que serão realizados."
  },
  {
    icon: <div className="text-red-500 text-xl">🤫</div>,
    title: "Mímica Proibida",
    description: "Adivinhe as palavras e frases picantes através de mímicas."
  },
  {
    icon: <div className="text-red-500 text-xl">💆</div>,
    title: "Massagem Tântrica",
    description: "Aprenda e pratique massagens tântricas para uma conexão mais profunda."
  },
  {
    icon: <div className="text-red-500 text-xl">💖</div>,
    title: "Modo de Conexão Emocional",
    description: "Fortaleça a intimidade e conexão emocional com seu parceiro(a)."
  }
];

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
      <FooterSection />
    </div>
  );
}

function CallbackProcessor() {
  const { setUserData, user } = useAuth();
  const router = useRouter();
  const hasProcessedCallback = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (hasProcessedCallback.current) return;
    if (isProcessing) return;

    const processCallback = async () => {
      try {
        setIsProcessing(true);
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userParam = urlParams.get('user');

        if (!token || !userParam) {
          return;
        }

        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        setUserData(userData);
        hasProcessedCallback.current = true;
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Erro ao processar callback:', error);
        setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [setUserData, isProcessing, mounted]);

  if (!mounted) {
    return (
      <Layout>
        <main>
          <HeroSection />
          <ComoFuncionaSection steps={[]} firstRowGames={firstRowGames} secondRowGames={secondRowGames} />
          <ValorSection />
          <TestimonialsSection />
          <PresenteSection />
          <PlansSection />
          <FaqSection />
        </main>
      </Layout>
    );
  }

  if (isProcessing) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao processar autenticação</p>
            <button
              onClick={() => router.push('/auth')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Voltar para Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <main>
          <HeroSection />
          <ComoFuncionaSection steps={[]} firstRowGames={firstRowGames} secondRowGames={secondRowGames} />
          <ValorSection />
          <TestimonialsSection />
          <PresenteSection />
          <PlansSection />
          <FaqSection />
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProtectedRoute>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando dashboard...</p>
            </div>
          </div>
        }>
          <UserDashboard />
        </Suspense>
      </ProtectedRoute>
    </Layout>
  );
}

export default function Home() {
  return <CallbackProcessor />;
}
