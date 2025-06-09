"use client";

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { PIXEL_CONFIG, type PlanId } from '@/config/pixels';

declare global {
  interface Window {
    fbq: any;
    testFacebookPixel?: () => void;
  }
}

export default function PixelManager() {
  const initializationRef = useRef(false);

  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    console.log('🎯 [PIXEL MANAGER] Inicializando Facebook Pixel');

    // Adicionar função de teste global
    if (typeof window !== 'undefined') {
      window.testFacebookPixel = () => {
        if (window.fbq) {
          console.log('✅ Facebook Pixel está disponível');
          window.fbq('track', 'Lead', {
            content_name: 'Teste Manual'
          });
          console.log('🎯 Evento de teste Lead enviado');
        } else {
          console.log('❌ Facebook Pixel não está disponível');
        }
      };
      
      console.log('💡 Digite window.testFacebookPixel() no console para testar');
    }
  }, []);

  return (
    <>
      {/* Facebook Pixel - Configuração limpa */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '${PIXEL_CONFIG.FACEBOOK_PIXEL_ID}');
            fbq('track', 'PageView');
            
            console.log('✅ Facebook Pixel inicializado - ID: ${PIXEL_CONFIG.FACEBOOK_PIXEL_ID}');
          `,
        }}
      />

      {/* NoScript fallback */}
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_CONFIG.FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/**
 * Tracking do Hero CTA
 */
export const trackHeroCTA = () => {
  if (typeof window === 'undefined' || !window.fbq) {
    console.log('❌ Facebook Pixel não disponível');
    return;
  }
  
  console.log('🎯 Disparando evento Lead');
  
  window.fbq('track', 'Lead', {
    content_name: 'Hero CTA Click'
  });
  
  console.log('✅ Evento Lead enviado');
};

/**
 * Tracking de seção
 */
export const trackSectionView = (sectionName: string) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  
  console.log(`🎯 Disparando ViewContent para ${sectionName}`);
  
  window.fbq('track', 'ViewContent', {
    content_name: sectionName
  });
  
  console.log(`✅ ViewContent enviado para ${sectionName}`);
};

/**
 * Tracking de checkout
 */
export const trackPlanCheckout = (planId: PlanId, planName: string, planValue: number) => {
  if (typeof window === 'undefined' || !window.fbq) {
    console.log('❌ Facebook Pixel não disponível');
    return;
  }

  console.log(`🎯 Disparando InitiateCheckout para ${planName}`);

  // Evento padrão
  window.fbq('track', 'InitiateCheckout', {
    content_name: planName,
    value: planValue,
    currency: 'BRL'
  });
  
  console.log('✅ InitiateCheckout enviado');

  // Evento customizado
  const planConfig = PIXEL_CONFIG.PLAN_EVENTS[planId];
  if (planConfig) {
    window.fbq('trackCustom', planConfig.facebook_event, {
      plan_name: planName,
      plan_value: planValue
    });
    
    console.log(`✅ Evento customizado ${planConfig.facebook_event} enviado`);
  }
};

/**
 * Tracking de visualização de plano
 */
export const trackPlanView = (planId: PlanId) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  
  const planData = PIXEL_CONFIG.PLAN_EVENTS[planId];
  if (!planData) return;
  
  console.log(`🎯 Disparando ViewContent para plano ${planId}`);
  
  window.fbq('track', 'ViewContent', {
    content_name: planData.plan_name,
    value: planData.plan_price,
    currency: 'BRL'
  });
  
  console.log(`✅ ViewContent enviado para ${planId}`);
}; 