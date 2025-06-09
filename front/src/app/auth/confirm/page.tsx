"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirecionar se não tiver email
  useEffect(() => {
    if (!email) {
      router.push('/auth');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 4) return;
    
    setIsSubmitting(true);
    
    // Simulação de verificação do código (em um app real, isso seria uma API call)
    setTimeout(() => {
      // Redirecionar para página da conta após verificação bem-sucedida
      router.push('/account');
      setIsSubmitting(false);
    }, 1500);
  };

  const handleResendCode = () => {
    // Simulação de reenvio de código
    alert(`Código reenviado para ${email}`);
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
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Código de validação</h1>
        </div>
        <p className="text-md lg:text-md text-muted-foreground">
          Digite o código de validação enviado para o seu e-mail ou{' '}
          <Link href="/auth" className="text-primary hover:underline">
            clique aqui para voltar
          </Link>
          .
        </p>
      </div>

      <div className="py-4">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label 
                className="text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" 
                htmlFor="code-input"
              >
                Código de verificação
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
                  type="text"
                  className="flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400"
                  placeholder="000000"
                  id="code-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              type="submit"
              disabled={!code || code.length < 6 || isSubmitting}
            >
              {isSubmitting ? 'Validando...' : 'Validar código'}
            </button>
            
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={handleResendCode}
            >
              Reenviar código
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Carregando...</h1>
          <p className="text-md lg:text-md text-muted-foreground">
            Aguarde um momento...
          </p>
        </div>
      </div>
    }>
      <ConfirmPageContent />
    </Suspense>
  );
} 