import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Planos | Lovely",
  description: "Escolha o plano perfeito para criar sua página personalizada.",
};

export default function PlanosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
} 