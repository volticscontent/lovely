"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    mail: '',
    senha: '',
    nome: '',
    surn: '',
    phone: '',
    cpf: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.mail || !formData.senha || !formData.nome || 
        !formData.surn || !formData.phone || !formData.cpf) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (!formData.mail.includes('@')) {
      setError('Email inválido');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Validar CPF
    const cpfNumbers = formData.cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      setError('CPF inválido');
      return;
    }

    // Validar telefone
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      setError('Telefone inválido');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // Mapear os campos para o formato esperado pela função signUp
      const signUpData = {
        email: formData.mail,
        password: formData.senha,
        name: `${formData.nome} ${formData.surn}`
      };
      await signUp(signUpData);
    } catch (err) {
      setError('Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 -ml-2">
          <Link href="/auth" className="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left h-10 p-0">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Criar conta</h1>
        </div>
        <p className="text-md lg:text-md text-muted-foreground">
          Preencha os dados abaixo para criar sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-white">
            E-mail
          </label>
          <div className="p-[2px] rounded-lg transition duration-300 group/input">
            <input
              type="email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              className="flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        {/* Senha */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-white">
            Senha
          </label>
          <div className="p-[2px] rounded-lg transition duration-300 group/input">
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Nome */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-white">
            Nome
          </label>
          <div className="p-[2px] rounded-lg transition duration-300 group/input">
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm"
              placeholder="Seu nome"
              required
            />
          </div>
        </div>

        {/* Sobrenome */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-white">
            Sobrenome
          </label>
          <div className="p-[2px] rounded-lg transition duration-300 group/input">
            <input
              type="text"
              name="surn"
              value={formData.surn}
              onChange={handleChange}
              className="flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm"
              placeholder="Seu sobrenome"
              required
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-white">
            Telefone
          </label>
          <div className="p-[2px] rounded-lg transition duration-300 group/input">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm"
              placeholder="(00) 00000-0000"
              required
            />
          </div>
        </div>

        {/* CPF */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-white">
            CPF
          </label>
          <div className="p-[2px] rounded-lg transition duration-300 group/input">
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm"
              placeholder="000.000.000-00"
              required
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </button>

        <div className="text-center">
          <Link href="/auth" className="text-sm text-primary hover:underline">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </form>
    </div>
  );
} 