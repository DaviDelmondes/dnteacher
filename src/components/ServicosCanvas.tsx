import { useEffect, useRef } from "react"

export default function ServicosCanvas() {
  const cvRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = cvRef.current
    const sec = document.getElementById('servicos')
    if (!cv || !sec) return
    const ctx = cv.getContext('2d')!

    let W = 0, H = 0, rafId = 0, active = false, time = 0
    let nodes: { x: number; y: number; ph: number; spd: number }[] = []
    let traces: { ax: number; ay: number; bx: number; by: number; t: number; spd: number }[] = []
    const HEX = 70, H3 = HEX * Math.sqrt(3)

    function buildGrid() {
      nodes = []
      for (let col = -1; col < Math.ceil(W / (HEX * 1.5)) + 2; col++)
        for (let row = -1; row < Math.ceil(H / H3) + 2; row++)
          nodes.push({
            x: col * HEX * 1.5,
            y: row * H3 + (col % 2) * H3 / 2,
            ph: Math.random() * Math.PI * 2,
            spd: .008 + Math.random() * .006,
          })
    }

    function spawnTrace() {
      if (nodes.length < 2) return
      const a = Math.floor(Math.random() * nodes.length)
      const b = Math.floor(Math.random() * nodes.length)
      if (a !== b) traces.push({ ax: nodes[a].x, ay: nodes[a].y, bx: nodes[b].x, by: nodes[b].y, t: 0, spd: .004 + Math.random() * .004 })
    }

    function resize() {
      W = sec.offsetWidth; H = sec.offsetHeight
      cv.width = W; cv.height = H
      buildGrid(); traces = []
      for (let i = 0; i < 8; i++) spawnTrace()
    }

    function draw() {
      if (!active) { rafId = 0; return }
      rafId = requestAnimationFrame(draw)
      time += 1 / 60
      ctx.clearRect(0, 0, W, H)

      nodes.forEach(n => {
        const p = .5 + .5 * Math.sin(time * n.spd * 60 + n.ph)
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(14,165,255,${.04 + p * .08})`; ctx.fill()
      })

      traces = traces.filter(tr => {
        tr.t += tr.spd
        if (tr.t > 1.3) { spawnTrace(); return false }
        const et = Math.min(tr.t < .5 ? 2 * tr.t * tr.t : -1 + (4 - 2 * tr.t) * tr.t, .99)
        const ex = tr.ax + (tr.bx - tr.ax) * et, ey = tr.ay + (tr.by - tr.ay) * et
        ctx.beginPath(); ctx.moveTo(tr.ax, tr.ay); ctx.lineTo(ex, ey)
        ctx.strokeStyle = 'rgba(14,165,255,.18)'; ctx.lineWidth = 1.2; ctx.stroke()
        ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(14,165,255,.7)'; ctx.fill()
        return true
      })
    }

    function start() { if (active) return; resize(); active = true; cv.classList.add('active'); draw() }
    function stop()  { active = false; cv.classList.remove('active'); if (rafId) { cancelAnimationFrame(rafId); rafId = 0 } }

    const obs = new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop(), { threshold: .1 })
    obs.observe(sec)
    const onResize = () => { if (active) resize() }
    window.addEventListener('resize', onResize)

    return () => { stop(); obs.disconnect(); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={cvRef} className="sec-canvas" id="canvas-servicos" />
}
