import { useEffect, useRef } from "react"

export default function ContatoCanvas() {
  const cvRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = cvRef.current
    const sec = document.getElementById('contato')
    if (!cv || !sec) return
    const ctx = cv.getContext('2d')!

    let W = 0, H = 0, rafId = 0, active = false, angle = 0
    let dots: { x: number; y: number; life: number; spd: number }[] = []

    function resize() { W = sec.offsetWidth; H = sec.offsetHeight; cv.width = W; cv.height = H }

    function draw() {
      if (!active) { rafId = 0; return }
      rafId = requestAnimationFrame(draw)
      angle += .008
      ctx.clearRect(0, 0, W, H)
      const cx = W * .25, cy = H * .5, maxR = Math.min(W * .35, H * .7)

      for (let i = 1; i <= 5; i++) {
        ctx.beginPath(); ctx.arc(cx, cy, maxR * (i / 5), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(14,165,255,${.04 + i * .01})`; ctx.lineWidth = .8; ctx.stroke()
      }

      ctx.save()
      for (let i = 0; i < 40; i++) {
        const a = angle - Math.PI * .6 * (i / 40)
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, maxR, a, a + Math.PI * .6 / 40); ctx.closePath()
        ctx.fillStyle = `rgba(14,165,255,${(1 - i / 40) * .12})`; ctx.fill()
      }
      ctx.restore()

      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR)
      ctx.strokeStyle = 'rgba(14,165,255,.55)'; ctx.lineWidth = 1.5; ctx.stroke()

      if (Math.sin(angle * 3) > .96 && dots.length < 20)
        dots.push({ x: cx + Math.cos(angle) * (maxR * .2 + Math.random() * maxR * .7), y: cy + Math.sin(angle) * (maxR * .2 + Math.random() * maxR * .7), life: 1, spd: .008 + Math.random() * .006 })

      dots = dots.filter(d => {
        d.life -= d.spd; if (d.life <= 0) return false
        const r = 6 * (1 - d.life) + 2
        ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(14,165,255,${d.life * .8})`; ctx.lineWidth = 1; ctx.stroke()
        ctx.beginPath(); ctx.arc(d.x, d.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(14,165,255,${d.life})`; ctx.fill()
        return true
      })

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20)
      cg.addColorStop(0, 'rgba(14,165,255,.6)'); cg.addColorStop(1, 'rgba(14,165,255,0)')
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(14,165,255,.9)'; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill()
    }

    function start() { if (active) return; resize(); active = true; cv.classList.add('active'); draw() }
    function stop()  { active = false; cv.classList.remove('active'); if (rafId) { cancelAnimationFrame(rafId); rafId = 0 } }

    const obs = new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop(), { threshold: .15 })
    obs.observe(sec)
    const onResize = () => { if (active) resize() }
    window.addEventListener('resize', onResize)

    return () => { stop(); obs.disconnect(); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={cvRef} className="sec-canvas" id="canvas-contato" />
}
