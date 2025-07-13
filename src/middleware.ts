import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/products', '/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Rutas privadas que requieren autenticación
  const privateRoutes = ['/profile', '/orders', '/checkout', '/cart'];
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  // Si es una ruta privada y no hay token, redirigir a login
  if (isPrivateRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si está autenticado y trata de acceder a login/register, redirigir a home
  if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 