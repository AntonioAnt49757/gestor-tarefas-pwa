// src/components/performance-page.js
import { LitElement, html, css } from 'lit';

export class PerformancePage extends LitElement {
  static styles = css`
    .container {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .title {
      color: #495057;
      margin-bottom: 2rem;
      text-align: center;
      font-size: 2rem;
    }

    .buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn:hover {
      background: #0056b3;
      transform: translateY(-2px);
    }

    .btn.success { background: #28a745; }
    .btn.warning { background: #ffc107; color: #333; }
    .btn.danger { background: #dc3545; }

    .status {
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
      text-align: center;
      font-weight: 600;
    }

    .status.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .status.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status.info {
      background: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }

    .debug-info {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      font-family: monospace;
      white-space: pre-wrap;
      max-height: 200px;
      overflow-y: auto;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .metric-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .metric-card h3 {
      color: #495057;
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .metric-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #dee2e6;
    }

    .metric-item:last-child {
      border-bottom: none;
    }

    .loading {
      text-align: center;
      color: #6c757d;
      font-style: italic;
      padding: 2rem;
    }
  `;

  static properties = {
    serverMetrics: { type: Object },
    loading: { type: Boolean },
    error: { type: String },
    debugInfo: { type: String },
    lastTest: { type: String }
  };

  constructor() {
    super();
    this.serverMetrics = null;
    this.loading = false;
    this.error = '';
    this.debugInfo = '';
    this.lastTest = '';
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('🔌 PerformancePage conectada');
    this._addDebugInfo('Página de performance carregada');
    this._testConnection();
  }

  _addDebugInfo(message) {
    const timestamp = new Date().toLocaleTimeString();
    this.debugInfo += `[${timestamp}] ${message}\n`;
    this.requestUpdate();
  }

  async _testConnection() {
    this._addDebugInfo('🔍 Testando conexão com backend...');
    
    try {
      const response = await fetch('http://localhost:3000/debug');
      if (response.ok) {
        const data = await response.json();
        this._addDebugInfo('✅ Backend disponível: ' + JSON.stringify(data, null, 2));
        this.lastTest = 'Backend conectado ✅';
      } else {
        this._addDebugInfo('❌ Backend respondeu com erro: ' + response.status);
        this.lastTest = `Backend erro ${response.status} ❌`;
      }
    } catch (error) {
      this._addDebugInfo('❌ Erro de conexão: ' + error.message);
      this.lastTest = 'Backend offline ❌';
    }
    
    this.requestUpdate();
  }

  async _loadServerMetrics() {
    this.loading = true;
    this.error = '';
    this._addDebugInfo('📊 Carregando métricas do servidor...');
    
    try {
      console.log('🔍 Fazendo fetch para http://localhost:3000/api/performance/metrics');
      
      const response = await fetch('http://localhost:3000/api/performance/metrics');
      
      this._addDebugInfo(`Resposta recebida: Status ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      this.serverMetrics = await response.json();
      this._addDebugInfo('✅ Métricas carregadas com sucesso');
      console.log('📊 Métricas recebidas:', this.serverMetrics);
      
    } catch (error) {
      console.error('❌ Erro ao carregar métricas:', error);
      this.error = error.message;
      this._addDebugInfo('❌ Erro: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  async _runStressTest() {
    this._addDebugInfo('🔥 Iniciando stress test...');
    
    try {
      const response = await fetch('http://localhost:3000/api/performance/stress-test?iterations=100');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      this._addDebugInfo(`✅ Stress test: ${result.totalTime}ms para ${result.iterations} iterações`);
      alert(`🔥 Stress test concluído: ${result.totalTime}ms para ${result.iterations} iterações`);
      
      // Recarregar métricas após teste
      setTimeout(() => this._loadServerMetrics(), 1000);
      
    } catch (error) {
      this._addDebugInfo('❌ Erro no stress test: ' + error.message);
      alert('❌ Erro no stress test: ' + error.message);
    }
  }

  async _testScenario(scenario) {
    this._addDebugInfo(`🎬 Testando cenário: ${scenario}`);
    
    try {
      const response = await fetch(`http://localhost:3000/api/performance/scenario/${scenario}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      this._addDebugInfo(`✅ Cenário ${scenario}: ${result.processingTime}ms`);
      alert(`🎬 Cenário ${scenario}: ${result.processingTime}ms`);
      
    } catch (error) {
      this._addDebugInfo(`❌ Erro no cenário ${scenario}: ` + error.message);
      alert(`❌ Erro no cenário ${scenario}: ` + error.message);
    }
  }

  _clearDebug() {
    this.debugInfo = '';
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="container">
        <h1 class="title">📊 Performance Dashboard</h1>
        
        <!-- Status da Conexão -->
        <div class="status ${this.error ? 'error' : 'info'}">
          ${this.error ? `❌ Erro: ${this.error}` : `🔗 Status: ${this.lastTest || 'Verificando...'}`}
        </div>

        <!-- Botões de Ação -->
        <div class="buttons">
          <button class="btn" @click=${this._testConnection}>🔍 Testar Conexão</button>
          <button class="btn success" @click=${this._loadServerMetrics}>🔄 Recarregar Métricas</button>
          <button class="btn warning" @click=${this._runStressTest}>🔥 Stress Test</button>
          <button class="btn" @click=${() => this._testScenario('fast')}>⚡ Cenário Rápido</button>
          <button class="btn" @click=${() => this._testScenario('slow')}>🐌 Cenário Lento</button>
          <button class="btn danger" @click=${this._clearDebug}>🧹 Limpar Debug</button>
        </div>

        <!-- Debug Info -->
        ${this.debugInfo ? html`
          <h3>🔍 Informações de Debug:</h3>
          <div class="debug-info">${this.debugInfo}</div>
        ` : ''}

        <!-- Loading -->
        ${this.loading ? html`
          <div class="loading">⏳ Carregando métricas...</div>
        ` : ''}

        <!-- Métricas do Servidor -->
        ${this.serverMetrics ? html`
          <div class="metrics-grid">
            <!-- Performance do Servidor -->
            <div class="metric-card">
              <h3>🖥️ Performance do Servidor</h3>
              <div class="metric-item">
                <span>Uptime:</span>
                <span>${this.serverMetrics.server?.uptimeFormatted || 'N/A'}</span>
              </div>
              <div class="metric-item">
                <span>Requests Totais:</span>
                <span>${this.serverMetrics.requests?.total || 0}</span>
              </div>
              <div class="metric-item">
                <span>Taxa de Erro:</span>
                <span>${this.serverMetrics.requests?.errorRate || '0%'}</span>
              </div>
              <div class="metric-item">
                <span>Requests/segundo:</span>
                <span>${this.serverMetrics.performance?.requestsPerSecond || '0'}</span>
              </div>
            </div>

            <!-- Requests por Endpoint -->
            <div class="metric-card">
              <h3>📊 Requests do Servidor</h3>
              ${Object.entries(this.serverMetrics.requests?.byEndpoint || {}).map(([endpoint, count]) => html`
                <div class="metric-item">
                  <span>${endpoint}:</span>
                  <span>${count} requests</span>
                </div>
              `)}
            </div>

            <!-- Memória do Servidor -->
            <div class="metric-card">
              <h3>💾 Memória do Servidor</h3>
              <div class="metric-item">
                <span>RSS:</span>
                <span>${this.serverMetrics.memory?.current?.rss || 0} MB</span>
              </div>
              <div class="metric-item">
                <span>Heap Used:</span>
                <span>${this.serverMetrics.memory?.current?.heapUsed || 0} MB</span>
              </div>
              <div class="metric-item">
                <span>Heap Total:</span>
                <span>${this.serverMetrics.memory?.current?.heapTotal || 0} MB</span>
              </div>
              <div class="metric-item">
                <span>External:</span>
                <span>${this.serverMetrics.memory?.current?.external || 0} MB</span>
              </div>
            </div>

            <!-- Utilizadores e Dados -->
            <div class="metric-card">
              <h3>👥 Utilizadores e Dados</h3>
              <div class="metric-item">
                <span>Utilizadores Registados:</span>
                <span>${this.serverMetrics.users?.totalRegistered || 0}</span>
              </div>
              <div class="metric-item">
                <span>Utilizadores Ativos:</span>
                <span>${this.serverMetrics.users?.activeUsers || 0}</span>
              </div>
              <div class="metric-item">
                <span>Total de Tarefas:</span>
                <span>${this.serverMetrics.users?.totalTasks || 0}</span>
              </div>
            </div>

            <!-- Tempos de Resposta -->
            <div class="metric-card">
              <h3>⏱️ Tempos de Resposta Médios</h3>
              ${Object.entries(this.serverMetrics.requests?.averageResponseTimes || {}).map(([endpoint, time]) => html`
                <div class="metric-item">
                  <span>${endpoint}:</span>
                  <span>${time}ms</span>
                </div>
              `)}
            </div>

            <!-- Informações do Sistema -->
            <div class="metric-card">
              <h3>⚙️ Sistema</h3>
              <div class="metric-item">
                <span>Node.js:</span>
                <span>${this.serverMetrics.server?.nodeVersion || 'N/A'}</span>
              </div>
              <div class="metric-item">
                <span>Plataforma:</span>
                <span>${this.serverMetrics.server?.platform || 'N/A'}</span>
              </div>
              <div class="metric-item">
                <span>PID:</span>
                <span>${this.serverMetrics.server?.pid || 'N/A'}</span>
              </div>
              <div class="metric-item">
                <span>Timestamp:</span>
                <span>${new Date(this.serverMetrics.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ` : html`
          <div class="status info">
            💡 Nenhuma métrica carregada ainda. Clique em "🔄 Recarregar Métricas" ou "🔍 Testar Conexão".
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('performance-page', PerformancePage);