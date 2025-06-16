"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

const faqs = [
  {
    question: "Como funciona o acesso aos jogos?",
    answer: "Após a compra, você recebe acesso imediato à plataforma através do seu e-mail. Você pode jogar direto pelo navegador do celular, sem precisar baixar nada. Para incluir seu parceiro(a), basta compartilhar o QR code que aparece no seu perfil."
  },
  {
    question: "Como personalizar a experiência?",
    answer: "Nossa plataforma se adapta às suas preferências. Você pode escolher diferentes níveis de intensidade, modos de jogo e personalizar completamente sua experiência baseada no perfil do casal."
  },
  {
    question: "É preciso baixar algum aplicativo?",
    answer: "Não! Nossa plataforma funciona 100% pelo navegador do celular, tablet ou computador. Isso garante mais privacidade e praticidade para vocês jogarem quando e onde quiserem."
  },
  {
    question: "Como conecto meu parceiro(a) à minha conta?",
    answer: "É super simples: após fazer login, você encontra um QR code exclusivo no seu perfil. Seu parceiro(a) só precisa escanear esse código com a câmera do celular para ser conectado automaticamente à sua conta."
  },
  {
    question: "Os jogos são seguros e discretos?",
    answer: "Absolutamente! Priorizamos sua privacidade. Todo o conteúdo é protegido por criptografia, não armazenamos dados sensíveis e o acesso é protegido por senha. Além disso, o nome da cobrança aparece de forma discreta na fatura do cartão."
  },
  {
    question: "Que tipos de jogos estão disponíveis?",
    answer: "Temos uma variedade de jogos que incluem desafios de intimidade, roleplay com narração, perguntas picantes, desafios com timer, modo exploração e muito mais. O conteúdo é adaptado às preferências do casal e evolui conforme vocês jogam."
  },
  {
    question: "Posso presentear meu parceiro(a)?",
    answer: "Sim! Temos uma opção especial de presente onde você pode enviar o acesso com uma mensagem personalizada, cartão digital animado e programar a data de liberação. É perfeito para surpreender em ocasiões especiais."
  },
  {
    question: "Como é feito o pagamento?",
    answer: "Aceitamos todas as principais formas de pagamento: cartão de crédito, PIX e boleto. O processo é 100% seguro e você tem acesso imediato após a confirmação do pagamento."
  },
  {
    question: "E se eu não gostar?",
    answer: "Oferecemos garantia de 7 dias. Se você não ficar satisfeito por qualquer motivo, basta nos enviar um e-mail que devolvemos 100% do seu dinheiro, sem questionamentos."
  }
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-8 lg:py-32 bg-black">
      <div className="container max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between gap-8 md:gap-12">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <button className="relative flex border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit rounded-full">
            <div className="w-auto z-10 px-4 py-2 rounded-[inherit] bg-black text-white text-xs flex items-center space-x-2">
              <span>F.A.Q</span>
            </div>
            <div 
              className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
              style={{
                filter: 'blur(2px)',
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(17.7965% 45.1089% at 14.9905% 64.6057%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)'
              }}
            />
            <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
          </button>

          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-white text-2xl sm:text-3xl lg:text-5xl font-sans py-2 relative z-20 font-bold tracking-tight mt-4">
            Perguntas Frequentes
          </h2>
          <p className="max-w-xl text-left text-sm sm:text-base md:text-lg text-neutral-300 mt-2 mb-6">
            Aqui estão algumas perguntas frequentes para ajudar você a entender melhor nossa plataforma. Caso tenha alguma dúvida, entre em contato conosco.
          </p>
          <a 
            href="https://www.instagram.com/direct/t/17843072010081129"
            className="text-left text-sm md:text-base text-neutral-500 mt-6 underline hover:text-neutral-400 transition-colors inline-block"
            suppressHydrationWarning
          >
            Dúvidas? Entre em contato por aqui
          </a>
        </div>

        <div className="w-full md:w-1/2">
          <Accordion.Root type="single" collapsible className="space-y-2 md:space-y-4">
            {faqs.map((faq, index) => (
              <Accordion.Item key={index} value={`item-${index}`} className="border-b border-neutral-800">
                <Accordion.Header className="flex">
                  <Accordion.Trigger className="flex w-full items-center justify-between py-3 md:py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 text-neutral-100 text-sm sm:text-base">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-4" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden text-xs sm:text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-3 md:pb-4 text-neutral-300 pr-8">
                  {faq.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
