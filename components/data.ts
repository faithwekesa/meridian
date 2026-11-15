export type Focus = { x: number; y: number; s: number }

export type Chapter = {
  id: 'design' | 'engine' | 'size' | 'first'
  from: number
  to: number
  focus: Focus
}

export const CHAPTERS: Chapter[] = [
  { id: 'design', from: 0.34, to: 0.5, focus: { x: 32, y: 62, s: 1.45 } },
  { id: 'engine', from: 0.5, to: 0.65, focus: { x: 36, y: 50, s: 1.45 } },
  { id: 'size', from: 0.65, to: 0.8, focus: { x: 65, y: 75, s: 1.4 } },
  { id: 'first', from: 0.8, to: 0.89, focus: { x: 88, y: 57, s: 1.4 } },
]

export const ENGINES = [
  { name: '225 slant six', hp: 145 },
  { name: '318 V8', hp: 230 },
  { name: '340 V8', hp: 275 },
  { name: '440 Magnum', hp: 375 },
  { name: '440 Six Pack', hp: 390 },
  { name: '426 Hemi', hp: 425 },
]

export const SIZES = [
  { label: 'Wheelbase', imperial: '110 in', metric: '2.79 m' },
  { label: 'Length', imperial: '191.5 in', metric: '4.86 m' },
  { label: 'Width', imperial: '76.5 in', metric: '1.94 m' },
  { label: 'Height', imperial: '51 in', metric: '1.30 m' },
]

export const SOURCE = {
  label: 'Wikipedia: Dodge Challenger (1970)',
  href: 'https://en.wikipedia.org/wiki/Dodge_Challenger_(1970)',
}
