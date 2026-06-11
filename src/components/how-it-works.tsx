const steps = [
  {
    num: "01",
    title: "Busque sua sala",
    desc: "Encontre a sala ideal por localizacao, especialidade e horario disponivel.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
  },
  {
    num: "02",
    title: "Reserve online",
    desc: "Agende por hora, turno ou mes. Pagamento seguro e confirmacao instantanea.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
  },
  {
    num: "03",
    title: "Atenda seus pacientes",
    desc: "Chegue e atenda. Sala equipada, limpa e pronta para uso imediato.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-bg text-primary-dark text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Como Funciona
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight mb-4">
            Simples, rapido e sem burocracia
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Em tres passos voce ja esta atendendo em uma sala profissional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div key={step.num} className="relative text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                <svg
                  className="w-7 h-7 text-primary group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  {step.icon}
                </svg>
              </div>
              <div className="text-xs font-bold text-secondary mb-2 tracking-wider">
                PASSO {step.num}
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
