'use client'

import type { ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'motion/react'
import { ENGINES, SIZES, type Chapter } from './data'

export function Card({ p, c, children }: { p: MotionValue<number>; c: Chapter; children: ReactNode }) {
  const opacity = useTransform(p, [c.from, c.from + 0.03, c.to - 0.03, c.to], [0, 1, 1, 0])
  const y = useTransform(p, [c.from, c.from + 0.04], [24, 0])
  return (
    <motion.article className="card" style={{ opacity, y }}>
      {children}
    </motion.article>
  )
}

export function Dot({ p, c }: { p: MotionValue<number>; c: Chapter }) {
  const opacity = useTransform(p, [c.from + 0.02, c.from + 0.05, c.to - 0.04, c.to - 0.01], [0, 1, 1, 0])
  return <motion.i className="dot" aria-hidden="true" style={{ left: `${c.focus.x}%`, top: `${c.focus.y}%`, opacity }} />
}

function Bar({ p, from, i, name, hp }: { p: MotionValue<number>; from: number; i: number; name: string; hp: number }) {
  const scale = useTransform(p, [from + 0.03 + i * 0.01, from + 0.08 + i * 0.01], [0, 1])
  return (
    <li>
      <span className="bar-name">{name}</span>
      <span className="bar-track">
        <motion.span className="bar-fill" style={{ scaleX: scale, width: `${(hp / 425) * 100}%` }} />
      </span>
      <span className="bar-hp">{hp}</span>
    </li>
  )
}

export function DesignCard({ p, c }: { p: MotionValue<number>; c: Chapter }) {
  return (
    <Card p={p} c={c}>
      <span className="tag-s">Design</span>
      <h3>Four headlights, one wide grille</h3>
      <p>
        The Challenger carried four headlights where its sibling the Plymouth Barracuda had two. Carl Cameron designed
        the exterior.
      </p>
    </Card>
  )
}

export function EngineCard({ p, c }: { p: MotionValue<number>; c: Chapter }) {
  return (
    <Card p={p} c={c}>
      <span className="tag-s">Under the hood</span>
      <h3>From 145 hp to 425 hp</h3>
      <ul className="bars">
        {ENGINES.map((e, i) => (
          <Bar key={e.name} p={p} from={c.from} i={i} name={e.name} hp={e.hp} />
        ))}
      </ul>
      <p className="fine">Horsepower as listed in the 1970 sales brochure. The 426 Hemi made 490 lb·ft of torque at 4,000 rpm.</p>
    </Card>
  )
}

export function SizeCard({ p, c }: { p: MotionValue<number>; c: Chapter }) {
  return (
    <Card p={p} c={c}>
      <span className="tag-s">Dimensions</span>
      <h3>Built on Chrysler&apos;s E-body</h3>
      <dl className="sizes">
        {SIZES.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>
              {s.imperial}
              <small>{s.metric}</small>
            </dd>
          </div>
        ))}
      </dl>
      <p>It shared Chrysler&apos;s E-body platform with the Plymouth Barracuda. The Challenger&apos;s wheelbase was two inches longer.</p>
    </Card>
  )
}

export function FirstCard({ p, c }: { p: MotionValue<number>; c: Chapter }) {
  return (
    <Card p={p} c={c}>
      <span className="tag-s">The first year</span>
      <h3>Over 83,000 sold in 1970</h3>
      <p>
        The Challenger made its debut in the fall of 1969 as a 1970 model. Nine engines were offered. R/T cars came with a
        Rallye cluster that had a 150 mph speedometer and a tachometer.
      </p>
    </Card>
  )
}
