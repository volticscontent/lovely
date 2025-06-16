'use client';

import React, { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLoadingState } from '@/hooks/usePreventInfiniteLoop';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isLoading: isLoggingOut, error: logoutError, executeAsync: executeLogout } = useLoadingState();

  const handleLogout = useCallback(async () => {
    try {
      await executeLogout(async () => {
        await logout();
        router.push('/auth');
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [logout, router, executeLogout]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Usuário não autenticado</p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Informações do Usuário</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            {logoutError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">
                  Erro ao fazer logout. Por favor, tente novamente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 