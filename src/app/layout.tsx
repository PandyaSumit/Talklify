import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Talklify - Marketplace for Expert Sessions',
  description: 'Discover and host live expert sessions. Connect with coaches, consultants, and educators for free and paid workshops.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
