const items = [
  "Landing Pages","Sistemas Web","Apps Mobile","Automação WhatsApp",
  "React & Node.js","Neon PostgreSQL","Deploy Vercel","React Native",
  "Suporte Técnico","Pequenos Negócios",
]

export default function Ticker() {
  const double = [...items, ...items]
  return (
    <div className="ticker-wrap" id="ticker">
      <div className="ticker-track">
        {double.map((item, i) => (
          <span key={i} className="t-item">
            {item} <span className="t-sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
