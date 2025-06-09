import { ArrowRight, Link, Users, Wallet } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Cadastre-se",
    description: "Faça seu cadastro gratuito no programa de afiliados da Lovely."
  },
  {
    icon: Link,
    title: "Compartilhe",
    description: "Receba seu link único de afiliado e comece a divulgar para sua audiência."
  },
  {
    icon: Wallet,
    title: "Ganhe",
    description: "Receba comissões por cada venda realizada através do seu link."
  }
];

export default function ComoFuncionaAfiliados() {
  return (
    <section className="py-12 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Comece a ganhar dinheiro com a Lovely em três passos simples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-neutral-300">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                  <ArrowRight className="w-6 h-6 text-neutral-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 