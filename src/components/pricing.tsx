const plans = [
  {
    tag: "PACOTE",
    tagColor: "bg-primary text-white",
    name: "1 Hora",
    desc: "Flexibilidade para encaixes rapidos.",
    priceLabel: "Por hora",
    price: "90,00",
    priceDetail: "ou R$ 90,00/horas",
    features: [
      "Reserva avulsa",
      "Alta procura: restam 4 pacotes hoje",
      "Ideal para atendimentos pontuais",
    ],
    cta: "Reservar Pacote",
    popular: false,
    highlight: false,
  },
  {
    tag: "PACOTE",
    tagColor: "bg-primary text-white",
    name: "2 Horas",
    desc: "Otimo para rotina equilibrada.",
    priceLabel: "Por hora",
    price: "85,00",
    priceDetail: "ou R$ 170,00 no total",
    features: [
      "Economize R$ 10,00 por hora",
      "Alta demanda: restam 3 pacotes",
      "Mais tempo para seus pacientes",
    ],
    savings: null,
    cta: "Reservar Pacote",
    popular: false,
    highlight: false,
  },
  {
    tag: "MAIS RESERVADO",
    tagColor: "bg-secondary text-white",
    extraTag: "ESSENCIAL",
    name: "3 Horas",
    desc: "O pacote com melhor custo-beneficio.",
    priceLabel: "Por hora",
    price: "75,00",
    oldPrice: "R$ 225,00",
    discount: "20% OFF",
    priceDetail: null,
    features: [
      "Economize R$ 15,00 por hora",
      "Alta demanda: restam apenas 2 pacotes",
      "Ideal para quem atende mais pacientes",
    ],
    cta: "Reservar Pacote",
    popular: true,
    highlight: true,
  },
];

export function Pricing() {
  return (
    <section id="pacotes" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📦</span>
              <h2 className="text-2xl sm:text-3xl font-black text-dark tracking-tight">
                Pacotes de Horas
              </h2>
            </div>
            <p className="text-slate-500">
              Escolha o pacote ideal para sua rotina. Precos com desconto e mais economia.
            </p>
          </div>
          <div className="px-4 py-2 bg-secondary-bg border border-secondary/20 rounded-lg text-sm font-bold text-secondary-dark">
            Precos de varios (gastos 80%)
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-6 border-2 transition-shadow hover:shadow-lg ${
                plan.highlight
                  ? "border-secondary ring-2 ring-secondary/10 shadow-lg"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${plan.tagColor}`}>
                  {plan.tag}
                </span>
                {plan.highlight && (
                  <span className="px-3 py-1 bg-secondary/10 text-secondary-dark text-[10px] font-bold uppercase tracking-wider rounded-md">
                    ESSENCIAL
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-dark mb-1">{plan.name}</h3>
              <p className="text-sm text-slate-500 mb-5">{plan.desc}</p>

              <p className="text-xs text-slate-400 font-medium mb-1">{plan.priceLabel}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-slate-400">R$</span>
                <span className="text-3xl font-black text-dark">{plan.price}</span>
              </div>
              {plan.oldPrice && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-slate-400 line-through">{plan.oldPrice}</span>
                  <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-bold rounded">
                    {plan.discount}
                  </span>
                </div>
              )}
              {plan.priceDetail && (
                <p className="text-xs text-slate-400 mb-5">{plan.priceDetail}</p>
              )}
              {!plan.priceDetail && <div className="mb-5" />}

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg text-sm font-bold transition-colors ${
                  plan.highlight
                    ? "bg-secondary hover:bg-secondary-dark text-white"
                    : "bg-primary hover:bg-primary-dark text-white"
                }`}
              >
                {plan.cta}
              </button>

              {plan.highlight && (
                <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <svg className="w-3.5 h-3.5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  +510 avaliacoes positivas
                </p>
              )}
              {!plan.highlight && (
                <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pagamento seguro e confirmacao imediata.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
