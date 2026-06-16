"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  sala_id: string;
  sala: { id: string; nome: string } | null;
  profile: { nome: string; email: string; telefone?: string } | null;
}

const SALA_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", dot: "bg-blue-500" },
  { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", dot: "bg-emerald-500" },
  { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-300", dot: "bg-violet-500" },
  { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300", dot: "bg-amber-500" },
  { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-300", dot: "bg-rose-500" },
  { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-300", dot: "bg-cyan-500" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-800", border: "border-fuchsia-300", dot: "bg-fuchsia-500" },
  { bg: "bg-lime-100", text: "text-lime-800", border: "border-lime-300", dot: "bg-lime-500" },
];

const STATUS_STYLES: Record<string, string> = {
  Confirmada: "bg-green-50 text-green-700 border-green-200",
  Pendente: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelada: "bg-red-50 text-red-600 border-red-200",
  "Concluída": "bg-blue-50 text-blue-700 border-blue-200",
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

// sem dados mock — carrega direto do Supabase

function formatTime(t: string) {
  return t.slice(0, 5);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function AdminAgenda() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterSala, setFilterSala] = useState<string>("todas");
  const [viewMode, setViewMode] = useState<"mes" | "semana">("mes");

  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d;
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const [salasRes, reservasRes] = await Promise.all([
        supabase.from("salas").select("id, nome, tipo, preco_hora, status").order("nome"),
        supabase.from("reservas").select("*, sala:salas(id, nome), profile:profiles(nome, email, telefone)").order("data"),
      ]);
      if (!salasRes.error && salasRes.data) setSalas(salasRes.data);
      if (!reservasRes.error && reservasRes.data) {
        setReservas(reservasRes.data as Reserva[]);
      }
    } catch { /* fallback to mock */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const salaColorMap = useMemo(() => {
    const map: Record<string, typeof SALA_COLORS[0]> = {};
    salas.forEach((s, i) => { map[s.id] = SALA_COLORS[i % SALA_COLORS.length]; });
    return map;
  }, [salas]);

  const reservasByDate = useMemo(() => {
    const map: Record<string, Reserva[]> = {};
    const filtered = filterSala === "todas" ? reservas : reservas.filter((r) => (r.sala?.id || r.sala_id) === filterSala);
    filtered.forEach((r) => {
      if (r.status === "Cancelada") return;
      if (!map[r.data]) map[r.data] = [];
      map[r.data].push(r);
    });
    return map;
  }, [reservas, filterSala]);

  const selectedReservas = selectedDate ? (reservasByDate[selectedDate] || []) : [];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const totalMes = useMemo(() => {
    let count = 0;
    let valor = 0;
    reservas.forEach((r) => {
      const d = new Date(r.data + "T00:00:00");
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.status !== "Cancelada") {
        count++;
        valor += Number(r.valor);
      }
    });
    return { count, valor };
  }, [reservas, currentMonth, currentYear]);

  const ocupacaoMes = useMemo(() => {
    const diasComReserva = new Set<string>();
    reservas.forEach((r) => {
      const d = new Date(r.data + "T00:00:00");
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && r.status !== "Cancelada") {
        diasComReserva.add(r.data);
      }
    });
    const uteis = Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(currentYear, currentMonth, i + 1);
      return d.getDay() !== 0;
    }).filter(Boolean).length;
    return uteis > 0 ? Math.round((diasComReserva.size / uteis) * 100) : 0;
  }, [reservas, currentMonth, currentYear, daysInMonth]);

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
    setWeekStart(() => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay());
      return d;
    });
  }

  function prevWeek() {
    setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() - 7); return d; });
    setSelectedDate(null);
  }
  function nextWeek() {
    setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() + 7); return d; });
    setSelectedDate(null);
  }

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);

  function renderMonthView() {
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="bg-slate-50/50 rounded-lg min-h-[100px]" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key = dateKey(currentYear, currentMonth, day);
      const dayReservas = reservasByDate[key] || [];
      const isToday = key === todayKey;
      const isSelected = key === selectedDate;
      const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0;
      const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      cells.push(
        <button
          key={day}
          onClick={() => setSelectedDate(isSelected ? null : key)}
          className={`relative rounded-lg min-h-[100px] p-1.5 text-left transition-all border-2 hover:shadow-md ${
            isSelected
              ? "border-primary bg-primary/5 shadow-md"
              : isToday
                ? "border-primary/40 bg-blue-50/50"
                : dayReservas.length > 0
                  ? "border-slate-200 bg-white hover:border-primary/30"
                  : "border-transparent bg-white hover:border-slate-200"
          } ${isWeekend ? "opacity-70" : ""} ${isPast ? "opacity-60" : ""}`}
        >
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
            isToday ? "bg-primary text-white" : isSelected ? "bg-primary/10 text-primary" : "text-slate-600"
          }`}>
            {day}
          </span>
          <div className="mt-0.5 space-y-0.5">
            {dayReservas.slice(0, 3).map((r) => {
              const salaId = r.sala?.id || r.sala_id;
              const colors = salaColorMap[salaId] || SALA_COLORS[0];
              return (
                <div
                  key={r.id}
                  className={`${colors.bg} ${colors.text} text-[10px] font-medium px-1.5 py-0.5 rounded truncate leading-tight`}
                  title={`${r.sala?.nome} — ${r.profile?.nome} (${formatTime(r.hora_inicio)}–${formatTime(r.hora_fim)})`}
                >
                  {formatTime(r.hora_inicio)} {r.sala?.nome?.split(" ")[0]}
                </div>
              );
            })}
            {dayReservas.length > 3 && (
              <div className="text-[10px] text-slate-400 font-semibold pl-1">+{dayReservas.length - 3} mais</div>
            )}
          </div>
        </button>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase py-2">{d}</div>
        ))}
        {cells}
      </div>
    );
  }

  function renderWeekView() {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-200">
          <div className="border-r border-slate-100" />
          {weekDays.map((d) => {
            const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
            const isToday = key === todayKey;
            return (
              <button
                key={key}
                onClick={() => setSelectedDate(key === selectedDate ? null : key)}
                className={`py-3 text-center border-r border-slate-100 last:border-r-0 transition-colors ${
                  isToday ? "bg-primary/5" : selectedDate === key ? "bg-blue-50" : "hover:bg-slate-50"
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400">{WEEKDAYS[d.getDay()]}</div>
                <div className={`text-lg font-extrabold mt-0.5 ${isToday ? "text-primary" : "text-dark"}`}>
                  {d.getDate()}
                </div>
                <div className="text-[10px] text-slate-400">{MONTHS[d.getMonth()].slice(0, 3)}</div>
              </button>
            );
          })}
        </div>

        <div className="overflow-y-auto max-h-[520px]">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] min-h-[52px] border-b border-slate-50">
              <div className="text-xs text-slate-400 font-medium text-right pr-2 pt-1 border-r border-slate-100">
                {String(hour).padStart(2, "0")}:00
              </div>
              {weekDays.map((d) => {
                const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
                const dayReservas = reservasByDate[key] || [];
                const hourReservas = dayReservas.filter((r) => {
                  const h = parseInt(r.hora_inicio.split(":")[0]);
                  return h === hour;
                });

                return (
                  <div key={key + hour} className="border-r border-slate-50 last:border-r-0 p-0.5 relative">
                    {hourReservas.map((r) => {
                      const salaId = r.sala?.id || r.sala_id;
                      const colors = salaColorMap[salaId] || SALA_COLORS[0];
                      const startH = parseInt(r.hora_inicio.split(":")[0]);
                      const endH = parseInt(r.hora_fim.split(":")[0]);
                      const span = endH - startH;

                      return (
                        <button
                          key={r.id}
                          onClick={() => setSelectedDate(key)}
                          className={`${colors.bg} ${colors.text} ${colors.border} border absolute left-0.5 right-0.5 rounded-md px-1 py-0.5 text-[10px] font-semibold leading-tight overflow-hidden z-10 hover:shadow-md transition-shadow cursor-pointer`}
                          style={{ height: `${span * 52 - 4}px` }}
                          title={`${r.sala?.nome} — ${r.profile?.nome}`}
                        >
                          <div className="truncate">{r.sala?.nome?.split(" ").slice(0, 2).join(" ")}</div>
                          <div className="truncate opacity-75">{r.profile?.nome?.split(" ")[0]}</div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark flex items-center gap-3">
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Agenda de Salas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualize a ocupação das salas por data e horário
            {!loading && reservas.length === 0 && <span className="text-slate-400 ml-2">(sem agendamentos ainda)</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-lg border border-slate-200 p-0.5">
            <button
              onClick={() => setViewMode("mes")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                viewMode === "mes" ? "bg-primary text-white" : "text-slate-500 hover:text-dark"
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode("semana")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                viewMode === "semana" ? "bg-primary text-white" : "text-slate-500 hover:text-dark"
              }`}
            >
              Semana
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs text-slate-500 font-medium">Reservas no mês</span>
          </div>
          <div className="text-xl font-extrabold text-dark">{totalMes.count}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-slate-500 font-medium">Receita do mês</span>
          </div>
          <div className="text-xl font-extrabold text-dark">
            R$ {totalMes.valor.toLocaleString("pt-BR")}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            </div>
            <span className="text-xs text-slate-500 font-medium">Salas ativas</span>
          </div>
          <div className="text-xl font-extrabold text-dark">
            {salas.filter((s) => s.status !== "Manutenção").length}/{salas.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs text-slate-500 font-medium">Ocupação</span>
          </div>
          <div className="text-xl font-extrabold text-dark">{ocupacaoMes}%</div>
          <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-amber-500 h-1.5 rounded-full transition-all" style={{ width: `${ocupacaoMes}%` }} />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1 min-w-0">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={viewMode === "mes" ? prevMonth : prevWeek} className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-extrabold text-dark min-w-[200px] text-center">
                {viewMode === "mes"
                  ? `${MONTHS[currentMonth]} ${currentYear}`
                  : `${weekDays[0].getDate()} ${MONTHS[weekDays[0].getMonth()].slice(0, 3)} – ${weekDays[6].getDate()} ${MONTHS[weekDays[6].getMonth()].slice(0, 3)} ${weekDays[6].getFullYear()}`
                }
              </h2>
              <button onClick={viewMode === "mes" ? nextMonth : nextWeek} className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button onClick={goToday} className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                Hoje
              </button>
            </div>

            <select
              value={filterSala}
              onChange={(e) => setFilterSala(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-dark font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="todas">Todas as salas</option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : viewMode === "mes" ? renderMonthView() : renderWeekView()}

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            {salas.map((s) => {
              const colors = salaColorMap[s.id] || SALA_COLORS[0];
              return (
                <button
                  key={s.id}
                  onClick={() => setFilterSala(filterSala === s.id ? "todas" : s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    filterSala === s.id
                      ? `${colors.bg} ${colors.text} ring-2 ring-offset-1 ring-current`
                      : filterSala === "todas"
                        ? `${colors.bg} ${colors.text} opacity-80 hover:opacity-100`
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  {s.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Sidebar */}
        <div className="lg:w-[340px] shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 sticky top-6">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-extrabold text-dark flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
                <p className="text-xs text-slate-400 mt-1">
                  {selectedReservas.length} reserva{selectedReservas.length !== 1 ? "s" : ""} neste dia
                </p>
              )}
            </div>

            <div className="p-4 max-h-[500px] overflow-y-auto">
              {!selectedDate ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">Clique em um dia no calendário para ver os detalhes</p>
                </div>
              ) : selectedReservas.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-green-700">Dia livre!</p>
                  <p className="text-xs text-slate-400 mt-1">Todas as salas disponíveis nesta data</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedReservas
                    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                    .map((r) => {
                      const salaId = r.sala?.id || r.sala_id;
                      const colors = salaColorMap[salaId] || SALA_COLORS[0];
                      return (
                        <div key={r.id} className={`rounded-xl border-2 ${colors.border} p-3 transition-all hover:shadow-sm`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
                              <span className="text-sm font-extrabold text-dark">{r.sala?.nome || "—"}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[r.status] || "bg-slate-50 text-slate-600"}`}>
                              {r.status}
                            </span>
                          </div>
                          <div className="space-y-1.5 ml-5">
                            <div className="flex items-center gap-2 text-xs">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-bold text-dark">{formatTime(r.hora_inicio)} – {formatTime(r.hora_fim)}</span>
                              <span className="text-slate-400">
                                ({parseInt(r.hora_fim) - parseInt(r.hora_inicio)}h)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-dark font-medium">{r.profile?.nome || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-slate-500">{r.profile?.email || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-bold text-green-700">R$ {Number(r.valor).toLocaleString("pt-BR")}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Total do dia</span>
                      <span className="font-extrabold text-dark">
                        R$ {selectedReservas.reduce((s, r) => s + Number(r.valor), 0).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Salas livres</p>
                      <div className="flex flex-wrap gap-1">
                        {salas
                          .filter((s) => s.status !== "Manutenção" && !selectedReservas.some((r) => (r.sala?.id || r.sala_id) === s.id))
                          .map((s) => (
                            <span key={s.id} className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full">
                              {s.nome}
                            </span>
                          ))}
                        {salas.filter((s) => s.status !== "Manutenção" && !selectedReservas.some((r) => (r.sala?.id || r.sala_id) === s.id)).length === 0 && (
                          <span className="text-[10px] text-red-500 font-medium">Todas as salas ocupadas</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
