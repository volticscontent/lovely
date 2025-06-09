"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Função para mascarar dados sensíveis
const maskData = (data: string | undefined, type: 'email') => {
  if (!data) return '';
  
  if (type === 'email') {
    const [username, domain] = data.split('@');
    return `${username[0]}${username[1]}***@${domain}`;
  }
  
  return data;
};

export default function AccountPage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-white text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Minha Conta</h1>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Sair
          </button>
        </div>

        <div className="bg-neutral-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-neutral-400 text-sm">Nome</p>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">E-mail</p>
              <p className="text-lg">{maskData(user.email, 'email')}</p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Minhas Personalizações</h2>
          <div className="text-center py-8">
            <p className="text-neutral-400 mb-4">
              Você ainda não tem nenhuma personalização salva.
            </p>
            <button
              onClick={() => router.push('/personalizacao')}
              className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-md transition-colors"
            >
              Criar Nova Personalização
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 