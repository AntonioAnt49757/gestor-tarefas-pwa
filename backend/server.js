  const express = require('express');
  const cors = require('cors');
  const jwt = require('jsonwebtoken');

  const app = express();
  app.use(cors());
  app.use(express.json());

  // ✅ DADOS ORGANIZADOS POR UTILIZADOR
  const users = [];
  const tarefasPorUser = {}; // Cada user tem as suas tarefas separadas

  // ✅ MÉTRICAS DE PERFORMANCE DO SERVIDOR
  let serverMetrics = {
    totalRequests: 0,
    requestsByEndpoint: {},
    responseTimes: {},
    activeUsers: new Set(),
    startTime: Date.now(),
    memoryUsage: [],
    errorCount: 0
  };

  // ✅ MIDDLEWARE PARA MEDIR PERFORMANCE
  app.use((req, res, next) => {
    const startTime = Date.now();
    const endpoint = req.path;
    
    // Incrementar contadores
    serverMetrics.totalRequests++;
    serverMetrics.requestsByEndpoint[endpoint] = (serverMetrics.requestsByEndpoint[endpoint] || 0) + 1;
    
    // Medir tempo de resposta
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      if (!serverMetrics.responseTimes[endpoint]) {
        serverMetrics.responseTimes[endpoint] = [];
      }
      
      serverMetrics.responseTimes[endpoint].push(duration);
      
      // Manter apenas últimas 100 medições por endpoint
      if (serverMetrics.responseTimes[endpoint].length > 100) {
        serverMetrics.responseTimes[endpoint].shift();
      }
      
      // Log de performance para análise
      console.log(`⏱️ ${req.method} ${endpoint} - ${duration}ms - Status: ${res.statusCode}`);
      
      // Contar erros
      if (res.statusCode >= 400) {
        serverMetrics.errorCount++;
      }
    });
    
    next();
  });

  // ✅ COLETAR MÉTRICAS DE MEMÓRIA PERIODICAMENTE
  setInterval(() => {
    try {
      const memUsage = process.memoryUsage();
      serverMetrics.memoryUsage.push({
        timestamp: Date.now(),
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024) // MB
      });
      
      // Manter apenas últimas 100 medições
      if (serverMetrics.memoryUsage.length > 100) {
        serverMetrics.memoryUsage.shift();
      }
    } catch (error) {
      console.error('Erro ao coletar métricas de memória:', error);
    }
  }, 10000); // A cada 10 segundos

  // ✅ MIDDLEWARE PARA TRACKING DE UTILIZADORES ATIVOS
  app.use((req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (token) {
        serverMetrics.activeUsers.add(token);
      }
    }
    next();
  });

  // ========== ENDPOINTS DA APLICAÇÃO ==========

  // Registo
  app.post('/register', (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('📝 Registo:', username);
      
      if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Utilizador já existe' });
      }
      
      users.push({ username, password });
      tarefasPorUser[username] = []; // ✅ Criar array vazio para este user
      console.log(`✅ Utilizador ${username} registado. Users: ${users.length}`);
      res.json({ message: 'Registo feito com sucesso' });
    } catch (error) {
      console.error('Erro no registo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Login
  app.post('/login', (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('🔑 Login:', username);
      
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
      console.log(`✅ Login bem-sucedido: ${username}`);
      res.json({ token });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Middleware auth
  function auth(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Sem token' });
    
    try {
      req.user = jwt.verify(token, 'secret');
      next();
    } catch {
      res.status(403).json({ error: 'Token inválido' });
    }
  }

  // ✅ LISTAR TAREFAS - Apenas do utilizador atual
  app.get('/tarefas', auth, (req, res) => {
    try {
      const { username } = req.user;
      const userTasks = tarefasPorUser[username] || [];
      console.log(`📋 ${userTasks.length} tarefas para ${username}`);
      res.json(userTasks);
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // ✅ CRIAR TAREFA - Guardar no array do utilizador
  app.post('/tarefas', auth, (req, res) => {
    try {
      const { username } = req.user;
      const task = req.body;
      
      // Garantir que o utilizador tem um array
      if (!tarefasPorUser[username]) {
        tarefasPorUser[username] = [];
      }
      
      tarefasPorUser[username].push(task);
      console.log(`✅ Tarefa criada: ${task.id} para ${username}. Total: ${tarefasPorUser[username].length}`);
      res.json({ message: 'Tarefa criada', task });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // ✅ ATUALIZAR TAREFA - Apenas do utilizador atual
  app.put('/tarefas/:id', auth, (req, res) => {
    try {
      const { username } = req.user;
      const { id } = req.params;
      const updatedTask = req.body;
      
      if (!tarefasPorUser[username]) {
        return res.status(404).json({ error: 'Utilizador não tem tarefas' });
      }
      
      const index = tarefasPorUser[username].findIndex(t => t.id === id);
      if (index === -1) {
        console.log(`❌ Tarefa ${id} não encontrada para ${username}`);
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      
      tarefasPorUser[username][index] = { ...updatedTask, id };
      console.log(`✅ Tarefa ${id} atualizada para ${username}`);
      res.json({ message: 'Tarefa atualizada', task: tarefasPorUser[username][index] });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // ✅ REMOVER TAREFA - Apenas do utilizador atual
  app.delete('/tarefas/:id', auth, (req, res) => {
    try {
      const { username } = req.user;
      const { id } = req.params;
      
      if (!tarefasPorUser[username]) {
        return res.status(404).json({ error: 'Utilizador não tem tarefas' });
      }
      
      const index = tarefasPorUser[username].findIndex(t => t.id === id);
      if (index === -1) {
        console.log(`❌ Tarefa ${id} não encontrada para ${username}`);
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      
      const removed = tarefasPorUser[username].splice(index, 1)[0];
      console.log(`✅ Tarefa ${id} removida para ${username}. Restam: ${tarefasPorUser[username].length}`);
      res.json({ message: 'Tarefa removida', task: removed });
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // ========== ENDPOINTS DE PERFORMANCE ==========

  // 📊 ENDPOINT PRINCIPAL PARA MÉTRICAS DO SERVIDOR
  app.get('/api/performance/metrics', (req, res) => {
    try {
      console.log('📊 Endpoint /api/performance/metrics chamado');
      
      // Calcular estatísticas
      const uptime = Date.now() - serverMetrics.startTime;
      const averageResponseTimes = {};
      
      Object.keys(serverMetrics.responseTimes).forEach(endpoint => {
        const times = serverMetrics.responseTimes[endpoint];
        if (times && times.length > 0) {
          const avg = times.reduce((a, b) => a + b, 0) / times.length;
          averageResponseTimes[endpoint] = Math.round(avg);
        }
      });
      
      const currentMemory = process.memoryUsage();
      
      const metrics = {
        server: {
          uptime: uptime,
          uptimeFormatted: formatUptime(uptime),
          nodeVersion: process.version,
          platform: process.platform,
          pid: process.pid
        },
        requests: {
          total: serverMetrics.totalRequests,
          byEndpoint: serverMetrics.requestsByEndpoint,
          averageResponseTimes: averageResponseTimes,
          errorCount: serverMetrics.errorCount,
          errorRate: ((serverMetrics.errorCount / Math.max(serverMetrics.totalRequests, 1)) * 100).toFixed(2) + '%'
        },
        users: {
          totalRegistered: users.length,
          activeUsers: serverMetrics.activeUsers.size,
          totalTasks: Object.values(tarefasPorUser).reduce((sum, tasks) => sum + (tasks ? tasks.length : 0), 0),
          tasksPerUser: Object.keys(tarefasPorUser).reduce((acc, user) => {
            acc[user] = tarefasPorUser[user] ? tarefasPorUser[user].length : 0;
            return acc;
          }, {})
        },
        memory: {
          current: {
            rss: Math.round(currentMemory.rss / 1024 / 1024),
            heapUsed: Math.round(currentMemory.heapUsed / 1024 / 1024),
            heapTotal: Math.round(currentMemory.heapTotal / 1024 / 1024),
            external: Math.round(currentMemory.external / 1024 / 1024)
          },
          history: serverMetrics.memoryUsage.slice(-20) // Últimas 20 medições
        },
        performance: {
          requestsPerSecond: (serverMetrics.totalRequests / (uptime / 1000)).toFixed(2),
          averageMemoryUsage: serverMetrics.memoryUsage.length > 0 
            ? Math.round(serverMetrics.memoryUsage.reduce((sum, m) => sum + m.heapUsed, 0) / serverMetrics.memoryUsage.length)
            : 0
        },
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Enviando métricas de performance');
      res.json(metrics);
    } catch (error) {
      console.error('❌ Erro ao gerar métricas:', error);
      res.status(500).json({ error: 'Erro ao gerar métricas: ' + error.message });
    }
  });

  // 🔥 ENDPOINT PARA TESTE DE CARGA
  app.get('/api/performance/stress-test', (req, res) => {
    try {
      const iterations = parseInt(req.query.iterations) || 100;
      console.log(`🔥 Stress test com ${iterations} iterações`);
      
      const startTime = Date.now();
      
      // Simular processamento pesado de forma segura
      let result = 0;
      for (let i = 0; i < iterations; i++) {
        // Operação matemática simples em vez de arrays grandes
        result += Math.sqrt(i * Math.random());
      }
      
      const totalTime = Date.now() - startTime;
      
      console.log(`✅ Stress test concluído: ${totalTime}ms`);
      
      res.json({
        message: 'Stress test concluído',
        iterations: iterations,
        totalTime: totalTime,
        averageTime: (totalTime / iterations).toFixed(2),
        result: result.toFixed(2),
        memoryAfter: {
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
        }
      });
    } catch (error) {
      console.error('❌ Erro no stress test:', error);
      res.status(500).json({ error: 'Erro no stress test: ' + error.message });
    }
  });

  // 🎬 ENDPOINT PARA CENÁRIOS DE TESTE
  app.get('/api/performance/scenario/:type', (req, res) => {
    try {
      const { type } = req.params;
      const startTime = Date.now();
      
      console.log(`🎬 Executando cenário: ${type}`);
      
      switch (type) {
        case 'fast':
          res.json({ 
            scenario: 'fast',
            message: 'Resposta otimizada',
            processingTime: Date.now() - startTime
          });
          break;
          
        case 'slow':
          setTimeout(() => {
            res.json({ 
              scenario: 'slow',
              message: 'Resposta com processamento lento',
              processingTime: Date.now() - startTime
            });
          }, 2000);
          break;
          
        case 'heavy':
          // Processamento pesado mais seguro
          let data = 0;
          for (let i = 0; i < 10000; i++) {
            data += Math.random() * i;
          }
          
          res.json({ 
            scenario: 'heavy',
            message: 'Processamento pesado concluído',
            dataResult: data.toFixed(2),
            processingTime: Date.now() - startTime
          });
          break;
          
        case 'error':
          res.status(500).json({
            scenario: 'error',
            error: 'Erro simulado para teste',
            processingTime: Date.now() - startTime
          });
          break;
          
        default:
          res.status(400).json({
            error: 'Cenário não reconhecido',
            availableScenarios: ['fast', 'slow', 'heavy', 'error'],
            processingTime: Date.now() - startTime
          });
      }
    } catch (error) {
      console.error(`❌ Erro no cenário ${req.params.type}:`, error);
      res.status(500).json({ error: 'Erro no cenário: ' + error.message });
    }
  });

  // 🔄 ENDPOINT PARA RESET DAS MÉTRICAS
  app.post('/api/performance/reset', (req, res) => {
    try {
      serverMetrics = {
        totalRequests: 0,
        requestsByEndpoint: {},
        responseTimes: {},
        activeUsers: new Set(),
        startTime: Date.now(),
        memoryUsage: [],
        errorCount: 0
      };
      
      console.log('🔄 Métricas do servidor resetadas');
      res.json({ message: 'Métricas resetadas com sucesso' });
    } catch (error) {
      console.error('❌ Erro ao resetar métricas:', error);
      res.status(500).json({ error: 'Erro ao resetar métricas: ' + error.message });
    }
  });

  // 🔍 DEBUG - Status do servidor
  app.get('/debug', (req, res) => {
    try {
      res.json({
        totalUsers: users.length,
        usernames: users.map(u => u.username),
        tasksPerUser: Object.keys(tarefasPorUser).reduce((acc, user) => {
          acc[user] = tarefasPorUser[user] ? tarefasPorUser[user].length : 0;
          return acc;
        }, {}),
        serverMetrics: {
          totalRequests: serverMetrics.totalRequests,
          activeUsers: serverMetrics.activeUsers.size,
          uptime: formatUptime(Date.now() - serverMetrics.startTime)
        }
      });
    } catch (error) {
      console.error('❌ Erro no debug:', error);
      res.status(500).json({ error: 'Erro no debug: ' + error.message });
    }
  });

  // ✅ FUNÇÃO AUXILIAR PARA FORMATAR UPTIME
  function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  // ✅ ERROR HANDLER GLOBAL
  app.use((error, req, res, next) => {
    console.error('❌ Erro não tratado:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  });

  // ✅ INICIAR SERVIDOR
  app.listen(3000, () => {
    console.log('🚀 Servidor ROBUSTO a correr em http://localhost:3000');
    console.log('✅ Tarefas organizadas por utilizador');
    console.log('🔐 Cada user só vê as suas tarefas');
    console.log('📊 Sistema de métricas de performance ativado');
    console.log('🔗 Endpoints disponíveis:');
    console.log('   📋 Aplicação:');
    console.log('     POST /register - Registo de utilizador');
    console.log('     POST /login - Login');
    console.log('     GET /tarefas - Listar tarefas');
    console.log('     POST /tarefas - Criar tarefa');
    console.log('     PUT /tarefas/:id - Atualizar tarefa');
    console.log('     DELETE /tarefas/:id - Remover tarefa');
    console.log('   📊 Performance:');
    console.log('     GET /api/performance/metrics - Métricas completas');
    console.log('     GET /api/performance/stress-test - Teste de carga');
    console.log('     POST /api/performance/reset - Reset métricas');
    console.log('     GET /api/performance/scenario/:type - Cenários de teste');
    console.log('   🔍 Debug:');
    console.log('     GET /debug - Status do servidor');
    console.log('🎭 Cenários disponíveis: fast, slow, heavy, error');
    console.log('🔧 Parâmetros de teste: ?iterations=n');
    console.log('📈 Métricas coletadas automaticamente com error handling robusto!');
  });