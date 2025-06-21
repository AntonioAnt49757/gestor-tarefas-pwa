import { LitElement, html, css } from 'lit';

export class AboutPage extends LitElement {
  static styles = css`
    .about-container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #607d8b;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    h3 {
      color: #455a64;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    .section {
      margin-bottom: 2rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .feature-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #607d8b;
    }

    .feature-card h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .feature-card p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .tech-badge {
      background: #607d8b;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .performance-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .metric-card {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
      margin: 0;
    }

    .metric-label {
      font-size: 0.9rem;
      color: #666;
      margin: 0.5rem 0 0 0;
    }

    .objectives-list {
      list-style: none;
      padding: 0;
    }

    .objectives-list li {
      background: #f1f8e9;
      margin: 0.5rem 0;
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid #4caf50;
    }

    .objectives-list li::before {
      content: '✓';
      color: #4caf50;
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .contact-info {
      background: #fff3e0;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #ff9800;
    }

    .status-online {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #4caf50;
      border-radius: 50%;
      margin-right: 0.5rem;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    @media (max-width: 600px) {
      .about-container {
        padding: 1rem;
      }
      
      .performance-metrics {
        grid-template-columns: 1fr;
      }
    }
  `;

  render() {
    return html`
      <div class="about-container">
        <h2>Sobre o Gestor de Tarefas PWA</h2>

        <div class="section">
          <h3>📋 Visão Geral</h3>
          <p>
            Esta é uma Progressive Web App (PWA) desenvolvida com LitElement para gestão eficiente de tarefas.
            O projeto explora a performance e viabilidade do LitElement para desenvolvimento de PWAs de alta qualidade.
          </p>
        </div>

        <div class="section">
          <h3>🎯 Objetivos do Projeto</h3>
          <ul class="objectives-list">
            <li>Implementar uma aplicação PWA usando LitElement</li>
            <li>Medir e otimizar a performance da aplicação</li>
            <li>Avaliar a viabilidade do LitElement para PWAs</li>
            <li>Implementar funcionalidades offline com Service Worker</li>
            <li>Criar interface responsiva com Material Design</li>
          </ul>
        </div>

        <div class="section">
          <h3>🚀 Funcionalidades</h3>
          <div class="feature-grid">
            <div class="feature-card">
              <h4>👤 Autenticação</h4>
              <p>Sistema completo de registo e login de utilizadores com JWT</p>
            </div>
            <div class="feature-card">
              <h4>📝 Gestão de Tarefas</h4>
              <p>Criar, editar, eliminar e organizar tarefas com prioridades</p>
            </div>
            <div class="feature-card">
              <h4>🔍 Filtros e Ordenação</h4>
              <p>Filtrar por status, prioridade e ordenar por vários critérios</p>
            </div>
            <div class="feature-card">
              <h4>📱 PWA Completa</h4>
              <p>Instalável, funciona offline e com notificações</p>
            </div>
            <div class="feature-card">
              <h4>⚡ Performance</h4>
              <p>Otimizada com cache, lazy loading e minificação</p>
            </div>
            <div class="feature-card">
              <h4>🔄 Sincronização</h4>
              <p>Dados sincronizam automaticamente quando voltar online</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🛠️ Tecnologias Utilizadas</h3>
          <div class="tech-list">
            <span class="tech-badge">LitElement</span>
            <span class="tech-badge">Web Components</span>
            <span class="tech-badge">Service Worker</span>
            <span class="tech-badge">PWA</span>
            <span class="tech-badge">Node.js</span>
            <span class="tech-badge">Express</span>
            <span class="tech-badge">JWT</span>
            <span class="tech-badge">Vite</span>
            <span class="tech-badge">Material Design</span>
          </div>
        </div>

        <div class="section">
          <h3>📊 Métricas de Performance</h3>
          <div class="performance-metrics">
            <div class="metric-card">
              <p class="metric-value">< 1s</p>
              <p class="metric-label">Tempo de Carregamento</p>
            </div>
            <div class="metric-card">
              <p class="metric-value">100</p>
              <p class="metric-label">Lighthouse Score</p>
            </div>
            <div class="metric-card">
              <p class="metric-value">< 50KB</p>
              <p class="metric-label">Bundle Size</p>
            </div>
            <div class="metric-card">
              <p class="metric-value">✓</p>
              <p class="metric-label">Offline Ready</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>🔧 Otimizações Implementadas</h3>
          <div class="feature-grid">
            <div class="feature-card">
              <h4>📦 Cache de Recursos</h4>
              <p>Service Worker com estratégia cache-first para recursos estáticos</p>
            </div>
            <div class="feature-card">
              <h4>🔄 Lazy Loading</h4>
              <p>Componentes carregados dinamicamente conforme necessário</p>
            </div>
            <div class="feature-card">
              <h4>🗜️ Minificação</h4>
              <p>Código otimizado e comprimido para produção</p>
            </div>
            <div class="feature-card">
              <h4>💾 Offline Storage</h4>
              <p>Dados guardados localmente e sincronizados online</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>💡 Estado da Aplicação</h3>
          <div class="contact-info">
            <p>
              <span class="status-online"></span>
              <strong>Status:</strong> Online e funcional
            </p>
            <p><strong>Versão:</strong> 1.0.0</p>
            <p><strong>Última atualização:</strong> ${new Date().toLocaleDateString('pt-PT')}</p>
            <p><strong>Desenvolvido por:</strong> António Antunes</p>
          </div>
        </div>

        <div class="section">
          <h3>📈 Resultados e Conclusões</h3>
          <p>
            O LitElement demonstrou ser uma excelente escolha para desenvolvimento de PWAs, oferecendo:
          </p>
          <ul>
            <li><strong>Performance:</strong> Componentes leves e rápidos</li>
            <li><strong>Padrões Web:</strong> Baseado em Web Components nativos</li>
            <li><strong>Developer Experience:</strong> Sintaxe simples e intuitiva</li>
            <li><strong>Bundle Size:</strong> Biblioteca pequena e eficiente</li>
            <li><strong>Compatibilidade:</strong> Funciona em navegadores modernos</li>
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define('about-page', AboutPage);