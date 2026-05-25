import { useEffect, useState } from "react"

const WA_HREF = "https://wa.me/5511999999999"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <div className="nav-inner">
        <a href="#hero" className="logo" id="logo">
          DN<div className="logo-dot" />Teacher
        </a>
        <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          <li><a href="#why">Por que nós</a></li>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#nichos">Nichos</a></li>
          <li><a href="#projetos">Projetos</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a href="#contato" className="nav-cta" id="navCta">Orçamento grátis →</a>
        <button className="hamburger" id="hbg" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
