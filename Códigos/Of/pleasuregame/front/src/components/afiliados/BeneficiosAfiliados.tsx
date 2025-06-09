import { BadgePercent, Clock, DollarSign, Globe2, Headphones, Zap } from "lucide-react";

const beneficios = [
  {
    icon: BadgePercent,
    title: "Comissões Atrativas",
    description: "Ganhe até 30% de comissão em cada venda realizada através do seu link."
  },
  {
    icon: Clock,
    title: "Pagamento Rápido",
    description: "Receba suas comissões em até 30 dias após a venda ser confirmada."
  },
  {
    icon: Globe2,
    title: "Alcance Global",
    description: "Divulgue para qualquer pessoa em qualquer lugar do mundo."
  },
  {
    icon: Headphones,
    title: "Suporte Dedicado",
    description: "Conte com nossa equipe para ajudar em todas as suas dúvidas."
  },
  {
    icon: DollarSign,
    title: "Sem Investimento",
    description: "Comece a ganhar sem precisar investir nada, apenas divulgando."
  },
  {
    icon: Zap,
    title: "Materiais Prontos",
    description: "Acesso a materiais de marketing profissionais para suas divulgações."
  }
];

export default function BeneficiosAfiliados() {
  return (
    <section className="py-12 lg:py-24 bg-neutral-900/50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Benefícios do Programa
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Descubra todas as vantagens de ser um afiliado Lovely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((beneficio, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-neutral-800/30 border border-neutral-700 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <beneficio.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{beneficio.title}</h3>
                  <p className="text-neutral-300">{beneficio.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 