'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import { SOURCES } from './data'

const FIRST = 'DODGE'
const SECOND = 'CHALLENGER'
const START = 0.938
const STEP = 0.0023

function Letter({ p, ch, i }: { p: MotionValue<number>; ch: string; i: number }) {
  const a = START + i * STEP
  const opacity = useTransform(p, [a, a + 0.004], [0, 1])
  const y = useTransform(p, [a, a + 0.004], [12, 0])
  return <motion.span style={{ opacity, y }}>{ch}</motion.span>
}

export default function Finale({ p, on, onBack }: { p: MotionValue<number>; on: boolean; onBack: () => void }) {
  const subO = useTransform(p, [0.988, 1], [0, 1])
  const subY = useTransform(p, [0.988, 1], [14, 0])
  const curO = useTransform(p, [0.975, 0.977, 0.984, 0.987], [0, 1, 1, 0])
  const lift = useTransform(p, (v) => {
    const k = Math.min(1, Math.max(0, (v - 0.972) / 0.018))
    const e = k * k * (3 - 2 * k)
    const to = typeof window !== 'undefined' && window.innerWidth <= 700 ? -24 : -29
    return `${to * e}vh`
  })
  return (
    <>
      <motion.div className="print" style={{ y: lift }}>
        <h2 aria-label="Dodge Challenger">
          <span className="p1" aria-hidden="true">
            {[...FIRST].map((c, i) => (
              <Letter key={i} p={p} ch={c} i={i} />
            ))}
          </span>
          <span className="p2" aria-hidden="true">
            {[...SECOND].map((c, i) => (
              <Letter key={i} p={p} ch={c} i={i + FIRST.length} />
            ))}
            <motion.i className="cursor" style={{ opacity: curO }}>
              <b />
            </motion.i>
          </span>
        </h2>
      </motion.div>
      <motion.div className={on ? 'print-sub on' : 'print-sub'} style={{ opacity: subO, y: subY }}>
        <p>Debuted in the fall of 1969 as a 1970 model.</p>
        <div className="actions">
          <button type="button" onClick={onBack}>
            Back to the start
          </button>

        </div>
        <p className="sources">
          Sources:{' '}
          {SOURCES.map((s, i) => (
            <span key={s.href}>
              {i > 0 ? ' · ' : ''}
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </motion.div>
    </>
  )
}
