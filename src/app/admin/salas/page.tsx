"use client";

import { useState } from "react";

const salasData = [
  { id: 1, nome: "Consultorio 1A", tipo: "Consultorio", andar: "1", preco: 45, status: "Disponivel", equipamentos: ["Maca", "Ar-condicionado", "Pia"] },
  { id: 2, nome: "Consultorio 1B", tipo: "Consultorio", andar: "1", preco: 45, status: "Ocupada", equipamentos: ["Maca", "Ar-condicionado", "Pia", "Negatoscopio"] },
  { id: 3, nome: "Consultorio 3A", tipo: "Consultorio", andar: "3", preco: 55, status: "Disponivel", equipamentos: ["Maca", "Ar-condicionado", "Pia", "Autoclave"] },
  { id: 4, nome: "Sala Cirurgica 1", tipo: "Cirurgica", andar: "2", preco: 120, status: "Manutencao", equipamentos: ["Mesa cirurgica", "Foco", "Ar-condicionado", "Autoclave", "Monitor"] },
  { id: 5, nome: "Sala de Exames 2", tipo: "Exames", andar: "2", preco: 80, status: "Disponivel", equipamentos: ["Maca", "Ultrassom", "Ar-condicionado"] },
  { id: 6, nome: "Consultorio 5C", tipo: "Consultorio", andar: "5", preco: 60, status: "Disponivel", equipamentos: ["Maca", "Ar-condicionado", "Pia", "Computador"] },
];

export default function AdminSalas() {
  const [filtro, setFiltro] = useState("Todos");

  const filtered = filtro === "Todos" ? salasData : salasData.filter((s) => s.status === filtro);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Salas</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie as salas da clinica</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
          + Nova Sala
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {["Todos", "Disponivel", "Ocupada", "Manutencao"].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              filtro === f ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((sala) => (
          <div key={sala.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-dark">{sala.nome}</h3>
                <p className="text-xs text-slate-400">{sala.tipo} · {sala.andar}o andar</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                sala.status === "Disponivel" ? "bg-green-50 text-green-700"
                  : sala.status === "Ocupada" ? "bg-amber-50 text-amber-700"
                  : "bg-red-50 text-red-600"
              }`}>
                {sala.status}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-primary mb-3">
              R$ {sala.preco}<span className="text-sm font-normal text-slate-400">/hora</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {sala.equipamentos.map((eq) => (
                <span key={eq} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{eq}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 text-xs font-semibold bg-primary-bg text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                Editar
              </button>
              <button className="flex-1 py-2 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                Historico
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
