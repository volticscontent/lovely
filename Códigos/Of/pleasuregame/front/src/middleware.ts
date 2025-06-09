import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isProtectedRoute } from '@/config/api';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const path = request.nextUrl.pathname;

  // Verifica se é uma rota protegida
  if (isProtectedRoute(path) && !token) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configuração do middleware
export const config = {
  matcher: [
    '/account/:path*',
    '/personalizacao/:path*',
    '/pages/:path*',
  ],
}; 