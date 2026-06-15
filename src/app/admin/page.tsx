import { createClient } from "@/lib/supabase/server";

async function getDashboardData() {
  try {
    const supabase = await createClient();

    const [salasRes, reservasRes, usersRes, produtosRes] = await Promise.all([
      supabase.from("salas").select("id", { count: "exact", head: true }),
      supabase.from("reservas").select("id, valor, status, data, hora_inicio, hora_fim, sala:salas(nome), profile:profiles(nome)").order("created_at", { ascending: false }).limit(5),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("produtos").select("id", { count: "exact", head: true }),
    ]);

    return {
      totalSalas: salasRes.count ?? 0,
      totalUsuarios: usersRes.count ?? 0,
      totalProdutos: produtosRes.count ?? 0,
      reservas: reservasRes.data ?? [],
      hasData: true,
    };
  } catch {
    return { totalSalas: 0, totalUsuarios: 0, totalProdutos: 0, reservas: [], hasData: false };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const kpis = [
    { label: "Salas Cadastradas", value: data.hasData ? String(data.totalSalas) : "6", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { label: "Reservas Recentes", value: data.hasData ? String(data.reservas.length) : "127", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Usuários", value: data.hasData ? String(data.totalUsuarios) : "34", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
    { label: "Produtos", value: data.hasData ? String(data.totalProdutos) : "6", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  ];

  const mockReservas = [
    { id: "1", sala: { nome: "Consultório 3A" }, profile: { nome: "Dra. Ana Costa" }, data: "2026-06-11", hora_inicio: "08:00", hora_fim: "12:00", valor: 180, status: "Confirmada" },
    { id: "2", sala: { nome: "Sala Cirúrgica 1" }, profile: { nome: "Dr. Pedro Alves" }, data: "2026-06-11", hora_inicio: "14:00", hora_fim: "18:00", valor: 480, status: "Pendente" },
    { id: "3", sala: { nome: "Consultório 1B" }, profile: { nome: "Dra. Maria Lima" }, data: "2026-06-12", hora_inicio: "09:00", hora_fim: "11:00", valor: 90, status: "Confirmada" },
    { id: "4", sala: { nome: "Sala de Exames 2" }, profile: { nome: "Dr. Lucas Neto" }, data: "2026-06-12", hora_inicio: "13:00", hora_fim: "17:00", valor: 320, status: "Cancelada" },
    { id: "5", sala: { nome: "Consultório 5C" }, profile: { nome: "Dra. Julia Ramos" }, data: "2026-06-13", hora_inicio: "08:00", hora_fim: "10:00", valor: 120, status: "Confirmada" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reservas: any[] = data.hasData && data.reservas.length > 0 ? data.reservas : mockReservas;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-dark">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Visão geral da plataforma
          {!data.hasData && <span className="text-amber-500 ml-2">(dados de demonstração)</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">{k.label}</span>
              <div className="w-9 h-9 rounded-lg bg-primary-bg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={k.icon} />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-dark">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-dark">Reservas Recentes</h2>
          <a href="/admin/reservas" className="text-sm text-primary font-semibold hover:text-primary-dark">
            Ver todas
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">Sala</th>
                <th className="px-6 py-3">Profissional</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Horário</th>
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservas.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-semibold text-dark">{r.sala?.nome}</td>
                  <td className="px-6 py-3">{r.profile?.nome}</td>
                  <td className="px-6 py-3">{r.data}</td>
                  <td className="px-6 py-3">{r.hora_inicio}–{r.hora_fim}</td>
                  <td className="px-6 py-3 font-semibold">R$ {Number(r.valor).toFixed(0)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      r.status === "Confirmada" ? "bg-green-50 text-green-700"
                        : r.status === "Pendente" ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
