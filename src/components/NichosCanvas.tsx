import { useEffect, useRef } from "react"

const SYSTEMS = [
  { rings: [{ r:34,n:5,spd:.012,sz:2.2,dir:1 },{ r:66,n:8,spd:.006,sz:1.6,dir:-1 }], phase: 0 },
  { rings: [{ r:36,n:6,spd:.010,sz:2.4,dir:1 },{ r:72,n:9,spd:.005,sz:1.7,dir:-1 },{ r:108,n:4,spd:.003,sz:1.3,dir:1 }], phase: 1.2 },
  { rings: [{ r:40,n:5,spd:.007,sz:2.6,dir:1 },{ r:80,n:10,spd:.004,sz:1.8,dir:-1 },{ r:124,n:6,spd:.002,sz:1.4,dir:1 }], phase: 2.4 },
  { rings: [{ r:34,n:4,spd:.011,sz:2.2,dir:-1 },{ r:68,n:7,spd:.006,sz:1.6,dir:1 }], phase: 3.6 },
  { rings: [{ r:30,n:3,spd:.014,sz:2.0,dir:1 },{ r:58,n:5,spd:.008,sz:1.5,dir:-1 }], phase: 4.8 },
]

export default function NichosCanvas() {
  const cvRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = cvRef.current
    const sec = document.getElementById('nichos')
    if (!cv || !sec) return
    const ctx = cv.getContext('2d')!

    let W = 0, H = 0, rafId = 0, active = false, time = 0, hoveredNode = -1

    function resize() { W = sec.offsetWidth; H = sec.offsetHeight; cv.width = W; cv.height = H }
    function getPos(i: number) { return { x: W * [.1, .3, .5, .7, .9][i], y: H * .77 } }

    function drawSystem(sys: typeof SYSTEMS[0], cx: number, cy: number, idx: number) {
      const hov = hoveredNode === idx, s = hov ? 1.3 : 1, op = hov ? .9 : .55
      const maxR = (sys.rings[sys.rings.length - 1].r + 30) * s
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR)
      grd.addColorStop(0, `rgba(14,165,255,${hov ? .1 : .04})`); grd.addColorStop(1, 'rgba(14,165,255,0)')
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(cx, cy, maxR, 0, Math.PI * 2); ctx.fill()

      sys.rings.forEach(r => {
        ctx.beginPath(); ctx.arc(cx, cy, r.r * s, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(14,165,255,${hov ? .08 : .03})`; ctx.lineWidth = .8; ctx.stroke()
      })

      const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22 * s)
      ng.addColorStop(0, `rgba(14,165,255,${hov ? 1 : .8})`); ng.addColorStop(.4, `rgba(14,165,255,${hov ? .4 : .2})`); ng.addColorStop(1, 'rgba(14,165,255,0)')
      ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(cx, cy, 22 * s, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = `rgba(14,165,255,${hov ? 1 : .85})`; ctx.beginPath(); ctx.arc(cx, cy, hov ? 10 : 7, 0, Math.PI * 2); ctx.fill()

      sys.rings.forEach(ring => {
        for (let i = 0; i < ring.n; i++) {
          const ang = time * ring.spd * ring.dir * 60 + (Math.PI * 2 / ring.n) * i + sys.phase
          const px = cx + Math.cos(ang) * ring.r * s, py = cy + Math.sin(ang) * ring.r * s
          for (let t2 = 1; t2 <= 5; t2++) {
            const ta = ang - ring.dir * (t2 * .05), tx = cx + Math.cos(ta) * ring.r * s, ty = cy + Math.sin(ta) * ring.r * s
            ctx.beginPath(); ctx.arc(tx, ty, ring.sz * s * (1 - t2 * .15), 0, Math.PI * 2)
            ctx.fillStyle = `rgba(14,165,255,${op * (1 - t2 * .18)})`; ctx.fill()
          }
          ctx.beginPath(); ctx.arc(px, py, ring.sz * s, 0, Math.PI * 2); ctx.fillStyle = `rgba(14,165,255,${op})`; ctx.fill()
          const pg = ctx.createRadialGradient(px, py, 0, px, py, ring.sz * s * 4)
          pg.addColorStop(0, `rgba(14,165,255,${op * .35})`); pg.addColorStop(1, 'rgba(14,165,255,0)')
          ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, ring.sz * s * 4, 0, Math.PI * 2); ctx.fill()
        }
      })
    }

    const pulses = [
      { i: 0, j: 1, t: 0, spd: .003 }, { i: 1, j: 2, t: .33, spd: .0025 },
      { i: 2, j: 3, t: .66, spd: .003 }, { i: 3, j: 4, t: .15, spd: .0028 },
    ]

    function draw() {
      if (!active) { rafId = 0; return }
      rafId = requestAnimationFrame(draw)
      time += 1 / 60
      ctx.clearRect(0, 0, W, H)
      const positions = SYSTEMS.map((_, i) => getPos(i))
      for (let i = 0; i < 4; i++) {
        const a = positions[i], b = positions[i + 1]
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = 'rgba(14,165,255,.07)'; ctx.lineWidth = 1; ctx.stroke()
      }
      pulses.forEach(p => {
        p.t = (p.t + p.spd) % 1
        const a = positions[p.i], b = positions[p.j]
        const et = p.t < .5 ? 2 * p.t * p.t : -1 + (4 - 2 * p.t) * p.t
        const px = a.x + (b.x - a.x) * et, py = a.y + (b.y - a.y) * et
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 8)
        pg.addColorStop(0, 'rgba(14,165,255,.9)'); pg.addColorStop(1, 'rgba(14,165,255,0)')
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = 'rgba(14,165,255,.95)'; ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill()
      })
      SYSTEMS.forEach((sys, i) => { const { x, y } = positions[i]; drawSystem(sys, x, y, i) })
    }

    function start() { if (active) return; resize(); active = true; cv.classList.add('active'); draw() }
    function stop()  { active = false; cv.classList.remove('active'); if (rafId) { cancelAnimationFrame(rafId); rafId = 0 } }

    const obs = new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop(), { threshold: .1 })
    obs.observe(sec)
    const onResize = () => { if (active) resize() }
    window.addEventListener('resize', onResize)

    function setupHover() {
      document.querySelectorAll<HTMLElement>('.nicho-card[data-node]').forEach(card => {
        const idx = Number(card.dataset.node)
        card.addEventListener('mouseenter', () => hoveredNode = idx)
        card.addEventListener('mouseleave', () => hoveredNode = -1)
      })
    }
    setupHover()

    return () => { stop(); obs.disconnect(); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={cvRef} className="sec-canvas" id="canvas-nichos" />
}
