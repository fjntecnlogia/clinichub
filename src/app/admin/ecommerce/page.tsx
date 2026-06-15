"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  cor: string;
  icone: string;
  ativo: boolean;
  ordem: number;
  created_at: string;
}

interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  descricao_curta: string | null;
  categoria: string;
  preco: number;
  preco_antigo: number | null;
  estoque: number;
  foto_url: string | null;
  badge: string | null;
  sku: string | null;
  marca: string | null;
  peso: number | null;
  destaque: boolean;
  tags: string[];
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
  endereco: { rua?: string; cidade?: string; estado?: string; cep?: string } | null;
  metodo_pagamento: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string | null;
  profile: { nome: string; email: string; telefone?: string } | null;
}

type Tab = "produtos" | "pedidos" | "categorias";

const categoriasDefault = ["Equipamentos", "Vestuário", "Descartáveis", "Mobiliário", "Tecnologia", "Higiene", "Outro"];
const statusOptions = ["Pendente", "Pago", "Em transito", "Entregue", "Cancelado"];
const iconeOptions = ["📦", "🔧", "👔", "🧤", "🪑", "💻", "🧴", "🦷", "💊", "🩺", "🧪", "🛒", "⭐", "🎯"];
const corOptions = ["#1D4ED8", "#7C3AED", "#059669", "#D97706", "#DC2626", "#2563EB", "#0891B2", "#6B7280", "#F97316", "#EC4899"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateSKU(nome: string, categoria: string) {
  const cat = categoria.substring(0, 3).toUpperCase();
  const prod = nome.substring(0, 3).toUpperCase();
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${cat}-${prod}-${num}`;
}

export default function AdminEcommerce() {
  const [tab, setTab] = useState<Tab>("produtos");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);
  const [activePedido, setActivePedido] = useState<Pedido | null>(null);
  const [saving, setSaving] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroPedido, setFiltroPedido] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteCat, setConfirmDeleteCat] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [produtoTab, setProdutoTab] = useState<"geral" | "detalhes" | "seo">("geral");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearFoto() {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [prodRes, pedRes, catRes] = await Promise.all([
      supabase.from("produtos").select("*").order("created_at", { ascending: false }),
      supabase.from("pedidos").select("*, profile:profiles(nome, email, telefone)").order("created_at", { ascending: false }),
      supabase.from("categorias").select("*").order("ordem", { ascending: true }),
    ]);
    if (prodRes.data) setProdutos(prodRes.data);
    if (pedRes.data) setPedidos(pedRes.data as Pedido[]);
    if (catRes.data && catRes.data.length > 0) {
      setCategorias(catRes.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const categoriasNomes = categorias.length > 0
    ? categorias.filter(c => c.ativo).map(c => c.nome)
    : categoriasDefault;

  // === PRODUTO HANDLERS ===
  async function handleSaveProduto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();

    let foto_url: string | null = fotoPreview ? (editProduto?.foto_url ?? null) : null;

    if (fotoFile) {
      const ext = fotoFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${slugify(fd.get("nome") as string)}-${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("produtos")
        .upload(fileName, fotoFile, { cacheControl: "3600", upsert: true });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from("produtos").getPublicUrl(uploadData.path);
        foto_url = urlData.publicUrl;
      }
    }

    const tagsRaw = (fd.get("tags") as string) || "";
    const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);

    const payload = {
      nome: fd.get("nome") as string,
      slug: slugify(fd.get("nome") as string),
      descricao: (fd.get("descricao") as string) || null,
      descricao_curta: (fd.get("descricao_curta") as string) || null,
      categoria: fd.get("categoria") as string,
      preco: parseFloat(fd.get("preco") as string),
      preco_antigo: fd.get("preco_antigo") ? parseFloat(fd.get("preco_antigo") as string) : null,
      estoque: parseInt(fd.get("estoque") as string),
      foto_url,
      badge: (fd.get("badge") as string) || null,
      sku: (fd.get("sku") as string) || null,
      marca: (fd.get("marca") as string) || null,
      peso: fd.get("peso") ? parseFloat(fd.get("peso") as string) : null,
      destaque: fd.get("destaque") === "on",
      tags,
      ativo: fd.get("ativo") === "on",
    };

    if (editProduto) {
      await supabase.from("produtos").update(payload).eq("id", editProduto.id);
    } else {
      await supabase.from("produtos").insert(payload);
    }

    clearFoto();
    setSaving(false);
    setShowProdutoModal(false);
    setEditProduto(null);
    setProdutoTab("geral");
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

  async function handleToggleDestaque(p: Produto) {
    const supabase = createClient();
    await supabase.from("produtos").update({ destaque: !p.destaque }).eq("id", p.id);
    await loadData();
  }

  // === PEDIDO HANDLERS ===
  async function handleUpdateStatus(pedidoId: string, newStatus: string) {
    const supabase = createClient();
    await supabase.from("pedidos").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", pedidoId);
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

  async function handleUpdateNotas(pedidoId: string, notas: string) {
    const supabase = createClient();
    await supabase.from("pedidos").update({ notas }).eq("id", pedidoId);
    await loadData();
  }

  // === CATEGORIA HANDLERS ===
  async function handleSaveCategoria(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();

    const payload = {
      nome: fd.get("nome") as string,
      slug: slugify(fd.get("nome") as string),
      descricao: (fd.get("descricao") as string) || null,
      cor: fd.get("cor") as string,
      icone: fd.get("icone") as string,
      ativo: fd.get("ativo") === "on",
      ordem: parseInt(fd.get("ordem") as string) || 0,
    };

    if (editCategoria) {
      await supabase.from("categorias").update(payload).eq("id", editCategoria.id);
    } else {
      await supabase.from("categorias").insert(payload);
    }

    setSaving(false);
    setShowCategoriaModal(false);
    setEditCategoria(null);
    await loadData();
  }

  async function handleDeleteCategoria(id: string) {
    const supabase = createClient();
    await supabase.from("categorias").delete().eq("id", id);
    setConfirmDeleteCat(null);
    await loadData();
  }

  // === HELPERS ===
  function openEdit(p: Produto) {
    setEditProduto(p);
    setFotoFile(null);
    setFotoPreview(p.foto_url || null);
    setProdutoTab("geral");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowProdutoModal(true);
  }

  function openNew() {
    setEditProduto(null);
    clearFoto();
    setProdutoTab("geral");
    setShowProdutoModal(true);
  }

  function openEditCategoria(c: Categoria) {
    setEditCategoria(c);
    setShowCategoriaModal(true);
  }

  function openNewCategoria() {
    setEditCategoria(null);
    setShowCategoriaModal(true);
  }

  const produtosFiltrados = produtos
    .filter((p) => filtroCategoria === "Todos" || p.categoria === filtroCategoria)
    .filter((p) => !busca || p.nome.toLowerCase().includes(busca.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(busca.toLowerCase())));

  const pedidosFiltrados = pedidos.filter(
    (p) => filtroPedido === "Todos" || p.status === filtroPedido
  );

  const totalReceita = pedidos
    .filter((p) => p.status !== "Cancelado")
    .reduce((s, p) => s + Number(p.total), 0);
  const receitaMes = pedidos
    .filter((p) => {
      const d = new Date(p.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && p.status !== "Cancelado";
    })
    .reduce((s, p) => s + Number(p.total), 0);
  const totalEstoque = produtos.reduce((s, p) => s + p.estoque, 0);
  const baixoEstoque = produtos.filter((p) => p.estoque < 10 && p.ativo).length;
  const pedidosPendentes = pedidos.filter((p) => p.status === "Pendente" || p.status === "Pago").length;
  const produtosDestaque = produtos.filter(p => p.destaque).length;
  const ticketMedio = pedidos.length > 0 ? totalReceita / pedidos.filter(p => p.status !== "Cancelado").length : 0;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">E-commerce</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie produtos, pedidos e categorias</p>
        </div>
        <div className="flex items-center gap-2">
          {tab === "produtos" && (
            <button onClick={openNew} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Novo Produto
            </button>
          )}
          {tab === "categorias" && (
            <button onClick={openNewCategoria} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Nova Categoria
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <StatCard label="Produtos" value={produtos.length} sub={`${produtos.filter(p => p.ativo).length} ativos`} icon="📦" />
        <StatCard label="Estoque" value={totalEstoque} sub={baixoEstoque > 0 ? `${baixoEstoque} baixo` : "OK"} icon="📊" alert={baixoEstoque > 0} />
        <StatCard label="Pedidos" value={pedidos.length} sub={`${pedidosPendentes} pendentes`} icon="🛒" alert={pedidosPendentes > 0} />
        <StatCard label="Receita Total" value={`R$ ${totalReceita.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`} sub="acumulado" icon="💰" />
        <StatCard label="Receita Mês" value={`R$ ${receitaMes.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`} sub="mês atual" icon="📈" />
        <StatCard label="Ticket Médio" value={`R$ ${ticketMedio.toFixed(2)}`} sub={`${produtosDestaque} destaques`} icon="⭐" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit mb-6">
        {([
          { key: "produtos" as Tab, label: `Produtos (${produtos.length})` },
          { key: "pedidos" as Tab, label: `Pedidos (${pedidos.length})` },
          { key: "categorias" as Tab, label: `Categorias (${categorias.length || categoriasDefault.length})` },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-colors ${
              tab === t.key ? "bg-white text-dark shadow-sm" : "text-slate-500 hover:text-dark"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ====== TAB PRODUTOS ====== */}
      {tab === "produtos" && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou SKU..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Todos", ...categoriasNomes].map((c) => (
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

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
                    <th className="px-5 py-3">Produto</th>
                    <th className="px-5 py-3">SKU</th>
                    <th className="px-5 py-3">Categoria</th>
                    <th className="px-5 py-3">Preço</th>
                    <th className="px-5 py-3">Estoque</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {produtosFiltrados.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">Nenhum produto encontrado</td></tr>
                  ) : (
                    produtosFiltrados.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {p.foto_url ? (
                              <img src={p.foto_url} alt={p.nome} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">📦</div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-dark">{p.nome}</span>
                                {p.destaque && <span className="text-amber-500 text-xs" title="Destaque">⭐</span>}
                              </div>
                              {p.marca && <span className="text-xs text-slate-400">{p.marca}</span>}
                              {p.badge && <span className="ml-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-slate-500">{p.sku || "—"}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                            {categorias.find(c => c.nome === p.categoria)?.icone || "📦"} {p.categoria}
                          </span>
                        </td>
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
                          {p.estoque < 10 && p.ativo && (
                            <span className="ml-1 text-[10px] text-red-500 font-bold">BAIXO</span>
                          )}
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
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleToggleDestaque(p)} className={`p-1.5 rounded-lg transition-colors ${p.destaque ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-amber-500 hover:bg-amber-50"}`} title="Destaque">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            </button>
                            <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary-bg rounded-lg transition-colors" title="Editar">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            {confirmDelete === p.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDeleteProduto(p.id)} className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700">Sim</button>
                                <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-300">Não</button>
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

      {/* ====== TAB PEDIDOS ====== */}
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
                    <th className="px-5 py-3">Pagamento</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Data</th>
                    <th className="px-5 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pedidosFiltrados.length === 0 ? (
                    <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-400">Nenhum pedido encontrado</td></tr>
                  ) : (
                    pedidosFiltrados.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">#{p.id.slice(0, 8)}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-dark">{p.profile?.nome ?? "—"}</div>
                          <div className="text-xs text-slate-400">{p.profile?.email ?? ""}</div>
                          {p.profile?.telefone && <div className="text-xs text-slate-400">{p.profile.telefone}</div>}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-slate-600">{Array.isArray(p.itens) ? p.itens.length : 0} itens</span>
                          <div className="text-[10px] text-slate-400">
                            {Array.isArray(p.itens) && p.itens.slice(0, 2).map(i => i.nome).join(", ")}
                            {Array.isArray(p.itens) && p.itens.length > 2 && "..."}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold">R$ {Number(p.total).toFixed(2)}</div>
                          <div className="text-[10px] text-slate-400">
                            sub: R$ {Number(p.subtotal).toFixed(2)}
                            {Number(p.frete) > 0 && ` + frete: R$ ${Number(p.frete).toFixed(2)}`}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs text-slate-500">{p.metodo_pagamento || "—"}</span>
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
                          <div className="text-[10px]">{new Date(p.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
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

      {/* ====== TAB CATEGORIAS ====== */}
      {tab === "categorias" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(categorias.length > 0 ? categorias : categoriasDefault.map((c, i) => ({
            id: `default-${i}`,
            nome: c,
            slug: slugify(c),
            descricao: null,
            cor: corOptions[i % corOptions.length],
            icone: iconeOptions[i % iconeOptions.length],
            ativo: true,
            ordem: i,
            created_at: "",
          }))).map((cat) => {
            const prodCount = produtos.filter(p => p.categoria === cat.nome).length;
            return (
              <div key={cat.id} className={`bg-white rounded-xl border-2 p-5 transition-shadow hover:shadow-md ${cat.ativo ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${cat.cor}15` }}>
                      {cat.icone}
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">{cat.nome}</h3>
                      <p className="text-xs text-slate-400">{prodCount} produto{prodCount !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${cat.ativo ? "bg-green-500" : "bg-slate-300"}`} />
                  </div>
                </div>
                {cat.descricao && (
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{cat.descricao}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: cat.cor }} />
                    <span className="text-xs text-slate-400">Ordem: {cat.ordem}</span>
                  </div>
                  {cat.id.startsWith("default-") ? (
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded">Padrão</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditCategoria(cat as Categoria)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary-bg rounded-lg transition-colors" title="Editar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      {confirmDeleteCat === cat.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDeleteCategoria(cat.id)} className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700">Sim</button>
                          <button onClick={() => setConfirmDeleteCat(null)} className="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-300">Não</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteCat(cat.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====== MODAL PRODUTO (com sub-tabs) ====== */}
      {showProdutoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowProdutoModal(false); setEditProduto(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-dark">{editProduto ? "Editar Produto" : "Novo Produto"}</h2>
              <button onClick={() => { setShowProdutoModal(false); setEditProduto(null); }} className="text-slate-400 hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Sub-tabs do modal */}
            <div className="flex gap-1 px-6 pt-4 bg-slate-50/50">
              {([
                { key: "geral" as const, label: "Informações Gerais", icon: "📝" },
                { key: "detalhes" as const, label: "Detalhes", icon: "📋" },
                { key: "seo" as const, label: "Midia e SEO", icon: "🖼️" },
              ]).map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setProdutoTab(t.key)}
                  className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
                    produtoTab === t.key ? "bg-white text-dark border border-slate-200 border-b-white -mb-px" : "text-slate-500 hover:text-dark"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProduto} className="overflow-y-auto flex-1 px-6 py-5">
              {produtoTab === "geral" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-dark mb-1">Nome do Produto *</label>
                      <input name="nome" required defaultValue={editProduto?.nome} placeholder="Ex: Jaleco Premium Branco" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">SKU</label>
                      <div className="flex gap-1">
                        <input name="sku" defaultValue={editProduto?.sku ?? ""} placeholder="AUTO" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1">Descrição Curta</label>
                    <input name="descricao_curta" defaultValue={editProduto?.descricao_curta ?? ""} placeholder="Resumo que aparece na listagem" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" maxLength={160} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1">Descrição Completa</label>
                    <textarea name="descricao" rows={3} defaultValue={editProduto?.descricao ?? ""} placeholder="Descrição detalhada do produto..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">Categoria *</label>
                      <select name="categoria" defaultValue={editProduto?.categoria ?? categoriasNomes[0]} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                        {categoriasNomes.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">Marca</label>
                      <input name="marca" defaultValue={editProduto?.marca ?? ""} placeholder="Ex: 3M, Dentsply" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">Preço (R$) *</label>
                      <input name="preco" type="number" step="0.01" required defaultValue={editProduto ? Number(editProduto.preco) : ""} placeholder="189.90" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">Preço Antigo</label>
                      <input name="preco_antigo" type="number" step="0.01" defaultValue={editProduto?.preco_antigo ? Number(editProduto.preco_antigo) : ""} placeholder="249.90" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">Estoque *</label>
                      <input name="estoque" type="number" required defaultValue={editProduto?.estoque ?? 0} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">Peso (kg)</label>
                      <input name="peso" type="number" step="0.001" defaultValue={editProduto?.peso ? Number(editProduto.peso) : ""} placeholder="0.500" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {produtoTab === "detalhes" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">Badge / Etiqueta</label>
                      <input name="badge" defaultValue={editProduto?.badge ?? ""} placeholder="Ex: Novo, Oferta, -20%" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                      <p className="text-xs text-slate-400 mt-1">Aparece como etiqueta no card do produto</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-1">Tags</label>
                      <input name="tags" defaultValue={editProduto?.tags?.join(", ") ?? ""} placeholder="odonto, epi, premium" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                      <p className="text-xs text-slate-400 mt-1">Separadas por vírgula, usadas para filtros</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <h4 className="font-semibold text-dark text-sm">Visibilidade</h4>
                    <div className="flex items-center gap-3">
                      <input name="ativo" type="checkbox" defaultChecked={editProduto?.ativo ?? true} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                      <div>
                        <label className="text-sm text-dark font-medium">Produto ativo</label>
                        <p className="text-xs text-slate-400">Visível na loja para os clientes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input name="destaque" type="checkbox" defaultChecked={editProduto?.destaque ?? false} className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                      <div>
                        <label className="text-sm text-dark font-medium">Produto em destaque</label>
                        <p className="text-xs text-slate-400">Aparece na seção de destaques da loja</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {produtoTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1">Foto do Produto</label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                        {fotoPreview ? (
                          <>
                            <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={clearFoto}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </>
                        ) : (
                          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="foto-upload"
                        />
                        <label
                          htmlFor="foto-upload"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Escolher imagem
                        </label>
                        <p className="text-xs text-slate-400 mt-1.5">JPG, PNG ou WebP. Max 2MB. Recomendado: 800x800px</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="font-semibold text-dark text-sm mb-2">Pré-visualização SEO</h4>
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <p className="text-primary text-sm font-medium truncate">{editProduto?.nome || "Nome do Produto"} — MaciHub</p>
                      <p className="text-green-700 text-xs truncate">macihub.com.br/loja/{editProduto?.slug || slugify(editProduto?.nome || "produto")}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{editProduto?.descricao_curta || editProduto?.descricao || "Descrição do produto aparece aqui nos resultados de busca..."}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden inputs para tabs inativas */}
              {produtoTab !== "geral" && (
                <>
                  <input type="hidden" name="nome" defaultValue={editProduto?.nome} />
                  <input type="hidden" name="sku" defaultValue={editProduto?.sku ?? ""} />
                  <input type="hidden" name="descricao_curta" defaultValue={editProduto?.descricao_curta ?? ""} />
                  <input type="hidden" name="descricao" defaultValue={editProduto?.descricao ?? ""} />
                  <input type="hidden" name="categoria" defaultValue={editProduto?.categoria ?? categoriasNomes[0]} />
                  <input type="hidden" name="marca" defaultValue={editProduto?.marca ?? ""} />
                  <input type="hidden" name="preco" defaultValue={editProduto ? Number(editProduto.preco) : ""} />
                  <input type="hidden" name="preco_antigo" defaultValue={editProduto?.preco_antigo ? Number(editProduto.preco_antigo) : ""} />
                  <input type="hidden" name="estoque" defaultValue={editProduto?.estoque ?? 0} />
                  <input type="hidden" name="peso" defaultValue={editProduto?.peso ? Number(editProduto.peso) : ""} />
                </>
              )}
              {produtoTab !== "detalhes" && (
                <>
                  <input type="hidden" name="badge" defaultValue={editProduto?.badge ?? ""} />
                  <input type="hidden" name="tags" defaultValue={editProduto?.tags?.join(", ") ?? ""} />
                  {(editProduto?.ativo ?? true) && <input type="hidden" name="ativo" value="on" />}
                  {(editProduto?.destaque ?? false) && <input type="hidden" name="destaque" value="on" />}
                </>
              )}

              <div className="flex gap-3 pt-5 mt-5 border-t border-slate-100">
                <button type="button" onClick={() => { setShowProdutoModal(false); setEditProduto(null); }} className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors">
                  {saving ? "Salvando..." : editProduto ? "Salvar Alterações" : "Criar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== MODAL PEDIDO DETALHES (melhorado) ====== */}
      {showPedidoModal && activePedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowPedidoModal(false); setActivePedido(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header do pedido */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-extrabold text-dark">Pedido #{activePedido.id.slice(0, 8)}</h2>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    activePedido.status === "Entregue" ? "bg-green-50 text-green-700"
                      : activePedido.status === "Pago" ? "bg-blue-50 text-blue-700"
                      : activePedido.status === "Em transito" ? "bg-purple-50 text-purple-700"
                      : activePedido.status === "Pendente" ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-600"
                  }`}>{activePedido.status}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Criado em {new Date(activePedido.created_at).toLocaleString("pt-BR")}
                  {activePedido.updated_at && ` — Atualizado em ${new Date(activePedido.updated_at).toLocaleString("pt-BR")}`}
                </p>
              </div>
              <button onClick={() => { setShowPedidoModal(false); setActivePedido(null); }} className="text-slate-400 hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Grid: cliente + pagamento */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Cliente
                  </div>
                  <div className="font-semibold text-dark">{activePedido.profile?.nome ?? "—"}</div>
                  <div className="text-sm text-slate-500">{activePedido.profile?.email ?? ""}</div>
                  {activePedido.profile?.telefone && <div className="text-sm text-slate-500">{activePedido.profile.telefone}</div>}
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Pagamento
                  </div>
                  <div className="font-semibold text-dark">{activePedido.metodo_pagamento || "Não informado"}</div>
                  <div className="text-sm text-slate-500">ID: #{activePedido.id.slice(0, 12)}</div>
                </div>
              </div>

              {/* Endereço */}
              {activePedido.endereco && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Endereço de Entrega
                  </div>
                  <div className="text-sm text-dark">
                    {activePedido.endereco.rua && <div>{activePedido.endereco.rua}</div>}
                    <div>
                      {activePedido.endereco.cidade && `${activePedido.endereco.cidade}`}
                      {activePedido.endereco.estado && ` - ${activePedido.endereco.estado}`}
                    </div>
                    {activePedido.endereco.cep && <div className="text-slate-500">CEP: {activePedido.endereco.cep}</div>}
                  </div>
                </div>
              )}

              {/* Itens */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Itens do Pedido
                </div>
                {Array.isArray(activePedido.itens) && activePedido.itens.length > 0 ? (
                  <div className="space-y-3">
                    {activePedido.itens.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-bg rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                            {item.qty}x
                          </div>
                          <span className="text-sm text-dark font-medium">{item.nome}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">R$ {(item.preco * item.qty).toFixed(2)}</div>
                          <div className="text-[10px] text-slate-400">R$ {Number(item.preco).toFixed(2)} un.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">Sem itens detalhados</span>
                )}
              </div>

              {/* Totais */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-500">Subtotal</span>
                  <span>R$ {Number(activePedido.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-500">Frete</span>
                  <span>{Number(activePedido.frete) > 0 ? `R$ ${Number(activePedido.frete).toFixed(2)}` : "Grátis"}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-dark border-t border-slate-200 pt-3 mt-2">
                  <span>Total</span>
                  <span>R$ {Number(activePedido.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Status do Pedido</label>
                  <select
                    value={activePedido.status}
                    onChange={(e) => handleUpdateStatus(activePedido.id, e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    {statusOptions.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Código de Rastreio</label>
                  <input
                    defaultValue={activePedido.rastreio ?? ""}
                    placeholder="Ex: BR123456789CD"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    onBlur={(e) => {
                      if (e.target.value !== (activePedido.rastreio ?? "")) {
                        handleUpdateRastreio(activePedido.id, e.target.value);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Notas internas */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Notas Internas</label>
                <textarea
                  rows={2}
                  defaultValue={activePedido.notas ?? ""}
                  placeholder="Observações internas sobre o pedido..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  onBlur={(e) => {
                    if (e.target.value !== (activePedido.notas ?? "")) {
                      handleUpdateNotas(activePedido.id, e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL CATEGORIA ====== */}
      {showCategoriaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowCategoriaModal(false); setEditCategoria(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-dark">{editCategoria ? "Editar Categoria" : "Nova Categoria"}</h2>
              <button onClick={() => { setShowCategoriaModal(false); setEditCategoria(null); }} className="text-slate-400 hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveCategoria} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Nome *</label>
                <input name="nome" required defaultValue={editCategoria?.nome} placeholder="Ex: Instrumentais" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Descrição</label>
                <textarea name="descricao" rows={2} defaultValue={editCategoria?.descricao ?? ""} placeholder="Descrição da categoria..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Ícone</label>
                <div className="flex flex-wrap gap-2">
                  {iconeOptions.map((icon) => (
                    <label key={icon} className="cursor-pointer">
                      <input type="radio" name="icone" value={icon} defaultChecked={editCategoria ? editCategoria.icone === icon : icon === "📦"} className="hidden peer" />
                      <div className="w-10 h-10 rounded-lg border-2 border-slate-200 flex items-center justify-center text-lg hover:border-primary peer-checked:border-primary peer-checked:bg-primary-bg transition-colors">
                        {icon}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {corOptions.map((cor) => (
                    <label key={cor} className="cursor-pointer">
                      <input type="radio" name="cor" value={cor} defaultChecked={editCategoria ? editCategoria.cor === cor : cor === "#1D4ED8"} className="hidden peer" />
                      <div className="w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-dark peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-current transition-all" style={{ backgroundColor: cor }} />
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Ordem</label>
                  <input name="ordem" type="number" defaultValue={editCategoria?.ordem ?? categorias.length + 1} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-2">
                    <input name="ativo" type="checkbox" defaultChecked={editCategoria?.ativo ?? true} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                    <label className="text-sm text-dark">Ativa</label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowCategoriaModal(false); setEditCategoria(null); }} className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors">
                  {saving ? "Salvando..." : editCategoria ? "Salvar" : "Criar Categoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, icon, alert }: { label: string; value: string | number; sub: string; icon: string; alert?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-xl font-extrabold text-dark">{value}</div>
      <div className={`text-xs mt-0.5 ${alert ? "text-red-500 font-semibold" : "text-slate-400"}`}>{sub}</div>
    </div>
  );
}
