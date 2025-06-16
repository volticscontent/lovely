"use client";

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';
import { PIXEL_CONFIG, type PlanId } from '@/config/pixels';
import { logger } from '@/utils/logger';
import { FacebookPixel, UTMify } from '@/types';

// Declaração global para o Facebook Pixel e UTMify
declare global {
  interface Window {
    fbq: FacebookPixel;
    utmify: UTMify;
    testFacebookPixel?: () => void;
    testUTMify?: () => void;
    _fbPixelInitialized?: boolean;
  }
}

interface PixelEvent {
  type: string;
  data?: Record<string, unknown>;
}

interface PixelManagerProps {
  pixelId: string;
  events?: PixelEvent[];
}

const PixelManager: React.FC<PixelManagerProps> = ({ pixelId, events = [] }) => {
  const initializationRef = useRef(false);

  useEffect(() => {
    if (initializationRef.current || typeof window === 'undefined') return;
    
    // Verificar se o pixel já foi inicializado globalmente
    if (window._fbPixelInitialized) {
      logger.info('🎯 [PIXEL MANAGER] Facebook Pixel já inicializado, pulando...');
      return;
    }
    
    initializationRef.current = true;
    window._fbPixelInitialized = true;

    logger.info('🎯 [PIXEL MANAGER] Inicializando Facebook Pixel e UTMify');

    // Adicionar funções de teste globais
    window.testFacebookPixel = () => {
      if (window.fbq) {
        logger.info('✅ Facebook Pixel está disponível');
        window.fbq('track', 'Lead', {
          content_name: 'Teste Manual Facebook'
        });
        logger.info('🎯 Evento de teste Lead enviado para Facebook');
      } else {
        logger.warn('❌ Facebook Pixel não está disponível');
      }
    };

    window.testUTMify = () => {
      if (window.utmify) {
        logger.info('✅ UTMify está disponível');
        window.utmify('track', 'teste_manual', {
          content_name: 'Teste Manual UTMify'
        });
        logger.info('🎯 Evento de teste enviado para UTMify');
      } else {
        logger.warn('❌ UTMify não está disponível');
      }
    };
    
    logger.info('💡 Digite window.testFacebookPixel() ou window.testUTMify() no console para testar');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.fbq || !window._fbPixelInitialized) return;

    const handleRouteChange = () => {
      window.fbq('track', 'PageView');
      logger.info('Facebook Pixel: PageView tracked');
    };

    // Registrar eventos
    if (events && events.length > 0) {
      events.forEach((event) => {
        window.fbq('track', event.type, event.data);
        logger.info(`Facebook Pixel: Event tracked - ${event.type}`);
      });
    }

    // Adicionar listener para mudanças de rota
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [events]);

  // Só renderizar scripts se não foi inicializado ainda
  if (typeof window !== 'undefined' && window._fbPixelInitialized && initializationRef.current) {
    return null;
  }

  return (
    <>
      {/* UTMify Script de UTMs - Para capturar parâmetros do Facebook Ads */}
      <Script
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        data-utmify-prevent-xcod-sck=""
        data-utmify-prevent-subids=""
        strategy="afterInteractive"
        async
        defer
      />

      {/* Facebook Pixel - Configuração limpa */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (!window._fbPixelInitialized) {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              
              window._fbPixelInitialized = true;
              
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            }
          `,
        }}
      />

      {/* UTMify Script de Tracking */}
      <Script
        id="utmify-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (!window.utmify) {
              (function(u,t,m,i,f,y){u[i]=u[i]||function(){
              (u[i].q=u[i].q||[]).push(arguments)};f=t.createElement(m);
              f.async=1;f.src='https://cdn.utmify.com.br/scripts/utmify.js';
              y=t.getElementsByTagName(m)[0];y.parentNode.insertBefore(f,y);
              })(window,document,'script','utmify');
              
              utmify('init', '${PIXEL_CONFIG.UTMIFY_PIXEL_ID}');
              utmify('track', 'page_view');
            }
          `,
        }}
      />

      {/* NoScript fallback para Facebook */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt="Facebook Pixel"
        />
      </noscript>
    </>
  );
};

export default PixelManager;

/**
 * Tracking do Hero CTA
 */
export const trackHeroCTA = () => {
  logger.info('🎯 Disparando evento Lead para Hero CTA');
  
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Hero CTA Click'
    });
    logger.info('✅ Evento Lead enviado para Facebook');
  }
  
  // UTMify
  if (typeof window !== 'undefined' && window.utmify) {
    window.utmify('track', 'hero_cta_click', {
      content_name: 'Hero CTA Click'
    });
    logger.info('✅ Evento hero_cta_click enviado para UTMify');
  }
};

/**
 * Tracking de seção
 */
export const trackSectionView = (sectionName: string) => {
  if (typeof window === 'undefined') return;
  
  logger.info(`🎯 Disparando ViewContent para ${sectionName}`);
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: sectionName
    });
    logger.info(`✅ ViewContent enviado para Facebook - ${sectionName}`);
  }
  
  // UTMify
  if (window.utmify) {
    window.utmify('track', 'section_view', {
      section_name: sectionName
    });
    logger.info(`✅ section_view enviado para UTMify - ${sectionName}`);
  }
};

/**
 * Tracking de checkout
 */
export const trackPlanCheckout = (planId: PlanId, planName: string, planValue: number) => {
  if (typeof window === 'undefined') return;

  logger.info(`🎯 Disparando InitiateCheckout para ${planName}`);

  // Facebook Pixel
  if (window.fbq) {
    // Evento padrão
    window.fbq('track', 'InitiateCheckout', {
      content_name: planName,
      value: planValue,
      currency: 'BRL'
    });
    
    logger.info('✅ InitiateCheckout enviado para Facebook');

    // Evento customizado
    const planConfig = PIXEL_CONFIG.PLAN_EVENTS[planId];
    if (planConfig) {
      window.fbq('trackCustom', planConfig.facebook_event, {
        plan_name: planName,
        plan_value: planValue
      });
      
      logger.info(`✅ Evento customizado ${planConfig.facebook_event} enviado para Facebook`);
    }
  }

  // UTMify
  if (window.utmify) {
    const planConfig = PIXEL_CONFIG.PLAN_EVENTS[planId];
    if (planConfig) {
      window.utmify('track', planConfig.utmify_event, {
        plan_name: planName,
        plan_value: planValue,
        currency: 'BRL'
      });
      
      logger.info(`✅ Evento ${planConfig.utmify_event} enviado para UTMify`);
    }
  }
};

/**
 * Tracking de visualização de plano
 */
export const trackPlanView = (planId: PlanId) => {
  if (typeof window === 'undefined') return;
  
  const planData = PIXEL_CONFIG.PLAN_EVENTS[planId];
  if (!planData) return;
  
  logger.info(`🎯 Disparando ViewContent para plano ${planId}`);
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: planData.plan_name,
      value: planData.plan_price,
      currency: 'BRL'
    });
    
    logger.info(`✅ ViewContent enviado para Facebook - ${planId}`);
  }
  
  // UTMify
  if (window.utmify) {
    window.utmify('track', 'plan_view', {
      plan_id: planId,
      plan_name: planData.plan_name,
      plan_value: planData.plan_price,
      currency: 'BRL'
    });
    
    logger.info(`✅ plan_view enviado para UTMify - ${planId}`);
  }
}; 