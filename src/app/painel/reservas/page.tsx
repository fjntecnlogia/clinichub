"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Sala {
  id: string;
  nome: string;
  tipo: string;
  preco_hora: number;
  status: string;
}

interface Reserva {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  valor: number;
  status: string;
  notas: string | null;
  sala: { nome: string } | null;
}

const HORARIOS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

export default function MinhasReservas() {
  const searchParams = useSearchParams();
  const pagamento = searchParams.get("pagamento");

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Todas");
  const [showModal, setShowModal] = useState(false);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [saving, setSaving] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(!!pagamento);

  const [salaId, setSalaId] = useState("");
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("12:00");
  const [notas, setNotas] = useState("");
  const [erro, setErro] = useState("");

  const loadReservas = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setReservas([]);
        setLoading(false);
        return;
      }

      const { data: res, error } = await supabase
        .from("reservas")
        .select("*, sala:salas(nome)")
        .eq("user_id", user.id)
        .order("data", { ascending: false });

      setReservas(!error && res ? res : []);
    } catch {
      setReservas([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadReservas();
  }, [loadReservas]);

  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => setShowFeedback(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  async function loadSalas() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("salas")
        .select("id, nome, tipo, preco_hora, status")
        .eq("status", "Disponível")
        .order("nome");

      setSalas(!error && data ? data : []);
    } catch {
      setSalas([]);
    }
  }

  function openModal() {
    setErro("");
    setSalaId("");
    setData("");
    setHoraInicio("08:00");
    setHoraFim("12:00");
    setNotas("");
    loadSalas();
    setShowModal(true);
  }

  function calcularValor() {
    const sala = salas.find((s) => s.id === salaId);
    if (!sala || !horaInicio || !horaFim) return 0;
    const [h1] = horaInicio.split(":").map(Number);
    const [h2] = horaFim.split(":").map(Number);
    const horas = h2 - h1;
    return horas > 0 ? horas * sala.preco_hora : 0;
  }

  async function handleCriarReserva(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!salaId || !data || !horaInicio || !horaFim) {
      setErro("Preencha todos os campos");
      return;
    }

    const [h1] = horaInicio.split(":").map(Number);
    const [h2] = horaFim.split(":").map(Number);
    if (h2 <= h1) {
      setErro("Horário final deve ser maior que o inicial");
      return;
    }

    const hoje = new Date().toISOString().split("T")[0];
    if (data < hoje) {
      setErro("Data não pode ser no passado");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/stripe/checkout-reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sala_id: salaId,
          data,
          hora_inicio: horaInicio,
          hora_fim: horaFim,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErro(result.error || "Erro ao criar reserva");
        setSaving(false);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
        return;
      }

      setErro("Erro: URL de pagamento não retornada");
    } catch {
      setErro("Erro ao conectar com o servidor");
    }
    setSaving(false);
  }

  async function handleCancelar(id: string) {
    setCancellingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("reservas")
        .update({ status: "Cancelada" })
        .eq("id", id);

      if (!error) await loadReservas();
    } catch { /* silent */ }
    setCancellingId(null);
  }

  const filtered = tab === "Todas" ? reservas : reservas.filter((r) => r.status === tab);
  const valor = calcularValor();
  const salaSelecionada = salas.find((s) => s.id === salaId);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {showFeedback && pagamento === "sucesso" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold text-green-800 text-sm">Pagamento confirmado!</p>
            <p className="text-green-600 text-xs">Sua reserva foi paga com sucesso. Você receberá uma confirmação por e-mail.</p>
          </div>
          <button onClick={() => setShowFeedback(false)} className="ml-auto text-green-400 hover:text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {showFeedback && pagamento === "cancelado" && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <svg className="w-6 h-6 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="font-bold text-amber-800 text-sm">Pagamento não concluído</p>
            <p className="text-amber-600 text-xs">A reserva foi criada mas o pagamento não foi finalizado. Você pode tentar novamente.</p>
          </div>
          <button onClick={() => setShowFeedback(false)} className="ml-auto text-amber-400 hover:text-amber-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Minhas Reservas</h1>
          <p className="text-slate-500 text-sm mt-1">Histórico de todas as suas reservas</p>
        </div>
        <button
          onClick={openModal}
          className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
        >
          + Nova Reserva
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {["Todas", "Confirmada", "Pendente", "Concluída", "Cancelada"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === t ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400 text-sm mb-1">Nenhuma reserva encontrada</p>
            <p className="text-slate-400 text-xs">Clique em &quot;+ Nova Reserva&quot; para começar</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-bg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-dark text-sm">{r.sala?.nome ?? "Sala"}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(r.data + "T12:00:00").toLocaleDateString("pt-BR")} · {r.hora_inicio}–{r.hora_fim}
                  </div>
                  {r.notas && <div className="text-xs text-slate-400 mt-0.5">{r.notas}</div>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-extrabold text-dark text-sm">R$ {Number(r.valor).toFixed(2)}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  r.status === "Confirmada" ? "bg-green-50 text-green-700"
                    : r.status === "Pendente" ? "bg-amber-50 text-amber-700"
                    : r.status === "Concluída" ? "bg-blue-50 text-blue-700"
                    : "bg-red-50 text-red-600"
                }`}>
                  {r.status}
                </span>
                {(r.status === "Pendente" || r.status === "Confirmada") && (
                  <button
                    onClick={() => handleCancelar(r.id)}
                    disabled={cancellingId === r.id}
                    className="text-xs text-red-400 hover:text-red-600 font-semibold disabled:opacity-50"
                  >
                    {cancellingId === r.id ? "..." : "Cancelar"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-dark">Nova Reserva</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCriarReserva} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Sala</label>
                <select
                  value={salaId}
                  onChange={(e) => setSalaId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="">Selecione uma sala...</option>
                  {salas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome} — {s.tipo} — R$ {Number(s.preco_hora).toFixed(0)}/h
                    </option>
                  ))}
                </select>
                {salas.length === 0 && (
                  <p className="text-amber-500 text-xs mt-1">Nenhuma sala disponível no momento</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Data</label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Hora Início</label>
                  <select
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    {HORARIOS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Hora Fim</label>
                  <select
                    value={horaFim}
                    onChange={(e) => setHoraFim(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    {HORARIOS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Observações (opcional)</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={2}
                  placeholder="Ex: preciso de projetor"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                />
              </div>

              {salaId && valor > 0 && (
                <div className="bg-primary-bg rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{salaSelecionada?.nome}</span>
                    <span className="text-slate-500">R$ {Number(salaSelecionada?.preco_hora ?? 0).toFixed(0)}/h</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">{horaInicio} até {horaFim}</span>
                    <span className="text-slate-500">{(() => { const [h1] = horaInicio.split(":").map(Number); const [h2] = horaFim.split(":").map(Number); return h2 - h1; })()} horas</span>
                  </div>
                  <div className="border-t border-primary/10 pt-2 flex justify-between">
                    <span className="font-bold text-dark">Total</span>
                    <span className="font-extrabold text-primary text-lg">R$ {valor.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {erro && <p className="text-red-500 text-sm">{erro}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || salas.length === 0}
                  className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    "Redirecionando..."
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      Pagar e Reservar
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center">Pagamento seguro via Stripe</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
