"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Sala {
  id: string;
  nome: string;
  tipo: string;
  andar: string;
  preco_hora: number;
  status: string;
  equipamentos: string[];
}

interface Reserva {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  valor: number;
  status: string;
  profile?: { nome: string; email: string } | null;
}

const mockSalas: Sala[] = [
  { id: "1", nome: "Consultorio 1A", tipo: "Consultorio", andar: "1", preco_hora: 90, status: "Disponivel", equipamentos: ["Maca", "Negatoscopio", "Ar-condicionado"] },
  { id: "2", nome: "Consultorio 1B", tipo: "Consultorio", andar: "1", preco_hora: 90, status: "Disponivel", equipamentos: ["Maca", "Balanca digital", "Ar-condicionado"] },
  { id: "3", nome: "Consultorio 3A", tipo: "Consultorio", andar: "3", preco_hora: 55, status: "Disponivel", equipamentos: ["Maca", "Ar-condicionado", "Pia", "Autoclave"] },
  { id: "4", nome: "Sala Cirurgica 1", tipo: "Cirurgica", andar: "2", preco_hora: 120, status: "Manutencao", equipamentos: ["Mesa cirurgica", "Foco", "Ar-condicionado", "Autoclave", "Monitor"] },
  { id: "5", nome: "Sala de Exames 2", tipo: "Exames", andar: "2", preco_hora: 80, status: "Disponivel", equipamentos: ["Maca", "Ultrassom", "Ar-condicionado"] },
  { id: "6", nome: "Consultorio 5C", tipo: "Consultorio", andar: "5", preco_hora: 60, status: "Disponivel", equipamentos: ["Maca", "Ar-condicionado", "Pia", "Computador"] },
];

const mockHistorico: Reserva[] = [
  { id: "h1", data: "2026-06-14", hora_inicio: "08:00", hora_fim: "12:00", valor: 180, status: "Confirmada", profile: { nome: "Dr. Carlos Mendes", email: "carlos@email.com" } },
  { id: "h2", data: "2026-06-12", hora_inicio: "14:00", hora_fim: "17:00", valor: 135, status: "Concluida", profile: { nome: "Dra. Ana Souza", email: "ana@email.com" } },
  { id: "h3", data: "2026-06-10", hora_inicio: "09:00", hora_fim: "11:00", valor: 90, status: "Concluida", profile: { nome: "Dr. Pedro Lima", email: "pedro@email.com" } },
  { id: "h4", data: "2026-06-07", hora_inicio: "08:00", hora_fim: "12:00", valor: 180, status: "Cancelada", profile: { nome: "Dra. Julia Costa", email: "julia@email.com" } },
];

export default function AdminSalas() {
  const [salas, setSalas] = useState<Sala[]>(mockSalas);
  const [filtro, setFiltro] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editSala, setEditSala] = useState<Sala | null>(null);
  const [editForm, setEditForm] = useState({ nome: "", tipo: "Consultorio", andar: "", preco_hora: "", status: "Disponivel", equipamentos: "" });
  const [editSaving, setEditSaving] = useState(false);

  const [histSala, setHistSala] = useState<Sala | null>(null);
  const [historico, setHistorico] = useState<Reserva[]>([]);
  const [histLoading, setHistLoading] = useState(false);

  const loadSalas = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("salas")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) setSalas(data);
    } catch { /* fallback to mock */ }
  }, []);

  useEffect(() => {
    loadSalas();
  }, [loadSalas]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const nova: Sala = {
      id: crypto.randomUUID(),
      nome: fd.get("nome") as string,
      tipo: fd.get("tipo") as string,
      andar: fd.get("andar") as string,
      preco_hora: parseFloat(fd.get("preco_hora") as string),
      status: "Disponivel",
      equipamentos: (fd.get("equipamentos") as string).split(",").map((e) => e.trim()).filter(Boolean),
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("salas").insert({
        nome: nova.nome,
        tipo: nova.tipo,
        andar: nova.andar,
        preco_hora: nova.preco_hora,
        status: nova.status,
        equipamentos: nova.equipamentos,
      });
      if (!error) await loadSalas();
      else setSalas((prev) => [nova, ...prev]);
    } catch {
      setSalas((prev) => [nova, ...prev]);
    }

    setSaving(false);
    setShowModal(false);
  }

  function openEdit(sala: Sala) {
    setEditSala(sala);
    setEditForm({
      nome: sala.nome,
      tipo: sala.tipo,
      andar: sala.andar,
      preco_hora: String(sala.preco_hora),
      status: sala.status,
      equipamentos: sala.equipamentos.join(", "),
    });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editSala) return;
    setEditSaving(true);

    const updated = {
      nome: editForm.nome,
      tipo: editForm.tipo,
      andar: editForm.andar,
      preco_hora: parseFloat(editForm.preco_hora),
      status: editForm.status,
      equipamentos: editForm.equipamentos.split(",").map((e) => e.trim()).filter(Boolean),
    };

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("salas")
        .update(updated)
        .eq("id", editSala.id);

      if (!error) {
        await loadSalas();
      } else {
        setSalas((prev) => prev.map((s) => s.id === editSala.id ? { ...s, ...updated } : s));
      }
    } catch {
      setSalas((prev) => prev.map((s) => s.id === editSala.id ? { ...s, ...updated } : s));
    }

    setEditSaving(false);
    setEditSala(null);
  }

  async function openHistorico(sala: Sala) {
    setHistSala(sala);
    setHistLoading(true);
    setHistorico([]);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reservas")
        .select("id, data, hora_inicio, hora_fim, valor, status, profile:profiles(nome, email)")
        .eq("sala_id", sala.id)
        .order("data", { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        setHistorico(data as unknown as Reserva[]);
      } else {
        setHistorico(mockHistorico);
      }
    } catch {
      setHistorico(mockHistorico);
    }
    setHistLoading(false);
  }

  const filtered = filtro === "Todos" ? salas : salas.filter((s) => s.status === filtro);

  const stats = {
    total: salas.length,
    disponiveis: salas.filter((s) => s.status === "Disponivel").length,
    ocupadas: salas.filter((s) => s.status === "Ocupada").length,
    manutencao: salas.filter((s) => s.status === "Manutencao").length,
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Salas</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie as salas da clinica</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
          + Nova Sala
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Total</div>
          <div className="text-xl font-extrabold text-dark">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Disponiveis</div>
          <div className="text-xl font-extrabold text-green-600">{stats.disponiveis}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Ocupadas</div>
          <div className="text-xl font-extrabold text-amber-600">{stats.ocupadas}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Manutencao</div>
          <div className="text-xl font-extrabold text-red-600">{stats.manutencao}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {["Todos", "Disponivel", "Ocupada", "Manutencao"].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              filtro === f ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((sala) => (
          <div key={sala.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-dark">{sala.nome}</h3>
                <p className="text-xs text-slate-400">{sala.tipo} · {sala.andar}o andar</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                sala.status === "Disponivel" ? "bg-green-50 text-green-700"
                  : sala.status === "Ocupada" ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-600"
              }`}>
                {sala.status}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-primary mb-3">
              R$ {Number(sala.preco_hora).toFixed(0)}<span className="text-sm font-normal text-slate-400">/hora</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {sala.equipamentos.map((eq) => (
                <span key={eq} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{eq}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(sala)}
                className="flex-1 py-2 text-xs font-semibold bg-primary-bg text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => openHistorico(sala)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Historico
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Sala */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-dark">Nova Sala</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Nome</label>
                  <input name="nome" required placeholder="Consultorio 7A" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Tipo</label>
                  <select name="tipo" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                    <option>Consultorio</option>
                    <option>Cirurgica</option>
                    <option>Exames</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Andar</label>
                  <input name="andar" required placeholder="3" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Preco/hora (R$)</label>
                  <input name="preco_hora" type="number" step="0.01" required placeholder="55" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Equipamentos (separados por virgula)</label>
                <input name="equipamentos" placeholder="Maca, Ar-condicionado, Pia" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors">
                  {saving ? "Salvando..." : "Criar Sala"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Sala */}
      {editSala && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditSala(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-dark">Editar Sala</h2>
              <button onClick={() => setEditSala(null)} className="text-slate-400 hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Nome</label>
                  <input
                    value={editForm.nome}
                    onChange={(e) => setEditForm((p) => ({ ...p, nome: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Tipo</label>
                  <select
                    value={editForm.tipo}
                    onChange={(e) => setEditForm((p) => ({ ...p, tipo: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option>Consultorio</option>
                    <option>Cirurgica</option>
                    <option>Exames</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Andar</label>
                  <input
                    value={editForm.andar}
                    onChange={(e) => setEditForm((p) => ({ ...p, andar: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Preco/hora</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.preco_hora}
                    onChange={(e) => setEditForm((p) => ({ ...p, preco_hora: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option>Disponivel</option>
                    <option>Ocupada</option>
                    <option>Manutencao</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Equipamentos (separados por virgula)</label>
                <input
                  value={editForm.equipamentos}
                  onChange={(e) => setEditForm((p) => ({ ...p, equipamentos: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditSala(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={editSaving} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors">
                  {editSaving ? "Salvando..." : "Salvar Alteracoes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Historico */}
      {histSala && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setHistSala(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-extrabold text-dark">Historico de Reservas</h2>
                <p className="text-xs text-slate-400 mt-0.5">{histSala.nome} · {histSala.tipo} · {histSala.andar}o andar</p>
              </div>
              <button onClick={() => setHistSala(null)} className="text-slate-400 hover:text-dark p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {histLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : historico.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-400 text-sm">Nenhuma reserva encontrada para esta sala</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historico.map((r) => (
                    <div key={r.id} className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-bg flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-dark text-sm">
                            {new Date(r.data + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                          <div className="text-xs text-slate-400">
                            {r.hora_inicio} - {r.hora_fim}
                            {r.profile && (
                              <span className="ml-2">· {r.profile.nome}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-dark text-sm">R$ {Number(r.valor).toFixed(2).replace(".", ",")}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === "Confirmada" ? "bg-green-50 text-green-700"
                            : r.status === "Pendente" ? "bg-amber-50 text-amber-700"
                            : r.status === "Concluida" ? "bg-blue-50 text-blue-700"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setHistSala(null)}
                className="w-full py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
