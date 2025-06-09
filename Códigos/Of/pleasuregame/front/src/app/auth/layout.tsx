import type { Metadata } from "next";
import AuthHeader from "@/components/auth/AuthHeader";

export const metadata: Metadata = {
  title: "Entrar | Lovely",
  description: "Acesse sua conta e gerencie suas páginas personalizadas.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-black p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col items-center gap-6">
          {/* Logo Mobile */}
          <div className="md:hidden w-full flex justify-center">
            <AuthHeader />
          </div>
          
          {/* Card principal */}
          <div className="rounded-lg border text-card-foreground shadow-sm overflow-hidden bg-neutral-900 border-neutral-800">
            <div className="grid p-0 md:grid-cols-2">
              {/* Conteúdo à esquerda (formulário) */}
              <div className="space-y-6 px-8 py-12">
                {children}
              </div>
              
              {/* Imagem/Logo à direita - apenas visível em telas MD+ */}
              <div className="relative hidden md:flex items-center justify-center bg-black/10 bg-grid-small-neutral-800/[0.5]">
                <AuthHeader />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-balance text-center text-xs text-muted-foreground">
            Copyright © {new Date().getFullYear()} - Lovely.com
          </div>
        </div>
      </div>
    </div>
  );
} 