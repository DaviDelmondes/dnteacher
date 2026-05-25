import { useEffect, useRef } from "react"

const RINGS = [
  { period: 3200, phase: 0,    w: 2,   op: .5  },
  { period: 4100, phase: 1000, w: 1.5, op: .35 },
  { period: 2700, phase: 600,  w: 1,   op: .25 },
  { period: 5000, phase: 2000, w: 2.5, op: .4  },
  { period: 3600, phase: 800,  w: 1,   op: .2  },
]

export default function CtaCanvas() {
  const cvRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = cvRef.current
    const sec = document.getElementById('cta')
    if (!cv || !sec) return
    const ctx = cv.getContext('2d')!

    let W = 0, H = 0, rafId = 0, active = false, time = 0
    let particles: { x: number; y: number; vx: number; vy: number; life: number; spd: number }[] = []

    function burst() {
      const cx = W / 2, cy = H / 2
      for (let i = 0; i < 20; i++) {
        const ang = Math.random() * Math.PI * 2, spd = 1.5 + Math.random() * 3
        particles.push({ x: cx, y: cy, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 1, spd: .007 + Math.random() * .005 })
      }
    }

    function resize() { W = sec.offsetWidth; H = sec.offsetHeight; cv.width = W; cv.height = H }

    function draw() {
      if (!active) { rafId = 0; return }
      rafId = requestAnimationFrame(draw)
      time += 16
      ctx.clearRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2, maxR = Math.hypot(W, H) / 2

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 280)
      cg.addColorStop(0, `rgba(14,165,255,${.06 + .02 * Math.sin(time * .001)})`); cg.addColorStop(1, 'rgba(14,165,255,0)')
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, 280, 0, Math.PI * 2); ctx.fill()

      RINGS.forEach(r => {
        const t = ((time + r.phase) % r.period) / r.period, rad = t * maxR, op = r.op * (1 - t) * (1 - t)
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(14,165,255,${op})`; ctx.lineWidth = r.w * (1 + t * .5); ctx.stroke()
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(180,230,255,${op * .4})`; ctx.lineWidth = r.w * .4; ctx.stroke()
      })

      particles = particles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.vx *= .97; p.vy *= .97; p.life -= p.spd
        if (p.life <= 0) return false
        ctx.beginPath(); ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(14,165,255,${p.life * .8})`; ctx.fill()
        return true
      })

      const pulse = .5 + .5 * Math.sin(time * .002)
      const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 + pulse * 20)
      ng.addColorStop(0, `rgba(14,165,255,${.2 + pulse * .15})`); ng.addColorStop(1, 'rgba(14,165,255,0)')
      ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(cx, cy, 60 + pulse * 20, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = `rgba(14,165,255,${.8 + pulse * .2})`; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill()

      if (Math.floor(time / 3000) !== Math.floor((time - 16) / 3000)) burst()
    }

    function start() { if (active) return; resize(); active = true; cv.classList.add('active'); draw() }
    function stop()  { active = false; cv.classList.remove('active'); if (rafId) { cancelAnimationFrame(rafId); rafId = 0 } }

    const obs = new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop(), { threshold: .2 })
    obs.observe(sec)
    const onResize = () => { if (active) resize() }
    window.addEventListener('resize', onResize)

    return () => { stop(); obs.disconnect(); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={cvRef} className="sec-canvas" id="canvas-cta" />
}
