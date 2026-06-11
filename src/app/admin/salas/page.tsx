"use client";

import { useState, useEffect } from "react";
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

const mockSalas: Sala[] = [
  { id: "1", nome: "Consultorio 1A", tipo: "Consultorio", andar: "1", preco_hora: 45, status: "Disponivel", equipamentos: ["Maca", "Ar-condicionado", "Pia"] },
  { id: "2", nome: "Consultorio 1B", tipo: "Consultorio", andar: "1", preco_hora: 45, status: "Ocupada", equipamentos: ["Maca", "Ar-condicionado", "Pia", "Negatoscopio"] },
  { id: "3", nome: "Consultorio 3A", tipo: "Consultorio", andar: "3", preco_hora: 55, status: "Disponivel", equipamentos: ["Maca", "Ar-condicionado", "Pia", "Autoclave"] },
  { id: "4", nome: "Sala Cirurgica 1", tipo: "Cirurgica", andar: "2", preco_hora: 120, status: "Manutencao", equipamentos: ["Mesa cirurgica", "Foco", "Ar-condicionado", "Autoclave", "Monitor"] },
  { id: "5", nome: "Sala de Exames 2", tipo: "Exames", andar: "2", preco_hora: 80, status: "Disponivel", equipamentos: ["Maca", "Ultrassom", "Ar-condicionado"] },
  { id: "6", nome: "Consultorio 5C", tipo: "Consultorio", andar: "5", preco_hora: 60, status: "Disponivel", equipamentos: ["Maca", "Ar-condicionado", "Pia", "Computador"] },
];

export default function AdminSalas() {
  const [salas, setSalas] = useState<Sala[]>(mockSalas);
  const [filtro, setFiltro] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("salas")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) setSalas(data);
      } catch { /* fallback to mock */ }
    }
    load();
  }, []);

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
      if (!error) {
        const { data } = await supabase.from("salas").select("*").order("created_at", { ascending: false });
        if (data) setSalas(data);
      }
    } catch {
      setSalas((prev) => [nova, ...prev]);
    }

    setSaving(false);
    setShowModal(false);
  }

  const filtered = filtro === "Todos" ? salas : salas.filter((s) => s.status === filtro);

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
              <button className="flex-1 py-2 text-xs font-semibold bg-primary-bg text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                Editar
              </button>
              <button className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                Historico
              </button>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}
