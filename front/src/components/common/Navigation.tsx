"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

// Função debounce simples
function debounce(
  func: (e: KeyboardEvent) => void,
  wait: number
): (e: KeyboardEvent) => void {
  let timeout: NodeJS.Timeout;
  return (e: KeyboardEvent) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(e), wait);
  };
}

export default function BarraNavegacao() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, logout } = useAuth();

  // Hook para garantir hidratação consistente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Construir URL do lovelyapp para usuário logado
  const getUserDashboardUrl = () => {
    if (!isClient || !user?.id) return '/auth';
    
    const token = Cookies.get('auth_token');
    // Assumir plano padrão se não especificado
    const userPlan = 'no-climinha'; // Pode ser obtido do contexto se disponível
    
    if (token) {
      return `http://localhost:3001/${user.id}/${userPlan}?token=${token}`;
    }
    return `http://localhost:3001/${user.id}/${userPlan}`;
  };

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await logout();
      closeMobileMenu();
    } catch (error) {
      // Manter apenas erro crítico sem log
    }
  };

  // Fechar menu mobile quando clicar em um link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Toggle do menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fechar menu mobile quando pressionar ESC - com debounce
  useEffect(() => {
    const handleEscape = debounce((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    }, 150);

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll do body quando menu estiver aberto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Removido log de debug
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="bg-black shadow-md py-2 md:py-4 relative z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 pl-0 md:pl-0 py-1 md:py-0">
            <div className="relative h-14 w-14 md:h-14 md:w-16 overflow-visible">
              <Image 
                src="/images/logo.png" 
                alt="Lovely Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain scale-125"
                style={{
                  backgroundColor: 'transparent',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  if (e.currentTarget) {
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            </div>
            <div className="text-white font-bold text-3xl md:text-4xl tracking-wide">
              <span className="text-white">Love</span>
              <span className="text-red-500">ly</span>
            </div>
          </div>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-red-400 transition-colors" suppressHydrationWarning>
              Surpreenda
            </Link>
            <Link href="/planos" className="text-white hover:text-red-400 transition-colors" suppressHydrationWarning>
              Planos
            </Link>
            <Link href="/vendas#faq" className="text-white hover:text-red-400 transition-colors" suppressHydrationWarning>
              F.A.Q
            </Link>
            <Link href="/afiliados" className="text-white hover:text-red-400 transition-colors" suppressHydrationWarning>
              Programa de afiliados
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 py-1 md:py-0">
            {/* Área do usuário */}
            {isClient && user ? (
              <div className="flex items-center space-x-3">
                {/* Link para dashboard */}
                <a href={getUserDashboardUrl()} className="text-white hover:text-red-400 p-1">
                  <div className="flex items-center gap-2">
                    <span className="hidden md:block text-sm">{user.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </a>
                
                {/* Botão de logout - Desktop */}
                <button 
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1 text-white hover:text-red-400 transition-colors p-1 text-sm"
                  title="Sair"
                >
                  <span>Sair</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : isClient ? (
              <Link href="/auth" className="text-white hover:text-red-400 p-1" suppressHydrationWarning>
                <div className="flex items-center gap-2">
                  <span className="hidden md:block text-sm">Entrar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            ) : (
              // Placeholder durante hidratação
              <div className="text-white p-1">
                <div className="flex items-center gap-2">
                  <span className="hidden md:block text-sm">...</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Botão Menu Mobile - Versão Simplificada */}
            <button 
              className="md:hidden text-white hover:text-red-400 p-2 transition-colors border border-gray-600 rounded"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              type="button"
            >
              {isMobileMenuOpen ? (
                // Ícone X quando menu está aberto
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Ícone hambúrguer quando menu está fechado
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile - Versão Simplificada */}
      {isClient && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black z-[9999] md:hidden"
          style={{
            backgroundColor: '#000000',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          {/* Container do Menu */}
          <div className="flex flex-col h-full justify-between p-6 pt-7" style={{ color: 'white' }}>
            
            {/* Header com Logo e Botão Fechar */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-white font-bold text-3xl tracking-wide">
                  <span className="text-white">Love</span>
                  <span className="text-red-500">ly</span>
                </div>
              </div>
              
              <button 
                onClick={closeMobileMenu}
                className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Close menu"
                type="button"
                style={{ backgroundColor: '#374151', color: 'white' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Links do Menu Principal */}
            <div className="flex-1 flex flex-col justify-center space-y-8">
              <Link 
                href="/vendas" 
                className="group flex items-center space-x-4 text-white hover:text-red-400 transition-all duration-300"
                onClick={closeMobileMenu}
                style={{ color: 'white' }}
                suppressHydrationWarning
              >
                <div className="w-12 h-12 bg-gray-800 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'white' }}>Surpreenda</h3>
                  <p className="text-gray-400 text-sm">Jogos para casais</p>
                </div>
              </Link>
              
              <Link 
                href="/planos" 
                className="group flex items-center space-x-4 text-white hover:text-red-400 transition-all duration-300"
                onClick={closeMobileMenu}
                style={{ color: 'white' }}
                suppressHydrationWarning
              >
                <div className="w-12 h-12 bg-gray-800 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'white' }}>Planos</h3>
                  <p className="text-gray-400 text-sm">Escolha seu plano</p>
                </div>
              </Link>
              
              <Link 
                href="/vendas#faq" 
                className="group flex items-center space-x-4 text-white hover:text-red-400 transition-all duration-300"
                onClick={closeMobileMenu}
                style={{ color: 'white' }}
                suppressHydrationWarning
              >
                <div className="w-12 h-12 bg-gray-800 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'white' }}>F.A.Q</h3>
                  <p className="text-gray-400 text-sm">Perguntas frequentes</p>
                </div>
              </Link>
              
              <Link 
                href="/afiliados" 
                className="group flex items-center space-x-4 text-white hover:text-red-400 transition-all duration-300"
                onClick={closeMobileMenu}
                style={{ color: 'white' }}
                suppressHydrationWarning
              >
                <div className="w-12 h-12 bg-gray-800 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'white' }}>Afiliados</h3>
                  <p className="text-gray-400 text-sm">Programa de parceiros</p>
                </div>
              </Link>
            </div>

            {/* Footer com Ação do Usuário */}
            <div className="mt-12">
              {user ? (
                <div className="space-y-6 mb-25">
                  <div className="flex items-center space-x-4 p-4 bg-gray-900 rounded-2xl">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg" style={{ color: 'white' }}>{user.name}</h4>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="space-y-3">
                    <a 
                      href={getUserDashboardUrl()} 
                      className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-4 px-6 rounded-2xl transition-all duration-300 font-bold text-lg"
                      onClick={closeMobileMenu}
                      style={{ backgroundColor: '#dc2626', color: 'white' }}
                    >
                      🚀 Acessar Dashboard
                    </a>
                    
                    {/* Botão de logout - Mobile */}
                    <button 
                      onClick={handleLogout}
                      className="block w-full bg-gray-700 hover:bg-gray-600 text-white text-center py-3 px-6 rounded-2xl transition-all duration-300 font-medium text-base"
                      style={{ backgroundColor: '#374151', color: 'white' }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sair da Conta</span>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/auth" 
                  className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-4 px-6 rounded-2xl transition-all duration-300 font-bold text-lg"
                  onClick={closeMobileMenu}
                  style={{ backgroundColor: '#dc2626', color: 'white' }}
                  suppressHydrationWarning
                >
                  💖 Entrar / Cadastrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
