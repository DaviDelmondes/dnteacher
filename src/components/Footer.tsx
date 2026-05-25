const WA = "https://wa.me/5511999999999"

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">DN<div className="logo-dot" style={{marginBottom:'5px',marginLeft:'2px'}} />Teacher</div>
            <div className="foot-tagline">Tecnologia acessível para pequenos negócios crescerem no mundo digital.</div>
          </div>
          <div className="foot-col">
            <div className="foot-col-title">Serviços</div>
            <ul>
              <li><a href="#servicos">Landing Pages</a></li>
              <li><a href="#servicos">Sistemas Web</a></li>
              <li><a href="#servicos">Apps Mobile</a></li>
              <li><a href="#servicos">Automação WhatsApp</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <div className="foot-col-title">Empresa</div>
            <ul>
              <li><a href="#why">Sobre</a></li>
              <li><a href="#processo">Como funciona</a></li>
              <li><a href="#projetos">Projetos</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <div className="foot-col-title">Contato</div>
            <ul>
              <li><a href={WA} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="mailto:davi@dnteacher.dev">Email</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="foot-copy">© 2025 DN Teacher · Davi Nascimento</div>
          <div className="foot-socials">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">in</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">gh</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">ig</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
