"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CheckoutSucessoPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-dark mb-2">Pedido Confirmado!</h1>
        <p className="text-slate-500 mb-8">
          Seu pagamento foi processado com sucesso. Você receberá um e-mail com os detalhes do pedido e o código de rastreamento.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/loja"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors text-sm"
          >
            Continuar Comprando
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-dark font-bold rounded-lg transition-colors text-sm"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
