'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import { SOURCE } from './data'

const FIRST = 'DODGE'
const SECOND = 'CHALLENGER'
const START = 0.962
const STEP = 0.002

function Letter({ p, ch, i }: { p: MotionValue<number>; ch: string; i: number }) {
  const a = START + i * STEP
  const opacity = useTransform(p, [a, a + 0.004], [0, 1])
  const y = useTransform(p, [a, a + 0.004], [12, 0])
  return <motion.span style={{ opacity, y }}>{ch}</motion.span>
}

export default function Finale({ p, on, onBack }: { p: MotionValue<number>; on: boolean; onBack: () => void }) {
  const subO = useTransform(p, [0.995, 1], [0, 1])
  const subY = useTransform(p, [0.995, 1], [14, 0])
  const curO = useTransform(p, [0.994, 0.996], [0, 1])
  return (
    <div className={on ? 'print on' : 'print'}>
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
      <motion.div className="print-sub" style={{ opacity: subO, y: subY }}>
        <p>Launched autumn 1969. Built until 1974.</p>
        <div className="actions">
          <button type="button" onClick={onBack}>
            Back to the start
          </button>
          <a href={SOURCE.href} target="_blank" rel="noopener noreferrer">
            Source: Wikipedia
          </a>
        </div>
      </motion.div>
    </div>
  )
}
