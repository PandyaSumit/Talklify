import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/providers/SessionProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Header } from '@/components/layout/Header'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider>
              <Header />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
