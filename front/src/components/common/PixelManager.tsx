"use client";

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { PIXEL_CONFIG, type PlanId } from '@/config/pixels';

declare global {
  interface Window {
    fbq: any;
    utmify: any;
    testFacebookPixel?: () => void;
    testUTMify?: () => void;
  }
}

export default function PixelManager() {
  const initializationRef = useRef(false);

  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    console.log('🎯 [PIXEL MANAGER] Inicializando Facebook Pixel e UTMify');

    // Adicionar funções de teste globais
    if (typeof window !== 'undefined') {
      window.testFacebookPixel = () => {
        if (window.fbq) {
          console.log('✅ Facebook Pixel está disponível');
          window.fbq('track', 'Lead', {
            content_name: 'Teste Manual Facebook'
          });
          console.log('🎯 Evento de teste Lead enviado para Facebook');
        } else {
          console.log('❌ Facebook Pixel não está disponível');
        }
      };

      window.testUTMify = () => {
        if (window.utmify) {
          console.log('✅ UTMify está disponível');
          window.utmify('track', 'teste_manual', {
            content_name: 'Teste Manual UTMify'
          });
          console.log('🎯 Evento de teste enviado para UTMify');
        } else {
          console.log('❌ UTMify não está disponível');
        }
      };
      
      console.log('💡 Digite window.testFacebookPixel() ou window.testUTMify() no console para testar');
    }
  }, []);

  return (
    <>
      {/* UTMify Script de UTMs - Para capturar parâmetros do Facebook Ads */}
      <Script
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        data-utmify-prevent-xcod-sck=""
        data-utmify-prevent-subids=""
        strategy="beforeInteractive"
        async
        defer
      />

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

      {/* UTMify Script de Tracking */}
      <Script
        id="utmify-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(u,t,m,i,f,y){u[i]=u[i]||function(){
            (u[i].q=u[i].q||[]).push(arguments)};f=t.createElement(m);
            f.async=1;f.src='https://cdn.utmify.com.br/scripts/utmify.js';
            y=t.getElementsByTagName(m)[0];y.parentNode.insertBefore(f,y);
            })(window,document,'script','utmify');
            
            utmify('init', '${PIXEL_CONFIG.UTMIFY_PIXEL_ID}');
            utmify('track', 'page_view');
            
            console.log('✅ UTMify inicializado - ID: ${PIXEL_CONFIG.UTMIFY_PIXEL_ID}');
            console.log('✅ UTMify UTMs script carregado para capturar parâmetros do Facebook Ads');
          `,
        }}
      />

      {/* NoScript fallback para Facebook */}
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
  console.log('🎯 Disparando evento Lead para Hero CTA');
  
  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Hero CTA Click'
    });
    console.log('✅ Evento Lead enviado para Facebook');
  }
  
  // UTMify
  if (typeof window !== 'undefined' && window.utmify) {
    window.utmify('track', 'hero_cta_click', {
      content_name: 'Hero CTA Click'
    });
    console.log('✅ Evento hero_cta_click enviado para UTMify');
  }
};

/**
 * Tracking de seção
 */
export const trackSectionView = (sectionName: string) => {
  if (typeof window === 'undefined') return;
  
  console.log(`🎯 Disparando ViewContent para ${sectionName}`);
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: sectionName
    });
    console.log(`✅ ViewContent enviado para Facebook - ${sectionName}`);
  }
  
  // UTMify
  if (window.utmify) {
    window.utmify('track', 'section_view', {
      section_name: sectionName
    });
    console.log(`✅ section_view enviado para UTMify - ${sectionName}`);
  }
};

/**
 * Tracking de checkout
 */
export const trackPlanCheckout = (planId: PlanId, planName: string, planValue: number) => {
  if (typeof window === 'undefined') return;

  console.log(`🎯 Disparando InitiateCheckout para ${planName}`);

  // Facebook Pixel
  if (window.fbq) {
    // Evento padrão
    window.fbq('track', 'InitiateCheckout', {
      content_name: planName,
      value: planValue,
      currency: 'BRL'
    });
    
    console.log('✅ InitiateCheckout enviado para Facebook');

    // Evento customizado
    const planConfig = PIXEL_CONFIG.PLAN_EVENTS[planId];
    if (planConfig) {
      window.fbq('trackCustom', planConfig.facebook_event, {
        plan_name: planName,
        plan_value: planValue
      });
      
      console.log(`✅ Evento customizado ${planConfig.facebook_event} enviado para Facebook`);
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
      
      console.log(`✅ Evento ${planConfig.utmify_event} enviado para UTMify`);
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
  
  console.log(`🎯 Disparando ViewContent para plano ${planId}`);
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: planData.plan_name,
      value: planData.plan_price,
      currency: 'BRL'
    });
    
    console.log(`✅ ViewContent enviado para Facebook - ${planId}`);
  }
  
  // UTMify
  if (window.utmify) {
    window.utmify('track', 'plan_view', {
      plan_id: planId,
      plan_name: planData.plan_name,
      plan_value: planData.plan_price,
      currency: 'BRL'
    });
    
    console.log(`✅ plan_view enviado para UTMify - ${planId}`);
  }
}; 