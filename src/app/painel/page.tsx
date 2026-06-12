import Link from "next/link";
import { getPainelOverview } from "./actions";

export default async function PainelPage() {
  const overview = await getPainelOverview();

  const nome = overview?.nome ?? "Usuario";
  const hasData = overview?.hasData ?? false;

  const mockProximas = [
    { sala: { nome: "Consultorio 3A" }, data: "2026-06-11", hora_inicio: "08:00", hora_fim: "12:00", status: "Confirmada" },
    { sala: { nome: "Consultorio 1B" }, data: "2026-06-14", hora_inicio: "14:00", hora_fim: "17:00", status: "Pendente" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proximas: any[] = hasData && overview!.proximas.length > 0 ? overview!.proximas : mockProximas;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-dark">Ola, {nome}!</h1>
        <p className="text-slate-500 text-sm mt-1">
          Aqui esta o resumo da sua conta.
          {!hasData && <span className="text-amber-500 ml-2">(dados de demonstracao)</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Reservas este mes</span>
          <div className="text-3xl font-extrabold text-dark mt-1">{hasData ? overview!.reservasMes : 8}</div>
          <span className="text-xs text-accent font-semibold">reservas ativas</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Proximas reservas</span>
          <div className="text-3xl font-extrabold text-primary mt-1">{proximas.length}</div>
          <span className="text-xs text-slate-400">agendadas</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Pedidos na loja</span>
          <div className="text-3xl font-extrabold text-dark mt-1">{hasData ? overview!.totalPedidos : 3}</div>
          <span className="text-xs text-slate-400">pedidos realizados</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-dark">Proximas Reservas</h2>
          <Link href="/painel/reservas" className="text-sm text-primary font-semibold hover:text-primary-dark">Ver todas</Link>
        </div>
        {proximas.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">
            Nenhuma reserva agendada. Que tal reservar uma sala?
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {proximas.map((r, i) => (
              <div key={r.id ?? i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-dark text-sm">{r.sala?.nome}</div>
                  <div className="text-xs text-slate-400">{r.data} · {r.hora_inicio}–{r.hora_fim}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  r.status === "Confirmada" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
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
