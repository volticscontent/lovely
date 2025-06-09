'use client';

import { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/UserDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

function CallbackProcessor({ children }: { children: React.ReactNode }) {
  const { setUserData, user, loading } = useAuth();
  const router = useRouter();
  const hasProcessedCallback = useRef(false);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  const processCallback = useCallback(async () => {
    console.log('🔥 [CALLBACK PROCESSOR] processCallback iniciado!');
    
    // Evitar processamento múltiplo
    if (hasProcessedCallback.current) {
      console.log('🔄 [CALLBACK] Já processado, ignorando...');
      return;
    }

    // ✅ USAR API NATIVA DO BROWSER EM VEZ DE useSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');

    console.log('🔄 [CALLBACK] Verificando parâmetros...');
    console.log('🔑 [CALLBACK] Token:', token ? `PRESENTE (${token.substring(0, 20)}...)` : 'AUSENTE');
    console.log('👤 [CALLBACK] User:', userParam ? `PRESENTE (${userParam.substring(0, 50)}...)` : 'AUSENTE');

    if (token && userParam) {
      console.log('✅ [CALLBACK] Parâmetros válidos encontrados, processando...');
      
      hasProcessedCallback.current = true;
      setIsProcessingCallback(true);
      
      try {
        // LIMPAR COMPLETAMENTE O LOCALSTORAGE
        console.log('🧹 [CALLBACK] Limpando localStorage...');
        localStorage.clear();
        
        // Aguardar para garantir limpeza
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // SALVAR NOVO TOKEN COM A CHAVE CORRETA
        console.log('💾 [CALLBACK] Salvando novo token...');
        localStorage.setItem('token', token);
        console.log('💾 [CALLBACK] Token salvo no localStorage:', localStorage.getItem('token') ? 'SUCESSO' : 'FALHA');
        
        // DECODIFICAR DADOS DO USUÁRIO
        console.log('🔓 [CALLBACK] Decodificando dados do usuário...');
        const userData = JSON.parse(decodeURIComponent(userParam));
        console.log('👤 [CALLBACK] Dados decodificados:', userData);
        
        // VERIFICAR SE OS DADOS ESTÃO COMPLETOS
        if (!userData.id || !userData.email || !userData.name) {
          throw new Error('Dados do usuário incompletos');
        }
        
        // DEFINIR NO CONTEXTO
        console.log('🔄 [CALLBACK] Definindo no contexto...');
        console.log('🔄 [CALLBACK] Estado antes de setUserData:', { user, loading });
        
        // Chamar setUserData e aguardar um pouco para o estado atualizar
        setUserData(userData);
        console.log('🔄 [CALLBACK] setUserData chamado com:', userData);
        
        // AGUARDAR PARA GARANTIR QUE O ESTADO FOI ATUALIZADO
        console.log('⏳ [CALLBACK] Aguardando atualização do estado...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // LIMPAR URL
        console.log('🧹 [CALLBACK] Limpando URL...');
        window.history.replaceState({}, '', '/');
        
        console.log('✅ [CALLBACK] Processamento concluído com sucesso!');
        console.log('✅ [CALLBACK] Usuário final:', userData);
        
      } catch (error) {
        console.error('❌ [CALLBACK] Erro no processamento:', error);
        localStorage.clear();
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
        window.location.href = `${API_URL}/auth`;
      } finally {
        setIsProcessingCallback(false);
      }
    } else {
      console.log('ℹ️ [CALLBACK] Sem parâmetros de callback, continuando normalmente...');
    }
  }, [setUserData, user, loading]);

  useEffect(() => {
    console.log('🔥 [CALLBACK PROCESSOR] useEffect executado!');
    console.log('🔥 [CALLBACK PROCESSOR] URL completa:', window.location.href);
    console.log('🔥 [CALLBACK PROCESSOR] Search params:', window.location.search);
    console.log('🔥 [CALLBACK PROCESSOR] hasProcessedCallback.current:', hasProcessedCallback.current);
    
    // ✅ EXECUTAR IMEDIATAMENTE
    processCallback();
  }, [processCallback]);

  // Mostrar loading durante processamento
  if (isProcessingCallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">🔄 Processando login...</p>
          <p className="text-gray-500 text-sm mt-2">Configurando sua sessão...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ✅ COMPONENTE COM SUSPENSE PARA NEXT.JS 15
function CallbackProcessorWithSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">🔄 Carregando...</p>
        </div>
      </div>
    }>
      <CallbackProcessor>{children}</CallbackProcessor>
    </Suspense>
  );
}

export default function HomePage() {
  console.log('🏠 [HOME PAGE] Componente renderizado!');
  
  return (
    <CallbackProcessorWithSuspense>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <UserDashboard />
        </div>
      </ProtectedRoute>
    </CallbackProcessorWithSuspense>
  );
} 