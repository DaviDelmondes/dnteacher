import ServicosCanvas from "./ServicosCanvas"

export default function Services() {
  return (
    <section id="servicos">
      <ServicosCanvas />
      <div className="container" style={{position:'relative',zIndex:1}}>
        <div id="servHead">
          <div className="s-eye">Serviços</div>
          <h2>O que a DN Teacher<br />constrói para você</h2>
        </div>
        <div className="bento">
          <div className="b b1 b-hl">
            <div className="b-num">01</div>
            <span className="b-icon">🖥️</span>
            <div className="b-title">Landing Pages de Alta Conversão</div>
            <div className="b-desc">Páginas focadas em transformar visitante em cliente. Design moderno, rápidas e otimizadas para SEO.</div>
            <span className="b-tag">React</span><span className="b-tag">TailwindCSS</span><span className="b-tag">Vite</span>
          </div>
          <div className="b b2">
            <div className="b-num">02</div>
            <span className="b-icon">⚙️</span>
            <div className="b-title">Sistemas Web Personalizados</div>
            <div className="b-desc">Agendamento online, controle de estoque, gestão financeira — feitos para o fluxo real do seu negócio.</div>
            <span className="b-tag">Node.js</span><span className="b-tag">Neon PostgreSQL</span><span className="b-tag">Prisma</span>
          </div>
          <div className="b b3">
            <div className="b-num">03</div>
            <span className="b-icon">📱</span>
            <div className="b-title">Apps Mobile</div>
            <div className="b-desc">iOS e Android com React Native. Performance nativa e design moderno.</div>
            <span className="b-tag">React Native</span><span className="b-tag">Expo</span>
          </div>
          <div className="b b4">
            <div className="b-num">04</div>
            <span className="b-icon">💬</span>
            <div className="b-title">Automação WhatsApp</div>
            <div className="b-desc">Atendimento automático, captação de leads e integração com sistemas.</div>
            <span className="b-tag">API Oficial</span><span className="b-tag">Webhooks</span>
          </div>
          <div className="b b5">
            <div className="b-num">05</div>
            <span className="b-icon">🌐</span>
            <div className="b-title">Sites Institucionais</div>
            <div className="b-desc">Presença digital completa com painel de administração e blog integrado.</div>
            <span className="b-tag">CMS</span><span className="b-tag">SEO</span>
          </div>
          <div className="b b6">
            <div className="b-num">06</div>
            <span className="b-icon">🛠️</span>
            <div className="b-title">Suporte & Manutenção</div>
            <div className="b-desc">Planos mensais: backup, monitoramento e melhorias contínuas para manter seu sistema funcionando.</div>
            <span className="b-tag">24/7</span><span className="b-tag">Backup</span><span className="b-tag">Updates</span>
          </div>
          <div className="b b7" style={{display:'flex',alignItems:'center'}}>
            <div>
              <div className="b-num">Stack</div>
              <div className="b-title" style={{fontSize:'18px',marginBottom:'14px'}}>Tecnologias utilizadas</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                {['React','Node.js','TypeScript','Neon','Prisma','React Native','TailwindCSS','Vercel'].map(t => (
                  <span key={t} className="b-tag" style={{color:'var(--blue)',borderColor:'var(--blue-border)'}}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
