"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";

interface Produto {
  id: string;
  slug: string;
  nome: string;
  categoria: string;
  descricao: string | null;
  preco: number;
  preco_antigo: number | null;
  estoque: number;
  foto_url: string | null;
  specs: { k: string; v: string }[] | null;
}

export default function ProductPage() {
  const { id } = useParams();
  const { addItem, totalItems } = useCart();
  const [product, setProduct] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .eq("slug", id as string)
          .single();

        if (!error && data) {
          setProduct(data);
        }
      } catch { /* fallback below */ }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleAddToCart() {
    if (!product || product.estoque === 0) return;
    addItem({
      id: product.id,
      slug: product.slug,
      nome: product.nome,
      preco: Number(product.preco),
      foto_url: product.foto_url,
    }, qty);
    setAdded(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link href="/loja" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Voltar para a loja
            </Link>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-extrabold text-dark mb-2">Produto não encontrado</h1>
          <p className="text-slate-500 mb-6">O produto que você procura não existe ou foi removido.</p>
          <Link href="/loja" className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
            Ver todos os produtos
          </Link>
        </div>
      </div>
    );
  }

  const imgUrl = product.foto_url || "https://placehold.co/600x600/e2e8f0/94a3b8?text=Produto";
  const specs = Array.isArray(product.specs) && product.specs.length > 0
    ? product.specs
    : [
        { k: "Categoria", v: product.categoria },
        { k: "Estoque", v: `${product.estoque} unidades` },
      ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/loja" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Voltar para a loja
          </Link>
          <Link href="/carrinho" className="relative p-2 text-slate-600 hover:text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden aspect-square">
              <img src={imgUrl} alt={product.nome} className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-primary bg-primary-bg px-3 py-1 rounded-full">{product.categoria}</span>
            <h1 className="text-3xl font-extrabold text-dark mt-3 mb-2">{product.nome}</h1>
            {product.descricao && (
              <p className="text-slate-500 leading-relaxed mb-6">{product.descricao}</p>
            )}

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-extrabold text-primary">R$ {Number(product.preco).toFixed(2)}</span>
              {product.preco_antigo && (
                <span className="text-lg text-slate-400 line-through">R$ {Number(product.preco_antigo).toFixed(2)}</span>
              )}
            </div>

            <p className="text-sm text-slate-400 mb-6">
              {product.estoque > 0 ? (
                <span className="text-green-600 font-medium">Em estoque ({product.estoque} disponíveis)</span>
              ) : (
                <span className="text-red-500 font-medium">Fora de estoque</span>
              )}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-slate-200 rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-slate-500 hover:text-dark">-</button>
                <span className="px-3 py-2 font-bold text-dark min-w-[2rem] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.estoque, qty + 1))} className="px-3 py-2 text-slate-500 hover:text-dark">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.estoque === 0}
                className={`flex-1 py-3 font-bold rounded-lg transition-colors text-sm ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-primary hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white"
                }`}
              >
                {added ? "Adicionado ao Carrinho!" : "Adicionar ao Carrinho"}
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-dark mb-3">Especificações</h3>
              <div className="space-y-2">
                {specs.map((s) => (
                  <div key={s.k} className="flex justify-between text-sm">
                    <span className="text-slate-500">{s.k}</span>
                    <span className="font-medium text-dark">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Retirada no Instituto Macieski
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Garantia de 12 meses
              </div>
            </div>
          </div>
        </div>
      </div>

      {added && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAdded(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-dark mb-1">Produto adicionado!</h3>
            <p className="text-sm text-slate-500 mb-6">{product.nome} foi adicionado ao seu carrinho.</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/carrinho"
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors text-sm text-center"
              >
                Ver Carrinho
              </Link>
              <button
                onClick={() => setAdded(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-dark font-bold rounded-lg transition-colors text-sm"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
