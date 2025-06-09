"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const cookieConsent = Cookies.get('cookie-consent');
    
    // Se não aceitou, mostrar o banner
    if (!cookieConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    // Salvar o consentimento nos cookies por 1 ano
    Cookies.set('cookie-consent', 'true', { expires: 365 });
    setShowConsent(false);
  };

  const handleReject = () => {
    // Mesmo rejeitando, salvamos que o usuário viu o aviso
    Cookies.set('cookie-consent-rejected', 'true', { expires: 30 });
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-neutral-300 text-sm">
          <p className="mb-2">
            <strong className="text-white">Este site utiliza cookies</strong> para melhorar sua experiência.
          </p>
          <p>
            Utilizamos cookies para personalizar conteúdo e anúncios, fornecer funcionalidades de redes sociais e analisar nosso tráfego.
            Ao continuar navegando, você concorda com a nossa {' '}
            <a href="/politica-privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </a>
            .
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-3">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm text-white hover:underline"
          >
            Rejeitar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
          >
            Aceitar cookies
          </button>
        </div>
      </div>
    </div>
  );
} 