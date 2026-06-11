const testimonials = [
  {
    name: "Dra. Camila Oliveira",
    role: "Dermatologista",
    text: "Comecei atendendo 2 dias por semana e hoje ja tenho agenda cheia. O ClinicHub me permitiu crescer sem o risco de um aluguel fixo.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    stars: 5,
  },
  {
    name: "Dr. Ricardo Santos",
    role: "Fisioterapeuta",
    text: "A infraestrutura e impecavel. Meus pacientes elogiam o ambiente e eu nao preciso me preocupar com nada alem de atender.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    stars: 5,
  },
  {
    name: "Dra. Fernanda Lima",
    role: "Psicologa",
    text: "Economizo mais de R$ 2.000 por mes em comparacao ao meu antigo consultorio. E ainda tenho flexibilidade de horarios.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-bg text-primary-dark text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight mb-4">
            Quem usa, recomenda
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Mais de 500 profissionais ja transformaram sua carreira com o
            ClinicHub.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-secondary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-dark">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
