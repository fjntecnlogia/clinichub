const testimonials = [
  {
    name: "Dr. Lucas Fernandes",
    role: "Cirurgiao-Dentista",
    text: "O MaciHub me deu liberdade para atender mais pacientes sem me preocupar com aluguel, funcionarios ou contas fixas. Meu faturamento triplicou!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    stars: 5,
    rating: "5.0",
  },
  {
    name: "Dra. Mariana Lima",
    role: "Ortodontista",
    text: "A estrutura e impecavel e consigo agendar tudo pelo app em segundos. Atendo mais e ganho mais, sem dor de cabeca.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    stars: 5,
    rating: "5.0",
  },
  {
    name: "Dr. Rafael Costa",
    role: "Clinico Geral",
    text: "Finalmente uma solucao pensada para dentistas. Pago so pelo que uso e tenho todo o suporte que preciso para crescer.",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    stars: 5,
    rating: "5.0",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-dark tracking-tight mb-4">
            Mais de 500 dentistas estao crescendo com o MaciHub
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
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
                    <span className="text-sm font-black text-dark">{t.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p className="text-sm font-bold text-dark">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
