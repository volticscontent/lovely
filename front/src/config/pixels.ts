// Configurações dos Pixels - SIMPLES E DIRETO

export const PIXEL_CONFIG = {
  // IDs dos pixels
  FACEBOOK_PIXEL_ID: '747190927658218',
  UTMIFY_PIXEL_ID: '68434d65e9fc66b1bc11be20',
  
  // URLs das APIs
  UTMIFY_API_URL: 'https://api.utmify.com.br/api/v1/events',

  // Eventos para cada plano
  PLAN_EVENTS: {
    BASICO: {
      plan_name: 'Plano Básico',
      plan_price: 9.90,
      plan_currency: 'BRL',
      content_category: 'Digital Product',
      content_type: 'product',
      facebook_event: 'Plan_Basico_Checkout',
      utmify_event: 'plano_basico_checkout'
    },
    MEDIO: {
      plan_name: 'Plano Médio',
      plan_price: 14.90,
      plan_currency: 'BRL',
      content_category: 'Digital Product',
      content_type: 'product',
      facebook_event: 'Plan_Medio_Checkout',
      utmify_event: 'plano_medio_checkout'
    },
    PREMIUM: {
      plan_name: 'Plano Premium',
      plan_price: 19.90,
      plan_currency: 'BRL',
      content_category: 'Digital Product',
      content_type: 'product',
      facebook_event: 'Plan_Premium_Checkout',
      utmify_event: 'plano_premium_checkout'
    }
  }
};

// Tipos TypeScript
export type PlanId = 'BASICO' | 'MEDIO' | 'PREMIUM'; 