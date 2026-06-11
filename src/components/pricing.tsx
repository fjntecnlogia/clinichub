const plans = [
  {
    name: "Avulso",
    price: "45",
    unit: "/hora",
    desc: "Ideal para quem atende esporadicamente",
    features: [
      "Sala equipada completa",
      "Wi-Fi de alta velocidade",
      "Recepcao compartilhada",
      "Estacionamento",
    ],
    cta: "Reservar Hora",
    popular: false,
  },
  {
    name: "Turno",
    price: "299",
    unit: "/turno",
    desc: "Manha ou tarde, 4-6 horas fixas por semana",
    features: [
      "Tudo do plano Avulso",
      "Prioridade na reserva",
      "Armario individual",
      "Desconto no e-commerce",
      "Sem taxa de reserva",
    ],
    cta: "Escolher Turno",
    popular: true,
  },
  {
    name: "Integral",
    price: "1.890",
    unit: "/mes",
    desc: "Sala fixa com exclusividade total",
    features: [
      "Tudo do plano Turno",
      "Sala exclusiva",
      "Personalizacao do espaco",
      "Placa com seu nome",
      "Gestao de agenda propria",
      "Suporte prioritario",
    ],
    cta: "Falar com Consultor",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pacotes" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-bg text-secondary-dark text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Pacotes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight mb-4">
            Planos para cada necessidade
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Do profissional autonomo ao consultorio fixo, temos a opcao certa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 transition-shadow hover:shadow-lg ${
                plan.popular
                  ? "border-primary ring-2 ring-primary/10"
                  : "border-slate-100"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-dark mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500">{plan.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-sm text-slate-400">R$ </span>
                <span className="text-4xl font-black text-dark">
                  {plan.price}
                </span>
                <span className="text-slate-400">{plan.unit}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg text-sm font-bold transition-colors ${
                  plan.popular
                    ? "bg-primary hover:bg-primary-dark text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-dark"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
