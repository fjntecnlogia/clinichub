export function Hero() {
  return (
    <section id="inicio" className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-bg border border-primary/20 rounded-full text-primary text-xs font-bold mb-8">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              N&ordm; 1 em Agendamento Odontologico
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-dark leading-[1.1] tracking-tight mb-6">
              Reserve suas cadeiras{" "}
              <span className="text-secondary">por hora</span>
              <br />
              <span className="text-primary">sem investir em clinica propria</span>
            </h1>

            <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">
              Uma clinica completa, diversas salas disponiveis.
              Dentistas estao faturando{" "}
              <strong className="text-dark">mais de R$ 10.000,00/mes</strong>{" "}
              sem gastar com estrutura. Voce paga apenas pelas horas que usar.
            </p>

            <div className="bg-white rounded-xl p-2 shadow-lg border border-slate-200 max-w-xl mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Onde voce quer atender?"
                    className="w-full pl-10 pr-3 py-3 text-sm text-slate-700 placeholder-slate-400 rounded-lg border-0 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar Horarios
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sem contrato.
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sem investimento inicial.
              </span>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=450&fit=crop"
                alt="Consultorio odontologico moderno"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de urgência */}
      <div className="bg-slate-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-2xl border border-orange-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
                <p className="text-sm text-dark">
                  <span className="font-black">Alta demanda!</span> Restam poucas horas disponiveis para hoje.
                </p>
              </div>
              <div className="flex items-center gap-3 ml-[52px]">
                <span className="text-lg">👥</span>
                <p className="text-sm text-slate-600">
                  +500 dentistas ja atendidos e faturando <strong className="text-dark">mais de R$ 10.000,00/mes</strong> com o MaciHub.
                </p>
              </div>
            </div>
            <div className="hidden md:flex -space-x-3">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
              <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
