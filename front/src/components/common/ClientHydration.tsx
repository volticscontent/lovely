"use client";

import { useEffect, useState } from 'react';

interface ClientHydrationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Hook simples para verificar se está no cliente
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// Componente principal simplificado
export default function ClientHydration({ children, fallback }: ClientHydrationProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hidratação simples e direta
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        {fallback || (
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-gray-600 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
            <p>Carregando...</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

// Componente para renderização condicional no cliente
export function ClientOnly({ children, fallback }: ClientHydrationProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
} 