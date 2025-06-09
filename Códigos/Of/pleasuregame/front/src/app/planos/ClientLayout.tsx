"use client";

import StarsBackground from "@/components/vendas/plans/StarsBackground";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto max-w-7xl px-4 relative min-h-screen">
      <StarsBackground />
      <div className="relative">
        {children}
      </div>
    </section>
  );
} 