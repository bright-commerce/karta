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
    // If this container is deployed as ADMIN, block everything except admin routes
    if (!path.startsWith('/admin') && !path.startsWith('/api/admin')) {
      // Return 404 for non-admin routes to effectively isolate this container
      return new NextResponse('Not Found (This container is configured for Admin routes only)', { status: 404 });
    }
  } else if (role === 'SELLER') {
    // If this container is deployed as SELLER, block everything except seller routes
    if (!path.startsWith('/seller') && !path.startsWith('/api/seller')) {
      return new NextResponse('Not Found (This container is configured for Seller routes only)', { status: 404 });
    }
  } else {
    // Default STOREFRONT mode: Block admin and seller routes
    if (
      path.startsWith('/admin') || 
      path.startsWith('/seller') || 
      path.startsWith('/api/admin') || 
      path.startsWith('/api/seller')
    ) {
      return new NextResponse('Not Found (This container is configured for Storefront routes only)', { status: 404 });
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
