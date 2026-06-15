import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface Reserva {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  valor: number;
  status: string;
  notas: string | null;
  created_at: string;
  sala: { nome: string } | null;
  profile: { nome: string; email: string } | null;
}

const mockReservas: Reserva[] = [
  { id: "1", sala: { nome: "Consultório 3A" }, profile: { nome: "Dra. Ana Costa", email: "ana.costa@email.com" }, data: "2026-06-11", hora_inicio: "08:00", hora_fim: "12:00", valor: 180, status: "Confirmada", notas: null, created_at: "" },
  { id: "2", sala: { nome: "Sala Cirúrgica 1" }, profile: { nome: "Dr. Pedro Alves", email: "pedro.alves@email.com" }, data: "2026-06-11", hora_inicio: "14:00", hora_fim: "18:00", valor: 480, status: "Pendente", notas: null, created_at: "" },
  { id: "3", sala: { nome: "Consultório 1B" }, profile: { nome: "Dra. Maria Lima", email: "maria.lima@email.com" }, data: "2026-06-12", hora_inicio: "09:00", hora_fim: "11:00", valor: 90, status: "Confirmada", notas: null, created_at: "" },
  { id: "4", sala: { nome: "Sala de Exames 2" }, profile: { nome: "Dr. Lucas Neto", email: "lucas.neto@email.com" }, data: "2026-06-12", hora_inicio: "13:00", hora_fim: "17:00", valor: 320, status: "Cancelada", notas: null, created_at: "" },
  { id: "5", sala: { nome: "Consultório 5C" }, profile: { nome: "Dra. Julia Ramos", email: "julia.ramos@email.com" }, data: "2026-06-13", hora_inicio: "08:00", hora_fim: "10:00", valor: 120, status: "Confirmada", notas: null, created_at: "" },
];

async function getReservas() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reservas")
      .select("*, sala:salas(nome), profile:profiles(nome, email)")
      .order("data", { ascending: false });

    if (error || !data || data.length === 0) return { reservas: mockReservas, real: false };
    return { reservas: data as Reserva[], real: true };
  } catch {
    return { reservas: mockReservas, real: false };
  }
}

export default async function AdminReservas({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { reservas, real } = await getReservas();
  const params = await searchParams;
  const tab = params.status || "Todas";

  const filtered = tab === "Todas" ? reservas : reservas.filter((r) => r.status === tab);

  const totalValor = reservas.reduce((s, r) => s + Number(r.valor), 0);
  const confirmadas = reservas.filter((r) => r.status === "Confirmada").length;
  const pendentes = reservas.filter((r) => r.status === "Pendente").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Reservas</h1>
          <p className="text-slate-500 text-sm mt-1">
            {reservas.length} reservas no total
            {!real && <span className="text-amber-500 ml-2">(dados de demonstração)</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Receita Reservas</span>
          <div className="text-2xl font-extrabold text-dark mt-1">
            R$ {totalValor.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Confirmadas</span>
          <div className="text-2xl font-extrabold text-green-600 mt-1">{confirmadas}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Pendentes</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendentes}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {["Todas", "Confirmada", "Pendente", "Cancelada", "Concluída"].map((t) => (
          <Link
            key={t}
            href={t === "Todas" ? "/admin/reservas" : `/admin/reservas?status=${t}`}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === t ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="px-6 py-3">Sala</th>
                <th className="px-6 py-3">Profissional</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Horário</th>
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Nenhuma reserva encontrada
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-dark">{r.sala?.nome ?? "—"}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-dark">{r.profile?.nome ?? "—"}</div>
                      <div className="text-xs text-slate-400">{r.profile?.email}</div>
                    </td>
                    <td className="px-6 py-4">{r.data}</td>
                    <td className="px-6 py-4">{r.hora_inicio}–{r.hora_fim}</td>
                    <td className="px-6 py-4 font-semibold">R$ {Number(r.valor).toFixed(0)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.status === "Confirmada" ? "bg-green-50 text-green-700"
                          : r.status === "Pendente" ? "bg-amber-50 text-amber-700"
                          : r.status === "Concluída" ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-600"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
