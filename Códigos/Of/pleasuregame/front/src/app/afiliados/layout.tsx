import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programa de Afiliados | Lovely",
  description: "Ganhe dinheiro indicando a Lovely. Comissões atrativas, pagamento rápido e suporte dedicado para nossos afiliados.",
};

export default function AfiliadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
      {children}
    </section>
  );
} 