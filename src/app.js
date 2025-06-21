import { LitElement, html, css } from 'lit';
import './components/auth-form.js';
import './components/register-form.js';
import './components/task-form.js';
import './components/task-list.js';

class TaskApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-attachment: fixed;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      min-height: 100vh;
    }

    .header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .header h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(102, 126, 234, 0.1);
      padding: 1rem 1.5rem;
      border-radius: 15px;
    }

    .logout-btn {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    }

    .nav-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 1rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .nav-tab {
      flex: 1;
      padding: 1rem 2rem;
      background: transparent;
      border: 2px solid transparent;
      border-radius: 15px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      color: #6c7293;
    }

    .nav-tab:hover {
      transform: translateY(-2px);
      border-color: rgba(102, 126, 234, 0.3);
      background: rgba(102, 126, 234, 0.05);
    }

    .nav-tab.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      transform: translateY(-2px);
    }

    .auth-container {
      max-width: 500px;
      margin: 2rem auto;
    }

    .auth-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      justify-content: center;
    }

    .auth-tab {
      padding: 1rem 2rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 2px solid transparent;
      border-radius: 15px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      color: #6c7293;
    }

    .auth-tab.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .error {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 15px;
      margin-bottom: 1rem;
      text-align: center;
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
      animation: slideIn 0.3s ease-out;
    }

    .success {
      background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 15px;
      margin-bottom: 1rem;
      text-align: center;
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(81, 207, 102, 0.3);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.2rem;
      font-weight: 600;
    }

    .about-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      margin-top: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .about-section h2 {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 2rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.8);
      padding: 1.5rem;
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
      }

      .header h1 {
        font-size: 2rem;
      }

      .nav-tabs {
        flex-direction: column;
        gap: 0.5rem;
      }

      .auth-tabs {
        flex-direction: column;
      }

      .container {
        padding: 1rem 0.5rem;
      }
    }
  `;

  static properties = {
    currentPage: { type: String },
    authMode: { type: String },
    loggedIn: { type: Boolean },
    username: { type: String },
    token: { type: String },
    tarefas: { type: Array },
    errorMessage: { type: String },
    successMessage: { type: String },
    loading: { type: Boolean }
  };

  constructor() {
    super();
    this.currentPage = 'tarefas';
    this.authMode = 'login';
    this.loggedIn = false;
    this.username = '';
    this.token = '';
    this.tarefas = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      this.token = token;
      this.username = username;
      this.loggedIn = true;
      this._carregarTarefas();
    }
  }

  _navegar(pagina) {
    this.currentPage = pagina;
    this._limparMensagens();
  }

  _mudarAuthMode(mode) {
    this.authMode = mode;
    this._limparMensagens();
  }

  _limparMensagens() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  _onLogin(e) {
    console.log('🔍 DEBUG - Login event:', e.detail);
    
    this.loggedIn = true;
    this.username = e.detail.username;
    this.token = e.detail.token;
    
    console.log('🔍 DEBUG - Token recebido:', this.token);
    console.log('🔍 DEBUG - Username:', this.username);
    
    localStorage.setItem('token', this.token);
    localStorage.setItem('username', this.username);
    
    console.log('🔍 DEBUG - Token guardado no localStorage:', localStorage.getItem('token'));
    
    this._limparMensagens();
    this._carregarTarefas();
  }

  _onLoginError(e) {
    this.errorMessage = e.detail.message;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  _onRegisterSuccess(e) {
    this.successMessage = '✅ Registo realizado com sucesso! Faça o login.';
    this.authMode = 'login';
    setTimeout(() => this.successMessage = '', 5000);
  }

  _onRegisterError(e) {
    this.errorMessage = e.detail.message;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  _logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.loggedIn = false;
    this.username = '';
    this.token = '';
    this.tarefas = [];
    this.currentPage = 'tarefas';
    this._limparMensagens();
  }

  async _carregarTarefas() {
    if (!this.token) return;
    
    console.log('🔍 DEBUG - Carregando tarefas com token:', this.token);
    
    this.loading = true;
    try {
      const resposta = await fetch('http://localhost:3000/tarefas', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      
      console.log('🔍 DEBUG - Carregar tarefas status:', resposta.status);
      
      if (resposta.ok) {
        this.tarefas = await resposta.json();
        console.log('🔍 DEBUG - Tarefas carregadas:', this.tarefas.length);
      } else if (resposta.status === 401) {
        console.error('❌ Token inválido ao carregar tarefas!');
        this._logout();
        this.errorMessage = 'Sessão expirada. Faça login novamente.';
      } else {
        const data = await resposta.json();
        console.error('❌ Erro ao carregar tarefas:', data);
        this.errorMessage = 'Erro ao carregar tarefas';
      }
    } catch (err) {
      console.error('❌ Erro de conexão ao carregar tarefas:', err);
      this.errorMessage = 'Erro de conexão. Verifique se o backend está ligado.';
    } finally {
      this.loading = false;
    }
  }

  async _criarTarefa(e) {
    const tarefa = e.detail;
    this.loading = true;

    // 🔍 DEBUG - Verificar token
    console.log('🔍 DEBUG - Token atual:', this.token);
    console.log('🔍 DEBUG - Token localStorage:', localStorage.getItem('token'));
    console.log('🔍 DEBUG - Username:', this.username);
    console.log('🔍 DEBUG - Tarefa a enviar:', tarefa);

    // Verificar se tem token
    if (!this.token) {
      console.error('❌ Sem token! A fazer logout...');
      this._logout();
      this.errorMessage = 'Sessão expirada. Faça login novamente.';
      this.loading = false;
      return;
    }

    try {
      const isEdit = tarefa.isEdit;
      const url = isEdit ? `http://localhost:3000/tarefas/${tarefa.id}` : 'http://localhost:3000/tarefas';
      const method = isEdit ? 'PUT' : 'POST';

      console.log(`🔍 DEBUG - ${method} para:`, url);
      console.log('🔍 DEBUG - Headers:', {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      });

      const resposta = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarefa)
      });

      console.log('🔍 DEBUG - Resposta status:', resposta.status);
      
      const data = await resposta.json();
      console.log('🔍 DEBUG - Resposta data:', data);

      if (resposta.ok) {
        await this._carregarTarefas();
        this.successMessage = isEdit ? '✅ Tarefa atualizada!' : '✅ Tarefa criada!';
        
        // Limpar formulário
        const taskForm = this.shadowRoot.querySelector('task-form');
        if (taskForm && taskForm._limparFormulario) {
          taskForm._limparFormulario();
        }
        
        setTimeout(() => this.successMessage = '', 3000);
      } else {
        // Se token inválido, fazer logout
        if (resposta.status === 401 || resposta.status === 403) {
          console.error('❌ Token inválido! A fazer logout...');
          this._logout();
          this.errorMessage = 'Sessão expirada. Faça login novamente.';
        } else {
          this.errorMessage = data.error || `Erro ${resposta.status}: ${data.message || 'Erro ao processar tarefa'}`;
        }
      }
    } catch (err) {
      console.error('❌ Erro ao processar tarefa:', err);
      this.errorMessage = 'Erro de conexão - verifique se o backend está ligado';
    } finally {
      this.loading = false;
    }
  }

  _editarTarefa(e) {
    const tarefa = e.detail;
    const taskForm = this.shadowRoot.querySelector('task-form');
    if (taskForm && taskForm.carregarTarefa) {
      taskForm.carregarTarefa(tarefa);
      taskForm.scrollIntoView({ behavior: 'smooth' });
      this.successMessage = '📝 Tarefa carregada para edição';
      setTimeout(() => this.successMessage = '', 2000);
    }
  }

  async _removerTarefa(e) {
    const id = e.detail;
    
    if (!confirm('❌ Tem certeza que deseja remover esta tarefa?')) {
      return;
    }
    
    this.loading = true;

    try {
      const resposta = await fetch(`http://localhost:3000/tarefas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (resposta.ok) {
        await this._carregarTarefas();
        this.successMessage = '🗑️ Tarefa removida com sucesso!';
        setTimeout(() => this.successMessage = '', 3000);
      } else {
        const data = await resposta.json();
        this.errorMessage = data.error || 'Erro ao remover tarefa';
      }
    } catch (err) {
      console.error('Erro ao remover tarefa:', err);
      this.errorMessage = 'Erro de conexão - verifique se o backend está ligado';
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (!this.loggedIn) {
      return html`
        <div class="container">
          <div class="header">
            <h1>📋 Gestor de Tarefas PWA</h1>
            <div style="font-size: 0.9rem; color: #6c7293; font-weight: 500;">
              Performance ✨ • Offline 📱 • LitElement ⚡
            </div>
          </div>

          <div class="auth-container">
            ${this.errorMessage ? html`<div class="error">❌ ${this.errorMessage}</div>` : ''}
            ${this.successMessage ? html`<div class="success">✅ ${this.successMessage}</div>` : ''}

            <div class="auth-tabs">
              <button 
                class="auth-tab ${this.authMode === 'login' ? 'active' : ''}"
                @click=${() => this._mudarAuthMode('login')}>
                🔑 Entrar
              </button>
              <button 
                class="auth-tab ${this.authMode === 'register' ? 'active' : ''}"
                @click=${() => this._mudarAuthMode('register')}>
                👤 Registar
              </button>
            </div>

            ${this.authMode === 'login' ? html`
              <auth-form 
                @user-login=${this._onLogin}
                @login-error=${this._onLoginError}>
              </auth-form>
            ` : html`
              <register-form 
                @register-success=${this._onRegisterSuccess}
                @register-error=${this._onRegisterError}>
              </register-form>
            `}
          </div>
        </div>
      `;
    }

    return html`
      <div class="container">
        <div class="header">
          <h1>📋 Gestor de Tarefas PWA</h1>
          <div class="user-info">
            <span style="font-weight: 600; color: #4c63d2;">👋 Olá, ${this.username}!</span>
            <button class="logout-btn" @click=${this._logout}>
              🚪 Sair
            </button>
          </div>
        </div>

        ${this.errorMessage ? html`<div class="error">❌ ${this.errorMessage}</div>` : ''}
        ${this.successMessage ? html`<div class="success">✅ ${this.successMessage}</div>` : ''}

        <div class="nav-tabs">
          <button 
            class="nav-tab ${this.currentPage === 'tarefas' ? 'active' : ''}"
            @click=${() => this._navegar('tarefas')}>
            📝 Minhas Tarefas
          </button>
          <button 
            class="nav-tab ${this.currentPage === 'sobre' ? 'active' : ''}"
            @click=${() => this._navegar('sobre')}>
            ℹ️ Sobre o Projeto
          </button>
        </div>

        ${this.loading ? html`<div class="loading">⏳ Carregando...</div>` : ''}

        ${this.currentPage === 'tarefas' ? html`
          <task-form 
            @tarefa-criada=${this._criarTarefa}>
          </task-form>
          <task-list
            .tarefas=${this.tarefas}
            @tarefa-removida=${this._removerTarefa}
            @tarefa-edit=${this._editarTarefa}>
          </task-list>
        ` : ''}

        ${this.currentPage === 'sobre' ? html`
          <div class="about-section">
            <h2>🚀 Gestor de Tarefas PWA</h2>
            <p style="font-size: 1.1rem; color: #6c7293; margin-bottom: 2rem; text-align: center;">
              Aplicação web progressiva para organização eficiente de tarefas pessoais e profissionais.
            </p>
            
            <div class="features-grid">
              <div class="feature-card">
                <h3 style="color: #667eea; margin-top: 0;">🎯 Características</h3>
                <ul style="text-align: left; color: #6c7293; line-height: 1.6;">
                  <li>🔐 Login seguro por utilizador</li>
                  <li>📝 Criação e gestão de tarefas</li>
                  <li>🏷️ Organização por categorias</li>
                  <li>⚡ Níveis de prioridade</li>
                  <li>📅 Controlo de prazos</li>
                  <li>📊 Acompanhamento de progresso</li>
                </ul>
              </div>
              
              <div class="feature-card">
                <h3 style="color: #764ba2; margin-top: 0;">🛠️ Implementação</h3>
                <ul style="text-align: left; color: #6c7293; line-height: 1.6;">
                  <li><strong>Frontend:</strong> LitElement + Web Components</li>
                  <li><strong>Backend:</strong> Node.js REST API</li>
                  <li><strong>PWA:</strong> Service Worker + Manifest</li>
                  <li><strong>Segurança:</strong> JSON Web Tokens</li>
                  <li><strong>Build:</strong> Vite Development Server</li>
                  <li><strong>Styling:</strong> CSS3 + Animations</li>
                </ul>
              </div>
              
              <div class="feature-card">
                <h3 style="color: #f093fb; margin-top: 0;">📊 Resultados Técnicos</h3>
                <ul style="text-align: left; color: #6c7293; line-height: 1.6;">
                  <li>⚡ Carregamento inicial otimizado</li>
                  <li>📦 Componentes modulares</li>
                  <li>🎨 Interface responsiva fluida</li>
                  <li>💾 Gestão eficiente de estado</li>
                  <li>📱 Compatibilidade cross-browser</li>
                  <li>🔄 Arquitetura escalável</li>
                </ul>
              </div>
              
              <div class="feature-card">
                <h3 style="color: #f5576c; margin-top: 0;">✅ Metodologia Aplicada</h3>
                <ul style="text-align: left; color: #6c7293; line-height: 1.6;">
                  <li>📋 Análise de requisitos PWA</li>
                  <li>🏗️ Arquitetura LitElement</li>
                  <li>📏 Testes de performance</li>
                  <li>⚡ Otimizações implementadas</li>
                  <li>📊 Medição de métricas</li>
                  <li>📝 Documentação técnica</li>
                </ul>
              </div>
            </div>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 15px; text-align: center;">
              <h3 style="color: #667eea; margin-top: 0;">🎯 Conclusões do Estudo</h3>
              <p style="color: #6c7293; margin: 0; line-height: 1.6;">
                A implementação demonstra que o LitElement oferece uma base sólida para desenvolvimento de PWAs, 
                combinando performance nativa com facilidade de manutenção. Os resultados obtidos evidenciam 
                a viabilidade desta stack tecnológica para aplicações web modernas de alta qualidade.
              </p>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('task-app', TaskApp);