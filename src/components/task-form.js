import { LitElement, html, css } from 'lit';

export class TaskForm extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 2rem;
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

    .edit-mode {
      background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #4c63d2;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 1rem 1.5rem;
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.8);
      font-family: inherit;
    }

    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background: white;
    }

    .form-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .submit-btn {
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 140px;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(81, 207, 102, 0.3);
    }

    .submit-btn.edit-mode {
      background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%);
    }

    .submit-btn.edit-mode:hover {
      box-shadow: 0 8px 25px rgba(255, 167, 38, 0.3);
    }

    .cancel-btn {
      padding: 1rem 2rem;
      background: rgba(108, 114, 147, 0.1);
      color: #6c7293;
      border: 2px solid rgba(108, 114, 147, 0.2);
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 140px;
    }

    .cancel-btn:hover {
      background: rgba(108, 114, 147, 0.2);
      transform: translateY(-2px);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-left: 0.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .priority-high { border-color: #ff6b6b; }
    .priority-medium { border-color: #ffa726; }
    .priority-low { border-color: #51cf66; }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-row-2 {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .form-container {
        padding: 1.5rem;
      }
    }
  `;

  static properties = {
    titulo: { type: String },
    descricao: { type: String },
    prioridade: { type: String },
    status: { type: String },
    categoria: { type: String },
    dataLimite: { type: String },
    editMode: { type: Boolean },
    editId: { type: String },
    loading: { type: Boolean }
  };

  constructor() {
    super();
    this.titulo = '';
    this.descricao = '';
    this.prioridade = 'media';
    this.status = 'pendente';
    this.categoria = 'geral';
    this.dataLimite = '';
    this.editMode = false;
    this.editId = '';
    this.loading = false;
  }

  _handleInputChange(e) {
    const { name, value } = e.target;
    this[name] = value;
  }

  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async _handleSubmit(e) {
    e.preventDefault();
    
    if (!this.titulo.trim()) {
      alert('❌ Por favor digite um título para a tarefa');
      return;
    }

    this.loading = true;

    const tarefa = {
      id: this.editMode ? this.editId : this._generateId(),
      titulo: this.titulo.trim(),
      descricao: this.descricao.trim(),
      prioridade: this.prioridade,
      status: this.status,
      categoria: this.categoria,
      dataLimite: this.dataLimite || null,
      criadaEm: this.editMode ? undefined : new Date().toISOString(),
      atualizadaEm: new Date().toISOString(),
      isEdit: this.editMode
    };

    this.dispatchEvent(new CustomEvent('tarefa-criada', {
      detail: tarefa
    }));

    // Não limpar aqui - deixar o componente pai decidir
    this.loading = false;
  }

  _limparFormulario() {
    this.titulo = '';
    this.descricao = '';
    this.prioridade = 'media';
    this.status = 'pendente';
    this.categoria = 'geral';
    this.dataLimite = '';
    this.editMode = false;
    this.editId = '';
    this.loading = false;
  }

  _cancelarEdicao() {
    this._limparFormulario();
    this.dispatchEvent(new CustomEvent('edicao-cancelada'));
  }

  carregarTarefa(tarefa) {
    this.titulo = tarefa.titulo;
    this.descricao = tarefa.descricao || '';
    this.prioridade = tarefa.prioridade;
    this.status = tarefa.status;
    this.categoria = tarefa.categoria || 'geral';
    this.dataLimite = tarefa.dataLimite || '';
    this.editMode = true;
    this.editId = tarefa.id;
  }

  render() {
    return html`
      <div class="form-container">
        <h2 class="form-title ${this.editMode ? 'edit-mode' : ''}">
          ${this.editMode ? '📝 Editar Tarefa' : '➕ Nova Tarefa'}
        </h2>
        
        <form @submit=${this._handleSubmit}>
          <div class="form-row">
            <div class="form-group">
              <label for="titulo">📝 Título *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                .value=${this.titulo}
                @input=${this._handleInputChange}
                placeholder="Digite o título da tarefa"
                ?disabled=${this.loading}
                required
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label for="categoria">🏷️ Categoria</label>
              <select
                id="categoria"
                name="categoria"
                .value=${this.categoria}
                @change=${this._handleInputChange}
                ?disabled=${this.loading}
              >
                <option value="geral">📋 Geral</option>
                <option value="trabalho">💼 Trabalho</option>
                <option value="pessoal">👤 Pessoal</option>
                <option value="estudos">📚 Estudos</option>
                <option value="saude">🏥 Saúde</option>
                <option value="casa">🏠 Casa</option>
                <option value="compras">🛒 Compras</option>
                <option value="viagem">✈️ Viagem</option>
              </select>
            </div>

            <div class="form-group">
              <label for="prioridade">⚡ Prioridade</label>
              <select
                id="prioridade"
                name="prioridade"
                .value=${this.prioridade}
                @change=${this._handleInputChange}
                ?disabled=${this.loading}
                class="priority-${this.prioridade}"
              >
                <option value="baixa">🟢 Baixa</option>
                <option value="media">🟡 Média</option>
                <option value="alta">🔴 Alta</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">📊 Status</label>
              <select
                id="status"
                name="status"
                .value=${this.status}
                @change=${this._handleInputChange}
                ?disabled=${this.loading}
              >
                <option value="pendente">⏳ Pendente</option>
                <option value="em-progresso">🔄 Em Progresso</option>
                <option value="concluida">✅ Concluída</option>
              </select>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label for="dataLimite">📅 Data Limite</label>
              <input
                type="datetime-local"
                id="dataLimite"
                name="dataLimite"
                .value=${this.dataLimite}
                @input=${this._handleInputChange}
                ?disabled=${this.loading}
                min="${new Date().toISOString().slice(0, 16)}"
              />
            </div>

            <div class="form-group">
              <label for="descricao">📄 Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                .value=${this.descricao}
                @input=${this._handleInputChange}
                placeholder="Descreva os detalhes da tarefa (opcional)"
                ?disabled=${this.loading}
                maxlength="500"
                style="min-height: 60px;"
              ></textarea>
            </div>
          </div>

          <div class="form-buttons">
            ${this.editMode ? html`
              <button 
                type="button" 
                class="cancel-btn"
                @click=${this._cancelarEdicao}
                ?disabled=${this.loading}>
                ❌ Cancelar
              </button>
            ` : ''}
            
            <button 
              type="submit" 
              class="submit-btn ${this.editMode ? 'edit-mode' : ''}"
              ?disabled=${this.loading}>
              ${this.loading 
                ? html`Processando... <span class="loading"></span>` 
                : this.editMode 
                  ? '💾 Atualizar Tarefa' 
                  : '🚀 Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('task-form', TaskForm);