"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            Seu espaco profissional. Reserve salas equipadas e comece a atender
            hoje mesmo.
          </p>
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
            Bem-vindo de volta
          </h1>
          <p className="text-slate-500 mb-8">
            Entre na sua conta para acessar suas reservas.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-dark">Senha</label>
                <a
                  href="#"
                  className="text-xs text-primary hover:text-primary-dark font-medium"
                >
                  Esqueci a senha
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors text-sm"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Nao tem conta?{" "}
            <Link
              href="/cadastro"
              className="text-primary font-semibold hover:text-primary-dark"
            >
              Cadastre-se gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
