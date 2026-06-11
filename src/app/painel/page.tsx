import Link from "next/link";

export default function PainelPage() {
  const proximas = [
    { sala: "Consultorio 3A", data: "11/06/2026", horario: "08:00–12:00", status: "Confirmada" },
    { sala: "Consultorio 1B", data: "14/06/2026", horario: "14:00–17:00", status: "Pendente" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-dark">Ola, Dra. Ana!</h1>
        <p className="text-slate-500 text-sm mt-1">Aqui esta o resumo da sua conta.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Reservas este mes</span>
          <div className="text-3xl font-extrabold text-dark mt-1">8</div>
          <span className="text-xs text-accent font-semibold">+2 vs. mes passado</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Economia total</span>
          <div className="text-3xl font-extrabold text-accent mt-1">R$ 1.240</div>
          <span className="text-xs text-slate-400">vs. aluguel fixo</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Pedidos na loja</span>
          <div className="text-3xl font-extrabold text-dark mt-1">3</div>
          <span className="text-xs text-slate-400">1 em transito</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-dark">Proximas Reservas</h2>
          <Link href="/painel/reservas" className="text-sm text-primary font-semibold hover:text-primary-dark">Ver todas</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {proximas.map((r, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-dark text-sm">{r.sala}</div>
                <div className="text-xs text-slate-400">{r.data} · {r.horario}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                r.status === "Confirmada" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
              }`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link href="/painel/reservas" className="bg-primary-bg rounded-xl p-6 hover:bg-primary hover:text-white group transition-colors">
          <svg className="w-8 h-8 text-primary group-hover:text-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <h3 className="font-bold text-dark group-hover:text-white">Nova Reserva</h3>
          <p className="text-sm text-slate-500 group-hover:text-white/70 mt-1">Reserve uma sala para seu proximo atendimento</p>
        </Link>
        <Link href="/loja" className="bg-secondary/10 rounded-xl p-6 hover:bg-secondary hover:text-white group transition-colors">
          <svg className="w-8 h-8 text-secondary group-hover:text-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="font-bold text-dark group-hover:text-white">Loja</h3>
          <p className="text-sm text-slate-500 group-hover:text-white/70 mt-1">Equipamentos e materiais para seu consultorio</p>
        </Link>
      </div>
    </div>
  );
}
