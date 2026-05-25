import NichosCanvas from "./NichosCanvas"

export default function Niches() {
  return (
    <section id="nichos">
      <NichosCanvas />
      <div className="container" style={{position:'relative',zIndex:1}}>
        <div className="nichos-wrap">
          <div id="nichosHead">
            <div className="s-eye">Nichos</div>
            <h2>Setores que<br />atendemos</h2>
            <p className="s-desc">Cada negócio tem necessidades específicas. Conhecemos os desafios de cada setor.</p>
          </div>
          <div id="nichosDores" style={{background:'rgba(12,18,25,.9)',border:'1px solid var(--border)',borderRadius:'14px',padding:'28px',backdropFilter:'blur(8px)'}}>
            <div style={{fontFamily:"'Geist Mono',monospace",fontSize:'11px',color:'var(--muted)',marginBottom:'16px',letterSpacing:'.1em'}}>{'// dores que resolvemos'}</div>
            <div style={{display:'flex',flexDirection:'column',gap:'13px'}}>
              {[
                'Sem presença digital profissional',
                'Agenda feita no caderno ou no zap',
                'Sem controle financeiro real',
                'Atendimento lento e manual',
                'Clientes indo para a concorrência',
              ].map(d => (
                <div key={d} style={{display:'flex',alignItems:'center',gap:'12px',fontSize:'14px'}}>
                  <span style={{color:'var(--green)',fontSize:'16px'}}>✓</span>
                  <span style={{color:'var(--white2)'}}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="nicho-grid">
          <div className="nicho-card" data-node="0"><span className="nicho-emoji">✂️</span><div className="nicho-name">Barbearias</div><div className="nicho-needs">Agendamento · Site · Caixa</div></div>
          <div className="nicho-card" data-node="1"><span className="nicho-emoji">🏋️</span><div className="nicho-name">Academias</div><div className="nicho-needs">App · Planos · Mensalidades</div></div>
          <div className="nicho-card" data-node="2"><span className="nicho-emoji">⛪</span><div className="nicho-name">Igrejas</div><div className="nicho-needs">App · Lives · Membros</div></div>
          <div className="nicho-card" data-node="3"><span className="nicho-emoji">🍽️</span><div className="nicho-name">Restaurantes</div><div className="nicho-needs">Cardápio · Pedidos · Delivery</div></div>
          <div className="nicho-card" data-node="4"><span className="nicho-emoji">👤</span><div className="nicho-name">Autônomos</div><div className="nicho-needs">Landing page · Agenda · Portfólio</div></div>
        </div>
      </div>
    </section>
  )
}
