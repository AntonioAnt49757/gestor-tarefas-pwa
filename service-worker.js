// service-worker.js
const CACHE_NAME = 'gestor-tarefas-v1';
const OFFLINE_CACHE_NAME = 'offline-tarefas-v1';

// Recursos para cache
const urlsToCache = [
  '/',
  '/index.html',
  '/src/app.js',
  '/src/components/auth-form.js',
  '/src/components/register-form.js',
  '/src/components/task-form.js',
  '/src/components/task-list.js'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Recursos em cache');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Erro ao fazer cache:', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Limpar caches antigos
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE_NAME) {
            console.log('🧹 Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker ativado');
      self.clients.claim();
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Apenas interceptar requests HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Requests para a API (localhost:3000)
  if (url.hostname === 'localhost' && url.port === '3000') {
    event.respondWith(handleApiRequest(event.request));
  } 
  // Requests para recursos estáticos
  else {
    event.respondWith(handleStaticRequest(event.request));
  }
});

// Gerir requests para a API
async function handleApiRequest(request) {
  try {
    // Tentar fazer o request normal
    const response = await fetch(request);
    
    // Se for uma criação de tarefa bem-sucedida, fazer cache da resposta
    if (request.method === 'GET' && request.url.includes('/tarefas') && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('🔄 API offline, a processar...');
    
    // Se for POST para tarefas (criar tarefa offline) - REQUISITO DO ENUNCIADO
    if (request.method === 'POST' && request.url.includes('/tarefas')) {
      return handleOfflineTaskCreation(request);
    }
    
    // Para GET de tarefas, tentar cache
    if (request.method === 'GET' && request.url.includes('/tarefas')) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log('📱 Usando tarefas do cache offline');
        return cachedResponse;
      }
    }
    
    // Fallback para erro de rede
    return new Response(
      JSON.stringify({ 
        error: 'Aplicação offline',
        offline: true 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Gerir criação de tarefas offline (REQUISITO PRINCIPAL DO ENUNCIADO)
async function handleOfflineTaskCreation(request) {
  try {
    const taskData = await request.json();
    
    // Adicionar marcador de offline
    taskData.offline = true;
    taskData.syncPending = true;
    taskData.offlineId = 'offline_' + Date.now();
    
    // Guardar tarefa no cache offline
    const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
    const offlineKey = `offline-task-${taskData.offlineId}`;
    const offlineResponse = new Response(JSON.stringify(taskData));
    await offlineCache.put(offlineKey, offlineResponse);
    
    console.log('💾 Tarefa guardada offline:', taskData);
    
    // Registar para sync quando voltar online
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      self.registration.sync.register('sync-offline-tasks');
    }
    
    // Notificar o cliente sobre a tarefa offline
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'TASK_SAVED_OFFLINE',
          task: taskData
        });
      });
    });
    
    return new Response(
      JSON.stringify({ 
        message: 'Tarefa guardada offline - será sincronizada quando voltar online',
        offline: true,
        task: taskData
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ Erro ao guardar tarefa offline:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao guardar offline' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Gerir requests para recursos estáticos
async function handleStaticRequest(request) {
  try {
    // Tentar buscar da rede primeiro (Network First)
    const response = await fetch(request);
    
    // Se bem-sucedido, atualizar cache
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Se falhar, tentar cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📱 Usando recurso do cache:', request.url);
      return cachedResponse;
    }
    
    // Fallback para página offline
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    return new Response('Recurso não disponível offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Sincronizar tarefas offline quando voltar online
self.addEventListener('sync', event => {
  if (event.tag === 'sync-offline-tasks') {
    console.log('🔄 Sincronizando tarefas offline...');
    event.waitUntil(syncOfflineTasks());
  }
});

// Função para sincronizar tarefas
async function syncOfflineTasks() {
  try {
    const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
    const keys = await offlineCache.keys();
    
    const syncPromises = [];
    
    for (const request of keys) {
      if (request.url.includes('offline-task-')) {
        const response = await offlineCache.match(request);
        const taskData = await response.json();
        
        // Remover marcadores offline
        const cleanTaskData = { ...taskData };
        delete cleanTaskData.offline;
        delete cleanTaskData.syncPending;
        delete cleanTaskData.offlineId;
        
        // Tentar enviar para o servidor
        const syncPromise = fetch('http://localhost:3000/tarefas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getStoredToken()}`
          },
          body: JSON.stringify(cleanTaskData)
        }).then(response => {
          if (response.ok) {
            // Se bem-sucedido, remover do cache offline
            return offlineCache.delete(request).then(() => {
              console.log('✅ Tarefa sincronizada:', cleanTaskData);
              
              // Notificar cliente sobre sincronização
              self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                  client.postMessage({
                    type: 'TASK_SYNCED',
                    task: taskData
                  });
                });
              });
            });
          } else {
            console.log('❌ Falha ao sincronizar tarefa:', response.status);
          }
        }).catch(error => {
          console.log('❌ Erro na sincronização:', error);
        });
        
        syncPromises.push(syncPromise);
      }
    }
    
    await Promise.all(syncPromises);
    console.log('🎉 Sincronização de tarefas concluída');
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  }
}

// Função auxiliar para obter token
function getStoredToken() {
  // No contexto do service worker, não temos acesso direto ao localStorage
  // O token será passado nas mensagens ou obtido via indexedDB se necessário
  return 'token_placeholder'; // Será melhorado na implementação final
}

// Escutar mensagens do cliente principal
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SET_TOKEN') {
    // Guardar token para uso nas sincronizações
    self.currentToken = event.data.token;
  }
});