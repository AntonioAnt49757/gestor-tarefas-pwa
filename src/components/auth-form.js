import { LitElement, html, css } from 'lit';

export class AuthForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .form-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .form-title {
      text-align: center;
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #4c63d2;
    }

    .form-group input {
      width: 100%;
      padding: 1rem 1.5rem;
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.8);
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background: white;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-left: 0.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  static properties = {
    username: { type: String },
    password: { type: String },
    loading: { type: Boolean }
  };

  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.loading = false;
  }

  _handleInputChange(e) {
    const { name, value } = e.target;
    this[name] = value;
  }

  async _handleSubmit(e) {
    e.preventDefault();
    
    if (!this.username.trim() || !this.password.trim()) {
      this.dispatchEvent(new CustomEvent('login-error', {
        detail: { message: 'Por favor preencha todos os campos' }
      }));
      return;
    }

    this.loading = true;

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username.trim(),
          password: this.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        this.dispatchEvent(new CustomEvent('user-login', {
          detail: {
            username: this.username.trim(),
            token: data.token
          }
        }));
        
        // Limpar formulário
        this.username = '';
        this.password = '';
      } else {
        this.dispatchEvent(new CustomEvent('login-error', {
          detail: { message: data.error || 'Erro no login' }
        }));
      }
    } catch (error) {
      console.error('Erro no login:', error);
      this.dispatchEvent(new CustomEvent('login-error', {
        detail: { message: 'Erro de conexão com o servidor' }
      }));
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="form-container">
        <h2 class="form-title">🔑 Entrar na Conta</h2>
        
        <form @submit=${this._handleSubmit}>
          <div class="form-group">
            <label for="username">👤 Nome de Utilizador</label>
            <input
              type="text"
              id="username"
              name="username"
              .value=${this.username}
              @input=${this._handleInputChange}
              placeholder="Digite o seu nome de utilizador"
              ?disabled=${this.loading}
              required
            />
          </div>

          <div class="form-group">
            <label for="password">🔒 Palavra-passe</label>
            <input
              type="password"
              id="password"
              name="password"
              .value=${this.password}
              @input=${this._handleInputChange}
              placeholder="Digite a sua palavra-passe"
              ?disabled=${this.loading}
              required
            />
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            ?disabled=${this.loading}>
            ${this.loading 
              ? html`Entrando... <span class="loading"></span>` 
              : '🚀 Entrar'}
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define('auth-form', AuthForm);