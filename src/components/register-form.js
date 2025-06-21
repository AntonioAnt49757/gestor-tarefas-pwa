import { LitElement, html, css } from 'lit';

export class RegisterForm extends LitElement {
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

    .password-strength {
      margin-top: 0.5rem;
      font-size: 0.9rem;
    }

    .strength-weak { color: #ff6b6b; }
    .strength-medium { color: #ffa726; }
    .strength-strong { color: #51cf66; }

    .submit-btn {
      width: 100%;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
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
      box-shadow: 0 8px 25px rgba(81, 207, 102, 0.3);
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

    .info-text {
      font-size: 0.9rem;
      color: #6c7293;
      text-align: center;
      margin-bottom: 1rem;
      padding: 1rem;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 10px;
    }
  `;

  static properties = {
    username: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    loading: { type: Boolean },
    passwordStrength: { type: String }
  };

  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.loading = false;
    this.passwordStrength = '';
  }

  _handleInputChange(e) {
    const { name, value } = e.target;
    this[name] = value;
    
    if (name === 'password') {
      this._checkPasswordStrength(value);
    }
  }

  _checkPasswordStrength(password) {
    if (password.length === 0) {
      this.passwordStrength = '';
      return;
    }
    
    if (password.length < 4) {
      this.passwordStrength = 'weak';
    } else if (password.length < 8) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  _getPasswordStrengthText() {
    switch (this.passwordStrength) {
      case 'weak': return '🔴 Fraca';
      case 'medium': return '🟡 Média';
      case 'strong': return '🟢 Forte';
      default: return '';
    }
  }

  async _handleSubmit(e) {
    e.preventDefault();
    
    // Validações
    if (!this.username.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      this.dispatchEvent(new CustomEvent('register-error', {
        detail: { message: 'Por favor preencha todos os campos' }
      }));
      return;
    }

    if (this.username.trim().length < 3) {
      this.dispatchEvent(new CustomEvent('register-error', {
        detail: { message: 'Nome de utilizador deve ter pelo menos 3 caracteres' }
      }));
      return;
    }

    if (this.password.length < 4) {
      this.dispatchEvent(new CustomEvent('register-error', {
        detail: { message: 'Palavra-passe deve ter pelo menos 4 caracteres' }
      }));
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.dispatchEvent(new CustomEvent('register-error', {
        detail: { message: 'As palavras-passe não coincidem' }
      }));
      return;
    }

    this.loading = true;

    try {
      const response = await fetch('http://localhost:3000/register', {
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
        this.dispatchEvent(new CustomEvent('register-success', {
          detail: { message: 'Registo realizado com sucesso!' }
        }));
        
        // Limpar formulário
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.passwordStrength = '';
      } else {
        this.dispatchEvent(new CustomEvent('register-error', {
          detail: { message: data.error || 'Erro no registo' }
        }));
      }
    } catch (error) {
      console.error('Erro no registo:', error);
      this.dispatchEvent(new CustomEvent('register-error', {
        detail: { message: 'Erro de conexão com o servidor' }
      }));
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="form-container">
        <h2 class="form-title">👤 Criar Nova Conta</h2>
        
        <div class="info-text">
          Crie a sua conta para começar a gerir as suas tarefas de forma eficiente!
        </div>
        
        <form @submit=${this._handleSubmit}>
          <div class="form-group">
            <label for="username">👤 Nome de Utilizador</label>
            <input
              type="text"
              id="username"
              name="username"
              .value=${this.username}
              @input=${this._handleInputChange}
              placeholder="Escolha um nome de utilizador"
              ?disabled=${this.loading}
              required
              minlength="3"
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
              placeholder="Digite uma palavra-passe"
              ?disabled=${this.loading}
              required
              minlength="4"
            />
            ${this.passwordStrength ? html`
              <div class="password-strength strength-${this.passwordStrength}">
                Força: ${this._getPasswordStrengthText()}
              </div>
            ` : ''}
          </div>

          <div class="form-group">
            <label for="confirmPassword">🔒 Confirmar Palavra-passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              .value=${this.confirmPassword}
              @input=${this._handleInputChange}
              placeholder="Confirme a palavra-passe"
              ?disabled=${this.loading}
              required
            />
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            ?disabled=${this.loading}>
            ${this.loading 
              ? html`Criando Conta... <span class="loading"></span>` 
              : '🎉 Criar Conta'}
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define('register-form', RegisterForm);