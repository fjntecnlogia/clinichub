"use client";

import { useState } from "react";

const kits = [
  {
    name: "Kit Basico",
    desc: "Luvas, mascaras, campos e materiais essenciais.",
    price: "89,90",
    img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=200&h=200&fit=crop",
  },
  {
    name: "Kit Avancado",
    desc: "Anestesicos, resinas, agulhas e mais.",
    price: "79,90",
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&h=200&fit=crop",
  },
  {
    name: "Materiais Odontologicos",
    desc: "Instrumentais, tenho tudo e descartaveis.",
    price: "65,00",
    img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&h=200&fit=crop",
  },
];

export function Calculator() {
  const [days, setDays] = useState(5);
  const hourRate = 75;
  const hoursPerDay = 3;
  const weeklySavings = days * hoursPerDay * (90 - hourRate);
  const monthlySavings = weeklySavings * 4;

  return (
    <section id="economize" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Calculadora */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-2xl font-black text-dark mb-2">
              Quanto voce economiza com o MaciHub?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Faca as contas e veja a diferenca no seu bolso.
            </p>

            <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
              <label className="block text-sm font-semibold text-dark mb-3">
                Dias de atendimento por semana:
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-slate-200 flex items-center justify-center text-xl font-bold text-slate-400 hover:border-primary hover:text-primary transition-colors"
                >
                  &minus;
                </button>
                <span className="text-3xl font-black text-dark w-12 text-center">{days}</span>
                <button
                  onClick={() => setDays(Math.min(7, days + 1))}
                  className="w-10 h-10 rounded-lg border-2 border-slate-200 flex items-center justify-center text-xl font-bold text-slate-400 hover:border-primary hover:text-primary transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-slate-400 font-medium mb-1">Economia mensal estimada:</p>
              <p className="text-4xl font-black text-secondary">
                R$ {monthlySavings.toLocaleString("pt-BR")},00
              </p>
            </div>

            <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors text-sm">
              Simular Economia Completa
            </button>

            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Baseado em comparacao media com custos fixos de uma clinica propria.
            </p>
          </div>

          {/* Kits / Produtos */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-2xl font-black text-dark mb-2">
              Otimize seu atendimento
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Adicione itens e tenha tudo o que precisa.
            </p>

            <div className="space-y-4">
              {kits.map((kit) => (
                <div key={kit.name} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <img src={kit.img} alt={kit.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-dark text-sm">{kit.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">{kit.desc}</p>
                    <p className="font-black text-dark">R$ {kit.price}</p>
                  </div>
                  <button className="px-4 py-2 border-2 border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors whitespace-nowrap">
                    + Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
