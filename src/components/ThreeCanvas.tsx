import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

// Parâmetros de animação por seção: zm=velocidade Z, sw=redemoinho, lo=opacidade linhas
const MODES: Record<string, { zm: number; sw: number; lo: number }> = {
  hero:     { zm: 1.0,  sw: 0.0,  lo: .11 },
  why:      { zm: .35,  sw: .30,  lo: .15 },
  servicos: { zm: .55,  sw: .40,  lo: .09 },
  nichos:   { zm: .12,  sw: .85,  lo: .20 },
  processo: { zm: 1.1,  sw: .04,  lo: .07 },
  projetos: { zm: .45,  sw: .20,  lo: .12 },
  contato:  { zm: .22,  sw: .55,  lo: .17 },
  faq:      { zm: .38,  sw: .15,  lo: .11 },
  cta:      { zm: 2.6,  sw: 0.0,  lo: .04 },
}

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    // ── SCENE & CAMERA ──
    const scene  = new THREE.Scene()
    const FOV    = 78
    const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 1400)
    camera.position.set(0, 0, 0)

    // ── CONSTANTS ──
    const N          = 280
    const HUB_N      = 10
    const Z_NEAR_P   = 8
    const Z_FAR_P    = 950
    const HALF_FOV   = (FOV * Math.PI / 180) / 2
    const CONNECT_D  = 140
    const HUB_CONN_D = 230
    const MAX_LINES  = 700
    const FLOW_N     = 14

    const pos    = new Float32Array(N * 3)
    const vel    = new Float32Array(N * 3)
    const baseVZ = new Float32Array(N)      // velocidade Z base (multiplicada por czm)
    const aSz    = new Float32Array(N)
    const aCl    = new Float32Array(N * 3)
    const pPhase = new Float32Array(N)
    const pSpd   = new Float32Array(N)
    const isHub  = new Uint8Array(N)

    // ── MODO REATIVO AO SCROLL ──
    let czm = 1.0, csw = 0.0, clo = .11   // valores interpolados atuais
    let tzm = 1.0, tsw = 0.0, tlo = .11   // valores alvo

    function spawnAt(i: number, z?: number) {
      const zz    = z !== undefined ? z : -(Z_NEAR_P + Math.random() * (Z_FAR_P - Z_NEAR_P))
      const depth  = Math.abs(zz)
      const aspect = window.innerWidth / window.innerHeight
      const halfW  = depth * Math.tan(HALF_FOV) * 1.35
      const halfH  = halfW / aspect

      pos[i*3]   = (Math.random() - .5) * 2 * halfW
      pos[i*3+1] = (Math.random() - .5) * 2 * halfH
      pos[i*3+2] = zz

      baseVZ[i]  = isHub[i] ? .09 + Math.random() * .12 : .20 + Math.random() * .38
      vel[i*3]   = (Math.random() - .5) * .05
      vel[i*3+1] = (Math.random() - .5) * .05
    }

    for (let i = 0; i < N; i++) {
      isHub[i]  = i < HUB_N ? 1 : 0
      pPhase[i] = Math.random() * Math.PI * 2
      pSpd[i]   = .01 + Math.random() * .022

      if (isHub[i]) {
        aSz[i]     = 7 + Math.random() * 5
        aCl[i*3]   = .08; aCl[i*3+1] = .75; aCl[i*3+2] = 1.0
      } else {
        aSz[i]     = 1.8 + Math.random() * 2.8
        aCl[i*3]   = .03 + Math.random() * .09
        aCl[i*3+1] = .44 + Math.random() * .28
        aCl[i*3+2] = .88 + Math.random() * .12
      }
      spawnAt(i)
    }

    // ── PARTICLE GEOMETRY + SHADER ──
    const ptGeo  = new THREE.BufferGeometry()
    const pA     = new THREE.BufferAttribute(pos, 3);  pA.setUsage(THREE.DynamicDrawUsage)
    const szA    = new THREE.BufferAttribute(aSz, 1);  szA.setUsage(THREE.DynamicDrawUsage)
    const clA    = new THREE.BufferAttribute(aCl, 3);  clA.setUsage(THREE.DynamicDrawUsage)
    ptGeo.setAttribute('position', pA)
    ptGeo.setAttribute('aSize',    szA)
    ptGeo.setAttribute('aColor',   clA)

    const ptMat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aSize;
        attribute vec3  aColor;
        varying   vec3  vColor;
        varying   float vOp;
        void main(){
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          float depth = -mv.z;
          vOp = clamp(1.8 - depth/800.0, 0.05, 1.0);
          gl_PointSize = aSize * (280.0 / max(depth,1.0));
          gl_PointSize = clamp(gl_PointSize, 1.0, 40.0);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3  vColor;
        varying float vOp;
        void main(){
          vec2  uv   = gl_PointCoord - vec2(0.5);
          float dist = length(uv);
          if(dist > 0.5) discard;
          float core = 1.0 - dist * 2.0;
          float glow = pow(core, 1.5);
          float halo = pow(max(0.0, 1.0 - dist*1.4), 0.4) * 0.3;
          gl_FragColor = vec4(vColor, (glow + halo) * vOp);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.Points(ptGeo, ptMat))

    // ── LINE CONNECTIONS ──
    const lBuf  = new Float32Array(MAX_LINES * 6)
    const lGeo  = new THREE.BufferGeometry()
    const lPosA = new THREE.BufferAttribute(lBuf, 3); lPosA.setUsage(THREE.DynamicDrawUsage)
    lGeo.setAttribute('position', lPosA)
    const lMat  = new THREE.LineBasicMaterial({
      color: 0x0ea5ff, transparent: true, opacity: .11,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    scene.add(new THREE.LineSegments(lGeo, lMat))

    // ── FLOW PULSES ──
    const fBuf  = new Float32Array(FLOW_N * 3)
    const fGeo  = new THREE.BufferGeometry()
    const fPosA = new THREE.BufferAttribute(fBuf, 3); fPosA.setUsage(THREE.DynamicDrawUsage)
    fGeo.setAttribute('position', fPosA)
    const fMat  = new THREE.ShaderMaterial({
      vertexShader: `
        void main(){
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = 5.5 * (280.0 / max(-mv.z,1.0));
          gl_PointSize = clamp(gl_PointSize, 2.0, 18.0);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        void main(){
          vec2  uv   = gl_PointCoord - 0.5;
          float dist = length(uv);
          if(dist > 0.5) discard;
          float g = pow(1.0 - dist*2.0, 2.2);
          gl_FragColor = vec4(0.6, 0.92, 1.0, g*0.95);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.Points(fGeo, fMat))

    let activeEdges: [number, number][] = []
    const flows = Array.from({ length: FLOW_N }, () => ({
      a: Math.floor(Math.random() * N),
      b: Math.floor(Math.random() * N),
      t: Math.random(),
      spd: .005 + Math.random() * .009,
    }))

    // ── INTERSECTION OBSERVER — detecta seção visível e troca modo ──
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const m = MODES[e.target.id] ?? MODES.hero
          tzm = m.zm; tsw = m.sw; tlo = m.lo
        }
      })
    }, { threshold: .3 })
    ;['hero','why','servicos','nichos','processo','projetos','contato','faq','cta']
      .forEach(id => { const el = document.getElementById(id); if (el) secObs.observe(el) })

    // ── MOUSE — tilta a câmera (parallax) ──
    let tRX = 0, tRY = 0, cRX = 0, cRY = 0

    const onMouseMove = (e: MouseEvent) => {
      tRX = -((e.clientY / window.innerHeight) * 2 - 1) * .14
      tRY = -((e.clientX / window.innerWidth)  * 2 - 1) * .18
    }
    const onTouchMove = (e: TouchEvent) => {
      tRX = -((e.touches[0].clientY / window.innerHeight) * 2 - 1) * .14
      tRY = -((e.touches[0].clientX / window.innerWidth)  * 2 - 1) * .18
    }
    const onMouseLeave = () => { tRX = 0; tRY = 0 }
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }

    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('touchmove',  onTouchMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize',     onResize)

    let rafId = 0

    function animate() {
      rafId = requestAnimationFrame(animate)

      // 1. Interpolar suavemente para o modo alvo
      czm += (tzm - czm) * .018
      csw += (tsw - csw) * .018
      clo += (tlo - clo) * .018
      lMat.opacity = clo

      // 2. Mover partículas — velocidade Z controlada por czm, swirl controlado por csw
      for (let i = 0; i < N; i++) {
        pos[i*3+2] += baseVZ[i] * czm

        const px = pos[i*3], py = pos[i*3+1]
        const r2 = Math.sqrt(px*px + py*py) || 1
        pos[i*3]   += vel[i*3]   + (-py / r2) * csw * .5
        pos[i*3+1] += vel[i*3+1] + ( px / r2) * csw * .5

        if (pos[i*3+2] > -5) {
          spawnAt(i, -(Z_FAR_P * .55 + Math.random() * Z_FAR_P * .45))
        }

        pPhase[i] += pSpd[i]
        const p = .5 + .5 * Math.sin(pPhase[i])

        if (isHub[i]) {
          aSz[i]     = (7 + Math.random() * 5) * (.6 + p * .75)
          aCl[i*3+1] = .6  + p * .32
          aCl[i*3+2] = .88 + p * .12
        } else {
          aSz[i] = (1.8 + Math.random() * 2.8) * (.82 + p * .28)
        }
      }
      pA.needsUpdate = true; szA.needsUpdate = true; clA.needsUpdate = true

      // 3. Conexões dinâmicas
      let lc = 0
      activeEdges = []
      outer: for (let i = 0; i < N; i++) {
        const rng = isHub[i] ? HUB_CONN_D : CONNECT_D
        for (let j = i + 1; j < N; j++) {
          const dx = pos[i*3]-pos[j*3], dy = pos[i*3+1]-pos[j*3+1], dz = pos[i*3+2]-pos[j*3+2]
          const d   = Math.sqrt(dx*dx + dy*dy + dz*dz)
          const thr = isHub[j] ? HUB_CONN_D : rng
          if (d < thr) {
            const o = lc * 6
            lBuf[o]=pos[i*3]; lBuf[o+1]=pos[i*3+1]; lBuf[o+2]=pos[i*3+2]
            lBuf[o+3]=pos[j*3]; lBuf[o+4]=pos[j*3+1]; lBuf[o+5]=pos[j*3+2]
            activeEdges.push([i, j])
            if (++lc >= MAX_LINES) break outer
          }
        }
      }
      lPosA.needsUpdate = true
      lGeo.setDrawRange(0, lc * 2)

      // 4. Flow pulses
      for (let f = 0; f < flows.length; f++) {
        const fl = flows[f]
        fl.t += fl.spd
        if (fl.t >= 1) {
          if (activeEdges.length > 0) {
            const e = activeEdges[Math.floor(Math.random() * activeEdges.length)]
            fl.a = e[0]; fl.b = e[1]
            if (Math.random() > .5) { [fl.a, fl.b] = [fl.b, fl.a] }
          }
          fl.t = 0; fl.spd = .005 + Math.random() * .009
        }
        const t  = fl.t
        const et = t < .5 ? 2*t*t : -1+(4-2*t)*t
        const ai = fl.a*3, bi = fl.b*3
        fBuf[f*3]   = pos[ai]   + (pos[bi]   - pos[ai])   * et
        fBuf[f*3+1] = pos[ai+1] + (pos[bi+1] - pos[ai+1]) * et
        fBuf[f*3+2] = pos[ai+2] + (pos[bi+2] - pos[ai+2]) * et
      }
      fPosA.needsUpdate = true

      // 5. Tiltar câmera com lerp suave
      cRX += (tRX - cRX) * .045
      cRY += (tRY - cRY) * .045
      camera.rotation.order = 'YXZ'
      camera.rotation.x = cRX
      camera.rotation.y = cRY

      renderer.render(scene, camera)
    }

    const t = setTimeout(() => setReady(true), 2200)
    animate()

    return () => {
      clearTimeout(t)
      cancelAnimationFrame(rafId)
      secObs.disconnect()
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize',     onResize)
      renderer.dispose()
      ptGeo.dispose(); ptMat.dispose()
      lGeo.dispose();  lMat.dispose()
      fGeo.dispose();  fMat.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-[2000ms] ${ready ? "opacity-100" : "opacity-0"}`}
    />
  )
}
