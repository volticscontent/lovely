"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Validações de segurança simplificadas
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): string | null => {
  if (password.length < 3) {
    return 'A senha deve ter pelo menos 3 caracteres';
  }
  return null;
};

export default function AuthPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    // Validação de email
    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    // Validação de senha
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Tentando fazer login com:', { email, password });
      await signIn(email, password);
      console.log('Login realizado com sucesso!');
      // O redirecionamento será feito automaticamente pelo AuthContext
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Credenciais inválidas ou erro de conexão');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 -ml-2">
          <Link href="/" className="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left h-10 p-0">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Acessar sua conta</h1>
        </div>
        <p className="text-md lg:text-md text-muted-foreground">
          Digite seu e-mail e senha para acessar sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          {/* Campo de email */}
          <div className="space-y-2">
            <label 
              className="text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" 
              htmlFor="email-input"
            >
              E-mail
            </label>
            <div 
              className="p-[2px] rounded-lg transition duration-300 group/input"
              style={{ 
                background: `radial-gradient(
                  0px circle at 0px 0px,
                  var(--blue-500),
                  transparent 80%
                )`
              }}
            >
              <input
                type="email"
                className="flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400"
                placeholder="gusta@teste.com"
                id="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo de senha */}
          <div className="space-y-2">
            <label 
              className="text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" 
              htmlFor="password-input"
            >
              Senha
            </label>
            <div 
              className="p-[2px] rounded-lg transition duration-300 group/input"
              style={{ 
                background: `radial-gradient(
                  0px circle at 0px 0px,
                  var(--blue-500),
                  transparent 80%
                )`
              }}
            >
              <input
                type="password"
                className="flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400"
                placeholder="123456"
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!email || !password || isSubmitting}
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
} 