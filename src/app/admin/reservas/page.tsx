"use client";

import { useState } from "react";

const reservasData = [
  { id: "#4521", sala: "Consultorio 3A", prof: "Dra. Ana Costa", email: "ana.costa@email.com", data: "11/06/2026", horario: "08:00–12:00", valor: "R$ 180", status: "Confirmada" },
  { id: "#4520", sala: "Sala Cirurgica 1", prof: "Dr. Pedro Alves", email: "pedro.alves@email.com", data: "11/06/2026", horario: "14:00–18:00", valor: "R$ 480", status: "Pendente" },
  { id: "#4519", sala: "Consultorio 1B", prof: "Dra. Maria Lima", email: "maria.lima@email.com", data: "12/06/2026", horario: "09:00–11:00", valor: "R$ 90", status: "Confirmada" },
  { id: "#4518", sala: "Sala de Exames 2", prof: "Dr. Lucas Neto", email: "lucas.neto@email.com", data: "12/06/2026", horario: "13:00–17:00", valor: "R$ 320", status: "Cancelada" },
  { id: "#4517", sala: "Consultorio 5C", prof: "Dra. Julia Ramos", email: "julia.ramos@email.com", data: "13/06/2026", horario: "08:00–10:00", valor: "R$ 120", status: "Confirmada" },
  { id: "#4516", sala: "Consultorio 1A", prof: "Dr. Carlos Dias", email: "carlos.dias@email.com", data: "13/06/2026", horario: "14:00–16:00", valor: "R$ 90", status: "Pendente" },
  { id: "#4515", sala: "Consultorio 3A", prof: "Dra. Sofia Melo", email: "sofia.melo@email.com", data: "14/06/2026", horario: "10:00–12:00", valor: "R$ 110", status: "Confirmada" },
];

export default function AdminReservas() {
  const [tab, setTab] = useState("Todas");

  const filtered = tab === "Todas" ? reservasData : reservasData.filter((r) => r.status === tab);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Reservas</h1>
          <p className="text-slate-500 text-sm mt-1">{reservasData.length} reservas no total</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
          + Nova Reserva
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {["Todas", "Confirmada", "Pendente", "Cancelada"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === t ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Sala</th>
                <th className="px-6 py-3">Profissional</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Horario</th>
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-dark">{r.id}</td>
                  <td className="px-6 py-4">{r.sala}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-dark">{r.prof}</div>
                    <div className="text-xs text-slate-400">{r.email}</div>
                  </td>
                  <td className="px-6 py-4">{r.data}</td>
                  <td className="px-6 py-4">{r.horario}</td>
                  <td className="px-6 py-4 font-semibold">{r.valor}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      r.status === "Confirmada" ? "bg-green-50 text-green-700"
                        : r.status === "Pendente" ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-primary-dark text-xs font-semibold">Detalhes</button>
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
