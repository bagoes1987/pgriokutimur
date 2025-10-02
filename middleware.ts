import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from './lib/auth-edge'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('Middleware: Processing request for:', pathname)

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/berita',
    '/pengurus',
    '/cari-anggota',
    '/statistik',
    '/tentang',
    '/daftar',
    '/login',
    '/forgot-password',
    '/reset-password',
    '/test-auth'
  ]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/api/public') || pathname.startsWith('/berita/')
  )

  console.log('Middleware: Is public route:', isPublicRoute)

  if (isPublicRoute) {
    console.log('Middleware: Allowing public route')
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value
  console.log('Middleware: Token found:', !!token)
  console.log('Middleware: Token value:', token ? token.substring(0, 20) + '...' : 'none')

  if (!token) {
    console.log('Middleware: No token, redirecting to login')
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token
  const user = await verifyTokenEdge(token)
  console.log('Middleware: Token verification result:', !!user)
  console.log('Middleware: User role:', user?.role)
  
  if (!user) {
    console.log('Middleware: Invalid token, clearing and redirecting')
    // Clear invalid token and redirect
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }

  // Check role-based access
  if (pathname.startsWith('/admin') && user.role !== 'admin') {
    console.log('Middleware: Admin access denied for role:', user.role)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/member') && user.role !== 'member') {
    console.log('Middleware: Member access denied for role:', user.role)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('Middleware: Access granted for:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images)
     * - public static files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.).*)',
  ],
}