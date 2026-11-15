import type { Metadata, Viewport } from 'next'
import './globals.css'

const description = 'An unofficial fan tribute to the 1970 Dodge Challenger. The car assembles itself and the facts follow, each with its source.'

export const metadata: Metadata = {
  metadataBase: new URL('https://meridian-blond-nu.vercel.app'),
  title: 'Challenger Unveiled',
  description,
  openGraph: {
    title: 'Challenger Unveiled',
    description,
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'A 1970 Dodge Challenger in low light' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Challenger Unveiled',
    description,
    images: ['/og.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#09090a',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
