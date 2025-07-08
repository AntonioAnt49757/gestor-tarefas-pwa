// service-worker.js - VERSÃO CORRETA PARA PWA
const CACHE_NAME = 'gestor-tarefas-v2';
const OFFLINE_CACHE_NAME = 'offline-tarefas-v2';
const API_CACHE_NAME = 'api-cache-v2';

// Recursos críticos para cache imediato
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/src/app.js',
  '/manifest.json'
];

// Recursos para cache sob demanda
const CACHE_ON_DEMAND = [
  '/src/components/auth-form.js',
  '/src/components/register-form.js', 
  '/src/components/task-form.js',
  '/src/components/task-list.js',
  '/src/components/about-page.js'
];

// Métricas de performance do Service Worker
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  offlineFallbacks: 0,
  apiCacheHits: 0,
  avgResponseTime: 0,
  requestTimes: []
};

// Instalar Service Worker com métricas
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Instalando versão otimizada...');
  
  event.waitUntil(
    Promise.all([
      // Cache recursos críticos
      caches.open(CACHE_NAME).then(cache => {
        console.log('📦 Fazendo cache de recursos críticos...');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Inicializar cache de API
      caches.open(API_CACHE_NAME).then(cache => {
        console.log('💾 Cache de API inicializado');
        return Promise.resolve();
      })
    ]).then(() => {
      console.log('✅ Service Worker instalado com sucesso');
      self.skipWaiting();
    }).catch(error => {
      console.error('❌ Erro na instalação:', error);
    })
  );
});

// Ativar com limpeza de caches antigas
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Ativando...');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigas
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== OFFLINE_CACHE_NAME && 
                cacheName !== API_CACHE_NAME) {
              console.log('🧹 Removendo cache antiga:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Reinicializar métricas
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker ativado');
      resetPerformanceMetrics();
    })
  );
});

// Interceptar requests com medição de performance
self.addEventListener('fetch', event => {
  const requestStart = performance.now();
  const url = new URL(event.request.url);
  
  // Apenas processar HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // Incrementar contador de requests de rede
  performanceMetrics.networkRequests++;
  
  // Determinar estratégia baseada no tipo de request
  if (url.hostname === 'localhost' && url.port === '3000') {
    // Requests para API - Network First com cache
    event.respondWith(handleApiRequest(event.request, requestStart));
  } else if (CRITICAL_RESOURCES.some(resource => event.request.url.includes(resource))) {
    // Recursos críticos - Cache First
    event.respondWith(handleCriticalResource(event.request, requestStart));
  } else if (CACHE_ON_DEMAND.some(resource => event.request.url.includes(resource))) {
    // Componentes - Stale While Revalidate
    event.respondWith(handleComponentRequest(event.request, requestStart));
  } else {
    // Outros recursos - Network First
    event.respondWith(handleGenericRequest(event.request, requestStart));
  }
});

// Estratégia para API requests
async function handleApiRequest(request, startTime) {
  const cacheKey = `api-${request.url}-${request.method}`;
  
  try {
    // Tentar rede primeiro
    const response = await fetch(request);
    const responseTime = performance.now() - startTime;
    
    updatePerformanceMetrics(responseTime, false);
    
    // Cache successful GET requests
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(cacheKey, response.clone());
      performanceMetrics.apiCacheHits++;
    }
    
    console.log(`⚡ API Network: ${request.url} - ${responseTime.toFixed(2)}ms`);
    return response;
    
  } catch (error) {
    console.log('📡 API offline, tentando cache...');
    
    // Fallback para cache se disponível
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(cacheKey);
    
    if (cachedResponse) {
      performanceMetrics.cacheHits++;
      performanceMetrics.offlineFallbacks++;
      console.log(`💾 API Cache Hit: ${request.url}`);
      
      // Adicionar header para identificar cache
      const response = cachedResponse.clone();
      response.headers.set('X-Cache-Hit', 'true');
      response.headers.set('X-Cache-Source', 'service-worker');
      
      return response;
    }
    
    // Última opção: resposta offline
    performanceMetrics.cacheMisses++;
    performanceMetrics.offlineFallbacks++;
    
    return new Response(
      JSON.stringify({ 
        error: 'Dados não disponíveis offline',
        offline: true,
        cachedData: false
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Estratégia Cache First para recursos críticos
async function handleCriticalResource(request, startTime) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    const responseTime = performance.now() - startTime;
    updatePerformanceMetrics(responseTime, true);
    performanceMetrics.cacheHits++;
    
    console.log(`💾 Critical Cache Hit: ${request.url} - ${responseTime.toFixed(2)}ms`);
    
    // Marcar como cache hit
    cachedResponse.headers.set('X-Cache-Hit', 'true');
    return cachedResponse;
  }
  
  // Se não estiver em cache, buscar da rede
  try {
    const response = await fetch(request);
    const responseTime = performance.now() - startTime;
    
    updatePerformanceMetrics(responseTime, false);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    console.log(`⚡ Critical Network: ${request.url} - ${responseTime.toFixed(2)}ms`);
    return response;
    
  } catch (error) {
    performanceMetrics.cacheMisses++;
    performanceMetrics.offlineFallbacks++;
    
    console.log(`❌ Critical Resource Failed: ${request.url}`);
    return new Response('Recurso não disponível', { status: 503 });
  }
}

// Estratégia Stale While Revalidate para componentes
async function handleComponentRequest(request, startTime) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Função para buscar da rede e atualizar cache
  const fetchAndCache = async () => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.log(`❌ Falha ao atualizar componente: ${request.url}`);
      return null;
    }
  };
  
  if (cachedResponse) {
    const responseTime = performance.now() - startTime;
    updatePerformanceMetrics(responseTime, true);
    performanceMetrics.cacheHits++;
    
    console.log(`💾 Component Cache: ${request.url} - ${responseTime.toFixed(2)}ms`);
    
    // Atualizar em background
    fetchAndCache();
    
    cachedResponse.headers.set('X-Cache-Hit', 'true');
    return cachedResponse;
  }
  
  // Se não há cache, buscar da rede
  return fetchAndCache() || new Response('Componente não disponível', { status: 503 });
}

// Estratégia genérica Network First
async function handleGenericRequest(request, startTime) {
  try {
    const response = await fetch(request);
    const responseTime = performance.now() - startTime;
    
    updatePerformanceMetrics(responseTime, false);
    
    return response;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      performanceMetrics.cacheHits++;
      performanceMetrics.offlineFallbacks++;
      return cachedResponse;
    }
    
    performanceMetrics.cacheMisses++;
    return new Response('Não disponível offline', { status: 503 });
  }
}

// Atualizar métricas de performance
function updatePerformanceMetrics(responseTime, fromCache) {
  performanceMetrics.requestTimes.push(responseTime);
  
  // Manter apenas últimas 100 medições
  if (performanceMetrics.requestTimes.length > 100) {
    performanceMetrics.requestTimes.shift();
  }
  
  // Calcular tempo médio
  performanceMetrics.avgResponseTime = 
    performanceMetrics.requestTimes.reduce((a, b) => a + b, 0) / 
    performanceMetrics.requestTimes.length;
    
  // Enviar métricas para o cliente a cada 10 requests
  if (performanceMetrics.networkRequests % 10 === 0) {
    broadcastMetrics();
  }
}

// Enviar métricas para todos os clientes
function broadcastMetrics() {
  const metricsReport = {
    ...performanceMetrics,
    cacheHitRatio: (performanceMetrics.cacheHits / 
      (performanceMetrics.cacheHits + performanceMetrics.cacheMisses)) || 0,
    timestamp: Date.now()
  };
  
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_PERFORMANCE_METRICS',
        data: metricsReport
      });
    });
  });
  
  console.log('📊 SW Metrics:', metricsReport);
}

// Reset das métricas
function resetPerformanceMetrics() {
  performanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    networkRequests: 0,
    offlineFallbacks: 0,
    apiCacheHits: 0,
    avgResponseTime: 0,
    requestTimes: []
  };
}

// Escutar comandos do cliente
self.addEventListener('message', event => {
  if (event.data) {
    switch (event.data.type) {
      case 'GET_METRICS':
        broadcastMetrics();
        break;
        
      case 'RESET_METRICS':
        resetPerformanceMetrics();
        event.ports[0].postMessage({ success: true });
        break;
        
      case 'CLEAR_CACHE':
        clearAllCaches().then(() => {
          event.ports[0].postMessage({ success: true });
        });
        break;
    }
  }
});

// Limpar todos os caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('🧹 Todos os caches limpos');
}

// Relatório periódico (a cada 30 segundos)
setInterval(() => {
  if (performanceMetrics.networkRequests > 0) {
    broadcastMetrics();
  }
}, 30000);