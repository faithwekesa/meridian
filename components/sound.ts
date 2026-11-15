let ctx: AudioContext | null = null

const get = () => {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export const unlock = () => {
  get()
}

export const rumble = (long = false) => {
  const c = get()
  if (!c) return
  const t = c.currentTime
  const len = long ? 3.2 : 1.6
  const master = c.createGain()
  master.gain.setValueAtTime(0.0001, t)
  master.gain.exponentialRampToValueAtTime(0.22, t + 0.35)
  master.gain.exponentialRampToValueAtTime(0.12, t + len * 0.6)
  master.gain.exponentialRampToValueAtTime(0.0001, t + len)
  const low = c.createBiquadFilter()
  low.type = 'lowpass'
  low.frequency.setValueAtTime(140, t)
  low.frequency.linearRampToValueAtTime(320, t + len * 0.5)
  low.frequency.linearRampToValueAtTime(180, t + len)
  const pulse = c.createGain()
  pulse.gain.value = 0.6
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfo.frequency.setValueAtTime(6, t)
  lfo.frequency.linearRampToValueAtTime(14, t + len * 0.5)
  lfo.frequency.linearRampToValueAtTime(9, t + len)
  lfoGain.gain.value = 0.4
  lfo.connect(lfoGain)
  lfoGain.connect(pulse.gain)
  const a = c.createOscillator()
  const b = c.createOscillator()
  a.type = 'sawtooth'
  b.type = 'square'
  a.frequency.setValueAtTime(38, t)
  a.frequency.linearRampToValueAtTime(62, t + len * 0.5)
  a.frequency.linearRampToValueAtTime(48, t + len)
  b.frequency.setValueAtTime(19, t)
  b.frequency.linearRampToValueAtTime(31, t + len * 0.5)
  b.frequency.linearRampToValueAtTime(24, t + len)
  a.connect(low)
  b.connect(low)
  low.connect(pulse)
  pulse.connect(master)
  master.connect(c.destination)
  ;[a, b, lfo].forEach((o) => {
    o.start(t)
    o.stop(t + len + 0.1)
  })
}

export const tick = () => {
  const c = get()
  if (!c) return
  const t = c.currentTime
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'square'
  o.frequency.setValueAtTime(1500 + Math.random() * 500, t)
  g.gain.setValueAtTime(0.025, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)
  o.connect(g)
  g.connect(c.destination)
  o.start(t)
  o.stop(t + 0.05)
}

export const clank = () => {
  const c = get()
  if (!c) return
  const t = c.currentTime
  const len = 0.35
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.12), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2
  const n = c.createBufferSource()
  n.buffer = buf
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 2400 + Math.random() * 1200
  bp.Q.value = 3
  const ng = c.createGain()
  ng.gain.value = 0.18
  n.connect(bp)
  bp.connect(ng)
  ng.connect(c.destination)
  n.start(t)
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(130, t)
  o.frequency.exponentialRampToValueAtTime(48, t + len)
  g.gain.setValueAtTime(0.28, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + len)
  o.connect(g)
  g.connect(c.destination)
  o.start(t)
  o.stop(t + len + 0.05)
}
