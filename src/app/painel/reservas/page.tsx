"use client";

import { useState } from "react";

const reservas = [
  { id: "#4521", sala: "Consultorio 3A", data: "11/06/2026", horario: "08:00–12:00", valor: "R$ 180,00", status: "Confirmada" },
  { id: "#4515", sala: "Consultorio 1B", data: "14/06/2026", horario: "14:00–17:00", valor: "R$ 135,00", status: "Pendente" },
  { id: "#4510", sala: "Consultorio 3A", data: "07/06/2026", horario: "08:00–12:00", valor: "R$ 180,00", status: "Concluida" },
  { id: "#4502", sala: "Sala de Exames 2", data: "04/06/2026", horario: "10:00–12:00", valor: "R$ 160,00", status: "Concluida" },
  { id: "#4498", sala: "Consultorio 5C", data: "01/06/2026", horario: "09:00–11:00", valor: "R$ 120,00", status: "Cancelada" },
  { id: "#4490", sala: "Consultorio 3A", data: "28/05/2026", horario: "14:00–18:00", valor: "R$ 220,00", status: "Concluida" },
];

export default function MinhasReservas() {
  const [tab, setTab] = useState("Todas");

  const filtered = tab === "Todas" ? reservas : reservas.filter((r) => r.status === tab);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Minhas Reservas</h1>
          <p className="text-slate-500 text-sm mt-1">Historico de todas as suas reservas</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
          + Nova Reserva
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {["Todas", "Confirmada", "Pendente", "Concluida", "Cancelada"].map((t) => (
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

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-bg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-dark text-sm">{r.sala}</div>
                <div className="text-xs text-slate-400">{r.data} · {r.horario}</div>
                <div className="text-xs text-slate-400 mt-0.5">Reserva {r.id}</div>
              </div>
            </div>
            <div className="text-right flex items-center gap-4">
              <span className="font-extrabold text-dark text-sm">{r.valor}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                r.status === "Confirmada" ? "bg-green-50 text-green-700"
                  : r.status === "Pendente" ? "bg-amber-50 text-amber-700"
                  : r.status === "Concluida" ? "bg-blue-50 text-blue-700"
                  : "bg-red-50 text-red-600"
              }`}>
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
