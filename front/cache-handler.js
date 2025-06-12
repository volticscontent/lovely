// Cache handler customizado e otimizado para performance
class CustomCacheHandler {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.defaultTTL || 1800000; // 30 minutos em ms
  }

  // Determina TTL baseado no tipo de conteúdo
  getTTL(key) {
    // Arquivos estáticos - cache longo
    if (key.includes('/_next/static/') || key.includes('.css') || key.includes('.js')) {
      return 86400000 * 30; // 30 dias
    }
    
    // Imagens - cache médio
    if (key.includes('/images/') || key.includes('.jpg') || key.includes('.png') || key.includes('.webp')) {
      return 86400000 * 7; // 7 dias
    }
    
    // API routes - cache curto
    if (key.includes('/api/')) {
      return 3600000; // 1 hora
    }
    
    // Páginas dinâmicas - cache muito curto
    if (key.includes('/auth/') || key.includes('/planos/') || key.includes('/afiliados/')) {
      return 300000; // 5 minutos
    }
    
    return this.defaultTTL;
  }

  async get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    const now = Date.now();
    if (now > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    // Atualiza último acesso para LRU
    item.lastAccessed = now;
    return item.value;
  }

  async set(key, data, ctx = {}) {
    const ttl = this.getTTL(key);
    const expires = Date.now() + ttl;
    
    // Limpa cache se exceder tamanho máximo
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    this.cache.set(key, {
      value: data,
      expires,
      lastAccessed: Date.now(),
      size: this.getSize(data),
      tags: ctx.tags || []
    });
  }

  async revalidateTag(tag) {
    // Remove entradas com a tag específica
    for (const [key, item] of this.cache.entries()) {
      if (item.tags && item.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  // Remove entrada menos recentemente usada
  evictLRU() {
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Calcula tamanho aproximado dos dados
  getSize(data) {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 1000; // Estimativa padrão
    }
  }

  // Limpeza de entradas expiradas
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  // Estatísticas do cache
  getStats() {
    const now = Date.now();
    let expired = 0;
    let totalSize = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) expired++;
      totalSize += item.size || 0;
    }
    
    return {
      total: this.cache.size,
      expired,
      totalSize,
      maxSize: this.maxSize
    };
  }
}

module.exports = CustomCacheHandler; 