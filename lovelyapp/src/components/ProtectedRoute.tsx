'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Se há parâmetros de callback, deixar a página processar
    const hasCallbackParams = searchParams.get('token') && searchParams.get('user');
    
    if (hasCallbackParams) {
      console.log('🔄 [PROTECTED ROUTE] Parâmetros de callback detectados, aguardando processamento...');
      setShowLogin(false);
      return;
    }

    // Se ainda está carregando, aguardar
    if (loading) {
      console.log('⏳ [PROTECTED ROUTE] Aguardando carregamento da autenticação...');
      setShowLogin(false);
      return;
    }

    // Se não há usuário e não há parâmetros de callback, mostrar tela de login
    if (!user) {
      console.log('🚫 [PROTECTED ROUTE] Usuário não encontrado, mostrando tela de login');
      setShowLogin(true);
      return;
    }

    // Usuário autenticado
    console.log('✅ [PROTECTED ROUTE] Usuário autenticado:', user.name);
    setShowLogin(false);
  }, [user, loading, searchParams]);

  // Se há parâmetros de callback ou está carregando, renderizar normalmente
  const hasCallbackParams = searchParams.get('token') && searchParams.get('user');
  if (hasCallbackParams || loading) {
    return <>{children}</>;
  }

  // Se deve mostrar login, mostrar tela de acesso
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💖</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">LovelyApp</h1>
              <p className="text-gray-600">Acesso Necessário</p>
            </div>
            
            <p className="text-gray-700 mb-6">
              Para acessar o LovelyApp, você precisa fazer login primeiro.
            </p>
            
            <button
              onClick={() => {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
                window.location.href = `${API_URL}/auth`;
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuário autenticado, renderizar conteúdo protegido
  return <>{children}</>;
} 