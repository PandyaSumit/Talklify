import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/providers/SessionProvider'
import { QueryProvider } from '@/providers/QueryProvider'
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
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <SessionProvider>
          <QueryProvider>
            <Header />
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
