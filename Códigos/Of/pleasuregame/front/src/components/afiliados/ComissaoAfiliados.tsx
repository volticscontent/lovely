import { DollarSign } from "lucide-react";

const comissoes = [
  {
    plano: "Plano Mensal",
    valor: "R$ 29,90",
    comissao: "R$ 8,97",
    porcentagem: "30%"
  },
  {
    plano: "Plano Anual",
    valor: "R$ 299,90",
    comissao: "R$ 89,97",
    porcentagem: "30%",
    destaque: true
  }
];

export default function ComissaoAfiliados() {
  return (
    <section className="py-12 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Quanto Você Pode Ganhar
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Ganhe comissões atrativas em cada venda realizada através do seu link
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {comissoes.map((comissao, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl border ${
                comissao.destaque
                  ? "bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 border-pink-500"
                  : "bg-neutral-900/50 border-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">{comissao.plano}</h3>
                {comissao.destaque && (
                  <span className="px-3 py-1 text-sm font-medium text-pink-500 bg-pink-500/10 rounded-full">
                    Recomendado
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-400">Valor do plano</p>
                  <p className="text-2xl font-bold text-white">{comissao.valor}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Sua comissão ({comissao.porcentagem})</p>
                    <p className="text-xl font-semibold text-white">{comissao.comissao}</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 px-6 py-3 text-white font-medium bg-gradient-to-r from-pink-500 to-red-500 rounded-lg hover:opacity-90 transition-opacity">
                Começar Agora
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-400 text-sm">
            * As comissões são pagas em até 30 dias após a confirmação da venda
          </p>
        </div>
      </div>
    </section>
  );
} 