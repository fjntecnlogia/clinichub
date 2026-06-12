"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  categoria: string;
  preco: number;
  preco_antigo: number | null;
  estoque: number;
  foto_url: string | null;
  badge: string | null;
  ativo: boolean;
  created_at: string;
}

interface Pedido {
  id: string;
  itens: Array<{ nome: string; qty: number; preco: number }>;
  subtotal: number;
  frete: number;
  total: number;
  status: string;
  rastreio: string | null;
  created_at: string;
  profile: { nome: string; email: string } | null;
}

type Tab = "produtos" | "pedidos";

const categorias = ["Equipamentos", "Vestuario", "Descartaveis", "Mobiliario", "Tecnologia", "Higiene", "Outro"];
const statusOptions = ["Pendente", "Pago", "Em transito", "Entregue", "Cancelado"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminEcommerce() {
  const [tab, setTab] = useState<Tab>("produtos");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [activePedido, setActivePedido] = useState<Pedido | null>(null);
  const [saving, setSaving] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroPedido, setFiltroPedido] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [prodRes, pedRes] = await Promise.all([
      supabase.from("produtos").select("*").order("created_at", { ascending: false }),
      supabase.from("pedidos").select("*, profile:profiles(nome, email)").order("created_at", { ascending: false }),
    ]);
    if (prodRes.data) setProdutos(prodRes.data);
    if (pedRes.data) setPedidos(pedRes.data as Pedido[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSaveProduto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      nome: fd.get("nome") as string,
      slug: slugify(fd.get("nome") as string),
      descricao: (fd.get("descricao") as string) || null,
      categoria: fd.get("categoria") as string,
      preco: parseFloat(fd.get("preco") as string),
      preco_antigo: fd.get("preco_antigo") ? parseFloat(fd.get("preco_antigo") as string) : null,
      estoque: parseInt(fd.get("estoque") as string),
      foto_url: (fd.get("foto_url") as string) || null,
      badge: (fd.get("badge") as string) || null,
      ativo: fd.get("ativo") === "on",
    };

    const supabase = createClient();
    if (editProduto) {
      await supabase.from("produtos").update(payload).eq("id", editProduto.id);
    } else {
      await supabase.from("produtos").insert(payload);
    }

    setSaving(false);
    setShowProdutoModal(false);
    setEditProduto(null);
    await loadData();
  }

  async function handleDeleteProduto(id: string) {
    const supabase = createClient();
    await supabase.from("produtos").delete().eq("id", id);
    setConfirmDelete(null);
    await loadData();
  }

  async function handleToggleAtivo(p: Produto) {
    const supabase = createClient();
    await supabase.from("produtos").update({ ativo: !p.ativo }).eq("id", p.id);
    await loadData();
  }

  async function handleUpdateStatus(pedidoId: string, newStatus: string) {
    const supabase = createClient();
    await supabase.from("pedidos").update({ status: newStatus }).eq("id", pedidoId);
    await loadData();
    if (activePedido?.id === pedidoId) {
      setActivePedido((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  }

  async function handleUpdateRastreio(pedidoId: string, rastreio: string) {
    const supabase = createClient();
    await supabase.from("pedidos").update({ rastreio }).eq("id", pedidoId);
    await loadData();
  }

  function openEdit(p: Produto) {
    setEditProduto(p);
    setShowProdutoModal(true);
  }

  function openNew() {
    setEditProduto(null);
    setShowProdutoModal(true);
  }

  const produtosFiltrados = produtos
    .filter((p) => filtroCategoria === "Todos" || p.categoria === filtroCategoria)
    .filter((p) => !busca || p.nome.toLowerCase().includes(busca.toLowerCase()));

  const pedidosFiltrados = pedidos.filter(
    (p) => filtroPedido === "Todos" || p.status === filtroPedido
  );

  const totalReceita = pedidos
    .filter((p) => p.status !== "Cancelado")
    .reduce((s, p) => s + Number(p.total), 0);
  const totalEstoque = produtos.reduce((s, p) => s + p.estoque, 0);
  const baixoEstoque = produtos.filter((p) => p.estoque < 10 && p.ativo).length;
  const pedidosPendentes = pedidos.filter((p) => p.status === "Pendente" || p.status === "Pago").length;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">E-commerce</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie produtos e pedidos</p>
        </div>
        {tab === "produtos" && (
          <button onClick={openNew} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
            + Novo Produto
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Produtos</span>
            <div className="w-8 h-8 bg-primary-bg rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-dark mt-2">{produtos.length}</div>
          <div className="text-xs text-slate-400">{produtos.filter((p) => p.ativo).length} ativos</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Estoque</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${baixoEstoque > 0 ? "bg-red-50" : "bg-green-50"}`}>
              <svg className={`w-4 h-4 ${baixoEstoque > 0 ? "text-red-600" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" /></svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-dark mt-2">{totalEstoque}</div>
          <div className="text-xs text-slate-400">{baixoEstoque > 0 ? `${baixoEstoque} com estoque baixo` : "Tudo em dia"}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Pedidos</span>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-dark mt-2">{pedidos.length}</div>
          <div className="text-xs text-slate-400">{pedidosPendentes} pendentes</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Receita</span>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-dark mt-2">
            R$ {totalReceita.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-400">total vendido</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit mb-6">
        {(["produtos", "pedidos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-colors ${
              tab === t ? "bg-white text-dark shadow-sm" : "text-slate-500 hover:text-dark"
            }`}
          >
            {t === "produtos" ? `Produtos (${produtos.length})` : `Pedidos (${pedidos.length})`}
          </button>
        ))}
      </div>

      {tab === "produtos" && (
        <>
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar produto..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-2">
              {["Todos", ...categorias].map((c) => (
                <button
                  key={c}
                  onClick={() => setFiltroCategoria(c)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    filtroCategoria === c ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
                    <th className="px-5 py-3">Produto</th>
                    <th className="px-5 py-3">Categoria</th>
                    <th className="px-5 py-3">Preco</th>
                    <th className="px-5 py-3">Estoque</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {produtosFiltrados.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">Nenhum produto encontrado</td></tr>
                  ) : (
                    produtosFiltrados.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {p.foto_url ? (
                              <img src={p.foto_url} alt={p.nome} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-dark">{p.nome}</span>
                              {p.badge && <span className="ml-2 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{p.categoria}</td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-dark">R$ {Number(p.preco).toFixed(2)}</div>
                          {p.preco_antigo && (
                            <div className="text-xs text-slate-400 line-through">R$ {Number(p.preco_antigo).toFixed(2)}</div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`font-semibold ${p.estoque < 10 ? "text-red-600" : p.estoque < 30 ? "text-amber-600" : "text-green-600"}`}>
                            {p.estoque}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleToggleAtivo(p)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                              p.ativo ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {p.ativo ? "Ativo" : "Inativo"}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary-bg rounded-lg transition-colors" title="Editar">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            {confirmDelete === p.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDeleteProduto(p.id)} className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700">Sim</button>
                                <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-300">Nao</button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "pedidos" && (
        <>
          <div className="flex gap-2 mb-5 flex-wrap">
            {["Todos", ...statusOptions].map((s) => {
              const count = s === "Todos" ? pedidos.length : pedidos.filter((p) => p.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setFiltroPedido(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    filtroPedido === s ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {s} ({count})
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
                    <th className="px-5 py-3">Pedido</th>
                    <th className="px-5 py-3">Cliente</th>
                    <th className="px-5 py-3">Itens</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Data</th>
                    <th className="px-5 py-3 text-right">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pedidosFiltrados.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">Nenhum pedido encontrado</td></tr>
                  ) : (
                    pedidosFiltrados.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-slate-500">#{p.id.slice(0, 8)}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-dark">{p.profile?.nome ?? "—"}</div>
                          <div className="text-xs text-slate-400">{p.profile?.email ?? ""}</div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {Array.isArray(p.itens) ? p.itens.length : 0} itens
                        </td>
                        <td className="px-5 py-3.5 font-semibold">
                          R$ {Number(p.total).toFixed(2)}
                          {Number(p.frete) > 0 && (
                            <div className="text-[10px] text-slate-400 font-normal">frete: R$ {Number(p.frete).toFixed(2)}</div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <select
                            value={p.status}
                            onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${
                              p.status === "Entregue" ? "bg-green-50 text-green-700"
                                : p.status === "Pago" ? "bg-blue-50 text-blue-700"
                                : p.status === "Em transito" ? "bg-purple-50 text-purple-700"
                                : p.status === "Pendente" ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          {new Date(p.created_at).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => { setActivePedido(p); setShowPedidoModal(true); }}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary-bg rounded-lg transition-colors"
                            title="Detalhes"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Produto */}
      {showProdutoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowProdutoModal(false); setEditProduto(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-xl mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-dark">{editProduto ? "Editar Produto" : "Novo Produto"}</h2>
              <button onClick={() => { setShowProdutoModal(false); setEditProduto(null); }} className="text-slate-400 hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveProduto} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Nome do Produto *</label>
                <input name="nome" required defaultValue={editProduto?.nome} placeholder="Ex: Jaleco Premium Branco" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Descricao</label>
                <textarea name="descricao" rows={3} defaultValue={editProduto?.descricao ?? ""} placeholder="Descricao detalhada do produto..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Categoria *</label>
                  <select name="categoria" defaultValue={editProduto?.categoria ?? "Equipamentos"} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                    {categorias.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Badge</label>
                  <input name="badge" defaultValue={editProduto?.badge ?? ""} placeholder="Ex: Novo, Oferta" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Preco (R$) *</label>
                  <input name="preco" type="number" step="0.01" required defaultValue={editProduto ? Number(editProduto.preco) : ""} placeholder="189.90" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Preco Antigo</label>
                  <input name="preco_antigo" type="number" step="0.01" defaultValue={editProduto?.preco_antigo ? Number(editProduto.preco_antigo) : ""} placeholder="249.90" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Estoque *</label>
                  <input name="estoque" type="number" required defaultValue={editProduto?.estoque ?? 0} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">URL da Foto</label>
                <input name="foto_url" type="url" defaultValue={editProduto?.foto_url ?? ""} placeholder="https://..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input name="ativo" type="checkbox" defaultChecked={editProduto?.ativo ?? true} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <label className="text-sm text-dark">Produto ativo (visivel na loja)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowProdutoModal(false); setEditProduto(null); }} className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors">
                  {saving ? "Salvando..." : editProduto ? "Salvar Alteracoes" : "Criar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pedido Detalhes */}
      {showPedidoModal && activePedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowPedidoModal(false); setActivePedido(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-dark">Pedido #{activePedido.id.slice(0, 8)}</h2>
                <p className="text-xs text-slate-400">{new Date(activePedido.created_at).toLocaleString("pt-BR")}</p>
              </div>
              <button onClick={() => { setShowPedidoModal(false); setActivePedido(null); }} className="text-slate-400 hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Cliente</div>
                <div className="font-semibold text-dark">{activePedido.profile?.nome ?? "—"}</div>
                <div className="text-sm text-slate-500">{activePedido.profile?.email ?? ""}</div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Itens</div>
                {Array.isArray(activePedido.itens) && activePedido.itens.length > 0 ? (
                  <div className="space-y-2">
                    {activePedido.itens.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-dark">{item.qty}x {item.nome}</span>
                        <span className="font-semibold">R$ {(item.preco * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">Sem itens detalhados</span>
                )}
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Subtotal</span>
                  <span>R$ {Number(activePedido.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Frete</span>
                  <span>R$ {Number(activePedido.frete).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-dark border-t border-slate-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>R$ {Number(activePedido.total).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Status</label>
                <select
                  value={activePedido.status}
                  onChange={(e) => handleUpdateStatus(activePedido.id, e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  {statusOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Codigo de Rastreio</label>
                <div className="flex gap-2">
                  <input
                    defaultValue={activePedido.rastreio ?? ""}
                    placeholder="Ex: BR123456789CD"
                    className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    onBlur={(e) => {
                      if (e.target.value !== (activePedido.rastreio ?? "")) {
                        handleUpdateRastreio(activePedido.id, e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
