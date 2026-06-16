"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CarrinhoPage() {
  const { items, updateQty, removeItem, subtotal, totalItems } = useCart();
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<{ nome: string; preco: number; prazo: number } | null>(null);
  const [freteLoading, setFreteLoading] = useState(false);
  const [freteError, setFreteError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function calcularFrete() {
    const cepClean = cep.replace(/\D/g, "");
    if (cepClean.length !== 8) {
      setFreteError("CEP inválido");
      return;
    }
    setFreteLoading(true);
    setFreteError("");
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cep: cepClean,
          items: items.map((i) => ({ qty: i.qty, preco: i.preco })),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setFreteError(data.error);
      } else {
        setFrete(data);
      }
    } catch {
      setFreteError("Erro ao calcular frete");
    }
    setFreteLoading(false);
  }

  async function handleCheckout() {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            nome: i.nome,
            preco: i.preco,
            qty: i.qty,
            foto_url: i.foto_url,
          })),
          frete: frete?.preco ?? 0,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        alert("Você precisa estar logado para finalizar a compra.");
        window.location.href = "/login?redirect=/carrinho";
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erro ao iniciar pagamento");
      }
    } catch {
      alert("Erro ao conectar com o servidor");
    }
    setCheckoutLoading(false);
  }

  const freteValor = frete?.preco ?? (subtotal >= 299 ? 0 : null);
  const total = subtotal + (freteValor ?? 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/loja" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Continuar comprando
          </Link>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-extrabold text-sm">MH</div>
            <span className="font-extrabold text-dark">Maci<span className="text-primary">Hub</span></span>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold text-dark mb-6">
          Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4">
                <img
                  src={item.foto_url || "https://placehold.co/100x100/e2e8f0/94a3b8?text=..."}
                  alt={item.nome}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link href={`/loja/${item.slug}`} className="font-bold text-dark text-sm hover:text-primary transition-colors">
                    {item.nome}
                  </Link>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 py-1.5 text-slate-500 hover:text-dark text-sm">-</button>
                      <span className="px-2.5 py-1.5 font-bold text-dark text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 py-1.5 text-slate-500 hover:text-dark text-sm">+</button>
                    </div>
                    <span className="font-extrabold text-primary">R$ {(item.preco * item.qty).toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors self-start">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {items.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-400 mb-4">Seu carrinho está vazio</p>
                <Link href="/loja" className="text-primary font-semibold hover:text-primary-dark">Ver produtos</Link>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Calcular frete */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-dark mb-3 text-sm">Calcular frete</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5, 8);
                    setCep(v);
                  }}
                  maxLength={9}
                  placeholder="00000-000"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  onClick={calcularFrete}
                  disabled={freteLoading || items.length === 0}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-dark font-semibold rounded-lg text-sm transition-colors"
                >
                  {freteLoading ? "..." : "Calcular"}
                </button>
              </div>
              {freteError && <p className="text-red-500 text-xs mt-2">{freteError}</p>}
              {frete && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 font-medium">{frete.nome}</span>
                    <span className="font-bold text-green-700">
                      {frete.preco === 0 ? "Grátis" : `R$ ${frete.preco.toFixed(2)}`}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Entrega em até {frete.prazo} dias úteis</p>
                </div>
              )}
            </div>

            {/* Resumo */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h3 className="font-bold text-dark mb-4">Resumo</h3>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Frete</span>
                  <span className={`font-medium ${freteValor === 0 ? "text-green-600" : ""}`}>
                    {freteValor === null
                      ? "Calcular acima"
                      : freteValor === 0
                        ? "Grátis"
                        : `R$ ${freteValor.toFixed(2)}`}
                  </span>
                </div>
                {subtotal > 0 && subtotal < 299 && !frete && (
                  <p className="text-xs text-slate-400">Frete grátis acima de R$ 299,00</p>
                )}
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between mb-6">
                <span className="font-bold text-dark">Total</span>
                <span className="text-xl font-extrabold text-primary">R$ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || checkoutLoading}
                className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm"
              >
                {checkoutLoading ? "Processando..." : "Finalizar Compra"}
              </button>
              <div className="flex items-center justify-center gap-2 mt-3">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-[10px] text-slate-400">Pagamento seguro via Stripe (Pix ou Cartão)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
