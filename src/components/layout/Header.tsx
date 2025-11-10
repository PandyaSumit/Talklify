'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Talklify</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/sessions"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Browse Sessions
            </Link>
            {session?.user.userType !== 'ATTENDEE' && (
              <Link
                href="/host/sessions/new"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Host a Session
              </Link>
            )}
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md" />
            ) : session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
