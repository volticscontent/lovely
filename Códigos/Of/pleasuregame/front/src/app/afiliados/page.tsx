"use client";

import AfiliadosHero from "@/components/afiliados/AfiliadosHero";
import ComoFuncionaAfiliados from "@/components/afiliados/ComoFuncionaAfiliados";
import BeneficiosAfiliados from "@/components/afiliados/BeneficiosAfiliados";
import ComissaoAfiliados from "@/components/afiliados/ComissaoAfiliados";
import FaqAfiliados from "@/components/afiliados/FaqAfiliados";

export default function PaginaAfiliados() {
  return (
    <main>
      <AfiliadosHero />
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      <ComoFuncionaAfiliados />
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      <BeneficiosAfiliados />
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      <ComissaoAfiliados />
      <div className="h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      <FaqAfiliados />
    </main>
  );
} 