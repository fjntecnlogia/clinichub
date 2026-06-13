"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
              MH
            </div>
            <span className="text-lg font-extrabold tracking-tight text-dark">
              Maci<span className="text-primary">Hub</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {["Como Funciona", "Pacotes", "Economize", "Depoimentos"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                >
                  {item}
                </a>
              )
            )}
            <Link href="/loja" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
              Loja
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/painel"
                className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Meu Painel
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                Entrar
              </Link>
            )}
            <Link
              href={user ? "/painel/reservas" : "/cadastro"}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Reservar Agora
            </Link>
            <button
              className="lg:hidden p-2 text-slate-500"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 space-y-3">
            {["Como Funciona", "Pacotes", "Economize", "Depoimentos"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              )
            )}
            <Link href="/loja" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary" onClick={() => setMenuOpen(false)}>
              Loja
            </Link>
            {user ? (
              <Link href="/painel" className="block px-3 py-2 text-sm font-semibold text-primary" onClick={() => setMenuOpen(false)}>
                Meu Painel
              </Link>
            ) : (
              <Link href="/login" className="block px-3 py-2 text-sm font-semibold text-primary" onClick={() => setMenuOpen(false)}>
                Entrar
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
