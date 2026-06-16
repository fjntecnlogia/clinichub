"use client";

import { useState } from "react";

export function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary text-white relative overflow-hidden">
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white transition-colors"
        aria-label="Fechar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="py-2.5 overflow-hidden">
        <div className="animate-banner-scroll flex items-center gap-12 whitespace-nowrap w-max">
          {[1, 2].map((copy) => (
            <div key={copy} className="flex items-center gap-12">
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className="text-lg">🎉</span>
                INAUGURAÇÃO MaciHub — 20% OFF na primeira reserva!
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className="text-lg">🦷</span>
                Cadeiras equipadas prontas para você atender
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className="text-lg">📦</span>
                Loja com materiais odontológicos — retire no instituto
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className="text-lg">⚡</span>
                Plano Turno a partir de R$299/turno — reserve agora!
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
