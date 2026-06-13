export function Pricing() {
  return (
    <section id="pacotes" className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">📦</span>
              <h2 className="text-2xl sm:text-3xl font-black text-dark tracking-tight">
                Pacotes de Horas
              </h2>
            </div>
            <p className="text-slate-500 text-sm ml-[44px]">
              Escolha o pacote ideal para sua rotina. Precos com desconto e mais economia.
            </p>
          </div>
          <div className="px-4 py-2 bg-secondary-bg border border-secondary/30 rounded-lg text-sm font-bold text-secondary-dark whitespace-nowrap">
            Precos de varios (gastos 80%)
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* 1 Hora */}
          <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-1 bg-primary" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-md mb-3">
                    PACOTE
                  </span>
                  <h3 className="text-2xl font-black text-dark">1 Hora</h3>
                  <p className="text-sm text-slate-500 mt-1">Flexibilidade para encaixes rapidos.</p>
                </div>
                <div className="w-14 h-14 bg-primary-bg rounded-full flex items-center justify-center shrink-0 ml-3">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs text-slate-400 font-medium mb-1">Por hora</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm text-slate-400 font-bold">R$</span>
                  <span className="text-4xl font-black text-dark">90,00</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">ou R$ 90,00/horas</p>
              </div>

              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Reserva avulsa
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Alta procura: restam 4 pacotes hoje
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Ideal para atendimentos pontuais
                </li>
              </ul>

              <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-colors">
                Reservar Pacote
              </button>

              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Pagamento seguro e confirmacao imediata.
              </p>
            </div>
          </div>

          {/* 2 Horas */}
          <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-1 bg-primary" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-md mb-3">
                    PACOTE
                  </span>
                  <h3 className="text-2xl font-black text-dark">2 Horas</h3>
                  <p className="text-sm text-slate-500 mt-1">Otimo para rotina equilibrada.</p>
                </div>
                <div className="w-14 h-14 bg-primary-bg rounded-full flex items-center justify-center shrink-0 ml-3">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs text-slate-400 font-medium mb-1">Por hora</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm text-slate-400 font-bold">R$</span>
                  <span className="text-4xl font-black text-dark">85,00</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">ou R$ 170,00 no total</p>
              </div>

              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Economize <strong>R$ 10,00</strong> por hora
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Alta demanda: restam 3 pacotes
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Mais tempo para seus pacientes
                </li>
              </ul>

              <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-colors">
                Reservar Pacote
              </button>

              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Pagamento seguro e confirmacao imediata.
              </p>
            </div>
          </div>

          {/* 3 Horas — destaque */}
          <div className="relative bg-white rounded-2xl border-2 border-secondary overflow-hidden shadow-lg hover:shadow-xl transition-shadow ring-2 ring-secondary/10">
            <div className="h-1.5 bg-secondary" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                      MAIS RESERVADO
                    </span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary-dark text-[10px] font-bold uppercase tracking-wider rounded-md">
                      ESSENCIAL
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-dark">3 Horas</h3>
                  <p className="text-sm text-slate-500 mt-1">O pacote com melhor custo-beneficio.</p>
                </div>
                <div className="w-14 h-14 bg-secondary-bg rounded-full flex items-center justify-center shrink-0 ml-3">
                  <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs text-slate-400 font-medium mb-1">Por hora</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm text-secondary font-bold">R$</span>
                  <span className="text-4xl font-black text-secondary">75,00</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-400 line-through">R$ 225,00</span>
                  <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-bold rounded">
                    20% OFF
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Economize <strong>R$ 15,00</strong> por hora
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Alta demanda: restam apenas 2 pacotes
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Ideal para quem atende mais pacientes
                </li>
              </ul>

              <button className="w-full py-3 bg-secondary hover:bg-secondary-dark text-white text-sm font-bold rounded-lg transition-colors">
                Reservar Pacote
              </button>

              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                +510 avaliacoes positivas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
