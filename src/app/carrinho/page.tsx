"use client";

import { useState } from "react";
import Link from "next/link";

const initialItems = [
  { id: 1, nome: "Jaleco Premium Branco", tam: "M", preco: 189.9, qty: 1, img: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=100&h=100&fit=crop" },
  { id: 2, nome: "Kit Curativos Estereis (50 un)", preco: 45.9, qty: 2, img: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=100&h=100&fit=crop" },
  { id: 3, nome: "Luvas Nitrilo (cx 100)", preco: 54.9, qty: 1, img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=100&h=100&fit=crop" },
];

export default function CarrinhoPage() {
  const [items, setItems] = useState(initialItems);

  const updateQty = (id: number, d: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.preco * i.qty, 0);
  const frete = subtotal >= 299 ? 0 : 29.9;
  const total = subtotal + frete;

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
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-extrabold text-sm">CH</div>
            <span className="font-extrabold text-dark">Clinic<span className="text-primary">Hub</span></span>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold text-dark mb-6">Carrinho ({items.length} {items.length === 1 ? "item" : "itens"})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4">
                <img src={item.img} alt={item.nome} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-dark text-sm">{item.nome}</h3>
                  {item.tam && <span className="text-xs text-slate-400">Tamanho: {item.tam}</span>}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button onClick={() => updateQty(item.id, -1)} className="px-2.5 py-1.5 text-slate-500 hover:text-dark text-sm">-</button>
                      <span className="px-2.5 py-1.5 font-bold text-dark text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="px-2.5 py-1.5 text-slate-500 hover:text-dark text-sm">+</button>
                    </div>
                    <span className="font-extrabold text-primary">R$ {(item.preco * item.qty).toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => remove(item.id)} className="text-slate-400 hover:text-red-500 transition-colors self-start">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {items.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-400 mb-4">Seu carrinho esta vazio</p>
                <Link href="/loja" className="text-primary font-semibold hover:text-primary-dark">Ver produtos</Link>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h3 className="font-bold text-dark mb-4">Resumo</h3>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Frete</span>
                  <span className={`font-medium ${frete === 0 ? "text-accent" : ""}`}>
                    {frete === 0 ? "Gratis" : `R$ ${frete.toFixed(2)}`}
                  </span>
                </div>
                {frete > 0 && (
                  <p className="text-xs text-slate-400">Frete gratis acima de R$ 299,00</p>
                )}
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between mb-6">
                <span className="font-bold text-dark">Total</span>
                <span className="text-xl font-extrabold text-primary">R$ {total.toFixed(2)}</span>
              </div>
              <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors text-sm">
                Finalizar Compra
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-3">Pagamento seguro via Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
