import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Headers de segurança e performance
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Cache headers baseados no tipo de arquivo
  if (pathname.startsWith('/_next/static/')) {
    // Arquivos estáticos do Next.js - cache longo
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
    response.headers.set('Vary', 'Accept-Encoding');
  } else if (pathname.startsWith('/images/') || /\.(jpg|jpeg|png|webp|gif|svg|ico)$/.test(pathname)) {
    // Imagens - cache médio
    response.headers.set(
      'Cache-Control',
      'public, max-age=604800, stale-while-revalidate=86400'
    );
    response.headers.set('Vary', 'Accept, Accept-Encoding');
  } else if (pathname.startsWith('/api/')) {
    // API routes - cache curto com revalidação
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=60'
    );
    response.headers.set('Vary', 'Accept, Authorization');
  } else if (pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/planos')) {
    // Páginas principais - cache curto
    response.headers.set(
      'Cache-Control',
      'public, max-age=60, stale-while-revalidate=300'
    );
    response.headers.set('Vary', 'Accept-Encoding, Accept');
  }

  // Headers de compressão
  const acceptEncoding = request.headers.get('accept-encoding');
  if (acceptEncoding?.includes('gzip')) {
    response.headers.set('Content-Encoding', 'gzip');
  } else if (acceptEncoding?.includes('br')) {
    response.headers.set('Content-Encoding', 'br');
  }

  // Headers de performance
  response.headers.set('Server-Timing', 'middleware;dur=1');
  
  // Headers para PWA
  if (pathname === '/') {
    response.headers.set('Link', '</manifest.json>; rel=manifest');
  }

  // Early hints para recursos críticos
  if (pathname === '/') {
    response.headers.set(
      'Link',
      '</images/logo.png>; rel=preload; as=image, </_next/static/css/app/globals.css>; rel=preload; as=style'
    );
  }

  return response;
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 