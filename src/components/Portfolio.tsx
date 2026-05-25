export default function Portfolio() {
  return (
    <section id="projetos">
      <div className="container">
        <div className="port-head">
          <div id="portHead">
            <div className="s-eye">Projetos</div>
            <h2>Trabalhos recentes</h2>
          </div>
          <a href="#contato" className="btn-sec">Quero um projeto assim →</a>
        </div>
        <div className="port-grid">
          <div className="port-card">
            <div className="port-preview pp1">
              <span className="port-emoji">✂️</span>
              <div className="port-badge">Sistema Web</div>
            </div>
            <div className="port-body">
              <div className="port-niche">Barbearia</div>
              <div className="port-title">BarberPro — Agendamento Online</div>
              <div className="port-desc">Calendário, perfil dos profissionais, histórico de clientes e controle financeiro integrado.</div>
              <div className="port-pills">
                <span className="port-pill">React</span><span className="port-pill">Node.js</span><span className="port-pill">Neon</span><span className="port-pill">Prisma</span>
              </div>
            </div>
          </div>
          <div className="port-card">
            <div className="port-preview pp2">
              <span className="port-emoji">🏋️</span>
              <div className="port-badge">App Mobile</div>
            </div>
            <div className="port-body">
              <div className="port-niche">Academia</div>
              <div className="port-title">FitPanel — Gestão de Alunos</div>
              <div className="port-desc">App iOS e Android para matrículas, planos, frequência e fichas de treino.</div>
              <div className="port-pills">
                <span className="port-pill">React Native</span><span className="port-pill">Expo</span><span className="port-pill">Prisma</span><span className="port-pill">JWT</span>
              </div>
            </div>
          </div>
          <div className="port-card">
            <div className="port-preview pp3">
              <span className="port-emoji">⛪</span>
              <div className="port-badge">App Institucional</div>
            </div>
            <div className="port-body">
              <div className="port-niche">Igreja</div>
              <div className="port-title">ChurchApp — Comunidade Digital</div>
              <div className="port-desc">Lives, pedidos de oração, área dos membros, eventos e dízimos online.</div>
              <div className="port-pills">
                <span className="port-pill">React Native</span><span className="port-pill">Node.js</span><span className="port-pill">WebSocket</span><span className="port-pill">Pix</span>
              </div>
            </div>
          </div>
          <div className="port-card">
            <div className="port-preview pp4">
              <span className="port-emoji">🍽️</span>
              <div className="port-badge">Landing + Sistema</div>
            </div>
            <div className="port-body">
              <div className="port-niche">Restaurante</div>
              <div className="port-title">MenuDigital — Cardápio e Pedidos</div>
              <div className="port-desc">Cardápio via QR Code, pedidos pelo celular e painel de gestão integrado.</div>
              <div className="port-pills">
                <span className="port-pill">React</span><span className="port-pill">QR Code</span><span className="port-pill">WhatsApp API</span><span className="port-pill">Vercel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
