import { LitElement, html, css } from 'lit';
import './components/task-form.js';
import './components/task-list.js';
import './components/auth-form.js';
import './components/register-form.js';

export class MainApp extends LitElement {
  static properties = {
    currentPage: { type: String },
    user: { type: String },
    token: { type: String },
    tarefas: { type: Array },
    errorMessage: { type: String }
  };

  static styles = css`
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #607d8b;
      color: white;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .nav h1 {
      margin: 0;
      font-size: 1.4rem;
    }

    .nav button {
      background: #ff7043;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .nav button:hover {
      background: #f4511e;
    }

    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .tabs button {
      flex: 1;
      padding: 0.7rem;
      background: #cfd8dc;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
    }

    .tabs button.active {
      background-color: #607d8b;
      color: white;
    }

    .error {
      background-color: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      text-align: center;
    }
  `;

  constructor() {
    super();
    this.currentPage = 'login';
    this.user = '';
    this.token = localStorage.getItem('token') || '';
    this.tarefas = [];
    this.errorMessage = '';

    // Se tem token, tentar carregar dados do utilizador
    if (this.token) {
      this._loadUserData();
    }
  }

  async _loadUserData() {
    try {
      const response = await fetch('http://localhost:3000/tarefas', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        const tarefas = await response.json();
        this.tarefas = tarefas;
        this.user = 'Utilizador'; // Pode extrair do token se necessário
        this.currentPage = 'tarefas';
      } else {
        // Token inválido, limpar
        localStorage.removeItem('token');
        this.token = '';
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  _navegar(pagina) {
    this.currentPage = pagina;
    this.errorMessage = '';
  }

  _login(e) {
    this.user = e.detail.username;
    this.token = e.detail.token;
    localStorage.setItem('token', this.token);
    this._navegar('tarefas');
    this._loadTarefas();
  }

  _loginError(e) {
    this.errorMessage = e.detail.message;
  }

  async _loadTarefas() {
    try {
      const response = await fetch('http://localhost:3000/tarefas', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        this.tarefas = await response.json();
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }

  _logout() {
    this.user = '';
    this.token = '';
    this.tarefas = [];
    localStorage.removeItem('token');
    this._navegar('login');
  }

  async _registar(e) {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: e.detail.username,
          password: e.detail.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        this.errorMessage = '';
        this._navegar('login');
        // Mostrar mensagem de sucesso
        alert('Registo realizado com sucesso! Faça login.');
      } else {
        this.errorMessage = data.error || 'Erro no registo';
      }
    } catch (error) {
      this.errorMessage = 'Erro de conexão com o servidor';
    }
  }

  _registerError(e) {
    this.errorMessage = e.detail.message;
  }

  async _guardarTarefa(e) {
    const tarefa = e.detail;

    try {
      const response = await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(tarefa)
      });

      if (response.ok) {
        // Recarregar tarefas
        this._loadTarefas();
      } else {
        this.errorMessage = 'Erro ao guardar tarefa';
      }
    } catch (error) {
      this.errorMessage = 'Erro de conexão com o servidor';
    }
  }

  _apagarTarefa(e) {
    const id = e.detail;
    this.tarefas = this.tarefas.filter(t => t.id !== id);
    // Aqui deveria também fazer DELETE para o backend
    this.requestUpdate();
  }

  render() {
    return html`
      ${this.errorMessage ? html`<div class="error">${this.errorMessage}</div>` : ''}
      
      ${this.user
        ? html`
            <div class="nav">
              <h1>Bem-vindo, ${this.user}</h1>
              <button @click=${this._logout}>Logout</button>
            </div>
            <div class="tabs">
              <button class=${this.currentPage === 'tarefas' ? 'active' : ''} @click=${() => this._navegar('tarefas')}>Tarefas</button>
              <button class=${this.currentPage === 'sobre' ? 'active' : ''} @click=${() => this._navegar('sobre')}>Sobre</button>
            </div>
          `
        : html`
            <div class="tabs">
              <button class=${this.currentPage === 'login' ? 'active' : ''} @click=${() => this._navegar('login')}>Login</button>
              <button class=${this.currentPage === 'registo' ? 'active' : ''} @click=${() => this._navegar('registo')}>Registar</button>
              <button class=${this.currentPage === 'sobre' ? 'active' : ''} @click=${() => this._navegar('sobre')}>Sobre</button>
            </div>
          `}

      ${this.currentPage === 'login' ? html`
        <auth-form 
          @user-login=${this._login}
          @login-error=${this._loginError}>
        </auth-form>` : ''}

      ${this.currentPage === 'registo' ? html`
        <register-form 
          @user-register=${this._registar}
          @register-error=${this._registerError}>
        </register-form>` : ''}

      ${this.currentPage === 'tarefas' ? html`
        <task-form @tarefa-criada=${this._guardarTarefa}></task-form>
        <task-list
          .tarefas=${this.tarefas}
          @tarefa-removida=${this._apagarTarefa}
          @tarefa-edit=${this._guardarTarefa}>
        </task-list>` : ''}

      ${this.currentPage === 'sobre' ? html`
        <p>Esta é uma PWA criada com LitElement. Utilizador atual: ${this.user || 'nenhum'}</p>` : ''}
    `;
  }
}

customElements.define('main-app', MainApp);