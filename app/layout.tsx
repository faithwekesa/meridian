import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Challenger Unveiled',
  description: 'A scroll-driven tribute to the 1970 Dodge Challenger: the lights come on and the details follow.',
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
