import { useLayoutEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import ThreeBackground from "@/components/ThreeBackground"
import Intro           from "@/components/Intro"
import Navbar          from "@/components/Navbar"
import Hero            from "@/components/Hero"
import Ticker          from "@/components/Ticker"
import Why             from "@/components/Why"
import Services        from "@/components/Services"
import Niches          from "@/components/Niches"
import Process         from "@/components/Process"
import Portfolio       from "@/components/Portfolio"
import ContactForm     from "@/components/ContactForm"
import Faq             from "@/components/Faq"
import Cta             from "@/components/Cta"
import Footer          from "@/components/Footer"

gsap.registerPlugin(ScrollTrigger)

export default function App() {

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      /* ════════════════════════════════════════════════════════
         B — GSAP CINEMATIC INTRO SEQUENCE
      ════════════════════════════════════════════════════════ */
      gsap.set('#intro-logo',   { autoAlpha: 0, scale: 0.85, y: 20 })
      gsap.set('#intro-line',   { autoAlpha: 0, scaleX: 0, transformOrigin: 'left center' })
      gsap.set('#intro-sub',    { autoAlpha: 0, y: 10 })
      gsap.set('nav',           { autoAlpha: 0, y: -20 })
      gsap.set('.nav-links li', { autoAlpha: 0, y: -12 })
      gsap.set('#navCta',       { autoAlpha: 0, x: 16 })
      gsap.set('#heroBadge',    { autoAlpha: 0, y: 20, rotateX: -30, transformPerspective: 600 })
      gsap.set('.h1-word',      { autoAlpha: 0, y: 80, rotateX: -90, transformOrigin: '50% 100%', transformPerspective: 500 })
      gsap.set('#heroSub',      { autoAlpha: 0, y: 36 })
      gsap.set('#btn1',         { autoAlpha: 0, y: 24, scale: .96 })
      gsap.set('#btn2',         { autoAlpha: 0, y: 24, scale: .96 })
      gsap.set('#heroStats',    { autoAlpha: 0, y: 20 })
      gsap.set('#heroRight',    { autoAlpha: 0, x: 80, rotateY: 18, transformPerspective: 900 })
      gsap.set('#ticker',       { autoAlpha: 0 })

      const master = gsap.timeline()

      // ── PHASE 1: INTRO SCREEN ──
      master
        .to('#intro-logo', { autoAlpha: 1, scale: 1, y: 0, duration: 1.0, ease: 'expo.out' })
        .to('#three-canvas', { opacity: 1, duration: 1.5, ease: 'power2.out' }, 1.0)
        .to('#intro-line', { autoAlpha: 1, scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '-=0.3')
        .to('#intro-sub',  { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        // ── PHASE 2: HOLD ──
        .to({}, { duration: 6.0 })
        // ── PHASE 3: INTRO OUT ──
        .to(['#intro-logo', '#intro-line', '#intro-sub'], { autoAlpha: 0, y: -20, duration: 0.5, stagger: .08, ease: 'power2.in' })
        .to('#intro', { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.2')
        .set('#intro', { display: 'none' })
        // ── PHASE 4: NAV REVEALS ──
        .to('nav', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2')
        .to('.nav-links li', { autoAlpha: 1, y: 0, duration: 0.5, stagger: .07, ease: 'power2.out' }, '-=0.4')
        .to('#navCta', { autoAlpha: 1, x: 0, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.3')
        // ── PHASE 5: HERO TEXT — 3D CINEMATIC ──
        .to('#heroBadge', { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.1, ease: 'expo.out' }, '-=0.1')
        .to('#hw0', { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.5, ease: 'expo.out' }, '+=0.05')
        .to('#hw1', { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.5, ease: 'expo.out' }, '-=1.1')
        .to('#hw2', { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.5, ease: 'expo.out' }, '-=1.0')
        .to('#hw3', { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.5, ease: 'expo.out' }, '-=1.0')
        // Terminal slides in with 3D rotateY (parallel with words)
        .to('#heroRight', { autoAlpha: 1, x: 0, rotateY: 0, duration: 1.8, ease: 'expo.out' }, '-=2.0')
        // ── PHASE 6: SUPPORTING ELEMENTS ──
        .to('#heroSub',    { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.8')
        .to('#btn1',       { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.5')
        .to('#btn2',       { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.65')
        .to('#heroStats',  { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .to('#ticker',     { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')

      // Counter animation triggered by stats appearing
      master.add(() => {
        document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
          const tg = Number(el.dataset.count), sf = el.dataset.suf ?? ''
          const dur = 2000, t0 = performance.now()
          const step = (now: number) => {
            const p = Math.min((now - t0) / dur, 1)
            const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
            el.textContent = Math.round(e * tg) + sf
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        })
      }, '-=0.4')

      /* ════════════════════════════════════════════════════════
         C — GSAP SCROLL TRIGGER — 3D Section Reveals
      ════════════════════════════════════════════════════════ */

      // ── WHY ──
      ScrollTrigger.create({ trigger: '#why', start: 'top 65%', once: true, onEnter: () => {
        gsap.from('#whyHead', { y: 50, autoAlpha: 0, rotateX: -20, transformPerspective: 600, duration: 1.0, ease: 'expo.out' })
        gsap.from('.why-item', { y: 70, autoAlpha: 0, rotateX: -25, transformPerspective: 800,
          stagger: { amount: .4, from: 'start' }, duration: 1.1, ease: 'expo.out', delay: .3 })
      }})

      // ── SERVICES ── bento cards fan in with alternating rotateY
      ScrollTrigger.create({ trigger: '#servicos', start: 'top 65%', once: true, onEnter: () => {
        gsap.from('#servHead', { y: 50, autoAlpha: 0, rotateX: -20, transformPerspective: 600, duration: 1.0, ease: 'expo.out' })
        gsap.from('.b', {
          y: 80, autoAlpha: 0,
          rotateY: (i: number) => i % 2 === 0 ? -12 : 12,
          rotateX: -15, transformPerspective: 1000, scale: .94,
          stagger: { amount: .6, from: 'start' }, duration: 1.2, ease: 'expo.out', delay: .3,
        })
      }})

      // ── NICHOS ── cards flip in from the side
      ScrollTrigger.create({ trigger: '#nichos', start: 'top 65%', once: true, onEnter: () => {
        gsap.from(['#nichosHead', '#nichosDores'], { y: 50, autoAlpha: 0, rotateX: -20,
          transformPerspective: 600, duration: 1.0, ease: 'expo.out', stagger: .15 })
        gsap.from('.nicho-card', { x: -50, autoAlpha: 0, rotateY: -50, transformPerspective: 800,
          stagger: { amount: .5, from: 'start' }, duration: 1.3, ease: 'expo.out', delay: .4 })
      }})

      // ── PROCESS ── steps scale up from below with bounce
      ScrollTrigger.create({ trigger: '#processo', start: 'top 65%', once: true, onEnter: () => {
        gsap.from('#procHead', { y: 50, autoAlpha: 0, rotateX: -20, transformPerspective: 600, duration: 1.0, ease: 'expo.out' })
        gsap.from('.step', { y: 90, autoAlpha: 0, scale: .85, rotateX: -20, transformPerspective: 900,
          stagger: { amount: .4, from: 'start' }, duration: 1.2, ease: 'back.out(1.3)', delay: .3 })
      }})

      // ── PORTFOLIO ── cards split: left from left, right from right
      ScrollTrigger.create({ trigger: '#projetos', start: 'top 65%', once: true, onEnter: () => {
        gsap.from('#portHead', { y: 50, autoAlpha: 0, rotateX: -20, transformPerspective: 600, duration: 1.0, ease: 'expo.out' })
        const cards = gsap.utils.toArray<Element>('.port-card')
        cards.forEach((card, i) => {
          gsap.from(card, { x: i % 2 === 0 ? -80 : 80, autoAlpha: 0,
            rotateY: i % 2 === 0 ? 18 : -18, transformPerspective: 1000,
            duration: 1.3, ease: 'expo.out', delay: .3 + i * .12 })
        })
      }})

      // ── CONTACT ── book opening effect
      ScrollTrigger.create({ trigger: '#contato', start: 'top 65%', once: true, onEnter: () => {
        gsap.from('#contactHead', { y: 50, autoAlpha: 0, rotateX: -20, transformPerspective: 600, duration: 1.0, ease: 'expo.out' })
        gsap.from('.cf', { x: -60, autoAlpha: 0, rotateY: 20, transformPerspective: 700,
          stagger: { amount: .35 }, duration: 1.1, ease: 'expo.out', delay: .3 })
        gsap.from('#formCard', { x: 80, autoAlpha: 0, rotateY: -22, transformPerspective: 1000,
          scale: .96, duration: 1.4, ease: 'expo.out', delay: .2 })
      }})

      // ── FAQ ── stagger from bottom with 3D tilt
      ScrollTrigger.create({ trigger: '#faq', start: 'top 65%', once: true, onEnter: () => {
        gsap.from('#faqHead', { y: 50, autoAlpha: 0, rotateX: -20, transformPerspective: 600, duration: 1.0, ease: 'expo.out' })
        gsap.from('.faq-item', { y: 50, autoAlpha: 0, rotateX: -18, transformPerspective: 800,
          stagger: { amount: .4 }, duration: 1.0, ease: 'expo.out', delay: .3 })
      }})

      // ── CTA ── dramatic scale + rotation
      ScrollTrigger.create({ trigger: '#cta', start: 'top 65%', once: true, onEnter: () => {
        const tl = gsap.timeline()
        tl.from('.cta-badge', { y: 30, autoAlpha: 0, scale: .9, duration: .8, ease: 'back.out(1.6)' })
          .from('.cta-h',     { y: 60, autoAlpha: 0, rotateX: -25, transformPerspective: 700, scale: .92, duration: 1.4, ease: 'expo.out' }, '-=.3')
          .from('.cta-sub',   { y: 30, autoAlpha: 0, duration: 1.0, ease: 'expo.out' }, '-=.7')
          .from('.cta-btns > *', { y: 25, autoAlpha: 0, scale: .9, stagger: .15, duration: .9, ease: 'back.out(1.5)' }, '-=.5')
      }})
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Intro />
      <ThreeBackground />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Why />
        <Services />
        <Niches />
        <Process />
        <Portfolio />
        <ContactForm />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
