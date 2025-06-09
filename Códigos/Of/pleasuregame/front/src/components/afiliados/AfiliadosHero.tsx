export default function AfiliadosHero() {
  return (
    <section className="py-12 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center text-center">
          <button className="relative flex border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit rounded-full mb-6">
            <div className="w-auto z-10 px-4 py-2 rounded-[inherit] bg-black text-white text-xs flex items-center space-x-2">
              <span>Programa de Afiliados</span>
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

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6">
            Ganhe Dinheiro Indicando a Lovely
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mb-8">
            Junte-se ao nosso programa de afiliados e ganhe comissões atrativas por cada novo cliente que você trouxer. Seja parte do nosso sucesso!
          </p>

          <button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
            Começar Agora
          </button>
        </div>
      </div>
    </section>
  );
} 