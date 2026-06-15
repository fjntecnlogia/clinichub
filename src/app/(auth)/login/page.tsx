"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    const redirect = searchParams.get("redirect") || "/painel";
    router.push(redirect);
    router.refresh();
  }

  return (
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

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
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
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-sm"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          className="text-primary font-semibold hover:text-primary-dark"
        >
          Cadastre-se grátis
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
            Seu espaço profissional. Reserve salas equipadas e comece a atender
            hoje mesmo.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Suspense fallback={<div className="text-slate-400">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
