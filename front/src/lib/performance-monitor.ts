import { PerformanceLayoutShiftEntry, PerformanceThresholds } from '@/types';

// Sistema de monitoramento de performance para Web Vitals
interface PerformanceMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  entries?: PerformanceEntry[];
}

interface FIDEntry extends PerformanceEntry {
  processingStart: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeWebVitals();
    this.initializeCustomMetrics();
  }

  // Inicializa monitoramento de Web Vitals
  private initializeWebVitals() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals
    this.observeMetric('largest-contentful-paint', this.onLCP.bind(this));
    this.observeMetric('first-input', this.onFID.bind(this));
    this.observeMetric('layout-shift', this.onCLS.bind(this));
    
    // Outras métricas importantes
    this.observeMetric('first-contentful-paint', this.onFCP.bind(this));
    this.observeMetric('navigation', this.onNavigation.bind(this));
  }

  // Métricas customizadas
  private initializeCustomMetrics() {
    if (typeof window === 'undefined') return;

    // Tempo de hidratação
    this.measureHydrationTime();
    
    // Tempo de carregamento de recursos críticos
    this.measureCriticalResources();
    
    // Performance de API
    this.monitorAPIPerformance();
  }

  private observeMetric(entryType: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ type: entryType, buffered: true });
      this.observers.push(observer);
    } catch (e) {
      console.warn(`Failed to observe ${entryType}:`, e);
    }
  }

  // Largest Contentful Paint
  private onLCP(entries: PerformanceEntry[]) {
    const lcpEntry = entries[entries.length - 1];
    if (lcpEntry) {
      this.recordMetric('LCP', lcpEntry.startTime, 0, lcpEntry.name, [lcpEntry]);
    }
  }

  // First Input Delay
  private onFID(entries: PerformanceEntry[]) {
    const fidEntry = entries[0] as FIDEntry;
    if (fidEntry && 'processingStart' in fidEntry) {
      const delay = fidEntry.processingStart - fidEntry.startTime;
      this.recordMetric('FID', delay, 0, fidEntry.name, [fidEntry]);
    }
  }

  // Cumulative Layout Shift
  private onCLS(entries: PerformanceEntry[]) {
    let clsValue = 0;
    entries.forEach((entry) => {
      const clsEntry = entry as PerformanceLayoutShiftEntry;
      if (!clsEntry.hadRecentInput) {
        clsValue += clsEntry.value;
      }
    });
    
    if (clsValue > 0) {
      this.recordMetric('CLS', clsValue, 0, 'layout-shift', entries);
    }
  }

  // First Contentful Paint
  private onFCP(entries: PerformanceEntry[]) {
    const fcpEntry = entries[0];
    if (fcpEntry) {
      this.recordMetric('FCP', fcpEntry.startTime, 0, fcpEntry.name, [fcpEntry]);
    }
  }

  // Navigation timing
  private onNavigation(entries: PerformanceEntry[]) {
    const navEntry = entries[0] as PerformanceNavigationTiming;
    if (navEntry) {
      const ttfb = navEntry.responseStart - navEntry.requestStart;
      const domLoad = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
      const windowLoad = navEntry.loadEventEnd - navEntry.fetchStart;
      
      this.recordMetric('TTFB', ttfb, 0, 'navigation', [navEntry]);
      this.recordMetric('DOM_LOAD', domLoad, 0, 'navigation', [navEntry]);
      this.recordMetric('WINDOW_LOAD', windowLoad, 0, 'navigation', [navEntry]);
    }
  }

  // Medir tempo de hidratação
  private measureHydrationTime() {
    const startTime = performance.now();
    
    // Aguarda React hidratar
    if (typeof window !== 'undefined') {
      const checkHydration = () => {
        if (document.querySelector('[data-reactroot]') || document.querySelector('#__next')) {
          const hydrationTime = performance.now() - startTime;
          this.recordMetric('HYDRATION', hydrationTime, 0, 'custom');
        } else {
          requestAnimationFrame(checkHydration);
        }
      };
      
      requestAnimationFrame(checkHydration);
    }
  }

  // Monitorar recursos críticos
  private measureCriticalResources() {
    if (typeof window === 'undefined') return;

    const criticalResources = [
      '/images/logo.png',
      '/_next/static/css/app/globals.css'
    ];

    criticalResources.forEach(resource => {
      const entries = performance.getEntriesByName(resource);
      if (entries.length > 0) {
        const entry = entries[0] as PerformanceResourceTiming;
        this.recordMetric(`RESOURCE_${resource.split('/').pop()}`, entry.duration, 0, resource, [entry]);
      }
    });
  }

  // Monitorar performance de API
  private monitorAPIPerformance() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0]?.toString() || 'unknown';
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        if (url.includes('/api/')) {
          this.recordMetric('API_CALL', duration, 0, url);
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.recordMetric('API_ERROR', duration, 0, url);
        throw error;
      }
    };
  }

  // Registrar métrica
  private recordMetric(name: string, value: number, delta: number, id: string, entries?: PerformanceEntry[]) {
    this.metrics.set(name, {
      name,
      value,
      delta,
      id,
      entries
    });
  }

  // Obter todas as métricas
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  // Obter métrica específica
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  // Gerar relatório de performance
  generateReport(): string {
    const metrics = this.getMetrics();
    let report = '=== Performance Report ===\n';
    
    metrics.forEach(metric => {
      const status = this.getMetricStatus(metric.name, metric.value);
      report += `${metric.name}: ${metric.value.toFixed(2)}ms [${status}]\n`;
    });
    
    return report;
  }

  // Avaliar status da métrica
  private getMetricStatus(name: string, value: number): string {
    const thresholds: PerformanceThresholds = {
      'LCP': { good: 2500, needs_improvement: 4000 },
      'FID': { good: 100, needs_improvement: 300 },
      'CLS': { good: 0.1, needs_improvement: 0.25 },
      'FCP': { good: 1800, needs_improvement: 3000 },
      'TTFB': { good: 800, needs_improvement: 1800 },
    };
    
    const threshold = thresholds[name];
    if (!threshold) return 'OK';
    
    if (value <= threshold.good) return 'GOOD';
    if (value <= threshold.needs_improvement) return 'NEEDS_IMPROVEMENT';
    return 'POOR';
  }

  // Limpar observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Instância global
export const performanceMonitor = new PerformanceMonitor();

// Hook para usar no React
export function usePerformanceMonitor() {
  if (typeof window === 'undefined') return null;
  return performanceMonitor;
} 