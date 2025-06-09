import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware simplificado - apenas permite todas as requisições
  // As verificações de autenticação são feitas pelo backend
  return NextResponse.next();
}

// Configuração do middleware - removendo rotas protegidas
export const config = {
  matcher: [
    // Apenas para rotas que realmente precisam de processamento
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 