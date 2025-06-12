import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import BarraNavegacao from "@/components/common/Navigation";
import BannerPromocional from "@/components/vendas/BannerPromocional";
import CookieConsent from "@/components/common/CookieConsent";
import PixelManager from "@/components/common/PixelManager";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense } from "react";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Lovely - Jogos para Casais",
  description: "Os melhores jogos eróticos para casais. Transforme seus momentos íntimos em experiências inesquecíveis.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev" />
        <link rel="dns-prefetch" href="https://api.lovelygame.shop" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://cdn.utmify.com.br" />
        
        {/* Preconnect para recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
      <body className={`${inter.className} ${inter.variable}`} suppressHydrationWarning>
        <div className="min-h-screen bg-black">
          <AuthProvider>
            <Suspense fallback={<div className="h-16 bg-black" />}>
              <BarraNavegacao />
            </Suspense>
            <Suspense fallback={<div className="h-4 bg-black" />}>
              <BannerPromocional />
            </Suspense>
            <Suspense fallback={
              <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                  <p className="text-white">Carregando...</p>
                </div>
              </div>
            }>
              {children}
            </Suspense>
            <Suspense fallback={null}>
              <CookieConsent />
            </Suspense>
            <Suspense fallback={null}>
              <PixelManager />
            </Suspense>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
