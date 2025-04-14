import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pbAuth = request.cookies.get('id_token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  // Check both cookie and localStorage auth state
  const isAuthenticated = pbAuth?.value && pbAuth.value.length > 0

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/',
  ]
} 