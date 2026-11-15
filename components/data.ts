export type Focus = { x: number; y: number; s: number; ax?: number }

export type Chapter = {
  id: 'design' | 'engine' | 'size' | 'first'
  from: number
  to: number
  side: 'left' | 'right'
  focus: Focus
}

export const CHAPTERS: Chapter[] = [
  { id: 'design', from: 0.34, to: 0.5, side: 'right', focus: { x: 32, y: 62, s: 1.45 } },
  { id: 'engine', from: 0.5, to: 0.65, side: 'right', focus: { x: 36, y: 50, s: 1.45 } },
  { id: 'size', from: 0.65, to: 0.8, side: 'right', focus: { x: 65, y: 75, s: 1.4 } },
  { id: 'first', from: 0.8, to: 0.89, side: 'right', focus: { x: 88, y: 57, s: 1.4 } },
]

export const ENGINES = [
  { name: '225 slant six', hp: 145 },
  { name: '318 V8', hp: 230 },
  { name: '340 V8', hp: 275 },
  { name: '440 V8', hp: 375 },
  { name: '440 Six Pack', hp: 390 },
  { name: '426 Hemi', hp: 425 },
]

export const SIZES = [
  { label: 'Wheelbase', imperial: '110 in', metric: '2.79 m' },
  { label: 'Length', imperial: '191.3 in', metric: '4.86 m' },
  { label: 'Width', imperial: '76.1 in', metric: '1.93 m' },
  { label: 'Height', imperial: 'to 51.3 in', metric: '1.30 m' },
]

export const SOURCES = [
  {
    label: 'Dodge press release',
    href: 'https://embargoed.stellantisnorthamerica.com/pdf.do?id=9425',
  },
  {
    label: '1970 sales brochure',
    href: 'https://musclecarfacts.com/?p=240',
  },
  {
    label: 'Over-Drive fact sheet',
    href: 'https://over-drive-magazine.com/2024/04/20/1970-dodge-challenger-fact-sheet/',
  },
]
