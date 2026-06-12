"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Assinatura {
  id: string;
  plano: string;
  status: string;
  valor: number;
  inicio: string;
  renovacao: string | null;
}

const planos = [
  {
    id: "avulso",
    nome: "Avulso",
    descricao: "Ideal para quem atende esporadicamente",
    preco: 45,
    unidade: "/hora",
    features: ["Sala equipada completa", "Wi-Fi de alta velocidade", "Recepcao compartilhada", "Estacionamento"],
    cor: "slate",
    popular: false,
  },
  {
    id: "turno",
    nome: "Turno",
    descricao: "Manha ou tarde, 4-6 horas fixas por semana",
    preco: 299,
    unidade: "/turno",
    features: ["Tudo do plano Avulso", "Prioridade na reserva", "Armario individual", "Desconto no e-commerce", "Sem taxa de reserva"],
    cor: "primary",
    popular: true,
  },
  {
    id: "integral",
    nome: "Integral",
    descricao: "Sala fixa com exclusividade total",
    preco: 1890,
    unidade: "/mes",
    features: ["Tudo do plano Turno", "Sala exclusiva 24h", "Personalizacao do espaco", "Agenda prioritaria", "Suporte dedicado", "Placa com seu nome"],
    cor: "dark",
    popular: false,
  },
];

export default function PlanoPage() {
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data } = await supabase
          .from("assinaturas")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "ativa")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        setAssinatura(data);
      } catch { /* sem tabela ainda */ }
      setLoading(false);
    }
    load();
  }, []);

  async function handleMudarPlano(planoId: string) {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSaving(false); return; }

      if (assinatura) {
        await supabase
          .from("assinaturas")
          .update({ status: "cancelada" })
          .eq("id", assinatura.id);
      }

      const plano = planos.find((p) => p.id === planoId)!;
      const hoje = new Date();
      const renovacao = new Date(hoje);
      renovacao.setMonth(renovacao.getMonth() + 1);

      const { data } = await supabase
        .from("assinaturas")
        .insert({
          user_id: user.id,
          plano: planoId,
          status: "ativa",
          valor: plano.preco,
          inicio: hoje.toISOString(),
          renovacao: renovacao.toISOString(),
        })
        .select("*")
        .single();

      if (data) setAssinatura(data);
    } catch { /* tabela pode nao existir */ }
    setSaving(false);
    setShowConfirm(null);
  }

  async function handleCancelar() {
    if (!assinatura) return;
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase
        .from("assinaturas")
        .update({ status: "cancelada" })
        .eq("id", assinatura.id);
      setAssinatura(null);
    } catch { /* */ }
    setSaving(false);
  }

  const planoAtual = assinatura ? planos.find((p) => p.id === assinatura.plano) : null;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-dark">Meu Plano</h1>
        <p className="text-slate-500 text-sm mt-1">Gerencie sua assinatura e mude de plano quando quiser</p>
      </div>

      {/* Plano atual */}
      {assinatura && planoAtual ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                planoAtual.id === "turno" ? "bg-primary-bg text-primary" : planoAtual.id === "integral" ? "bg-dark text-white" : "bg-slate-100 text-slate-600"
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-dark text-lg">Plano {planoAtual.nome}</span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded-full">Ativo</span>
                </div>
                <p className="text-sm text-slate-500">{planoAtual.descricao}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-dark">
                R$ {assinatura.valor}<span className="text-sm font-normal text-slate-400">{planoAtual.unidade}</span>
              </div>
              {assinatura.renovacao && (
                <div className="text-xs text-slate-400 mt-1">
                  Renova em {new Date(assinatura.renovacao).toLocaleDateString("pt-BR")}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleCancelar}
              disabled={saving}
              className="px-4 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-semibold"
            >
              Cancelar assinatura
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-amber-800">Voce ainda nao tem um plano ativo. Escolha abaixo o melhor para voce.</p>
        </div>
      )}

      {/* Cards de planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planos.map((plano) => {
          const isAtual = assinatura?.plano === plano.id;
          return (
            <div
              key={plano.id}
              className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
                isAtual ? "border-primary shadow-lg shadow-primary/10" : plano.popular ? "border-primary/30" : "border-slate-200"
              }`}
            >
              {plano.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  MAIS POPULAR
                </div>
              )}
              {isAtual && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  SEU PLANO
                </div>
              )}

              <div className="mb-4 mt-1">
                <h3 className="text-xl font-extrabold text-dark">{plano.nome}</h3>
                <p className="text-sm text-slate-500 mt-1">{plano.descricao}</p>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-extrabold text-dark">R$ {plano.preco}</span>
                <span className="text-slate-400 text-sm">{plano.unidade}</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plano.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {isAtual ? (
                <button disabled className="w-full py-3 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl cursor-default">
                  Plano Atual
                </button>
              ) : showConfirm === plano.id ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 text-center">
                    {assinatura ? `Trocar de ${planoAtual?.nome} para ${plano.nome}?` : `Assinar plano ${plano.nome}?`}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirm(null)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => handleMudarPlano(plano.id)}
                      disabled={saving}
                      className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors"
                    >
                      {saving ? "..." : "Confirmar"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(plano.id)}
                  className={`w-full py-3 text-sm font-bold rounded-xl transition-colors ${
                    plano.popular
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "bg-primary-bg text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {assinatura ? "Trocar para este" : "Escolher Plano"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-8 bg-slate-50 rounded-xl p-5">
        <h3 className="font-bold text-dark text-sm mb-3">Sobre os planos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-500">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span>Troque de plano a qualquer momento. A mudanca e imediata.</span>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span>Sem fidelidade. Cancele quando quiser sem multa.</span>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <span>Pagamento via Pix ou cartao de credito.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
