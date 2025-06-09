import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BarraNavegacao from "@/components/common/Navigation";
import BannerPromocional from "@/components/vendas/BannerPromocional";
import CookieConsent from "@/components/common/CookieConsent";
import PixelManager from "@/components/common/PixelManager";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lovely - Surpreenda quem você ama",
  description: "Transforme momentos especiais em memórias inesquecíveis com o Lovely.",
};

// Componente para detectar hidratação e melhorar compatibilidade com iPhone
function HydrationProvider({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}

// Componente para carregamento progressivo
function ProgressiveLoader({ children }: { children: React.ReactNode }) {
  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000'
      }}
    >
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Meta tags essenciais para iPhone */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Preload de recursos críticos */}
        <link rel="preload" href="/videos/hero/dh.webm" as="video" type="video/webm" />
        <link rel="preload" href="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-01.gif" as="image" />
        <link rel="preload" href="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEO-SITE-02_1.gif" as="image" />
        <link rel="preload" href="https://pub-9e19518e85994c27a69dd5b29e669dca.r2.dev/V%C3%8DDEOS-SITE-03_1.gif" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ProgressiveLoader>
          <HydrationProvider>
            <AuthProvider>
              <BarraNavegacao />
              <BannerPromocional />
              {children}
              <CookieConsent />
              <PixelManager />
            </AuthProvider>
          </HydrationProvider>
        </ProgressiveLoader>
      </body>
    </html>
  );
}
