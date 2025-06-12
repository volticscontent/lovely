// Utilitários de performance para lazy loading e otimizações

// Função para lazy loading de imagens
export function setupImageLazyLoading() {
  if (typeof window === 'undefined') return () => {};

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  // Observar todas as imagens com data-src
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach((img) => imageObserver.observe(img));

  return () => {
    imageObserver.disconnect();
  };
}

// Função para preload de recursos críticos
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  const criticalResources = [
    '/images/logo.png',
    '/fonts/inter-var.woff2',
  ];

  criticalResources.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = src.includes('.woff') ? 'font' : 'image';
    link.href = src;
    if (src.includes('.woff')) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

// Função para debounce de funções
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = undefined;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Função para throttle de funções
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Função para detectar se está no viewport
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Função para lazy loading de módulos
export async function loadModuleLazy<T>(
  moduleLoader: () => Promise<T>,
  retries: number = 3
): Promise<T | null> {
  for (let i = 0; i < retries; i++) {
    try {
      return await moduleLoader();
    } catch (error) {
      console.warn(`Tentativa ${i + 1} de carregar módulo falhou:`, error);
      if (i === retries - 1) {
        console.error('Falha ao carregar módulo após todas as tentativas');
        return null;
      }
      // Esperar um pouco antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return null;
}

// Função para cache de resultados
const cache = new Map<string, any>();

export function cacheResult<T>(
  key: string,
  factory: () => T,
  ttl: number = 300000 // 5 minutos padrão
): T {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.value;
  }
  
  const value = factory();
  cache.set(key, { value, timestamp: Date.now() });
  
  return value;
}

// Função para limpar cache
export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Configurações de performance global
export const PERFORMANCE_CONFIG = {
  // Configurações de lazy loading
  lazyLoading: {
    rootMargin: '50px 0px',
    threshold: 0.1,
    loadingDelay: 100,
  },
  
  // Configurações de cache
  cache: {
    defaultTTL: 300000, // 5 minutos
    maxSize: 100,
  },
  
  // Configurações de debounce/throttle
  timing: {
    scrollThrottle: 16, // ~60fps
    resizeDebounce: 250,
    inputDebounce: 300,
  },
  
  // Configurações de preload
  preload: {
    critical: true,
    fonts: true,
    images: true,
  },
} as const;

// Função para monitoramento de performance
export function initPerformanceMonitor() {
  if (typeof window === 'undefined') return;

  // Monitorar Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
      if (entry.entryType === 'first-input') {
        const fidEntry = entry as any; // Type assertion para PerformanceEventTiming
        console.log('FID:', fidEntry.processingStart - entry.startTime);
      }
      if (entry.entryType === 'layout-shift') {
        const clsEntry = entry as any; // Type assertion para LayoutShift
        console.log('CLS:', clsEntry.value);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  } catch (e) {
    // Navegador não suporta algumas métricas
  }
  
  return () => observer.disconnect();
}

// Função para otimizar carregamento de imagens
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return;

  // Adicionar loading lazy para todas as imagens
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img) => {
    (img as HTMLImageElement).loading = 'lazy';
  });

  // Adicionar decode async para imagens críticas
  const criticalImages = document.querySelectorAll('img[data-critical]');
  criticalImages.forEach(async (img) => {
    try {
      await (img as HTMLImageElement).decode();
    } catch (e) {
      // Erro de decode silencioso
    }
  });
} 