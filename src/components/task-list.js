import { LitElement, html, css } from 'lit';

export class TaskList extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .list-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .list-title {
      text-align: center;
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .filter-btn {
      padding: 0.7rem 1.5rem;
      background: rgba(102, 126, 234, 0.1);
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      color: #4c63d2;
    }

    .filter-btn:hover {
      transform: translateY(-2px);
      background: rgba(102, 126, 234, 0.2);
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: #667eea;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .task-card {
      background: rgba(255, 255, 255, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .task-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
      border-color: rgba(102, 126, 234, 0.3);
    }

    .task-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .task-card.priority-alta::before {
      background: linear-gradient(90deg, #ff6b6b, #ee5a24);
    }

    .task-card.priority-media::before {
      background: linear-gradient(90deg, #ffa726, #ff7043);
    }

    .task-card.priority-baixa::before {
      background: linear-gradient(90deg, #51cf66, #40c057);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .task-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0;
      line-height: 1.3;
      word-break: break-word;
    }

    .task-priority {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      white-space: nowrap;
    }

    .priority-alta {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
    }

    .priority-media {
      background: linear-gradient(135deg, #ffa726, #ff7043);
      color: white;
    }

    .priority-baixa {
      background: linear-gradient(135deg, #51cf66, #40c057);
      color: white;
    }

    .task-description {
      color: #6c7293;
      font-size: 0.95rem;
      margin-bottom: 1rem;
      line-height: 1.5;
      max-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .task-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #8e94a9;
    }

    .task-category {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      margin-bottom: 0.5rem;
      background: rgba(102, 126, 234, 0.1);
      color: #4c63d2;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .task-deadline {
      font-size: 0.85rem;
      color: #6c7293;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      margin-bottom: 0.5rem;
    }

    .deadline-urgent {
      color: #ff6b6b;
      font-weight: 600;
    }

    .deadline-soon {
      color: #ffa726;
      font-weight: 600;
    }

    .task-status {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.4rem 0.8rem;
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .status-pendente {
      background: rgba(255, 167, 38, 0.1);
      color: #ff7043;
      border: 1px solid rgba(255, 167, 38, 0.2);
    }

    .status-em-progresso {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .status-concluida {
      background: rgba(81, 207, 102, 0.1);
      color: #40c057;
      border: 1px solid rgba(81, 207, 102, 0.2);
    }

    .task-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      flex: 1;
      padding: 0.7rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
    }

    .edit-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .edit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .delete-btn {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
    }

    .delete-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #6c7293;
    }

    .empty-state .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: #4c63d2;
    }

    .stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .stat-card {
      background: rgba(102, 126, 234, 0.1);
      padding: 1rem 1.5rem;
      border-radius: 12px;
      text-align: center;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #4c63d2;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #6c7293;
      margin-top: 0.2rem;
    }

    @media (max-width: 768px) {
      .tasks-grid {
        grid-template-columns: 1fr;
      }

      .filters {
        justify-content: stretch;
      }

      .filter-btn {
        flex: 1;
        text-align: center;
      }

      .stats {
        flex-direction: column;
      }

      .list-container {
        padding: 1.5rem;
      }
    }
  `;

  static properties = {
    tarefas: { type: Array },
    filtroStatus: { type: String },
    filtroPrioridade: { type: String }
  };

  constructor() {
    super();
    this.tarefas = [];
    this.filtroStatus = 'todas';
    this.filtroPrioridade = 'todas';
  }

  _formatarData(dataIso) {
    if (!dataIso) return 'Data inválida';
    try {
      const data = new Date(dataIso);
      return data.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  }

  _getStatusLabel(status) {
    const labels = {
      'pendente': '⏳ Pendente',
      'em-progresso': '🔄 Em Progresso',
      'concluida': '✅ Concluída'
    };
    return labels[status] || status;
  }

  _getPriorityLabel(prioridade) {
    const labels = {
      'baixa': '🟢 Baixa',
      'media': '🟡 Média',
      'alta': '🔴 Alta'
    };
    return labels[prioridade] || prioridade;
  }

  _getCategoriaLabel(categoria) {
    const labels = {
      'geral': '📋 Geral',
      'trabalho': '💼 Trabalho', 
      'pessoal': '👤 Pessoal',
      'estudos': '📚 Estudos',
      'saude': '🏥 Saúde',
      'casa': '🏠 Casa',
      'compras': '🛒 Compras',
      'viagem': '✈️ Viagem'
    };
    return labels[categoria] || '📋 Geral';
  }

  _formatarDataLimite(dataLimite) {
    if (!dataLimite) return null;
    
    try {
      const limite = new Date(dataLimite);
      const agora = new Date();
      const diffHoras = (limite - agora) / (1000 * 60 * 60);
      
      const formatada = limite.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      let classe = '';
      let emoji = '📅';
      
      if (diffHoras < 0) {
        classe = 'deadline-urgent';
        emoji = '🚨';
      } else if (diffHoras < 24) {
        classe = 'deadline-urgent';
        emoji = '⚠️';
      } else if (diffHoras < 72) {
        classe = 'deadline-soon';
        emoji = '⏰';
      }

      return { formatada, classe, emoji };
    } catch {
      return null;
    }
  }

  _filtrarTarefas() {
    return this.tarefas.filter(tarefa => {
      const statusMatch = this.filtroStatus === 'todas' || tarefa.status === this.filtroStatus;
      const prioridadeMatch = this.filtroPrioridade === 'todas' || tarefa.prioridade === this.filtroPrioridade;
      return statusMatch && prioridadeMatch;
    });
  }

  _calcularEstatisticas() {
    const total = this.tarefas.length;
    const pendentes = this.tarefas.filter(t => t.status === 'pendente').length;
    const emProgresso = this.tarefas.filter(t => t.status === 'em-progresso').length;
    const concluidas = this.tarefas.filter(t => t.status === 'concluida').length;
    
    return { total, pendentes, emProgresso, concluidas };
  }

  _editarTarefa(tarefa) {
    this.dispatchEvent(new CustomEvent('tarefa-edit', {
      detail: tarefa
    }));
  }

  _removerTarefa(tarefa) {
    if (confirm(`❌ Tem certeza que deseja remover a tarefa "${tarefa.titulo}"?`)) {
      this.dispatchEvent(new CustomEvent('tarefa-removida', {
        detail: tarefa.id
      }));
    }
  }

  _setFiltroStatus(status) {
    this.filtroStatus = status;
  }

  _setFiltroPrioridade(prioridade) {
    this.filtroPrioridade = prioridade;
  }

  render() {
    const tarefasFiltradas = this._filtrarTarefas();
    const stats = this._calcularEstatisticas();

    return html`
      <div class="list-container">
        <h2 class="list-title">📋 Minhas Tarefas</h2>

        <!-- Estatísticas -->
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.pendentes}</div>
            <div class="stat-label">Pendentes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.emProgresso}</div>
            <div class="stat-label">Em Progresso</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.concluidas}</div>
            <div class="stat-label">Concluídas</div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="filters">
          <button 
            class="filter-btn ${this.filtroStatus === 'todas' ? 'active' : ''}"
            @click=${() => this._setFiltroStatus('todas')}>
            🔍 Todas
          </button>
          <button 
            class="filter-btn ${this.filtroStatus === 'pendente' ? 'active' : ''}"
            @click=${() => this._setFiltroStatus('pendente')}>
            ⏳ Pendentes
          </button>
          <button 
            class="filter-btn ${this.filtroStatus === 'em-progresso' ? 'active' : ''}"
            @click=${() => this._setFiltroStatus('em-progresso')}>
            🔄 Em Progresso
          </button>
          <button 
            class="filter-btn ${this.filtroStatus === 'concluida' ? 'active' : ''}"
            @click=${() => this._setFiltroStatus('concluida')}>
            ✅ Concluídas
          </button>
        </div>

        <div class="filters">
          <button 
            class="filter-btn ${this.filtroPrioridade === 'todas' ? 'active' : ''}"
            @click=${() => this._setFiltroPrioridade('todas')}>
            🎯 Todas Prioridades
          </button>
          <button 
            class="filter-btn ${this.filtroPrioridade === 'alta' ? 'active' : ''}"
            @click=${() => this._setFiltroPrioridade('alta')}>
            🔴 Alta
          </button>
          <button 
            class="filter-btn ${this.filtroPrioridade === 'media' ? 'active' : ''}"
            @click=${() => this._setFiltroPrioridade('media')}>
            🟡 Média
          </button>
          <button 
            class="filter-btn ${this.filtroPrioridade === 'baixa' ? 'active' : ''}"
            @click=${() => this._setFiltroPrioridade('baixa')}>
            🟢 Baixa
          </button>
        </div>

        <!-- Lista de Tarefas -->
        ${tarefasFiltradas.length === 0 ? html`
          <div class="empty-state">
            <div class="icon">📭</div>
            <h3>Nenhuma tarefa encontrada</h3>
            <p>
              ${this.tarefas.length === 0 
                ? 'Ainda não tem tarefas. Crie a sua primeira tarefa acima!'
                : 'Nenhuma tarefa corresponde aos filtros selecionados.'}
            </p>
          </div>
        ` : html`
          <div class="tasks-grid">
            ${tarefasFiltradas.map(tarefa => {
              const dataLimite = this._formatarDataLimite(tarefa.dataLimite);
              return html`
                <div class="task-card priority-${tarefa.prioridade}">
                  <div class="task-header">
                    <h3 class="task-title">${tarefa.titulo}</h3>
                    <span class="task-priority priority-${tarefa.prioridade}">
                      ${this._getPriorityLabel(tarefa.prioridade)}
                    </span>
                  </div>

                  <div class="task-category">
                    ${this._getCategoriaLabel(tarefa.categoria)}
                  </div>

                  ${dataLimite ? html`
                    <div class="task-deadline ${dataLimite.classe}">
                      ${dataLimite.emoji} Prazo: ${dataLimite.formatada}
                    </div>
                  ` : ''}

                  ${tarefa.descricao ? html`
                    <p class="task-description">${tarefa.descricao}</p>
                  ` : ''}

                  <div class="task-status status-${tarefa.status}">
                    ${this._getStatusLabel(tarefa.status)}
                  </div>

                  <div class="task-meta">
                    ${tarefa.criadaEm ? html`
                      <span>📅 Criada: ${this._formatarData(tarefa.criadaEm)}</span>
                    ` : ''}
                    ${tarefa.atualizadaEm && tarefa.atualizadaEm !== tarefa.criadaEm ? html`
                      <span>🔄 Atualizada: ${this._formatarData(tarefa.atualizadaEm)}</span>
                    ` : ''}
                  </div>

                  <div class="task-actions">
                    <button 
                      class="action-btn edit-btn"
                      @click=${() => this._editarTarefa(tarefa)}
                      title="Editar tarefa">
                      ✏️ Editar
                    </button>
                    <button 
                      class="action-btn delete-btn"
                      @click=${() => this._removerTarefa(tarefa)}
                      title="Remover tarefa">
                      🗑️ Remover
                    </button>
                  </div>
                </div>
              `;
            })}
          </div>
        `}
      </div>
    `;
  }
}

customElements.define('task-list', TaskList);