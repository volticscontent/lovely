"use client";

import { useEffect, useState } from 'react';

// Declarações globais para TypeScript
declare global {
  interface Window {
    isHydrated?: boolean;
    hydrationTimeout?: NodeJS.Timeout;
    hydrationFailed?: boolean;
    isIPhone?: boolean;
  }
}

interface ClientHydrationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientHydration({ children, fallback }: ClientHydrationProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Detectar se é iPhone
    const isIPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Configurar timeout mais longo para iPhone
    const timeout = isIPhone ? 5000 : 3000;
    
    const hydrationTimer = setTimeout(() => {
      setIsHydrated(true);
      
      // Marcar como hidratado globalmente
      if (typeof window !== 'undefined') {
        window.isHydrated = true;
        if (window.hydrationTimeout) {
          clearTimeout(window.hydrationTimeout);
        }
      }
    }, 100);

    // Timeout de segurança
    const safetyTimer = setTimeout(() => {
      if (!isHydrated) {
        console.warn('Hydration safety timeout reached');
        setIsHydrated(true);
      }
    }, timeout);

    // Detectar erros durante a hidratação
    const errorHandler = (error: ErrorEvent) => {
      console.error('Hydration error:', error);
      if (isIPhone) {
        setHasError(true);
      }
    };

    window.addEventListener('error', errorHandler);

    return () => {
      clearTimeout(hydrationTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener('error', errorHandler);
    };
  }, [isHydrated]);

  // Mostrar fallback durante hidratação ou em caso de erro
  if (!isHydrated || hasError) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        {fallback || (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #333', 
              borderTop: '3px solid #ef4444',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p>Carregando...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

// Hook para verificar se está hidratado
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

// Componente para renderização condicional no cliente
export function ClientOnly({ children, fallback }: ClientHydrationProps) {
  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return <>{fallback}</> || null;
  }

  return <>{children}</>;
} 