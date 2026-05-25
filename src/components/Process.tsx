export default function Process() {
  return (
    <section id="processo">
      <div className="container">
        <div id="procHead" style={{textAlign:'center'}}>
          <div className="s-eye" style={{justifyContent:'center'}}>Como funciona</div>
          <h2>Do orçamento ao deploy<br />em 4 etapas</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-n">1</div>
            <div className="step-title">Diagnóstico gratuito</div>
            <div className="step-desc">Conversa pelo WhatsApp para entender seu negócio e qual solução faz mais sentido.</div>
          </div>
          <div className="step">
            <div className="step-n">2</div>
            <div className="step-title">Proposta e briefing</div>
            <div className="step-desc">Proposta detalhada com escopo, prazo e valor. Sem surpresas no meio do projeto.</div>
          </div>
          <div className="step">
            <div className="step-n">3</div>
            <div className="step-title">Desenvolvimento</div>
            <div className="step-desc">Atualizações frequentes. Você acompanha tudo em tempo real.</div>
          </div>
          <div className="step">
            <div className="step-n">4</div>
            <div className="step-title">Entrega e suporte</div>
            <div className="step-desc">Deploy, treinamento de uso e suporte pós-entrega inclusos.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
