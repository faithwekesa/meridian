'use client'

import { useEffect, useRef } from 'react'

type Dot = { x: number; y: number; r: number; v: number; a: number; k: number }

export default function Dust({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let w = 0
    let h = 0
    let dots: Dot[] = []
    let raf = 0

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = w < 700 ? 38 : 76
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.4,
        v: Math.random() * 0.22 + 0.05,
        a: Math.random() * 0.5 + 0.15,
        k: Math.random() * 6.28,
      }))
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const d of dots) {
        if (!still) {
          d.y -= d.v
          d.x += Math.sin(time / 1700 + d.k) * 0.18
          if (d.y < -4) {
            d.y = h + 4
            d.x = Math.random() * w
          }
        }
        ctx.globalAlpha = d.a * (0.5 + 0.5 * Math.sin(time / 900 + d.k))
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    size()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', size)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
    }
  }, [still])

  return <canvas ref={ref} className="dust" aria-hidden="true" />
}
