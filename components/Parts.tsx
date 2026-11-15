'use client'

import Image from 'next/image'
import { cubicBezier, motion, useTransform, type MotionValue } from 'motion/react'

const W = 1125
const H = 633

const poly = (pts: number[][]) =>
  `polygon(${pts.map(([x, y]) => `${((x / W) * 100).toFixed(2)}% ${((y / H) * 100).toFixed(2)}%`).join(',')})`

type Part = {
  id: string
  pts: number[][]
  dx: number
  dy: number
  rot: number
  from: number
  to: number
  origin?: string
}

export const PARTS: Part[] = [
  {
    id: 'rear-wheel',
    pts: [[903, 425], [975, 402], [1022, 412], [1032, 482], [1002, 545], [950, 562], [914, 540], [903, 482]],
    dx: 22,
    dy: 14,
    rot: -50,
    from: 0.0,
    to: 0.17,
    origin: '86% 76%',
  },
  {
    id: 'rear-quarter',
    pts: [[935, 345], [1050, 360], [1060, 425], [1030, 412], [975, 402], [940, 380]],
    dx: 16,
    dy: -4,
    rot: 3,
    from: 0.012,
    to: 0.182,
  },
  {
    id: 'door',
    pts: [[650, 335], [800, 312], [935, 345], [950, 375], [900, 440], [810, 505], [715, 520], [650, 430]],
    dx: 12,
    dy: 6,
    rot: 2,
    from: 0.024,
    to: 0.194,
  },
  {
    id: 'roof',
    pts: [[797, 232], [915, 285], [948, 310], [935, 345], [800, 312]],
    dx: 5,
    dy: -16,
    rot: -2,
    from: 0.036,
    to: 0.206,
  },
  {
    id: 'windscreen',
    pts: [[380, 298], [440, 244], [500, 232], [790, 232], [797, 265], [795, 312], [700, 312], [560, 308], [470, 300]],
    dx: -2,
    dy: -20,
    rot: -2,
    from: 0.048,
    to: 0.218,
  },
  {
    id: 'hood',
    pts: [[90, 362], [215, 335], [310, 310], [480, 298], [700, 314], [665, 350], [600, 362], [370, 360]],
    dx: -10,
    dy: -14,
    rot: -3,
    from: 0.06,
    to: 0.23,
  },
  {
    id: 'front-wheel',
    pts: [[690, 408], [742, 390], [782, 420], [788, 492], [762, 548], [710, 568], [668, 536], [664, 470]],
    dx: 8,
    dy: 22,
    rot: 70,
    from: 0.072,
    to: 0.242,
    origin: '65% 75%',
  },
  {
    id: 'grille',
    pts: [[80, 368], [360, 360], [612, 368], [620, 425], [600, 440], [90, 438]],
    dx: -18,
    dy: 3,
    rot: -2,
    from: 0.084,
    to: 0.254,
  },
  {
    id: 'bumper',
    pts: [[90, 436], [620, 436], [640, 422], [645, 475], [560, 515], [330, 530], [190, 562], [150, 520], [105, 470]],
    dx: -12,
    dy: 16,
    rot: 2,
    from: 0.096,
    to: 0.266,
  },
]

const E = { ease: cubicBezier(0.37, 0, 0.25, 1) }

function Piece({ p, part }: { p: MotionValue<number>; part: Part }) {
  const t = useTransform(p, [part.from, part.to], [0, 1], E)
  const x = useTransform(t, [0, 1], [`${part.dx}%`, '0%'])
  const y = useTransform(t, [0, 1], [`${part.dy}%`, '0%'])
  const rotate = useTransform(t, [0, 1], [part.rot, 0])
  const opacity = useTransform(t, [0, 0.4], [0, 1])
  const scale = useTransform(t, [0, 1], [0.97, 1])
  return (
    <motion.div
      className="piece"
      aria-hidden="true"
      style={{ clipPath: poly(part.pts), x, y, rotate, scale, opacity, transformOrigin: part.origin ?? '50% 50%' }}
    >
      <Image src="/car-graded.webp" alt="" fill sizes="(max-width: 700px) 100vw, 60vw" />
    </motion.div>
  )
}

export default function Parts({ p }: { p: MotionValue<number> }) {
  return (
    <>
      {PARTS.map((part) => (
        <Piece key={part.id} p={p} part={part} />
      ))}
    </>
  )
}
