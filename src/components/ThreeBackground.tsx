import { useEffect, useRef } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CustomEase } from "gsap/CustomEase"
gsap.registerPlugin(ScrollTrigger, CustomEase)

const MODES: Record<string, { zm: number; sw: number; lo: number }> = {
  hero:     { zm: 1.0,  sw: 0.0,  lo: .11 },
  why:      { zm: .35,  sw: .30,  lo: .15 },
  servicos: { zm: .55,  sw: 0.5,  lo: .09 },
  nichos:   { zm: .12,  sw: 0.9,  lo: .20 },
  processo: { zm: 1.1,  sw: .04,  lo: .07 },
  projetos: { zm: .45,  sw: .20,  lo: .12 },
  contato:  { zm: .22,  sw: .55,  lo: .17 },
  faq:      { zm: .38,  sw: .15,  lo: .11 },
  cta:      { zm: 2.5,  sw: 0.0,  lo: .04 },
}

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0, 0)

    const scene  = new THREE.Scene()
    const FOV    = 78
    const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 1400)
    camera.position.set(0, 0, 0)

    const N = isMobile ? 200 : 400, HUB_N = isMobile ? 9 : 18, Z_NEAR = 8, Z_FAR = 1100
    const HALF_FOV = (FOV * Math.PI / 180) / 2
    const MAX_LINES = isMobile ? 700 : 1400, FLOW_N = 28

    const pos    = new Float32Array(N * 3)
    const vel    = new Float32Array(N * 3)
    const baseVZ = new Float32Array(N)
    const aSz    = new Float32Array(N)
    const aCl    = new Float32Array(N * 3)
    const pPh    = new Float32Array(N)
    const pSp    = new Float32Array(N)
    const isHub  = new Uint8Array(N)

    let czm = 1.0, csw = 0.0, clo = .11
    let tzm = 1.0, tsw = 0.0, tlo = .11
    const baseCamZ = 0
    const cameraTarget = { z: 0, rotateY: 0 }

    function spawnAt(i: number, z?: number) {
      const zz = z !== undefined ? z : -(Z_NEAR + Math.random() * (Z_FAR - Z_NEAR))
      const d = Math.abs(zz), asp = window.innerWidth / window.innerHeight
      const hw = d * Math.tan(HALF_FOV) * 1.35, hh = hw / asp
      pos[i*3]   = (Math.random() - .5) * 2 * hw
      pos[i*3+1] = (Math.random() - .5) * 2 * hh
      pos[i*3+2] = zz
      baseVZ[i]  = (isHub[i] ? .09 : .20) + Math.random() * (isHub[i] ? .12 : .38)
      vel[i*3]   = (Math.random() - .5) * .05
      vel[i*3+1] = (Math.random() - .5) * .05
    }

    for (let i = 0; i < N; i++) {
      isHub[i] = i < HUB_N ? 1 : 0
      pPh[i]   = Math.random() * Math.PI * 2
      pSp[i]   = .01 + Math.random() * .022
      if (isHub[i]) {
        aSz[i] = 7 + Math.random() * 5
        aCl[i*3] = .08; aCl[i*3+1] = .75; aCl[i*3+2] = 1
      } else {
        aSz[i] = 1.8 + Math.random() * 2.8
        aCl[i*3] = .03 + Math.random() * .09
        aCl[i*3+1] = .44 + Math.random() * .28
        aCl[i*3+2] = .88 + Math.random() * .12
      }
      spawnAt(i)
    }

    const ptGeo = new THREE.BufferGeometry()
    const pA = new THREE.BufferAttribute(pos, 3); pA.setUsage(THREE.DynamicDrawUsage)
    const sA = new THREE.BufferAttribute(aSz, 1); sA.setUsage(THREE.DynamicDrawUsage)
    const cA = new THREE.BufferAttribute(aCl, 3); cA.setUsage(THREE.DynamicDrawUsage)
    ptGeo.setAttribute('position', pA)
    ptGeo.setAttribute('aSize',    sA)
    ptGeo.setAttribute('aColor',   cA)

    const ptMat = new THREE.ShaderMaterial({
      uniforms: { uWarp: { value: 1.0 } },
      vertexShader: `uniform float uWarp;attribute float aSize;attribute vec3 aColor;varying vec3 vC;varying float vO;
        void main(){vC=aColor;vec4 mv=modelViewMatrix*vec4(position,1.0);float d=-mv.z;
        vO=clamp(1.8-d/800.0,0.05+uWarp*0.7,1.0);gl_PointSize=aSize*(280.0/max(d,1.0))*(1.0+uWarp*12.0);
        gl_PointSize=clamp(gl_PointSize,0.5,120.0);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `uniform float uWarp;varying vec3 vC;varying float vO;
        void main(){vec2 u=gl_PointCoord-vec2(0.5);float d=length(u);if(d>.5)discard;
        float g=pow(1.0-d*2.0,1.5);float h=pow(max(0.0,1.0-d*1.4),0.4)*0.3;
        vec3 warpColor=mix(vC,vec3(0.8,0.9,1.0),uWarp*0.8);
        gl_FragColor=vec4(warpColor,(g+h)*vO);}`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    scene.add(new THREE.Points(ptGeo, ptMat))

    const lBuf = new Float32Array(MAX_LINES * 6)
    const lGeo = new THREE.BufferGeometry()
    const lPA  = new THREE.BufferAttribute(lBuf, 3); lPA.setUsage(THREE.DynamicDrawUsage)
    lGeo.setAttribute('position', lPA)
    const lMat = new THREE.LineBasicMaterial({
      color: 0x0ea5ff, transparent: true, opacity: .11,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    scene.add(new THREE.LineSegments(lGeo, lMat))

    const fBuf = new Float32Array(FLOW_N * 3)
    const fGeo = new THREE.BufferGeometry()
    const fPA  = new THREE.BufferAttribute(fBuf, 3); fPA.setUsage(THREE.DynamicDrawUsage)
    fGeo.setAttribute('position', fPA)
    const fMat = new THREE.ShaderMaterial({
      vertexShader: `void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=5.5*(280.0/max(-mv.z,1.0));gl_PointSize=clamp(gl_PointSize,2.0,18.0);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `void main(){vec2 u=gl_PointCoord-.5;float d=length(u);if(d>.5)discard;gl_FragColor=vec4(0.6,0.92,1.0,pow(1.0-d*2.0,2.2)*.95);}`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    scene.add(new THREE.Points(fGeo, fMat))

    let aEdges: [number, number][] = []
    const flows = Array.from({ length: FLOW_N }, () => ({
      a: Math.floor(Math.random() * N), b: Math.floor(Math.random() * N),
      t: Math.random(), spd: .005 + Math.random() * .009,
    }))

    const SECTION_IDS = ['hero','why','servicos','nichos','processo','projetos','contato','faq','cta']
    function detectSection() {
      let best = 'hero', bestVis = 0
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id); if (!el) continue
        const { top, bottom, height } = el.getBoundingClientRect()
        const vis = Math.max(0, Math.min(bottom, window.innerHeight) - Math.max(top, 0)) / height
        if (vis > bestVis) { bestVis = vis; best = id }
      }
      const m = MODES[best] ?? MODES.hero; tzm = m.zm; tsw = m.sw; tlo = m.lo
    }
    const onScroll = () => detectSection()
    window.addEventListener('scroll', onScroll, { passive: true })
    detectSection()

    let tRX = 0, tRY = 0, cRX = 0, cRY = 0

    const onMM = (e: MouseEvent) => { tRX = -((e.clientY/window.innerHeight)*2-1)*.14; tRY = -((e.clientX/window.innerWidth)*2-1)*.18 }
    const onML = () => { tRX = 0; tRY = 0 }
    const onR  = () => { renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix() }

    window.addEventListener('mousemove', onMM)
    window.addEventListener('mouseleave', onML)
    window.addEventListener('resize', onR)

    // ── WARP INTERSTELAR ──
    const warp = { speed: isMobile ? 1.0 : 32.0, stretch: isMobile ? 0.0 : 2.0 }
    let warpActive = !isMobile
    let warpTimeline: gsap.core.Timeline
    if (!isMobile) {
      camera.far = 16000
      camera.position.z = 12000
      camera.fov = 130
      camera.updateProjectionMatrix()
      warpTimeline = gsap.timeline({
        delay: 1.2,
        onComplete: () => { warpActive = false },
      })
      .to(camera.position, { z: 0, duration: 10.0, ease: 'expo.out' }, 0)
      .to(camera, {
        fov: 78, duration: 10.0,
        ease: 'expo.out',
        onUpdate: () => camera.updateProjectionMatrix(),
      }, 0)
      .to(warp, { speed: 1.0, duration: 9.0, ease: 'expo.out' }, 0)
      .to(warp, { stretch: 0.0, duration: 8.0, ease: 'expo.out' }, 0)
      .to(ptMat.uniforms.uWarp, { value: 0.0, duration: 8.0, ease: 'expo.out' }, 0)
    } else {
      ptMat.uniforms.uWarp.value = 0.0
      warpTimeline = gsap.timeline()
    }

    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      }
    })
    .to(cameraTarget, { z: -200, duration: 3 })
    .to(cameraTarget, { rotateY: 0.8, duration: 2 })
    .to(cameraTarget, { z: -400, duration: 3 })
    .to(cameraTarget, { rotateY: -0.4, duration: 2 })

    let rafId = 0
    function animate() {
      rafId = requestAnimationFrame(animate)
      czm += (tzm - czm) * .018
      csw += (tsw - csw) * .018
      clo += (tlo - clo) * .018
      lMat.opacity = clo

      for (let i = 0; i < N; i++) {
        pos[i*3+2] += baseVZ[i] * czm * warp.speed
        const px = pos[i*3], py = pos[i*3+1], r2 = Math.sqrt(px*px+py*py) || 1
        pos[i*3]   += vel[i*3]   + (-py/r2) * csw * .5
        pos[i*3+1] += vel[i*3+1] + ( px/r2) * csw * .5
        if (pos[i*3+2] > -5) spawnAt(i, -(Z_FAR*.55 + Math.random()*Z_FAR*.45))
        pPh[i] += pSp[i]; const p = .5 + .5*Math.sin(pPh[i])
        if (isHub[i]) { aSz[i] = (7+Math.random()*5)*(.6+p*.75); aCl[i*3+1] = .6+p*.32 }
        else           { aSz[i] = (1.8+Math.random()*2.8)*(.82+p*.28) }
      }
      pA.needsUpdate = true; sA.needsUpdate = true; cA.needsUpdate = true

      let lc = 0; aEdges = []
      outer: for (let i = 0; i < N; i++) {
        const rng = isHub[i] ? 300 : 185
        for (let j = i+1; j < N; j++) {
          const dx=pos[i*3]-pos[j*3], dy=pos[i*3+1]-pos[j*3+1], dz=pos[i*3+2]-pos[j*3+2]
          if (Math.sqrt(dx*dx+dy*dy+dz*dz) < (isHub[j]?300:rng)) {
            const o=lc*6; lBuf[o]=pos[i*3];lBuf[o+1]=pos[i*3+1];lBuf[o+2]=pos[i*3+2]
            lBuf[o+3]=pos[j*3];lBuf[o+4]=pos[j*3+1];lBuf[o+5]=pos[j*3+2]
            aEdges.push([i,j]); if (++lc >= MAX_LINES) break outer
          }
        }
      }
      lPA.needsUpdate = true; lGeo.setDrawRange(0, lc*2)

      for (let f = 0; f < flows.length; f++) {
        const fl = flows[f]; fl.t += fl.spd
        if (fl.t >= 1) {
          if (aEdges.length > 0) { const e=aEdges[Math.floor(Math.random()*aEdges.length)]; fl.a=e[0]; fl.b=e[1]; if (Math.random()>.5)[fl.a,fl.b]=[fl.b,fl.a] }
          fl.t = 0; fl.spd = .005+Math.random()*.009
        }
        const t=fl.t, et=t<.5?2*t*t:-1+(4-2*t)*t, ai=fl.a*3, bi=fl.b*3
        fBuf[f*3]  =pos[ai]  +(pos[bi]  -pos[ai])  *et
        fBuf[f*3+1]=pos[ai+1]+(pos[bi+1]-pos[ai+1])*et
        fBuf[f*3+2]=pos[ai+2]+(pos[bi+2]-pos[ai+2])*et
      }
      fPA.needsUpdate = true

      cRX += (tRX-cRX)*.045; cRY += (tRY-cRY)*.045
      camera.rotation.order = 'YXZ'
      camera.rotation.x = cRX
      camera.rotation.y = cameraTarget.rotateY + cRY
      if (!warpActive) camera.position.z = baseCamZ + cameraTarget.z
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafId)
      warpTimeline.kill()
      scrollTimeline.kill()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMM)
      window.removeEventListener('mouseleave', onML)
      window.removeEventListener('resize', onR)
      renderer.dispose(); ptGeo.dispose(); ptMat.dispose()
      lGeo.dispose(); lMat.dispose(); fGeo.dispose(); fMat.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="three-canvas"
      className=""
    />
  )
}
