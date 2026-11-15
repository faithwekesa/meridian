'use client'

import { easeInOut, motion, useTransform, type MotionValue } from 'motion/react'

const BARS = [
  { d: 'M 560 150 L 1010 98', from: 0.05, to: 0.2 },
  { d: 'M 900 34 L 764 288', from: 0.09, to: 0.24 },
  { d: 'M 820 340 L 1190 400', from: 0.13, to: 0.28 },
]

function Bar({ p, d, from, to }: { p: MotionValue<number>; d: string; from: number; to: number }) {
  const length = useTransform(p, [from, to], [0, 1])
  return (
    <>
      <motion.path d={d} className="bp glow" style={{ pathLength: length }} />
      <motion.path d={d} className="bp" style={{ pathLength: length }} />
    </>
  )
}

export default function Beams({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0.08, 0.3], [-130, 0], { ease: easeInOut })
  const rotate = useTransform(p, [0.08, 0.3], [-9, 0], { ease: easeInOut })
  const opacity = useTransform(p, [0, 0.3, 0.4], [1, 1, 0.22])

  return (
    <motion.div className="beams" aria-hidden="true" style={{ x, rotate, opacity }}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <g>
          {BARS.map((b) => (
            <Bar key={b.d} p={p} d={b.d} from={b.from} to={b.to} />
          ))}
        </g>
      </svg>
    </motion.div>
  )
}
