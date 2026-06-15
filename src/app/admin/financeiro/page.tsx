"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ──────────────────────────────────────────────────

interface Reserva {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  valor: number;
  status: string;
  created_at: string;
  sala: { nome: string } | null;
  profile: { nome: string; email: string } | null;
}

interface Pedido {
  id: string;
  itens: Array<{ nome: string; qty: number; preco: number }>;
  subtotal: number;
  frete: number;
  total: number;
  status: string;
  metodo_pagamento: string | null;
  created_at: string;
  profile: { nome: string; email: string } | null;
}

interface Transacao {
  id: string;
  tipo: "aluguel" | "ecommerce";
  descricao: string;
  valor: number;
  status: string;
  data: string;
  cliente: string;
  email: string;
  metodo: string;
  detalhes: string;
}

type TabFinanceiro = "visao" | "transacoes" | "alugueis" | "ecommerce";
type Periodo = "7d" | "30d" | "90d" | "12m" | "total";

// ─── Mocks ──────────────────────────────────────────────────

const mockReservas: Reserva[] = [
  { id: "r1", sala: { nome: "Consultório 1A" }, profile: { nome: "Dra. Ana Costa", email: "ana@email.com" }, data: "2026-06-02", hora_inicio: "08:00", hora_fim: "12:00", valor: 360, status: "Confirmada", created_at: "2026-06-01T10:00:00Z" },
  { id: "r2", sala: { nome: "Sala Cirúrgica 1" }, profile: { nome: "Dr. Pedro Alves", email: "pedro@email.com" }, data: "2026-06-03", hora_inicio: "14:00", hora_fim: "18:00", valor: 480, status: "Confirmada", created_at: "2026-06-02T14:00:00Z" },
  { id: "r3", sala: { nome: "Consultório 1B" }, profile: { nome: "Dra. Maria Lima", email: "maria@email.com" }, data: "2026-06-05", hora_inicio: "09:00", hora_fim: "11:00", valor: 180, status: "Confirmada", created_at: "2026-06-04T09:00:00Z" },
  { id: "r4", sala: { nome: "Consultório 3A" }, profile: { nome: "Dr. Lucas Neto", email: "lucas@email.com" }, data: "2026-06-07", hora_inicio: "13:00", hora_fim: "17:00", valor: 220, status: "Pendente", created_at: "2026-06-06T08:00:00Z" },
  { id: "r5", sala: { nome: "Consultório 5C" }, profile: { nome: "Dra. Julia Ramos", email: "julia@email.com" }, data: "2026-06-09", hora_inicio: "08:00", hora_fim: "10:00", valor: 120, status: "Confirmada", created_at: "2026-06-08T15:00:00Z" },
  { id: "r6", sala: { nome: "Sala de Exames 2" }, profile: { nome: "Dr. Roberto Azevedo", email: "roberto@email.com" }, data: "2026-06-10", hora_inicio: "10:00", hora_fim: "14:00", valor: 320, status: "Cancelada", created_at: "2026-06-09T11:00:00Z" },
  { id: "r7", sala: { nome: "Consultório 1A" }, profile: { nome: "Dra. Fernanda Rocha", email: "fernanda@email.com" }, data: "2026-06-11", hora_inicio: "08:00", hora_fim: "12:00", valor: 360, status: "Confirmada", created_at: "2026-06-10T07:00:00Z" },
  { id: "r8", sala: { nome: "Sala Cirúrgica 1" }, profile: { nome: "Dr. Marcos Silva", email: "marcos@email.com" }, data: "2026-06-12", hora_inicio: "07:00", hora_fim: "13:00", valor: 720, status: "Confirmada", created_at: "2026-06-11T09:00:00Z" },
  { id: "r9", sala: { nome: "Consultório 3A" }, profile: { nome: "Dra. Carla Dias", email: "carla@email.com" }, data: "2026-06-14", hora_inicio: "14:00", hora_fim: "16:00", valor: 110, status: "Pendente", created_at: "2026-06-13T10:00:00Z" },
  { id: "r10", sala: { nome: "Consultório 1A" }, profile: { nome: "Dra. Ana Costa", email: "ana@email.com" }, data: "2026-06-16", hora_inicio: "08:00", hora_fim: "12:00", valor: 360, status: "Pendente", created_at: "2026-06-15T08:00:00Z" },
];

const mockPedidos: Pedido[] = [
  { id: "p1", itens: [{ nome: "Estetoscópio Profissional", qty: 1, preco: 189.9 }], subtotal: 189.9, frete: 0, total: 189.9, status: "Entregue", metodo_pagamento: "Cartão de Crédito", created_at: "2026-06-01T12:00:00Z", profile: { nome: "Dra. Ana Costa", email: "ana@email.com" } },
  { id: "p2", itens: [{ nome: "Luvas Estéreis cx/100", qty: 3, preco: 45.9 }], subtotal: 137.7, frete: 15, total: 152.7, status: "Entregue", metodo_pagamento: "PIX", created_at: "2026-06-03T09:00:00Z", profile: { nome: "Dr. Pedro Alves", email: "pedro@email.com" } },
  { id: "p3", itens: [{ nome: "Mesa Auxiliar Portátil", qty: 1, preco: 459.9 }, { nome: "Máscara N95 cx/50", qty: 2, preco: 89.9 }], subtotal: 639.7, frete: 0, total: 639.7, status: "Pago", metodo_pagamento: "Cartão de Crédito", created_at: "2026-06-06T16:00:00Z", profile: { nome: "Dra. Maria Lima", email: "maria@email.com" } },
  { id: "p4", itens: [{ nome: "Jaleco Premium", qty: 2, preco: 129.9 }], subtotal: 259.8, frete: 12, total: 271.8, status: "Em transito", metodo_pagamento: "Cartão de Crédito", created_at: "2026-06-08T14:00:00Z", profile: { nome: "Dr. Lucas Neto", email: "lucas@email.com" } },
  { id: "p5", itens: [{ nome: "Kit Descartáveis Básico", qty: 5, preco: 32.9 }], subtotal: 164.5, frete: 18, total: 182.5, status: "Pendente", metodo_pagamento: null, created_at: "2026-06-10T11:00:00Z", profile: { nome: "Dra. Julia Ramos", email: "julia@email.com" } },
  { id: "p6", itens: [{ nome: "Otoscópio Digital", qty: 1, preco: 349.9 }], subtotal: 349.9, frete: 0, total: 349.9, status: "Cancelado", metodo_pagamento: null, created_at: "2026-06-11T10:00:00Z", profile: { nome: "Dr. Roberto Azevedo", email: "roberto@email.com" } },
  { id: "p7", itens: [{ nome: "Autoclave 12L", qty: 1, preco: 2890 }], subtotal: 2890, frete: 0, total: 2890, status: "Pago", metodo_pagamento: "PIX", created_at: "2026-06-13T08:00:00Z", profile: { nome: "Dra. Fernanda Rocha", email: "fernanda@email.com" } },
  { id: "p8", itens: [{ nome: "Luvas Estéreis cx/100", qty: 2, preco: 45.9 }, { nome: "Máscara N95 cx/50", qty: 1, preco: 89.9 }], subtotal: 181.7, frete: 15, total: 196.7, status: "Pendente", metodo_pagamento: null, created_at: "2026-06-14T15:00:00Z", profile: { nome: "Dr. Marcos Silva", email: "marcos@email.com" } },
];

// ─── Helpers ────────────────────────────────────────────────

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(d: string) {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
}

function statusAluguel(s: string): { label: string; color: string } {
  switch (s) {
    case "Confirmada": return { label: "Pago", color: "bg-green-50 text-green-700" };
    case "Pendente": return { label: "Pendente", color: "bg-amber-50 text-amber-700" };
    case "Cancelada": return { label: "Cancelado", color: "bg-red-50 text-red-600" };
    case "Concluída": return { label: "Concluído", color: "bg-blue-50 text-blue-700" };
    default: return { label: s, color: "bg-slate-50 text-slate-600" };
  }
}

function statusPedido(s: string): { label: string; color: string } {
  switch (s) {
    case "Pago": return { label: "Pago", color: "bg-green-50 text-green-700" };
    case "Entregue": return { label: "Entregue", color: "bg-blue-50 text-blue-700" };
    case "Em transito": return { label: "Em trânsito", color: "bg-cyan-50 text-cyan-700" };
    case "Pendente": return { label: "Pendente", color: "bg-amber-50 text-amber-700" };
    case "Cancelado": return { label: "Cancelado", color: "bg-red-50 text-red-600" };
    default: return { label: s, color: "bg-slate-50 text-slate-600" };
  }
}

const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// ─── Component ──────────────────────────────────────────────

export default function AdminFinanceiro() {
  const [tab, setTab] = useState<TabFinanceiro>("visao");
  const [periodo, setPeriodo] = useState<Periodo>("30d");
  const [reservas, setReservas] = useState<Reserva[]>(mockReservas);
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos);
  const [loading, setLoading] = useState(true);
  const [isReal, setIsReal] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const [rRes, pRes] = await Promise.all([
        supabase.from("reservas").select("*, sala:salas(nome), profile:profiles(nome, email)").order("created_at", { ascending: false }),
        supabase.from("pedidos").select("*, profile:profiles(nome, email)").order("created_at", { ascending: false }),
      ]);
      if (!rRes.error && rRes.data?.length) setReservas(rRes.data as Reserva[]);
      if (!pRes.error && pRes.data?.length) setPedidos(pRes.data as Pedido[]);
      if ((!rRes.error && rRes.data?.length) || (!pRes.error && pRes.data?.length)) setIsReal(true);
    } catch { /* mock fallback */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Computed ─────────────────────────────────────────────

  const transacoes = useMemo<Transacao[]>(() => {
    const list: Transacao[] = [];
    reservas.forEach((r) => {
      list.push({
        id: r.id,
        tipo: "aluguel",
        descricao: `Aluguel — ${r.sala?.nome || "Sala"}`,
        valor: Number(r.valor),
        status: r.status,
        data: r.created_at || r.data,
        cliente: r.profile?.nome || "—",
        email: r.profile?.email || "",
        metodo: "Transferência",
        detalhes: `${r.data} ${r.hora_inicio}–${r.hora_fim}`,
      });
    });
    pedidos.forEach((p) => {
      list.push({
        id: p.id,
        tipo: "ecommerce",
        descricao: `Pedido — ${p.itens.map((i) => i.nome).join(", ").slice(0, 60)}`,
        valor: Number(p.total),
        status: p.status,
        data: p.created_at,
        cliente: p.profile?.nome || "—",
        email: p.profile?.email || "",
        metodo: p.metodo_pagamento || "Aguardando",
        detalhes: `${p.itens.length} ite${p.itens.length > 1 ? "ns" : "m"}`,
      });
    });
    list.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    return list;
  }, [reservas, pedidos]);

  const stats = useMemo(() => {
    const receitaAlugueis = reservas.filter((r) => r.status !== "Cancelada").reduce((s, r) => s + Number(r.valor), 0);
    const receitaEcommerce = pedidos.filter((p) => p.status !== "Cancelado").reduce((s, p) => s + Number(p.total), 0);
    const pendAlugueis = reservas.filter((r) => r.status === "Pendente").reduce((s, r) => s + Number(r.valor), 0);
    const pendEcommerce = pedidos.filter((p) => p.status === "Pendente").reduce((s, p) => s + Number(p.total), 0);
    const pagoAlugueis = reservas.filter((r) => r.status === "Confirmada" || r.status === "Concluída").reduce((s, r) => s + Number(r.valor), 0);
    const pagoEcommerce = pedidos.filter((p) => ["Pago", "Entregue", "Em transito"].includes(p.status)).reduce((s, p) => s + Number(p.total), 0);
    const canceladoTotal = reservas.filter((r) => r.status === "Cancelada").reduce((s, r) => s + Number(r.valor), 0) + pedidos.filter((p) => p.status === "Cancelado").reduce((s, p) => s + Number(p.total), 0);

    return {
      receitaTotal: receitaAlugueis + receitaEcommerce,
      receitaAlugueis,
      receitaEcommerce,
      pendente: pendAlugueis + pendEcommerce,
      pendAlugueis,
      pendEcommerce,
      recebido: pagoAlugueis + pagoEcommerce,
      cancelado: canceladoTotal,
      totalReservas: reservas.length,
      totalPedidos: pedidos.length,
      ticketMedioAluguel: reservas.filter((r) => r.status !== "Cancelada").length > 0
        ? receitaAlugueis / reservas.filter((r) => r.status !== "Cancelada").length : 0,
      ticketMedioPedido: pedidos.filter((p) => p.status !== "Cancelado").length > 0
        ? receitaEcommerce / pedidos.filter((p) => p.status !== "Cancelado").length : 0,
    };
  }, [reservas, pedidos]);

  const chartData = useMemo(() => {
    const months: Record<string, { alugueis: number; ecommerce: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = { alugueis: 0, ecommerce: 0 };
    }
    reservas.forEach((r) => {
      if (r.status === "Cancelada") return;
      const key = r.data.slice(0, 7);
      if (months[key]) months[key].alugueis += Number(r.valor);
    });
    pedidos.forEach((p) => {
      if (p.status === "Cancelado") return;
      const key = p.created_at.slice(0, 7);
      if (months[key]) months[key].ecommerce += Number(p.total);
    });
    return Object.entries(months).map(([k, v]) => ({
      month: MONTHS_SHORT[parseInt(k.split("-")[1]) - 1],
      ...v,
      total: v.alugueis + v.ecommerce,
    }));
  }, [reservas, pedidos]);

  const chartMax = Math.max(...chartData.map((d) => d.total), 1);

  const topSalas = useMemo(() => {
    const map: Record<string, { nome: string; receita: number; count: number }> = {};
    reservas.filter((r) => r.status !== "Cancelada").forEach((r) => {
      const nome = r.sala?.nome || "—";
      if (!map[nome]) map[nome] = { nome, receita: 0, count: 0 };
      map[nome].receita += Number(r.valor);
      map[nome].count++;
    });
    return Object.values(map).sort((a, b) => b.receita - a.receita);
  }, [reservas]);

  const metodosPagemento = useMemo(() => {
    const map: Record<string, number> = {};
    pedidos.filter((p) => p.status !== "Cancelado" && p.metodo_pagamento).forEach((p) => {
      const m = p.metodo_pagamento!;
      map[m] = (map[m] || 0) + Number(p.total);
    });
    return Object.entries(map).sort(([, a], [, b]) => b - a);
  }, [pedidos]);

  // ─── Tabs config ──────────────────────────────────────────

  const tabs: { key: TabFinanceiro; label: string; icon: string }[] = [
    { key: "visao", label: "Visão Geral", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { key: "transacoes", label: "Transações", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
    { key: "alugueis", label: "Aluguéis", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { key: "ecommerce", label: "E-commerce", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  ];

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Financeiro
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Controle de receitas, pagamentos e operações
            {!isReal && !loading && <span className="text-amber-500 ml-2">(dados de demonstração)</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-xs font-bold text-amber-700">Stripe pendente</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-slate-200 p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              tab === t.key ? "bg-primary text-white" : "text-slate-500 hover:text-dark hover:bg-slate-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* ─── VISÃO GERAL ─────────────────────────────── */}
          {tab === "visao" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Receita Total</span>
                  </div>
                  <div className="text-2xl font-extrabold text-dark">{formatBRL(stats.receitaTotal)}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="text-xs text-green-600 font-bold">Aluguéis + E-commerce</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Recebido</span>
                  </div>
                  <div className="text-2xl font-extrabold text-green-600">{formatBRL(stats.recebido)}</div>
                  <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${stats.receitaTotal > 0 ? (stats.recebido / stats.receitaTotal) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Pendente</span>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-600">{formatBRL(stats.pendente)}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {reservas.filter((r) => r.status === "Pendente").length + pedidos.filter((p) => p.status === "Pendente").length} operações
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Cancelado</span>
                  </div>
                  <div className="text-2xl font-extrabold text-red-500">{formatBRL(stats.cancelado)}</div>
                  <div className="text-xs text-slate-400 mt-1">Não contabilizado</div>
                </div>
              </div>

              {/* Chart + Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-extrabold text-dark text-sm">Receita por Mês</h3>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary" /> Aluguéis</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-secondary" /> E-commerce</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 h-48">
                    {chartData.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-500">{formatBRL(d.total)}</span>
                        <div className="w-full flex flex-col gap-0.5" style={{ height: `${(d.total / chartMax) * 160}px` }}>
                          {d.alugueis > 0 && (
                            <div
                              className="w-full bg-primary rounded-t-md transition-all hover:opacity-80"
                              style={{ flex: d.alugueis / d.total }}
                              title={`Aluguéis: ${formatBRL(d.alugueis)}`}
                            />
                          )}
                          {d.ecommerce > 0 && (
                            <div
                              className="w-full bg-secondary rounded-b-md transition-all hover:opacity-80"
                              style={{ flex: d.ecommerce / d.total }}
                              title={`E-commerce: ${formatBRL(d.ecommerce)}`}
                            />
                          )}
                          {d.total === 0 && <div className="w-full bg-slate-100 rounded-md flex-1" />}
                        </div>
                        <span className="text-xs font-bold text-slate-400">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-extrabold text-dark text-sm mb-4">Composição da Receita</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-primary" />
                          <span className="font-medium text-dark">Aluguéis de Salas</span>
                        </span>
                        <span className="font-bold text-dark">{formatBRL(stats.receitaAlugueis)}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${stats.receitaTotal > 0 ? (stats.receitaAlugueis / stats.receitaTotal) * 100 : 0}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>{stats.totalReservas} reservas</span>
                        <span>{stats.receitaTotal > 0 ? Math.round((stats.receitaAlugueis / stats.receitaTotal) * 100) : 0}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-secondary" />
                          <span className="font-medium text-dark">E-commerce</span>
                        </span>
                        <span className="font-bold text-dark">{formatBRL(stats.receitaEcommerce)}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-secondary h-2 rounded-full" style={{ width: `${stats.receitaTotal > 0 ? (stats.receitaEcommerce / stats.receitaTotal) * 100 : 0}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>{stats.totalPedidos} pedidos</span>
                        <span>{stats.receitaTotal > 0 ? Math.round((stats.receitaEcommerce / stats.receitaTotal) * 100) : 0}%</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Ticket médio (aluguel)</span>
                        <span className="font-bold text-dark">{formatBRL(stats.ticketMedioAluguel)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Ticket médio (loja)</span>
                        <span className="font-bold text-dark">{formatBRL(stats.ticketMedioPedido)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Salas + Métodos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-extrabold text-dark text-sm mb-4">Salas mais Rentáveis</h3>
                  <div className="space-y-3">
                    {topSalas.slice(0, 5).map((s, i) => (
                      <div key={s.nome} className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                          i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-200 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {i + 1}º
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-dark truncate">{s.nome}</span>
                            <span className="text-sm font-extrabold text-dark ml-2">{formatBRL(s.receita)}</span>
                          </div>
                          <div className="flex justify-between items-center mt-0.5">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 mr-3">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(s.receita / (topSalas[0]?.receita || 1)) * 100}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400">{s.count} reservas</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {topSalas.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Nenhum dado disponível</p>}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-extrabold text-dark text-sm mb-4">Métodos de Pagamento</h3>
                  <div className="space-y-3">
                    {metodosPagemento.map(([metodo, valor]) => (
                      <div key={metodo} className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          metodo === "PIX" ? "bg-teal-100" : metodo.includes("Crédito") ? "bg-violet-100" : "bg-blue-100"
                        }`}>
                          {metodo === "PIX" ? (
                            <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="currentColor"><path d="M17.253 6.746l-2.506 2.506a3.5 3.5 0 01-4.95 0L7.79 7.245l-.544.543 2.007 2.007a4.5 4.5 0 006.95 0l2.507-2.506-.957-.957-.5.414zm-.957 10.508l-2.506-2.506a3.5 3.5 0 00-4.95 0l-2.007 2.007-.543-.544 2.007-2.007a4.5 4.5 0 016.95 0l2.506 2.507.957-.957-.5-.414-.957.957-.957-.043z"/></svg>
                          ) : (
                            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-dark">{metodo}</span>
                            <span className="text-sm font-extrabold text-dark">{formatBRL(valor)}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                            <div className={`h-1.5 rounded-full ${metodo === "PIX" ? "bg-teal-500" : "bg-violet-500"}`} style={{ width: `${(valor / (metodosPagemento[0]?.[1] || 1)) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {metodosPagemento.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Nenhum pagamento registrado</p>}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-sm font-extrabold text-dark">Integração Stripe</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Pagamentos online via cartão e PIX serão processados automaticamente quando a integração for ativada.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-dark text-sm">Últimas Transações</h3>
                  <button onClick={() => setTab("transacoes")} className="text-xs font-bold text-primary hover:underline">
                    Ver todas →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50">
                        <th className="px-5 py-2.5">Tipo</th>
                        <th className="px-5 py-2.5">Descrição</th>
                        <th className="px-5 py-2.5">Cliente</th>
                        <th className="px-5 py-2.5">Data</th>
                        <th className="px-5 py-2.5">Valor</th>
                        <th className="px-5 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {transacoes.slice(0, 6).map((t) => {
                        const st = t.tipo === "aluguel" ? statusAluguel(t.status) : statusPedido(t.status);
                        return (
                          <tr key={`${t.tipo}-${t.id}`} className="hover:bg-slate-50/50">
                            <td className="px-5 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                t.tipo === "aluguel" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
                              }`}>
                                {t.tipo === "aluguel" ? "Aluguel" : "Loja"}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-dark font-medium max-w-[200px] truncate">{t.descricao}</td>
                            <td className="px-5 py-3 text-slate-600">{t.cliente}</td>
                            <td className="px-5 py-3 text-slate-500">{formatDate(t.data)}</td>
                            <td className="px-5 py-3 font-bold text-dark">{formatBRL(t.valor)}</td>
                            <td className="px-5 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${st.color}`}>{st.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── TRANSAÇÕES ──────────────────────────────── */}
          {tab === "transacoes" && (
            <TransacoesTab transacoes={transacoes} />
          )}

          {/* ─── ALUGUÉIS ────────────────────────────────── */}
          {tab === "alugueis" && (
            <AlugueisTab reservas={reservas} stats={stats} />
          )}

          {/* ─── E-COMMERCE ──────────────────────────────── */}
          {tab === "ecommerce" && (
            <EcommerceTab pedidos={pedidos} stats={stats} />
          )}
        </>
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

function TransacoesTab({ transacoes }: { transacoes: Transacao[] }) {
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "aluguel" | "ecommerce">("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, setBusca] = useState("");

  const filtered = transacoes.filter((t) => {
    if (filtroTipo !== "todos" && t.tipo !== filtroTipo) return false;
    if (filtroStatus !== "todos" && t.status !== filtroStatus) return false;
    if (busca && !t.descricao.toLowerCase().includes(busca.toLowerCase()) && !t.cliente.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const totalFiltered = filtered.reduce((s, t) => s + t.valor, 0);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por descrição ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as typeof filtroTipo)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="todos">Todos os tipos</option>
          <option value="aluguel">Aluguéis</option>
          <option value="ecommerce">E-commerce</option>
        </select>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="todos">Todos os status</option>
          <option value="Confirmada">Pago (aluguel)</option>
          <option value="Pendente">Pendente</option>
          <option value="Cancelada">Cancelado (aluguel)</option>
          <option value="Pago">Pago (loja)</option>
          <option value="Entregue">Entregue</option>
          <option value="Em transito">Em trânsito</option>
          <option value="Cancelado">Cancelado (loja)</option>
        </select>
        <div className="text-sm font-bold text-slate-600">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} — <span className="text-green-600">{formatBRL(totalFiltered)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Descrição</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Método</th>
                <th className="px-5 py-3">Valor</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">Nenhuma transação encontrada</td></tr>
              ) : (
                filtered.map((t) => {
                  const st = t.tipo === "aluguel" ? statusAluguel(t.status) : statusPedido(t.status);
                  return (
                    <tr key={`${t.tipo}-${t.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.tipo === "aluguel" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
                        }`}>
                          {t.tipo === "aluguel" ? "Aluguel" : "Loja"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-dark max-w-[220px] truncate">{t.descricao}</div>
                        <div className="text-[10px] text-slate-400">{t.detalhes}</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-dark">{t.cliente}</div>
                        <div className="text-[10px] text-slate-400">{t.email}</div>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{formatDate(t.data)}</td>
                      <td className="px-5 py-3 text-slate-600 text-xs font-medium">{t.metodo}</td>
                      <td className="px-5 py-3 font-bold text-dark">{formatBRL(t.valor)}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${st.color}`}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AlugueisTab({ reservas, stats }: { reservas: Reserva[]; stats: Record<string, number> }) {
  const ativas = reservas.filter((r) => r.status !== "Cancelada");
  const pendentes = reservas.filter((r) => r.status === "Pendente");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-medium">Receita Aluguéis</span>
          <div className="text-xl font-extrabold text-dark mt-1">{formatBRL(stats.receitaAlugueis)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-medium">Total de Reservas</span>
          <div className="text-xl font-extrabold text-dark mt-1">{ativas.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-medium">Ticket Médio</span>
          <div className="text-xl font-extrabold text-dark mt-1">{formatBRL(stats.ticketMedioAluguel)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-medium">Pagamentos Pendentes</span>
          <div className="text-xl font-extrabold text-amber-600 mt-1">{pendentes.length}</div>
        </div>
      </div>

      {pendentes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Pagamentos Pendentes ({pendentes.length})
          </h4>
          <div className="space-y-2">
            {pendentes.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-dark">{r.sala?.nome} — {r.profile?.nome}</div>
                    <div className="text-[10px] text-slate-400">{formatDate(r.data)} • {r.hora_inicio.slice(0, 5)}–{r.hora_fim.slice(0, 5)}</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-amber-700">{formatBRL(Number(r.valor))}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-dark text-sm">Histórico de Aluguéis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="px-5 py-3">Sala</th>
                <th className="px-5 py-3">Profissional</th>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Horário</th>
                <th className="px-5 py-3">Valor</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reservas.map((r) => {
                const st = statusAluguel(r.status);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-bold text-dark">{r.sala?.nome ?? "—"}</td>
                    <td className="px-5 py-3">
                      <div className="text-dark">{r.profile?.nome ?? "—"}</div>
                      <div className="text-[10px] text-slate-400">{r.profile?.email}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{formatDate(r.data)}</td>
                    <td className="px-5 py-3 text-dark font-medium">{r.hora_inicio.slice(0, 5)}–{r.hora_fim.slice(0, 5)}</td>
                    <td className="px-5 py-3 font-bold text-dark">{formatBRL(Number(r.valor))}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${st.color}`}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EcommerceTab({ pedidos, stats }: { pedidos: Pedido[]; stats: Record<string, number> }) {
  const ativos = pedidos.filter((p) => p.status !== "Cancelado");
  const pendentes = pedidos.filter((p) => p.status === "Pendente");

  const produtosMaisVendidos = useMemo(() => {
    const map: Record<string, { nome: string; qty: number; receita: number }> = {};
    pedidos.filter((p) => p.status !== "Cancelado").forEach((p) => {
      p.itens.forEach((item) => {
        if (!map[item.nome]) map[item.nome] = { nome: item.nome, qty: 0, receita: 0 };
        map[item.nome].qty += item.qty;
        map[item.nome].receita += item.qty * item.preco;
      });
    });
    return Object.values(map).sort((a, b) => b.receita - a.receita);
  }, [pedidos]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-medium">Receita E-commerce</span>
          <div className="text-xl font-extrabold text-dark mt-1">{formatBRL(stats.receitaEcommerce)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-medium">Total de Pedidos</span>
          <div className="text-xl font-extrabold text-dark mt-1">{ativos.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-medium">Ticket Médio</span>
          <div className="text-xl font-extrabold text-dark mt-1">{formatBRL(stats.ticketMedioPedido)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-xs text-slate-500 font-medium">Pedidos Pendentes</span>
          <div className="text-xl font-extrabold text-amber-600 mt-1">{pendentes.length}</div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-extrabold text-dark text-sm mb-4">Produtos mais Vendidos</h3>
        <div className="space-y-3">
          {produtosMaisVendidos.slice(0, 5).map((p, i) => (
            <div key={p.nome} className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-200 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
              }`}>
                {i + 1}º
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-dark truncate">{p.nome}</span>
                  <span className="text-sm font-extrabold text-dark ml-2">{formatBRL(p.receita)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{p.qty} unidade{p.qty > 1 ? "s" : ""} vendida{p.qty > 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
          ))}
          {produtosMaisVendidos.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Nenhum produto vendido</p>}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-dark text-sm">Histórico de Pedidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Itens</th>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Pagamento</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pedidos.map((p) => {
                const st = statusPedido(p.status);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-bold text-primary text-xs">#{p.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-5 py-3">
                      <div className="text-dark">{p.profile?.nome ?? "—"}</div>
                      <div className="text-[10px] text-slate-400">{p.profile?.email}</div>
                    </td>
                    <td className="px-5 py-3 text-dark max-w-[180px] truncate text-xs">
                      {p.itens.map((i) => `${i.qty}× ${i.nome}`).join(", ")}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(p.created_at)}</td>
                    <td className="px-5 py-3 text-xs font-medium text-slate-600">{p.metodo_pagamento || "—"}</td>
                    <td className="px-5 py-3 font-bold text-dark">{formatBRL(Number(p.total))}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${st.color}`}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
