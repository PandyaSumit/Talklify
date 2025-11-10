import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/signin') ||
                       req.nextUrl.pathname.startsWith('/signup')
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
                             req.nextUrl.pathname.startsWith('/host') ||
                             req.nextUrl.pathname.startsWith('/profile')

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect unauthenticated users to signin
    if (isProtectedRoute && !isAuth) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check host permissions for host routes
    if (req.nextUrl.pathname.startsWith('/host') && token) {
      const userType = token.userType as string
      if (userType !== 'HOST' && userType !== 'BOTH') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Handle authorization in the middleware function
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/host/:path*', '/profile/:path*', '/signin', '/signup'],
}
