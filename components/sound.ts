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

type Plan = number[][]

const IDLE = 900

const planFor = (long: boolean): { plan: Plan; len: number; crank: number } =>
  long
    ? {
        len: 3.9,
        crank: 0.85,
        plan: [[0.85, 0], [0.86, 420], [1.0, 1150], [1.3, IDLE], [1.55, 1000], [2.55, 4900], [2.75, 4300], [3.0, 4700], [3.7, 1200], [3.9, IDLE]],
      }
    : {
        len: 2.4,
        crank: 0,
        plan: [[0, 0], [0.01, 600], [0.12, 1100], [0.35, IDLE], [0.55, 1000], [1.25, 4500], [1.4, 4100], [1.6, 4400], [2.1, 1200], [2.4, IDLE]],
      }

const ease = (x: number) => x * x * (3 - 2 * x)

const rpmAt = (plan: Plan, t: number) => {
  if (t < plan[0][0]) return 0
  for (let i = 1; i < plan.length; i++) {
    if (t <= plan[i][0]) {
      const [t0, r0] = plan[i - 1]
      const [t1, r1] = plan[i]
      return r0 + (r1 - r0) * ease((t - t0) / (t1 - t0))
    }
  }
  return plan[plan.length - 1][1]
}

type Shot = { t0: number; amp: number; low: number; mid: number; noise: number }

export const renderEngine = (sr: number, long: boolean) => {
  const { plan, len, crank } = planFor(long)
  const n = Math.floor(sr * len)
  const out = new Float32Array(n)
  const shots: Shot[] = []
  let phase = 0
  let cyl = 0
  let lp = 0
  let seed = 12345
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  const TAU = Math.PI * 2

  for (let i = 0; i < n; i++) {
    const t = i / sr
    const rpm = rpmAt(plan, t)
    let fire = (rpm / 60) * 4
    if (long && t < crank && t > crank - 0.3) fire = 4 + (t - (crank - 0.3)) * 18
    phase += fire / sr
    if (phase >= 1) {
      phase -= 1
      cyl = (cyl + 1) % 8
      const lope = Math.max(0, Math.min(1, (2400 - rpm) / 2400))
      let amp = 0.75 + rnd() * 0.25
      if (cyl === 3) amp *= 1 - 0.55 * lope
      if (cyl === 6) amp *= 1 - 0.3 * lope
      if (rpm < 500) amp *= 0.55
      shots.push({ t0: t, amp, low: 58 + rpm * 0.014, mid: 360 + rpm * 0.13, noise: rnd() * 2 - 1 })
    }

    let v = 0
    for (let k = shots.length - 1; k >= 0; k--) {
      const e = shots[k]
      const dt = t - e.t0
      if (dt > 0.22) {
        shots.splice(k, 1)
        continue
      }
      const nz = Math.sin(dt * 9000 * (1 + e.noise * 0.3) + e.noise * 40)
      v +=
        e.amp *
        (Math.sin(TAU * e.low * dt) * Math.exp(-dt / 0.04) +
          0.55 * Math.sin(TAU * e.mid * dt) * Math.exp(-dt / 0.013) +
          0.35 * nz * Math.exp(-dt / 0.005))
    }

    if (long && t < crank + 0.35) {
      const f = 62 + Math.min(t, crank) * 70
      const saw = ((t * f) % 1) * 2 - 1
      const churn = 0.55 + 0.45 * Math.sin(TAU * 17 * t)
      const fade = t < crank ? 1 : 1 - (t - crank) / 0.35
      v += 0.28 * saw * churn * fade
    }

    const cut = Math.min(0.9, (700 + rpm * 0.9) / sr * TAU)
    lp += (v - lp) * cut
    out[i] = lp
  }

  let raw = 0
  for (let i = 0; i < n; i++) raw = Math.max(raw, Math.abs(out[i]))
  let peak = 0
  for (let i = 0; i < n; i++) {
    const x = Math.tanh((out[i] / (raw || 1)) * 1.6)
    out[i] = x
    peak = Math.max(peak, Math.abs(x))
  }
  const fadeIn = Math.floor(sr * 0.02)
  const fadeOut = Math.floor(sr * 0.5)
  for (let i = 0; i < n; i++) {
    let g = 0.85 / (peak || 1)
    if (i < fadeIn) g *= i / fadeIn
    if (i > n - fadeOut) g *= (n - i) / fadeOut
    out[i] *= g
  }
  return out
}

const cache: Record<string, Float32Array> = {}

export const rumble = (long = false) => {
  const c = get()
  if (!c) return
  const key = `${c.sampleRate}-${long}`
  if (!cache[key]) cache[key] = renderEngine(c.sampleRate, long)
  const data = cache[key]
  const buf = c.createBuffer(1, data.length, c.sampleRate)
  buf.copyToChannel(new Float32Array(data), 0)
  const src = c.createBufferSource()
  src.buffer = buf
  const g = c.createGain()
  g.gain.value = 0.7
  src.connect(g)
  g.connect(c.destination)
  src.start()
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
