// Tipos para o sistema de tracking profissional

export interface TrackingEvent {
  event_name: string;
  timestamp: string;
  page_url: string;
  referrer: string;
  user_agent?: string;
}

export interface PlanTrackingData extends TrackingEvent {
  plan_id: string;
  plan_name: string;
  plan_value: number;
  currency: 'BRL';
  subscription_type: 'lifetime';
}

export interface FacebookPixelEvent {
  content_name: string;
  content_category: 'Lifetime_Subscription';
  content_ids: string[];
  content_type: 'product';
  value: number;
  currency: 'BRL';
  num_items?: number;
}

export interface UTMifyEvent {
  pixel_id: string;
  event: string;
  plan_id: string;
  plan_name: string;
  plan_value: number;
  currency: 'BRL';
  subscription_type: 'lifetime';
  timestamp: string;
  page_url: string;
  referrer: string;
}

export interface GoogleAnalyticsEvent {
  currency: 'BRL';
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: 'Lifetime_Subscription';
    price: number;
    quantity: number;
  }>;
}

export interface GTMEvent {
  event: string;
  ecommerce: {
    currency: 'BRL';
    value: number;
    items: Array<{
      item_id: string;
      item_name: string;
      item_category: 'Lifetime_Subscription';
      price: number;
      quantity: number;
    }>;
  };
  plan_details: PlanTrackingData;
}

// Tipos para configuração
export interface PixelConfiguration {
  FACEBOOK_PIXEL_ID: string;
  UTMIFY_PIXEL_ID: string;
  UTMIFY_API_URL: string;
  UTM_TEMPLATE: string;
  PLAN_EVENTS: Record<string, {
    facebook_event: string;
    utmify_event: string;
    plan_name: string;
    plan_price: number;
  }>;
}

// Tipos para validação
export type PlanId = 'basico' | 'medio' | 'premium';
export type TrackingPlatform = 'facebook' | 'utmify' | 'google_analytics' | 'gtm';
export type EventType = 'view_content' | 'initiate_checkout' | 'page_view';

// Interface para o gerenciador de pixels
export interface PixelManager {
  trackPlanCheckout: (planId: PlanId, planName: string, planValue: number) => void;
  trackPlanView: (planId: PlanId) => void;
  trackPageView: () => void;
}

// Tipos para debugging
export interface TrackingDebugInfo {
  planType: PlanId;
  planValue: number;
  timestamp: string;
  facebook_pixel_id: string;
  utmify_pixel_id: string;
  platforms_triggered: TrackingPlatform[];
  success: boolean;
  errors?: string[];
} 