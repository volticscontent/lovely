import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BarraNavegacao from "@/components/common/Navigation";
import BannerPromocional from "@/components/vendas/BannerPromocional";
import CookieConsent from "@/components/common/CookieConsent";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense } from "react";
import { Toaster } from '@/components/ui/toaster';
import PixelManager from '@/components/common/PixelManager';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Lovely Game - Jogos de Amor e Sedução",
  description: "Descubra o Lovely Game, o melhor jogo de amor e sedução. Jogue com sua parceira(o) e explore novas experiências juntos.",
  keywords: 'jogo de amor, jogo de sedução, casal, relacionamento, diversão, intimidade',
  authors: [{ name: 'Lovely Game' }],
  creator: 'Lovely Game',
  publisher: 'Lovely Game',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lovelygame.shop'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Lovely Game - Jogos de Amor e Sedução',
    description: 'Descubra o Lovely Game, o melhor jogo de amor e sedução. Jogue com sua parceira(o) e explore novas experiências juntos.',
    url: 'https://lovelygame.shop',
    siteName: 'Lovely Game',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://lovelygame.shop/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lovely Game - Jogos de Amor e Sedução'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lovely Game - Jogos de Amor e Sedução',
    description: 'Descubra o Lovely Game, o melhor jogo de amor e sedução. Jogue com sua parceira(o) e explore novas experiências juntos.',
    images: ['https://lovelygame.shop/images/og-image.jpg'],
    creator: '@lovelygame',
    site: '@lovelygame'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'games',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <head>
        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev" />
        <link rel="dns-prefetch" href="https://api.lovelygame.shop" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://cdn.utmify.com.br" />
        
        {/* Preconnect para recursos críticos (não Google Fonts) */}
        <link rel="preconnect" href="https://api.lovelygame.shop" />
        
        {/* Meta tags essenciais para PWA e mobile */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Otimizações de performance e tema */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          {/* Navegação sem Suspense para carregamento mais rápido */}
          <BarraNavegacao />
          
          {/* Banner promocional sem Suspense */}
          <BannerPromocional />
          
          {/* Conteúdo principal com fallback otimizado */}
          <Suspense fallback={
            <main className="min-h-screen bg-black">
              <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                  <div className="h-64 bg-gray-800 rounded"></div>
                </div>
              </div>
            </main>
          }>
            {children}
          </Suspense>
          
          {/* Componentes não críticos carregados após o conteúdo principal */}
          <CookieConsent />
          <Toaster />
          <PixelManager pixelId="123456789" />
        </AuthProvider>
      </body>
    </html>
  );
}
