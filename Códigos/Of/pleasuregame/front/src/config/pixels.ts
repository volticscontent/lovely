// Configurações dos Pixels de Tracking

export const PIXEL_CONFIG = {
  // Facebook Pixel
  FACEBOOK_PIXEL_ID: '1724726318150294',
  
  // UTMify
  UTMIFY_PIXEL_ID: '6834d81d4324d1bcbedc393f',
  UTMIFY_API_URL: 'https://api.utmify.com.br/events',
  
  // UTM Parameters Template
  UTM_TEMPLATE: 'utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}',
  
  // Eventos personalizados para cada plano vitalício
  PLAN_EVENTS: {
    BASICO: {
      facebook_event: 'InitiateCheckout_BASICO',
      utmify_event: 'checkout_plano_basico',
      plan_name: 'Plano Básico',
      plan_price: 47.90
    },
    MEDIO: {
      facebook_event: 'InitiateCheckout_MEDIO', 
      utmify_event: 'checkout_plano_medio',
      plan_name: 'Plano Médio',
      plan_price: 57.90
    },
    PREMIUM: {
      facebook_event: 'InitiateCheckout_PREMIUM',
      utmify_event: 'checkout_plano_premium', 
      plan_name: 'Plano Premium',
      plan_price: 77.90
    }
  }
} as const;

// Tipos para TypeScript
export type PlanId = 'basico' | 'medio' | 'premium'; 