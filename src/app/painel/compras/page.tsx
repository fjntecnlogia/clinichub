"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface PedidoItem {
  nome: string;
  slug?: string;
  preco: number;
  qty: number;
  foto_url?: string;
}

interface Pedido {
  id: string;
  itens: PedidoItem[];
  subtotal: number;
  frete: number;
  total: number;
  status: string;
  rastreio: string | null;
  endereco: Record<string, string> | null;
  metodo_pagamento: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string | null;
}

const mockPedidos: Pedido[] = [
  {
    id: "demo-1023",
    itens: [
      { nome: "Jaleco Premium Branco (M)", preco: 189.9, qty: 1 },
      { nome: "Kit Curativos Estereis", preco: 45.9, qty: 2 },
    ],
    subtotal: 281.7,
    frete: 0,
    total: 281.7,
    status: "Em transito",
    rastreio: "BR1234567890",
    endereco: { rua: "Rua Exemplo, 123", cidade: "Sao Paulo", estado: "SP", cep: "01001-000" },
    metodo_pagamento: "Pix",
    notas: null,
    created_at: "2026-06-10T10:00:00Z",
    updated_at: null,
  },
  {
    id: "demo-1019",
    itens: [{ nome: "Luvas Nitrilo (cx 100)", preco: 54.9, qty: 1 }],
    subtotal: 54.9,
    frete: 0,
    total: 54.9,
    status: "Entregue",
    rastreio: "BR9876543210",
    endereco: null,
    metodo_pagamento: "Cartao",
    notas: null,
    created_at: "2026-06-02T14:30:00Z",
    updated_at: "2026-06-06T09:00:00Z",
  },
  {
    id: "demo-1014",
    itens: [{ nome: "Estetoscopio Littmann Classic III", preco: 849.9, qty: 1 }],
    subtotal: 849.9,
    frete: 0,
    total: 849.9,
    status: "Entregue",
    rastreio: null,
    endereco: null,
    metodo_pagamento: "Pix",
    notas: null,
    created_at: "2026-05-25T16:00:00Z",
    updated_at: "2026-05-30T11:00:00Z",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
  Pendente: { bg: "bg-amber-50", text: "text-amber-700", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  Pago: { bg: "bg-blue-50", text: "text-blue-700", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  "Em transito": { bg: "bg-indigo-50", text: "text-indigo-700", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
  Entregue: { bg: "bg-green-50", text: "text-green-700", icon: "M5 13l4 4L19 7" },
  Cancelado: { bg: "bg-red-50", text: "text-red-600", icon: "M6 18L18 6M6 6l12 12" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.Pendente;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={cfg.icon} />
      </svg>
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function shortId(id: string) {
  return id.startsWith("demo-") ? `#P-${id.replace("demo-", "")}` : `#P-${id.slice(0, 6).toUpperCase()}`;
}

export default function MinhasCompras() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Pedido | null>(null);
  const [tracking, setTracking] = useState<Pedido | null>(null);
  const [tab, setTab] = useState("Todos");

  const loadPedidos = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPedidos(mockPedidos);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setPedidos(!error && data && data.length > 0 ? data : mockPedidos);
    } catch {
      setPedidos(mockPedidos);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPedidos();
  }, [loadPedidos]);

  const tabs = ["Todos", "Pendente", "Em transito", "Entregue", "Cancelado"];
  const filtered = tab === "Todos" ? pedidos : pedidos.filter((p) => p.status === tab);

  const totalGasto = pedidos
    .filter((p) => p.status !== "Cancelado")
    .reduce((sum, p) => sum + Number(p.total), 0);

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
        <h1 className="text-2xl font-extrabold text-dark">Minhas Compras</h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhe seus pedidos da loja</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Total de pedidos</div>
          <div className="text-xl font-extrabold text-dark">{pedidos.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Em andamento</div>
          <div className="text-xl font-extrabold text-indigo-600">
            {pedidos.filter((p) => p.status === "Em transito" || p.status === "Pendente" || p.status === "Pago").length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Entregues</div>
          <div className="text-xl font-extrabold text-green-600">
            {pedidos.filter((p) => p.status === "Entregue").length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-400 font-medium mb-1">Total gasto</div>
          <div className="text-xl font-extrabold text-primary">R$ {totalGasto.toFixed(2).replace(".", ",")}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              tab === t ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-slate-400 text-sm">Nenhum pedido encontrado</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-bold text-dark text-sm">{shortId(p.id)}</span>
                  <div className="text-xs text-slate-400 mt-0.5">{formatDate(p.created_at)}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="space-y-1 mb-4">
                {(p.itens as PedidoItem[]).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-dark">
                      {item.nome}
                      {item.qty > 1 && <span className="text-slate-400 ml-1">x{item.qty}</span>}
                    </span>
                    <span className="text-slate-500 text-xs">
                      R$ {(item.preco * item.qty).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-lg font-extrabold text-primary">
                  R$ {Number(p.total).toFixed(2).replace(".", ",")}
                </span>
                <div className="flex gap-2">
                  {p.rastreio && (
                    <button
                      onClick={() => setTracking(p)}
                      className="px-3 py-1.5 bg-primary-bg text-primary text-xs font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      Rastrear
                    </button>
                  )}
                  <button
                    onClick={() => setSelected(p)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Detalhes */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-dark">Pedido {shortId(selected.id)}</h2>
                <p className="text-xs text-slate-400">{formatDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-dark p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-dark">Status</span>
                <StatusBadge status={selected.status} />
              </div>

              {/* Itens */}
              <div>
                <h3 className="text-sm font-bold text-dark mb-3">Itens do pedido</h3>
                <div className="space-y-3">
                  {(selected.itens as PedidoItem[]).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        {item.foto_url ? (
                          <img src={item.foto_url} alt={item.nome} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-dark truncate">{item.nome}</div>
                        <div className="text-xs text-slate-400">Qtd: {item.qty}</div>
                      </div>
                      <div className="text-sm font-bold text-dark">
                        R$ {(item.preco * item.qty).toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totais */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-dark">R$ {Number(selected.subtotal).toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Frete</span>
                  <span className="text-dark">
                    {Number(selected.frete) > 0 ? `R$ ${Number(selected.frete).toFixed(2).replace(".", ",")}` : "Gratis"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-slate-200">
                  <span className="text-dark">Total</span>
                  <span className="text-primary text-lg">R$ {Number(selected.total).toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              {/* Pagamento */}
              {selected.metodo_pagamento && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Pagamento</span>
                  <span className="font-semibold text-dark flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {selected.metodo_pagamento}
                  </span>
                </div>
              )}

              {/* Rastreio */}
              {selected.rastreio && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Rastreio</span>
                  <span className="font-mono font-semibold text-dark text-xs bg-slate-100 px-2 py-1 rounded">
                    {selected.rastreio}
                  </span>
                </div>
              )}

              {/* Endereco */}
              {selected.endereco && (
                <div>
                  <h3 className="text-sm font-bold text-dark mb-2">Endereco de entrega</h3>
                  <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 space-y-0.5">
                    {selected.endereco.rua && <div>{selected.endereco.rua}</div>}
                    {(selected.endereco.cidade || selected.endereco.estado) && (
                      <div>{[selected.endereco.cidade, selected.endereco.estado].filter(Boolean).join(" - ")}</div>
                    )}
                    {selected.endereco.cep && <div>CEP: {selected.endereco.cep}</div>}
                  </div>
                </div>
              )}

              {/* Notas */}
              {selected.notas && (
                <div>
                  <h3 className="text-sm font-bold text-dark mb-2">Observacoes</h3>
                  <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3">{selected.notas}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setSelected(null)}
                className="w-full py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rastreio */}
      {tracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setTracking(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-dark">Rastreamento</h2>
              <button onClick={() => setTracking(null)} className="text-slate-400 hover:text-dark p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Pedido</span>
                <span className="font-bold text-dark text-sm">{shortId(tracking.id)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Status</span>
                <StatusBadge status={tracking.status} />
              </div>

              <div>
                <span className="text-sm text-slate-500 block mb-2">Codigo de rastreio</span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-slate-100 px-4 py-3 rounded-lg text-sm font-mono font-bold text-dark text-center tracking-wider">
                    {tracking.rastreio}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tracking.rastreio ?? "");
                    }}
                    className="px-3 py-3 bg-primary-bg text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    title="Copiar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Timeline visual */}
              <div className="space-y-0">
                {[
                  { label: "Pedido confirmado", done: true },
                  { label: "Pagamento aprovado", done: tracking.status !== "Pendente" },
                  { label: "Em transporte", done: tracking.status === "Em transito" || tracking.status === "Entregue" },
                  { label: "Entregue", done: tracking.status === "Entregue" },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        step.done ? "bg-primary" : "bg-slate-200"
                      }`}>
                        {step.done ? (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                        )}
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`w-0.5 h-6 ${step.done ? "bg-primary" : "bg-slate-200"}`} />
                      )}
                    </div>
                    <span className={`text-sm pt-0.5 ${step.done ? "font-semibold text-dark" : "text-slate-400"}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={`https://www.linkcorreios.com.br/?id=${tracking.rastreio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors text-center"
              >
                Rastrear nos Correios
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
