"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

type Toast = { type: "error" | "warning" | "info"; message: string } | null;

export default function CarrinhoPage() {
  const { items, updateQty, removeItem, subtotal, totalItems } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  async function handleCheckout() {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    setToast(null);
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
          frete: 0,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setToast({ type: "warning", message: "Voce precisa estar logado para finalizar a compra. Redirecionando..." });
        setTimeout(() => { window.location.href = "/login?redirect=/carrinho"; }, 2000);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setToast({ type: "error", message: data.error || "Erro ao iniciar pagamento" });
      }
    } catch {
      setToast({ type: "error", message: "Erro ao conectar com o servidor. Tente novamente." });
    }
    setCheckoutLoading(false);
  }

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
            {/* Entrega */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-dark mb-3 text-sm">Entrega</h3>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Retirada no Balcão</p>
                  <p className="text-xs text-blue-600">Retire seu pedido no Instituto Macieski</p>
                </div>
                <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Grátis</span>
              </div>
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
                  <span className="text-slate-500">Entrega</span>
                  <span className="font-medium text-green-600">Retirada no Balcão</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between mb-6">
                <span className="font-bold text-dark">Total</span>
                <span className="text-xl font-extrabold text-primary">R$ {subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || checkoutLoading}
                className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm"
              >
                {checkoutLoading ? "Processando..." : "Pagar e Retirar"}
              </button>
              <div className="flex items-center justify-center gap-2 mt-3">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-[10px] text-slate-400">Pagamento seguro via Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setToast(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              toast.type === "error" ? "bg-red-100" : toast.type === "warning" ? "bg-amber-100" : "bg-blue-100"
            }`}>
              {toast.type === "error" ? (
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : toast.type === "warning" ? (
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-dark mb-2">
              {toast.type === "error" ? "Ops!" : toast.type === "warning" ? "Atenção" : "Informação"}
            </h3>
            <p className="text-sm text-slate-500 mb-6">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className={`w-full py-3 font-bold rounded-lg transition-colors text-sm text-white ${
                toast.type === "error" ? "bg-red-500 hover:bg-red-600" : toast.type === "warning" ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary-dark"
              }`}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
