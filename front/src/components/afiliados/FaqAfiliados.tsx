import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    pergunta: "Como funciona o programa de afiliados?",
    resposta: "O programa de afiliados da Lovely é simples: você se cadastra gratuitamente, recebe seu link único de afiliado e começa a divulgar. Para cada venda realizada através do seu link, você recebe uma comissão de 30%."
  },
  {
    pergunta: "Quanto posso ganhar como afiliado?",
    resposta: "Você ganha 30% de comissão em cada venda. Por exemplo, em um plano mensal de R$ 29,90, você ganha R$ 8,97. Em um plano anual de R$ 299,90, você ganha R$ 89,97. Não há limite de ganhos!"
  },
  {
    pergunta: "Quando recebo minhas comissões?",
    resposta: "As comissões são pagas em até 30 dias após a confirmação da venda. O pagamento é realizado através de transferência bancária ou PIX, de acordo com sua preferência."
  },
  {
    pergunta: "Preciso ter experiência em marketing digital?",
    resposta: "Não é necessário ter experiência prévia. Fornecemos materiais de marketing prontos e suporte completo para ajudar você a começar. O importante é ter vontade de divulgar e uma audiência interessada."
  },
  {
    pergunta: "Existe algum custo para participar?",
    resposta: "Não há nenhum custo para participar do programa de afiliados. O cadastro é totalmente gratuito e você não precisa investir nada para começar a ganhar."
  },
  {
    pergunta: "Como faço para me cadastrar?",
    resposta: "Basta clicar no botão 'Começar Agora' em qualquer lugar desta página e preencher o formulário de cadastro. Após a aprovação, você receberá seu link de afiliado e poderá começar a divulgar."
  }
];

export default function FaqAfiliados() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 lg:py-24 bg-neutral-900/50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Tire suas dúvidas sobre o programa de afiliados
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-neutral-800 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-white">{faq.pergunta}</span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-neutral-300">{faq.resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-400">
            Ainda tem dúvidas? Entre em contato com nosso suporte
          </p>
          <button className="mt-4 px-6 py-3 text-white font-medium bg-gradient-to-r from-pink-500 to-red-500 rounded-lg hover:opacity-90 transition-opacity">
            Falar com Suporte
          </button>
        </div>
      </div>
    </section>
  );
} 