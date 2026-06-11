"use client";

import { useState } from "react";

export function Calculator() {
  const [hours, setHours] = useState(20);
  const avgRent = 3500;
  const hourRate = 45;
  const cost = hours * hourRate * 4;

  return (
    <section id="economize" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent-dark text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Calculadora
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight mb-4">
              Quanto voce economiza?
            </h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Compare o custo de um consultorio fixo com o ClinicHub. Ajuste as
              horas que voce atende por semana e veja a diferenca.
            </p>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-dark mb-3">
                Horas de atendimento por semana: <span className="text-primary">{hours}h</span>
              </label>
              <input
                type="range"
                min={4}
                max={40}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>4h</span>
                <span>40h</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 lg:p-10">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Consultorio Fixo
                </p>
                <p className="text-3xl font-black text-dark">
                  R$ {avgRent.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-slate-500 mt-1">/mes (media)</p>
                <div className="mt-3 text-xs text-slate-400">
                  + contas + equipamentos + funcionarios
                </div>
              </div>
              <div className="bg-primary-bg rounded-xl p-6 border border-primary/20">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  ClinicHub
                </p>
                <p className="text-3xl font-black text-primary">
                  R$ {cost.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-slate-500 mt-1">/mes ({hours}h/sem)</p>
                <div className="mt-3 text-xs text-accent font-semibold">
                  Tudo incluso, sem surpresas
                </div>
              </div>
            </div>

            {cost < avgRent && (
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 text-center">
                <p className="text-sm text-accent-dark font-semibold">
                  Voce economiza ate{" "}
                  <span className="text-2xl font-black">
                    R$ {(avgRent - cost).toLocaleString("pt-BR")}
                  </span>{" "}
                  por mes!
                </p>
              </div>
            )}
            {cost >= avgRent && (
              <div className="bg-secondary-bg border border-secondary/20 rounded-xl p-5 text-center">
                <p className="text-sm text-secondary-dark font-semibold">
                  Para {hours}h/sem, considere o plano Integral de R$ 1.890/mes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
