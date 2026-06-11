"use client";

import { useState } from "react";

export default function PerfilPage() {
  const [form, setForm] = useState({
    nome: "Dra. Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 98765-4321",
    especialidade: "Dermatologia",
    crm: "CRM/SP 123456",
    bio: "Especialista em dermatologia clinica e estetica, com 12 anos de experiencia.",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-dark">Meu Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">Gerencie suas informacoes pessoais</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-bold text-dark mb-5">Informacoes Pessoais</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Nome completo</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => set("nome", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Telefone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Especialidade</label>
                <input
                  type="text"
                  value={form.especialidade}
                  onChange={(e) => set("especialidade", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">CRM</label>
                <input
                  type="text"
                  value={form.crm}
                  onChange={(e) => set("crm", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-dark mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              />
            </div>
            <button className="mt-5 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
              Salvar Alteracoes
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-bold text-dark mb-4">Seguranca</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-dark">Senha</div>
                <div className="text-xs text-slate-400">Ultima alteracao ha 3 meses</div>
              </div>
              <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                Alterar Senha
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary-bg text-primary flex items-center justify-center font-black text-3xl mx-auto mb-4">
              AC
            </div>
            <h3 className="font-bold text-dark">{form.nome}</h3>
            <p className="text-sm text-slate-400">{form.especialidade}</p>
            <p className="text-xs text-slate-400 mt-1">{form.crm}</p>
            <button className="mt-4 w-full py-2 bg-primary-bg text-primary text-xs font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
              Alterar Foto
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4">
            <h3 className="font-bold text-dark text-sm mb-3">Estatisticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Membro desde</span>
                <span className="font-medium text-dark">Jan 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total reservas</span>
                <span className="font-medium text-dark">23</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total compras</span>
                <span className="font-medium text-dark">R$ 1.186,50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Economia total</span>
                <span className="font-medium text-accent">R$ 1.240,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
