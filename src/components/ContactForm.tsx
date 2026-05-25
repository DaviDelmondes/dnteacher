import { useState } from "react"
import ContatoCanvas from "./ContatoCanvas"

const WA = "https://wa.me/5511999999999"

export default function ContactForm() {
  const [form, setForm] = useState({ fn: '', fp: '', fe: '', fs: '', fm: '' })
  const [sent, setSent] = useState(false)

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.id]: e.target.value }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = `Olá! Sou ${form.fn} e gostaria de um orçamento.\n\nServiço: ${form.fs}${form.fm ? '\n\nProjeto: ' + form.fm : ''}`
    window.open(`${WA}?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
    setForm({ fn: '', fp: '', fe: '', fs: '', fm: '' })
  }

  return (
    <section id="contato">
      <ContatoCanvas />
      <div className="container" style={{position:'relative',zIndex:1}}>
        <div className="contact-grid">
          <div>
            <div id="contactHead">
              <div className="s-eye">Contato</div>
              <h2>Vamos construir<br />seu projeto</h2>
              <p className="s-desc" style={{marginBottom:'40px'}}>Preencha o formulário ou fale pelo WhatsApp. Respondo em até 2h em dias úteis.</p>
            </div>
            <div className="cf"><div className="cf-icon">📱</div><div><div className="cf-label">WhatsApp</div><div className="cf-val">(11) 9XXXX-XXXX</div></div></div>
            <div className="cf"><div className="cf-icon">📧</div><div><div className="cf-label">Email</div><div className="cf-val">davi@dnteacher.dev</div></div></div>
            <div className="cf"><div className="cf-icon">📍</div><div><div className="cf-label">Localização</div><div className="cf-val">São Paulo, SP — atendo todo o Brasil</div></div></div>
            <div className="cf"><div className="cf-icon">⏰</div><div><div className="cf-label">Atendimento</div><div className="cf-val">Seg–Sex, 9h às 18h</div></div></div>
          </div>

          <div className="form-card" id="formCard">
            <div className="form-title">Solicitar orçamento</div>
            <div className="form-sub">Gratuito e sem compromisso. Resposta em até 2 horas.</div>
            <form id="cForm" onSubmit={onSubmit}>
              <div className="field-row">
                <div className="field"><label htmlFor="fn">Nome completo *</label><input type="text" id="fn" placeholder="João Silva" required value={form.fn} onChange={onChange} /></div>
                <div className="field"><label htmlFor="fp">WhatsApp *</label><input type="tel" id="fp" placeholder="(11) 99999-9999" required value={form.fp} onChange={onChange} /></div>
              </div>
              <div className="field"><label htmlFor="fe">Email</label><input type="email" id="fe" placeholder="joao@empresa.com" value={form.fe} onChange={onChange} /></div>
              <div className="field">
                <label htmlFor="fs">Serviço *</label>
                <select id="fs" required value={form.fs} onChange={onChange}>
                  <option value="">Selecione...</option>
                  <option>Landing Page</option>
                  <option>Site Completo</option>
                  <option>Sistema Web</option>
                  <option>Aplicativo Mobile</option>
                  <option>Automação WhatsApp</option>
                  <option>Suporte Técnico</option>
                  <option>Ainda não sei — quero conversar</option>
                </select>
              </div>
              <div className="field"><label htmlFor="fm">Descreva brevemente seu projeto</label><textarea id="fm" rows={4} placeholder="Ex: Preciso de um sistema de agendamento..." value={form.fm} onChange={onChange} /></div>
              <button type="submit" className="btn-submit">Enviar solicitação →</button>
              <div className="form-note">🔒 Seus dados são protegidos.</div>
              <div className={`form-ok${sent ? ' show' : ''}`} id="formOk">✅ Mensagem enviada! Entrarei em contato em breve.</div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
