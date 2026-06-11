"use client";

import { useState } from "react";
import Link from "next/link";

export default function CadastroPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", type: "profissional" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark via-dark-2 to-primary-dark items-center justify-center p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-8">
            CH
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Clinic<span className="text-primary-light">Hub</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md">
            Junte-se a centenas de profissionais que ja transformaram sua
            carreira.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { n: "500+", l: "Profissionais" },
              { n: "50+", l: "Clinicas" },
              { n: "10k+", l: "Reservas" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-black text-primary-light">{s.n}</div>
                <div className="text-xs text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
              CH
            </div>
            <span className="text-lg font-extrabold text-dark">
              Clinic<span className="text-primary">Hub</span>
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-dark mb-2">
            Crie sua conta
          </h1>
          <p className="text-slate-500 mb-8">
            Comece a reservar salas em minutos.
          </p>

          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-6">
            {[
              { v: "profissional", l: "Profissional" },
              { v: "clinica", l: "Sou Clinica" },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => set("type", t.v)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                  form.type === t.v
                    ? "bg-white text-dark shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Dr. Joao Silva"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">
                Telefone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(11) 99999-0000"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Minimo 8 caracteres"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors text-sm"
            >
              Criar Conta
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center">
            Ao criar sua conta, voce concorda com nossos{" "}
            <a href="#" className="text-primary">Termos de Uso</a> e{" "}
            <a href="#" className="text-primary">Politica de Privacidade</a>.
          </p>

          <div className="mt-6 text-center text-sm text-slate-500">
            Ja tem conta?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:text-primary-dark"
            >
              Faca login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
