import { useState } from "react"

const faqs = [
  { q: "Quanto custa uma landing page?",     a: "Valores variam conforme complexidade. Landing pages partem de R$600. Solicite um orçamento gratuito para um valor específico." },
  { q: "Qual o prazo de entrega?",           a: "Landing pages: 5 a 10 dias. Sites: 15 a 25 dias. Sistemas: 30 a 60 dias. Apps: 45 a 90 dias." },
  { q: "Preciso saber programar para usar?", a: "Não. Painel administrativo intuitivo entregue com treinamento e documentação completos." },
  { q: "E se precisar de ajustes depois?",   a: "30 dias de suporte gratuito inclusos. Após isso, planos mensais de manutenção para melhorias contínuas." },
  { q: "Atende fora de São Paulo?",          a: "Sim! Atendo todo o Brasil 100% remoto. Reuniões, aprovações e entregas totalmente online." },
  { q: "O site fica hospedado onde?",        a: "Vercel (frontend) e Neon PostgreSQL (banco) — ambos gratuitos. Auxílio completo com domínio no Registro.br." },
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq">
      <div className="container">
        <div id="faqHead" style={{textAlign:'center',marginBottom:0}}>
          <div className="s-eye" style={{justifyContent:'center'}}>FAQ</div>
          <h2>Perguntas frequentes</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item${open === i ? ' open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
              <div className="faq-q">
                {faq.q}
                <div className="faq-chev">▾</div>
              </div>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
