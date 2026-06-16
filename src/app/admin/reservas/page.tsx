"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

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

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  Confirmada: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
  Pendente: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Cancelada: { badge: "bg-red-50 text-red-600", dot: "bg-red-500" },
  "Concluída": { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
};

const SALA_COLORS: Record<string, { bg: string; text: string; border: string }> = {};
const COLOR_POOL = [
  { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-300" },
  { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-300" },
  { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-300" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-800", border: "border-fuchsia-300" },
  { bg: "bg-lime-100", text: "text-lime-800", border: "border-lime-300" },
];

function getSalaColor(nome: string) {
  if (!SALA_COLORS[nome]) {
    const idx = Object.keys(SALA_COLORS).length % COLOR_POOL.length;
    SALA_COLORS[nome] = COLOR_POOL[idx];
  }
  return SALA_COLORS[nome];
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

// sem dados mock — carrega direto do Supabase

function formatTime(t: string) {
  return t.slice(0, 5);
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDateBR(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

export default function AdminReservas() {
  const today = new Date();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("Todas");
  const [view, setView] = useState<"lista" | "calendario">("lista");

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const loadReservas = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reservas")
        .select("*, sala:salas(nome), profile:profiles(nome, email)")
        .order("data", { ascending: false });

      if (!error && data) {
        setReservas(data as Reserva[]);
      }
    } catch { /* fallback to mock */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadReservas(); }, [loadReservas]);

  const filtered = tab === "Todas" ? reservas : reservas.filter((r) => r.status === tab);
  const totalValor = reservas.reduce((s, r) => s + Number(r.valor), 0);
  const confirmadas = reservas.filter((r) => r.status === "Confirmada").length;
  const pendentes = reservas.filter((r) => r.status === "Pendente").length;

  const reservasByDate = useMemo(() => {
    const map: Record<string, Reserva[]> = {};
    const source = tab === "Todas" ? reservas : reservas.filter((r) => r.status === tab);
    source.forEach((r) => {
      if (!map[r.data]) map[r.data] = [];
      map[r.data].push(r);
    });
    return map;
  }, [reservas, tab]);

  const selectedReservas = selectedDate ? (reservasByDate[selectedDate] || []) : [];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
    setSelectedDate(null);
  }
  function goToday() {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(todayKey);
  }

  function renderCalendar() {
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="bg-slate-50/50 rounded-lg min-h-[90px]" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key = dateKey(currentYear, currentMonth, day);
      const dayReservas = reservasByDate[key] || [];
      const isToday = key === todayKey;
      const isSelected = key === selectedDate;
      const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      cells.push(
        <button
          key={day}
          onClick={() => setSelectedDate(isSelected ? null : key)}
          className={`relative rounded-lg min-h-[90px] p-1.5 text-left transition-all border-2 hover:shadow-md ${
            isSelected
              ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
              : isToday
                ? "border-primary/40 bg-blue-50/50"
                : dayReservas.length > 0
                  ? "border-slate-200 bg-white hover:border-primary/30"
                  : "border-transparent bg-white hover:border-slate-200"
          } ${isPast ? "opacity-60" : ""}`}
        >
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
              isToday ? "bg-primary text-white" : isSelected ? "bg-primary/10 text-primary" : "text-slate-600"
            }`}>
              {day}
            </span>
            {dayReservas.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                dayReservas.some((r) => r.status === "Pendente")
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {dayReservas.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-0.5">
            {dayReservas.slice(0, 2).map((r) => {
              const colors = getSalaColor(r.sala?.nome || "—");
              return (
                <div
                  key={r.id}
                  className={`${colors.bg} ${colors.text} text-[10px] font-medium px-1.5 py-0.5 rounded truncate leading-tight`}
                  title={`${r.sala?.nome} — ${r.profile?.nome} (${formatTime(r.hora_inicio)}–${formatTime(r.hora_fim)})`}
                >
                  <span className="font-bold">{formatTime(r.hora_inicio)}</span> {r.profile?.nome?.split(" ")[0]}
                </div>
              );
            })}
            {dayReservas.length > 2 && (
              <div className="text-[10px] text-slate-400 font-semibold pl-1">+{dayReservas.length - 2} mais</div>
            )}
          </div>
        </button>
      );
    }

    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-extrabold text-dark min-w-[180px] text-center">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button onClick={goToday} className="ml-1 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                Hoje
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase py-2">{d}</div>
            ))}
            {cells}
          </div>
        </div>

        {/* Detail Sidebar */}
        <div className="lg:w-[320px] shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 sticky top-6">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-extrabold text-dark text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {selectedDate
                  ? (() => {
                    const [y, m, d] = selectedDate.split("-").map(Number);
                    const dt = new Date(y, m - 1, d);
                    const dayName = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][dt.getDay()];
                    return `${dayName}, ${d} de ${MONTHS[m - 1]}`;
                  })()
                  : "Selecione um dia"
                }
              </h3>
              {selectedDate && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedReservas.length} reserva{selectedReservas.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="p-3 max-h-[480px] overflow-y-auto">
              {!selectedDate ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">Clique em um dia para ver detalhes</p>
                </div>
              ) : selectedReservas.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-green-700">Nenhuma reserva</p>
                  <p className="text-xs text-slate-400 mt-1">Este dia está livre</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedReservas
                    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                    .map((r) => {
                      const colors = getSalaColor(r.sala?.nome || "—");
                      const statusStyle = STATUS_STYLES[r.status] || STATUS_STYLES["Confirmada"];
                      return (
                        <div key={r.id} className={`rounded-xl border-2 ${colors.border} p-3 transition-all hover:shadow-sm`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className={`${colors.bg} ${colors.text} text-xs font-bold px-2 py-0.5 rounded-md`}>
                              {r.sala?.nome || "—"}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle.badge}`}>
                              {r.status}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs">
                              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-bold text-dark">{formatTime(r.hora_inicio)} – {formatTime(r.hora_fim)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <div>
                                <span className="text-dark font-medium">{r.profile?.nome || "—"}</span>
                                <span className="text-slate-400 block text-[10px]">{r.profile?.email}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-bold text-green-700">R$ {Number(r.valor).toLocaleString("pt-BR")}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Total</span>
                    <span className="font-extrabold text-dark">
                      R$ {selectedReservas.reduce((s, r) => s + Number(r.valor), 0).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Reservas</h1>
          <p className="text-slate-500 text-sm mt-1">
            {reservas.length} reserva{reservas.length !== 1 ? "s" : ""} no total
            {!loading && reservas.length === 0 && <span className="text-slate-400 ml-2">(sem reservas ainda)</span>}
          </p>
        </div>
        <div className="flex bg-white rounded-lg border border-slate-200 p-0.5">
          <button
            onClick={() => setView("lista")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              view === "lista" ? "bg-primary text-white" : "text-slate-500 hover:text-dark"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Lista
          </button>
          <button
            onClick={() => setView("calendario")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              view === "calendario" ? "bg-primary text-white" : "text-slate-500 hover:text-dark"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendário
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-slate-500 font-medium">Receita Reservas</span>
          </div>
          <div className="text-xl font-extrabold text-dark">
            R$ {totalValor.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-slate-500 font-medium">Confirmadas</span>
          </div>
          <div className="text-xl font-extrabold text-green-600">{confirmadas}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-slate-500 font-medium">Pendentes</span>
          </div>
          <div className="text-xl font-extrabold text-amber-600">{pendentes}</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["Todas", "Confirmada", "Pendente", "Cancelada", "Concluída"].map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedDate(null); }}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === t ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : view === "calendario" ? (
        renderCalendar()
      ) : (
        /* Table View */
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
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`${getSalaColor(r.sala?.nome || "—").bg} ${getSalaColor(r.sala?.nome || "—").text} font-bold text-xs px-2 py-1 rounded-md`}>
                          {r.sala?.nome ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-dark">{r.profile?.nome ?? "—"}</div>
                        <div className="text-xs text-slate-400">{r.profile?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-dark">{formatDateBR(r.data)}</td>
                      <td className="px-6 py-4 font-medium text-dark">{formatTime(r.hora_inicio)}–{formatTime(r.hora_fim)}</td>
                      <td className="px-6 py-4 font-bold text-dark">R$ {Number(r.valor).toLocaleString("pt-BR")}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          STATUS_STYLES[r.status]?.badge || "bg-slate-50 text-slate-600"
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
      )}
    </div>
  );
}
