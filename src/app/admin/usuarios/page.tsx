"use client";

import { useState } from "react";

const users = [
  { id: 1, nome: "Dra. Ana Costa", email: "ana.costa@email.com", tipo: "Profissional", especialidade: "Dermatologia", reservas: 23, desde: "Jan 2026", status: "Ativo" },
  { id: 2, nome: "Dr. Pedro Alves", email: "pedro.alves@email.com", tipo: "Profissional", especialidade: "Cirurgia Geral", reservas: 45, desde: "Nov 2025", status: "Ativo" },
  { id: 3, nome: "Dra. Maria Lima", email: "maria.lima@email.com", tipo: "Profissional", especialidade: "Psicologia", reservas: 67, desde: "Set 2025", status: "Ativo" },
  { id: 4, nome: "Dr. Lucas Neto", email: "lucas.neto@email.com", tipo: "Profissional", especialidade: "Ortopedia", reservas: 12, desde: "Mar 2026", status: "Inativo" },
  { id: 5, nome: "Clinica Vida Plena", email: "contato@vidaplena.com", tipo: "Clinica", especialidade: "Multi-especialidade", reservas: 0, desde: "Jun 2026", status: "Pendente" },
  { id: 6, nome: "Dra. Julia Ramos", email: "julia.ramos@email.com", tipo: "Profissional", especialidade: "Nutricionista", reservas: 31, desde: "Dez 2025", status: "Ativo" },
];

export default function AdminUsuarios() {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) => u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} usuarios cadastrados</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
          + Convidar
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full max-w-md px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Especialidade</th>
                <th className="px-6 py-3">Reservas</th>
                <th className="px-6 py-3">Desde</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-bg text-primary flex items-center justify-center font-bold text-sm">
                        {u.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-dark">{u.nome}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.tipo === "Clinica" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {u.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">{u.especialidade}</td>
                  <td className="px-6 py-4 font-semibold">{u.reservas}</td>
                  <td className="px-6 py-4">{u.desde}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.status === "Ativo" ? "bg-green-50 text-green-700"
                        : u.status === "Pendente" ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-primary-dark text-xs font-semibold">Ver perfil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
