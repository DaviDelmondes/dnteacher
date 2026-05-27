import { useState, useEffect } from "react"

const SLIDES = [
  { src: '/projects/barbearia/telainicial.jpeg', alt: 'Tela inicial — Agendar Agora' },
  { src: '/projects/barbearia/calendario.jpeg',  alt: 'Calendário e horário' },
  { src: '/projects/barbearia/finaceiro.jpeg',   alt: 'Painel financeiro' },
]

function BarberCard() {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 2500)
    return () => clearInterval(t)
  }, [paused])

  return (
    <div className="port-card">
      <div
        className="port-img-wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <img key={slide} src={SLIDES[slide].src} alt={SLIDES[slide].alt} className="port-img" />
        <div className="port-live-badge">
          <span className="port-live-dot" />
          Projeto real · No ar
        </div>
      </div>
      <div className="port-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`port-dot${i === slide ? ' active' : ''}`}
            onClick={() => setSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="port-body">
        <div className="port-niche">Barbearia</div>
        <div className="port-title">Barbie Pro — Agendamento de Barbearia</div>
        <div className="port-desc">
          Sistema completo de agendamento online com painel administrativo. Cliente escolhe serviço,
          profissional, data e horário em 4 etapas pelo celular. Dono gerencia agendamentos, clientes
          e financeiro pelo admin — tudo em tempo real.
        </div>
        <ul className="port-features">
          <li>✓ Agendamento em 4 etapas</li>
          <li>✓ Gestão de profissionais</li>
          <li>✓ Controle financeiro</li>
          <li>✓ Histórico de clientes</li>
        </ul>
        <div className="port-links">
          <a
            href="https://barbie-pro-git-main-davidelmondes-projects.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="port-link-main"
          >
            Ver agendamento →
          </a>
          <a
            href="https://barbie-pro-git-main-davidelmondes-projects.vercel.app/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="port-link-sec"
          >
            Ver painel admin →
          </a>
        </div>
        <div className="port-pills">
          <span className="port-pill">React</span>
          <span className="port-pill">Node.js</span>
          <span className="port-pill">Neon PostgreSQL</span>
          <span className="port-pill">Vercel</span>
        </div>
      </div>
    </div>
  )
}

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
          <BarberCard />
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
