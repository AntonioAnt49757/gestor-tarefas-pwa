const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DADOS ORGANIZADOS POR UTILIZADOR
const users = [];
const tarefasPorUser = {}; // Cada user tem as suas tarefas separadas

// Registo
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  console.log('📝 Registo:', username);
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Utilizador já existe' });
  }
  
  users.push({ username, password });
  tarefasPorUser[username] = []; // ✅ Criar array vazio para este user
  console.log(`✅ Utilizador ${username} registado. Users: ${users.length}`);
  res.json({ message: 'Registo feito com sucesso' });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('🔑 Login:', username);
  
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  
  const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
  console.log(`✅ Login bem-sucedido: ${username}`);
  res.json({ token });
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
  const { username } = req.user;
  const userTasks = tarefasPorUser[username] || [];
  console.log(`📋 ${userTasks.length} tarefas para ${username}`);
  res.json(userTasks);
});

// ✅ CRIAR TAREFA - Guardar no array do utilizador
app.post('/tarefas', auth, (req, res) => {
  const { username } = req.user;
  const task = req.body;
  
  // Garantir que o utilizador tem um array
  if (!tarefasPorUser[username]) {
    tarefasPorUser[username] = [];
  }
  
  tarefasPorUser[username].push(task);
  console.log(`✅ Tarefa criada: ${task.id} para ${username}. Total: ${tarefasPorUser[username].length}`);
  res.json({ message: 'Tarefa criada', task });
});

// ✅ ATUALIZAR TAREFA - Apenas do utilizador atual
app.put('/tarefas/:id', auth, (req, res) => {
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
});

// ✅ REMOVER TAREFA - Apenas do utilizador atual
app.delete('/tarefas/:id', auth, (req, res) => {
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
});

// 🔍 DEBUG - Status do servidor
app.get('/debug', (req, res) => {
  res.json({
    totalUsers: users.length,
    usernames: users.map(u => u.username),
    tasksPerUser: Object.keys(tarefasPorUser).reduce((acc, user) => {
      acc[user] = tarefasPorUser[user].length;
      return acc;
    }, {})
  });
});

app.listen(3000, () => {
  console.log('🚀 Servidor SEGURO a correr em http://localhost:3000');
  console.log('✅ Tarefas organizadas por utilizador');
  console.log('🔐 Cada user só vê as suas tarefas');
  console.log('🔍 Debug: GET /debug para ver estatísticas');
});