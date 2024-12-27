import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const isAuthRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAuthRoute && !session?.user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAdminRoute) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
} 