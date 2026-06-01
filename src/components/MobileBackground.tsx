import { useEffect, useRef } from "react"

/**
 * Fundo leve em Canvas 2D puro (sem WebGL / Three.js / bloom) para mobile.
 * - 60 partículas brancas/azuis viajando em direção à câmera (z diminui)
 * - Entrada em "warp": nos primeiros 3s a velocidade é alta e as partículas
 *   crescem rápido saindo do centro; depois assenta em velocidade normal
 * - Linhas finas entre partículas próximas dão o ar de rede neural
 */
export default function MobileBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, cx = 0, cy = 0

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      cx = w / 2
      cy = h / 2
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      canvas!.style.width = w + "px"
      canvas!.style.height = h + "px"
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const N = 60
    const MAX_Z = 1000
    const FOCAL = 320
    const LINK = 120          // distância p/ ligar partículas (px)

    type P = { x: number; y: number; z: number; blue: boolean }
    const stars: P[] = []

    const rndXY = () => ({
      x: (Math.random() - 0.5) * w * 1.6,
      y: (Math.random() - 0.5) * h * 1.6,
    })

    for (let i = 0; i < N; i++) {
      const { x, y } = rndXY()
      stars.push({ x, y, z: MAX_Z * (0.45 + Math.random() * 0.55), blue: Math.random() < 0.7 })
    }

    const t0 = performance.now()
    const WARP_MS = 3000

    const proj = new Array(N) as { sx: number; sy: number; r: number; a: number; blue: boolean }[]

    let raf = 0
    function frame(now: number) {
      raf = requestAnimationFrame(frame)

      const wt = Math.min((now - t0) / WARP_MS, 1)
      const ease = 1 - Math.pow(1 - wt, 3)        // ease-out
      const speed = 16 * (1 - ease) + 1.3 * ease  // warp alto → normal

      ctx!.clearRect(0, 0, w, h)

      for (let i = 0; i < N; i++) {
        const p = stars[i]
        p.z -= speed
        if (p.z <= 1) {
          const { x, y } = rndXY()
          p.x = x; p.y = y; p.z = MAX_Z; p.blue = Math.random() < 0.7
        }
        const k = FOCAL / p.z
        const depth = 1 - p.z / MAX_Z             // 0 longe .. 1 perto
        proj[i] = {
          sx: cx + p.x * k,
          sy: cy + p.y * k,
          r: depth * 4.5 + 0.5,
          a: Math.min(depth * 1.25, 1),
          blue: p.blue,
        }
      }

      // ── rede neural: linhas entre partículas próximas ──
      ctx!.lineWidth = 1
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = proj[i].sx - proj[j].sx
          const dy = proj[i].sy - proj[j].sy
          const d2 = dx * dx + dy * dy
          if (d2 < LINK * LINK) {
            const la = (1 - Math.sqrt(d2) / LINK) * 0.14 * Math.min(proj[i].a, proj[j].a)
            ctx!.strokeStyle = `rgba(14,165,255,${la})`
            ctx!.beginPath()
            ctx!.moveTo(proj[i].sx, proj[i].sy)
            ctx!.lineTo(proj[j].sx, proj[j].sy)
            ctx!.stroke()
          }
        }
      }

      // ── partículas (núcleo + halo translúcido) ──
      for (let i = 0; i < N; i++) {
        const p = proj[i]
        const col = p.blue ? "14,165,255" : "225,238,255"
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(${col},${p.a * 0.14})`
        ctx!.arc(p.sx, p.sy, p.r * 3, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.beginPath()
        ctx!.fillStyle = `rgba(${col},${p.a})`
        ctx!.arc(p.sx, p.sy, p.r, 0, Math.PI * 2)
        ctx!.fill()
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="three-canvas" />
}
