'use client'

import { useEffect, useState } from 'react'

const CHAPTERS = [
  { label: 'Start', at: 0 },
  { label: 'Details', at: 0.4 },
  { label: 'Numbers', at: 0.7 },
  { label: 'End', at: 1 },
]

export default function TopBar({ onGo }: { onGo: (at: number) => void }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const go = (at: number) => {
    onGo(at)
    setOpen(false)
  }

  return (
    <>
      <header className="bar">
        <button className="mark" type="button" onClick={() => go(0)} aria-label="Challenger ’70, back to the start">
          Challenger ’70
        </button>
        <span className="tag">An unofficial tribute.</span>
        <span className="spacer" />
        <nav className="nav" aria-label="Chapters">
          {CHAPTERS.map((c) => (
            <button key={c.label} type="button" onClick={() => go(c.at)}>
              {c.label}
            </button>
          ))}
        </nav>
        <button
          className="burger"
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          <i />
          <i />
        </button>
      </header>
      {open ? (
        <nav className="menu" id="menu" aria-label="Chapters">
          {CHAPTERS.map((c) => (
            <button key={c.label} type="button" onClick={() => go(c.at)}>
              {c.label}
            </button>
          ))}
        </nav>
      ) : null}
    </>
  )
}
