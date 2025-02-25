import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isCreatePage = request.nextUrl.pathname === '/admin/create';

  // Get session token from cookie
  const session = request.cookies.get('session');

  if (isAdminRoute) {
    // Se estiver tentando acessar a página de criação, permitir acesso
    if (isCreatePage) {
      return NextResponse.next();
    }

    // If trying to access login page with valid session, redirect to dashboard
    if (isLoginPage && session) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // If trying to access admin routes without session, redirect to login
    if (!isLoginPage && !session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
}; 