const WA = "https://wa.me/5511999999999"

const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Hero() {
  return (
    <section id="hero">
      <div className="container">
        <div className="hero-inner">
          <div>
            <div className="hero-badge" id="heroBadge">
              <div className="badge-dot" />Disponível para novos projetos
            </div>
            <h1 id="heroH1">
              <span className="h1-line"><span className="h1-word" id="hw0">Tecnologia</span></span>
              <span className="h1-line"><span className="h1-word" id="hw1">que faz</span></span>
              <span className="h1-line"><span className="h1-word" id="hw2"><em>negócios</em></span></span>
              <span className="h1-line"><span className="h1-word" id="hw3">crescerem.</span></span>
            </h1>
            <p className="hero-sub" id="heroSub">
              Sites, sistemas e automações criados sob medida para pequenas empresas que querem resultados reais no mundo digital.
            </p>
            <div className="hero-btns" id="heroBtns">
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-main" id="btn1">
                {WA_ICON}Falar no WhatsApp
              </a>
              <a href="#projetos" className="btn-sec" id="btn2">Ver projetos →</a>
            </div>
            <div className="hero-stats" id="heroStats">
              <div><div className="stat-num" data-count="6" data-suf="">0</div><div className="stat-label">Serviços disponíveis</div></div>
              <div><div className="stat-num" data-count="5" data-suf="">0</div><div className="stat-label">Nichos atendidos</div></div>
              <div><div className="stat-num" data-count="100" data-suf="%">0%</div><div className="stat-label">Foco em resultado</div></div>
            </div>
          </div>

          <div className="hero-right" id="heroRight">
            <div className="terminal">
              <div className="term-bar">
                <div className="td td1" /><div className="td td2" /><div className="td td3" />
                <div className="term-file">~/dnteacher/projeto.ts</div>
              </div>
              <div className="term-body">
                <div className="tl"><span className="c">// DN Teacher — stack tecnológica</span></div>
                <div className="tl-blank" />
                <div className="tl"><span className="k">interface</span> <span style={{color:'#82b1ff'}}>Solucao</span> {'{'}</div>
                <div className="tl">&nbsp;&nbsp;tipo: <span className="s">'site'</span> | <span className="s">'sistema'</span> | <span className="s">'app'</span>;</div>
                <div className="tl">&nbsp;&nbsp;prazo: <span className="k">number</span>;&nbsp;<span className="c">// dias</span></div>
                <div className="tl">&nbsp;&nbsp;resultado: <span className="s">'crescimento'</span>;</div>
                <div className="tl">{'}'}</div>
                <div className="tl-blank" />
                <div className="tl"><span className="k">const</span> projeto = <span className="k">await</span> DN.build({'{'}</div>
                <div className="tl">&nbsp;&nbsp;banco: <span className="s">'Neon PostgreSQL'</span>,</div>
                <div className="tl">&nbsp;&nbsp;deploy: <span className="s">'Vercel'</span>,&nbsp;<span className="c">// grátis</span></div>
                <div className="tl">&nbsp;&nbsp;prazo: <span className="n">30</span>,</div>
                <div className="tl">{'}'});</div>
                <div className="tl-blank" />
                <div className="tl"><span className="ok">✓ Deploy realizado com sucesso!</span><span className="cursor" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
