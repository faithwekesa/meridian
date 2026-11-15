'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  easeInOut,
  motion,
  useMotionTemplate,
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import Beams from './Beams'
import Dust from './Dust'
import Finale from './Finale'
import Parts from './Parts'
import TopBar from './TopBar'
import { DesignCard, EngineCard, FirstCard, SizeCard } from './Chapter'
import { CHAPTERS } from './data'

const LAMPS = [
  { left: '14.4%', top: '62%' },
  { left: '50.6%', top: '62%' },
]

const E = { ease: easeInOut }

const OVERVIEW = { x: 50, y: 50, s: 1 }

const KEYS = [
  { p: 0, ...OVERVIEW },
  { p: 0.3, ...OVERVIEW },
  ...CHAPTERS.flatMap((c) => [
    { p: c.from + 0.02, ...c.focus },
    { p: c.to - 0.01, x: c.focus.x, y: c.focus.y, s: c.focus.s * 1.07 },
  ]),
  { p: 0.915, ...OVERVIEW },
  { p: 1, ...OVERVIEW },
]

const sample = (v: number, f: (k: (typeof KEYS)[number]) => number) => {
  if (v <= KEYS[0].p) return f(KEYS[0])
  for (let i = 1; i < KEYS.length; i++) {
    if (v <= KEYS[i].p) {
      const a = KEYS[i - 1]
      const b = KEYS[i]
      const t = (v - a.p) / (b.p - a.p)
      return f(a) + (f(b) - f(a)) * t
    }
  }
  return f(KEYS[KEYS.length - 1])
}

const smooth = (v: number, f: (k: (typeof KEYS)[number]) => number) => {
  const span = 0.03
  const n = 10
  let sum = 0
  for (let i = -n; i <= n; i++) sum += sample(v + (i / n) * span, f)
  return sum / (2 * n + 1)
}

let lastV = -1
let lastCam = { s: 1, x: 0, y: 0 }
const cam = (v: number) => {
  if (v !== lastV) {
    const s = smooth(v, (k) => k.s)
    const fx = smooth(v, (k) => k.x)
    const fy = smooth(v, (k) => k.y)
    const wide = typeof window !== 'undefined' && window.innerWidth > 700
    const k = Math.min(1, Math.max(0, (v - 0.925) / 0.04))
    const shift = wide ? 23 * k * k * (3 - 2 * k) : 0
    lastCam = { s, x: -s * (fx - 50) + shift, y: -s * (fy - 50) }
    lastV = v
  }
  return lastCam
}

export default function Scene() {
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const spring = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.8 })
  const sp = reduce ? scrollYProgress : spring
  const intro = useMotionValue(0)
  const driver = useMotionValue(0)
  const tourOn = useMotionValue(0)
  const p = useTransform([intro, sp, driver, tourOn], ([i, v, d, on]: number[]) => i * 0.3 + (on ? d : v) * 0.7)
  const playing = useRef<{ stop: () => void } | null>(null)
  const tour = useRef<{ stop: () => void } | null>(null)
  const [touring, setTouring] = useState(false)
  const [introDone, setIntroDone] = useState(false)

  const play = () => {
    playing.current?.stop()
    if (reduce) {
      intro.set(1)
      return
    }
    intro.set(0)
    document.documentElement.style.overflow = 'hidden'
    playing.current = animate(intro, 1, {
      duration: 8,
      delay: 0.5,
      ease: 'linear',
      onComplete: () => {
        document.documentElement.style.overflow = ''
        setIntroDone(true)
        startTour()
      },
    })
  }

  const stopTour = () => {
    if (!tour.current) return
    tour.current.stop()
    tour.current = null
    if (!reduce) spring.jump(driver.get())
    tourOn.set(0)
    setTouring(false)
  }

  const startTour = () => {
    tour.current?.stop()
    const max = document.documentElement.scrollHeight - window.innerHeight
    const now = window.scrollY / Math.max(max, 1)
    if (now > 0.985) return
    driver.set(now)
    tourOn.set(1)
    setTouring(true)
    tour.current = animate(driver, 1, {
      duration: (1 - now) * 40,
      ease: 'linear',
      onUpdate: (v: number) => {
        const m = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo(0, v * m)
      },
      onComplete: () => {
        stopTour()
      },
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    play()
    const take = () => stopTour()
    const keys = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) stopTour()
    }
    window.addEventListener('wheel', take, { passive: true })
    window.addEventListener('touchstart', take, { passive: true })
    window.addEventListener('pointerdown', take)
    window.addEventListener('keydown', keys)
    return () => {
      window.removeEventListener('wheel', take)
      window.removeEventListener('touchstart', take)
      window.removeEventListener('pointerdown', take)
      window.removeEventListener('keydown', keys)
      playing.current?.stop()
      tour.current?.stop()
      document.documentElement.style.overflow = ''
    }
  }, [])

  const scale = useTransform(p, (v) => cam(v).s)
  const x = useTransform(p, (v) => `${cam(v).x}%`)
  const y = useTransform(p, (v) => `${cam(v).y}%`)

  const photoMask = 'radial-gradient(ellipse 60% 62% at 50% 56%, #000 55%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 22%, #000 82%, transparent 99%), linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%)'
  const baseO = useTransform(p, [0.2, 0.3], [0, 1])
  const lamp = useTransform(p, [0.2, 0.21, 0.22, 0.24, 0.255, 0.28, 0.9, 0.93, 0.985, 0.998], [0, 1, 0.3, 1, 0.65, 1, 1, 0, 0, 1])

  const fogO = useTransform(p, [0, 0.3, 0.4], [0.2, 0.7, 0.4])
  const wedgeO = useTransform(p, [0.08, 0.3, 0.4], [0, 0.95, 0.45])
  const wedgeX = useTransform(p, [0.08, 0.3], ['20vw', '0vw'], E)

  const tin = useTransform(p, [0.2, 0.3], [0, 1], E)
  const tout = useTransform(p, [0.34, 0.4], [1, 0])
  const tOpacity = useTransform([tin, tout], ([a, b]: number[]) => a * b)
  const tShift = useTransform(p, [0.34, 0.4], [0, -28])
  const t1Blur = useTransform(tin, [0, 1], [14, 0])
  const t1Filter = useMotionTemplate`blur(${t1Blur}px)`
  const t1Space = useTransform(tin, [0, 1], [0.5, 0.02])
  const t1Spacing = useMotionTemplate`${t1Space}em`
  const t2Blur = useTransform(tin, [0, 1], [18, 0])
  const t2Filter = useMotionTemplate`blur(${t2Blur}px)`
  const t2Space = useTransform(tin, [0, 1], [0.42, 0])
  const t2Spacing = useMotionTemplate`${t2Space}em`
  const t2Y = useTransform(tin, [0, 1], [26, 0])

  const ghostO = useTransform(p, [0.2, 0.3, 0.4, 0.88, 0.91], [0, 1, 0.3, 0.3, 0])
  const ghostX = useTransform(p, [0.2, 0.3], [60, 0])
  const veilO = useTransform(p, [0.91, 0.935, 0.975, 0.99], [0, 1, 1, 0])
  const hintO = useTransform(p, [0.28, 0.3, 0.33, 0.4], [0, 1, 1, 0])
  const noteO = useTransform(p, [0.985, 1], [0, 1])

  const [finaleOn, setFinaleOn] = useState(false)
  useMotionValueEvent(p, 'change', (v) => setFinaleOn(v > 0.99))

  const go = (at: number) => {
    stopTour()
    if (at <= 0) {
      window.scrollTo(0, 0)
      setIntroDone(false)
      play()
      return
    }
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: Math.max(0, (at - 0.3) / 0.7) * max, behavior: reduce ? 'auto' : 'smooth' })
  }

  const [design, engine, size, first] = CHAPTERS

  return (
    <div ref={track} className="track">
      <div className="stage">
        <div className="bg" />
        <motion.div className="fog" style={{ opacity: fogO }} />
        <motion.div className="wedge" style={{ opacity: wedgeO, x: wedgeX }} />
        <Beams p={p} />
        <div className="floor" />
        <motion.div className="ghost" aria-hidden="true" style={{ opacity: ghostO, x: ghostX }}>
          1970
        </motion.div>

        <motion.figure className="car" style={{ scale, x, y }}>
          <div className="photo">
            <Parts p={p} />
            <motion.div className="base" style={{ opacity: baseO, maskImage: photoMask, WebkitMaskImage: photoMask, maskComposite: 'intersect', WebkitMaskComposite: 'source-in, source-in' }}>
              <Image
                src="/car-graded.webp"
                alt="A classic American coupé with a long bonnet, a hood scoop and gold alloy wheels"
                fill
                sizes="(max-width: 700px) 100vw, 60vw"
                preload
              />
            </motion.div>
          </div>
          {LAMPS.map((l) => (
            <motion.i key={l.left} className="lamp" aria-hidden="true" style={{ left: l.left, top: l.top, opacity: lamp }} />
          ))}
        </motion.figure>

        <Dust still={!!reduce} />
        <div className="grain" aria-hidden="true" />

        <TopBar onGo={go} />

        <motion.h1 className="title" style={{ opacity: tOpacity, y: tShift }}>
          <motion.span className="t1" style={{ filter: t1Filter, letterSpacing: t1Spacing }}>
            Dodge
          </motion.span>
          <motion.span className="t2" style={{ filter: t2Filter, letterSpacing: t2Spacing, y: t2Y }}>
            Challenger
          </motion.span>
        </motion.h1>

        <div className="cards">
          <DesignCard p={p} c={design} />
          <EngineCard p={p} c={engine} />
          <SizeCard p={p} c={size} />
          <FirstCard p={p} c={first} />
        </div>

        <motion.div className="veil" aria-hidden="true" style={{ opacity: veilO }} />
        <Finale p={p} on={finaleOn} onBack={() => go(0)} />

        {introDone ? (
          <button
            className="tour"
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => (touring ? stopTour() : startTour())}
          >
            {touring ? 'Pause tour' : 'Play tour'}
          </button>
        ) : null}

        <motion.div className="hint" style={{ opacity: hintO }}>
          <span className="mouse" aria-hidden="true" />
          <span>Scroll any time to take over</span>
        </motion.div>
        <motion.p className="note" style={{ opacity: noteO }}>
          Unofficial fan tribute. Not affiliated with Dodge. The photo shows a customised car. Figures are for the factory 1970 model.
        </motion.p>

        <div className="frame" aria-hidden="true" />
      </div>
    </div>
  )
}
