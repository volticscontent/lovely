"use client";

import React from 'react';
import { Users, QrCode, Sparkles, Crown, Zap, Flame } from 'lucide-react';

export default function RecursosSection() {
  return (
    <section className="relative z-20 py-32 max-w-7xl mx-auto" data-sentry-component="Features">
      <div className="px-8">
        <h2 className="mx-auto text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-white text-3xl lg:text-5xl font-sans py-2 relative z-20 font-bold tracking-tight">
          Vários Recursos
        </h2>
        <p className="max-w-xl mx-auto text-center text-base md:text-lg text-neutral-300">
          Veja os recursos que você pode adicionar à sua página personalizada
        </p>
      </div>
      
      <div className="relative mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-14 xl:border rounded-md border-neutral-800">
          {/* Multi-usuário e QR Code */}
          <div className="px-4 py-10 sm:py-8 sm:px-8 relative overflow-hidden col-span-1 lg:col-span-4 border-b lg:border-r border-neutral-800">
            <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug">
              Compartilhe com quem você ama
            </p>
            <p className="text-sm font-normal text-neutral-300 text-left max-w-sm mx-0 md:text-sm my-2">
              Conecte até 4 pessoas através do nosso sistema exclusivo de QR Code.
            </p>
            <div className="h-full w-full">
              <div className="relative flex p-2 sm:p-4 px-2 gap-6 sm:gap-10 h-full">
                <div className="mx-auto group h-full">
                  <div className="flex h-full flex-col space-y-2">
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6 mt-6 sm:mt-8">
                      {/* Card Multi-usuário */}
                      <div className="group/card w-full lg:min-w-[16rem] h-[10rem] sm:h-[12rem] hover:shadow-2xl hover:shadow-pink-500/[0.1] flex flex-col bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 relative overflow-hidden border border-neutral-700/50 transition-all duration-300 hover:border-pink-500/30">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-pink-400 mb-2 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Multi-usuário</h3>
                        <p className="text-xs sm:text-sm text-neutral-300">Compartilhe a experiência com até 4 pessoas dependendo do plano escolhido.</p>
                        {/* Efeito de brilho */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Card QR Code */}
                      <div className="group/card w-full lg:min-w-[16rem] h-[10rem] sm:h-[12rem] hover:shadow-2xl hover:shadow-purple-500/[0.1] flex flex-col bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 relative overflow-hidden border border-neutral-700/50 transition-all duration-300 hover:border-purple-500/30">
                        <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mb-2 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Conexão QR Code</h3>
                        <p className="text-xs sm:text-sm text-neutral-300">Sistema exclusivo para conectar os usuários de forma rápida e segura.</p>
                        {/* Efeito de brilho */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Futuras */}
          <div className="px-4 py-15 sm:py-8 sm:px-8 relative overflow-hidden col-span-1 lg:col-span-2 border-b border-neutral-800">
            <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug">
              Atualizações Constantes
            </p>
            <p className="text-sm font-normal text-neutral-300 text-left max-w-sm mx-0 md:text-sm my-2">
              Acesso vitalício a todas as novas funcionalidades sem custo adicional.
            </p>
            <div className="h-full w-full">
              <div className="relative w-full mx-auto bg-transparent group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2 relative">
                  <div className="rounded-xl mt-6 sm:mt-8 overflow-hidden">
                    <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-600/10 backdrop-blur-xl p-4 sm:p-6 group/card hover:shadow-2xl hover:shadow-emerald-500/[0.2] border border-emerald-500/30 transition-all duration-300 hover:border-emerald-400/50 min-h-[160px] sm:min-h-[180px] flex flex-col justify-center">
                      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-400 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 mb-1 sm:mb-2">
                            Sempre Atualizado
                          </h3>
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-emerald-300 font-medium">Novidades toda semana</span>
                          </div>
                          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                            Novos jogos, desafios e conteúdos são adicionados regularmente para manter a experiência sempre fresca.
                          </p>
                        </div>
                      </div>
                      {/* Efeito de brilho melhorado */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                      {/* Partículas flutuantes removidas para mobile */}
                      <div className="hidden sm:block absolute top-3 right-3 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
                      <div className="hidden sm:block absolute bottom-3 right-3 w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse opacity-40"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 💖 PLANOS DE ACESSO */}
          <div className="px-4 py-20 sm:py-8 sm:px-8 relative overflow-hidden col-span-1 lg:col-span-3 lg:border-r border-neutral-800">
            <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug">
               Planos de Acesso
            </p>
            <p className="text-sm font-normal mb-10 text-neutral-300 text-left max-w-sm mx-0 md:text-sm my-2">
              Escolha o plano ideal para você e desbloqueie todos os recursos.
            </p>
            <div className="h-full w-full">
              <div className="relative flex flex-col gap-2 sm:gap-4 mt-4 sm:mt-6 h-full max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-500/50 scrollbar-track-transparent"
                   style={{
                     WebkitOverflowScrolling: 'touch',
                     scrollbarWidth: 'thin',
                     scrollbarColor: 'rgba(239, 68, 68, 0.5) transparent'
                   }}>
                {/* Plano No Climinha */}
                <div className="group/card mb-2 bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-xl rounded-xl p-2.5 sm:p-4 relative overflow-hidden border border-green-500/30 transition-all duration-300 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02]"
                     style={{
                       WebkitTapHighlightColor: 'transparent',
                       touchAction: 'manipulation'
                     }}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-white">🟢 No Climinha</h3>
                      <span className="text-xs text-green-300">Jogos românticos e divertidos</span>
                    </div>
                    <span className="text-green-400 font-bold text-xs sm:text-sm">R$ 47,90</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Jogos mais lights como Date10 e Roleta do Desejo. Perfeito para casais que querem se divertir sem focar no erotismo.
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/8 via-emerald-400/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Plano Modo Quente */}
                <div className="group/card mb-2 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-xl p-2.5 sm:p-4 relative overflow-hidden border border-orange-500/30 transition-all duration-300 hover:border-orange-400/60 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02]"
                     style={{
                       WebkitTapHighlightColor: 'transparent',
                       touchAction: 'manipulation'
                     }}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-white">🟡 Modo Quente</h3>
                      <span className="text-xs text-orange-300">Esquentando a relação</span>
                    </div>
                    <span className="text-orange-400 font-bold text-xs sm:text-sm">R$ 57,90</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Experiência voltada para esquentar a relação. Jogos mais picantes e fantasias para apimentar o relacionamento.
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/8 via-red-400/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Plano Sem Freio */}
                <div className="group/card bg-gradient-to-br from-red-500/10 to-pink-600/10 backdrop-blur-xl rounded-xl p-2.5 sm:p-4 relative overflow-hidden border border-red-500/30 transition-all duration-300 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.02]"
                     style={{
                       WebkitTapHighlightColor: 'transparent',
                       touchAction: 'manipulation'
                     }}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-white">🔴 Sem Freio</h3>
                      <span className="text-xs text-red-300">Diversão completa</span>
                    </div>
                    <span className="text-red-400 font-bold text-xs sm:text-sm">R$ 77,90</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Diversão completa! Tudo liberado: roleplay, massagem, conquistas ilimitadas e acesso antecipado a todas as novidades.
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/8 via-pink-400/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Em todo lugar */}
          <div className="px-4 py-25 sm:py-8 sm:px-8 relative overflow-hidden col-span-1 lg:col-span-3 border-b lg:border-none border-t border-neutral-800">
            <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug">
              Em todo lugar
            </p>
            <p className="text-sm font-normal text-neutral-300 text-left max-w-sm mx-0 md:text-sm my-2">
              Crie sua página e compartilhe de qualquer lugar do mundo. Aceitamos pagamentos internacionais.
            </p>
            <div className="h-full w-full">
              <div className="flex flex-col w-full h-60 sm:h-80 mt-4 sm:mt-6 lg:h-full items-center relative bg-transparent">
                <div className="absolute -right-10 md:-right-48 -bottom-48 sm:-bottom-64 md:-bottom-40">
                  {/* Mantendo o globo original com seus efeitos */}
                  <div className="relative w-[600px] h-[600px] max-w-full rounded-full border border-neutral-700 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial from-neutral-800/50 to-white"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/80 via-black/50 to-black"></div>
                    
                    {/* Círculos de latitude */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border border-neutral-800/30 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-neutral-800/40 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] border border-neutral-800/50 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] border border-neutral-800/60 rounded-full"></div>
                    
                    {/* Linhas longitudinais */}
                    <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-neutral-800/30"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-neutral-800/30"></div>
                    <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 rotate-45 origin-center bg-neutral-800/20"></div>
                    <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 -rotate-45 origin-center bg-neutral-800/20"></div>
                    
                    {/* Pontos de países */}
                    <div className="absolute top-[35%] left-[30%] w-1.5 h-1.5 rounded-full bg-red-500 pulse-glow"></div>
                    <div className="absolute top-[40%] left-[60%] w-1.5 h-1.5 rounded-full bg-red-500 pulse-glow-delayed"></div>
                    <div className="absolute top-[50%] left-[45%] w-1.5 h-1.5 rounded-full bg-red-500 pulse-glow" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute top-[60%] left-[35%] w-1.5 h-1.5 rounded-full bg-red-500 pulse-glow-delayed" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute top-[30%] left-[50%] w-1.5 h-1.5 rounded-full bg-red-500 pulse-glow" style={{ animationDelay: '1s' }}></div>
                    
                    {/* Destaque de conexões */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <line x1="30%" y1="35%" x2="60%" y2="40%" stroke="rgba(225, 29, 72, 0.3)" strokeWidth="0.5" />
                      <line x1="45%" y1="50%" x2="60%" y2="40%" stroke="rgba(225, 29, 72, 0.3)" strokeWidth="0.5" />
                      <line x1="35%" y1="60%" x2="45%" y2="50%" stroke="rgba(225, 29, 72, 0.3)" strokeWidth="0.5" />
                      <line x1="30%" y1="35%" x2="50%" y2="30%" stroke="rgba(225, 29, 72, 0.3)" strokeWidth="0.5" />
                      <line x1="45%" y1="50%" x2="35%" y2="60%" stroke="rgba(225, 29, 72, 0.3)" strokeWidth="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 