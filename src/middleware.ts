import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CONTAINER_ROLE can be 'ADMIN', 'SELLER', or 'STOREFRONT' (default)
  const role = process.env.CONTAINER_ROLE || 'STOREFRONT';
  const path = request.nextUrl.pathname;

  // Always allow static files and internal Next.js requests to pass through
  if (
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.includes('.') // like .png, .css, etc.
  ) {
    return NextResponse.next();
  }

  if (role === 'ADMIN') {
    if (path === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (path.startsWith('/api/auth') || path.startsWith('/login')) {
      return NextResponse.next();
    }
    // If this container is deployed as ADMIN, block everything except admin routes
    if (!path.startsWith('/admin') && !path.startsWith('/api/admin')) {
      // Return standard 404 to effectively isolate this container securely
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  } else if (role === 'SELLER') {
    if (path === '/') {
      return NextResponse.redirect(new URL('/seller', request.url));
    }
    if (path.startsWith('/api/auth') || path.startsWith('/login')) {
      return NextResponse.next();
    }
    // If this container is deployed as SELLER, block everything except seller routes
    if (!path.startsWith('/seller') && !path.startsWith('/api/seller')) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  } else {
    // Default STOREFRONT mode: Block admin and seller routes
    if (
      path.startsWith('/admin') || 
      path.startsWith('/seller') || 
      path.startsWith('/api/admin') || 
      path.startsWith('/api/seller')
    ) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
