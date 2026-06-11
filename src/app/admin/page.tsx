export default function AdminDashboard() {
  const kpis = [
    { label: "Receita Mensal", value: "R$ 48.250", change: "+12%", up: true, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Reservas Ativas", value: "127", change: "+8%", up: true, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Taxa de Ocupacao", value: "84%", change: "+3%", up: true, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { label: "Novos Usuarios", value: "34", change: "-2%", up: false, icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
  ];

  const reservas = [
    { id: "#4521", sala: "Consultorio 3A", prof: "Dra. Ana Costa", data: "11/06/2026", horario: "08:00–12:00", status: "Confirmada" },
    { id: "#4520", sala: "Sala Cirurgica 1", prof: "Dr. Pedro Alves", data: "11/06/2026", horario: "14:00–18:00", status: "Pendente" },
    { id: "#4519", sala: "Consultorio 1B", prof: "Dra. Maria Lima", data: "12/06/2026", horario: "09:00–11:00", status: "Confirmada" },
    { id: "#4518", sala: "Sala de Exames 2", prof: "Dr. Lucas Neto", data: "12/06/2026", horario: "13:00–17:00", status: "Cancelada" },
    { id: "#4517", sala: "Consultorio 5C", prof: "Dra. Julia Ramos", data: "13/06/2026", horario: "08:00–10:00", status: "Confirmada" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-dark">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Visao geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">{k.label}</span>
              <div className="w-9 h-9 rounded-lg bg-primary-bg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={k.icon} />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-dark">{k.value}</div>
            <span className={`text-xs font-semibold ${k.up ? "text-accent" : "text-red-500"}`}>
              {k.change} vs. mes anterior
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-dark">Reservas Recentes</h2>
          <a href="/admin/reservas" className="text-sm text-primary font-semibold hover:text-primary-dark">
            Ver todas
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Sala</th>
                <th className="px-6 py-3">Profissional</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Horario</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservas.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-semibold text-dark">{r.id}</td>
                  <td className="px-6 py-3">{r.sala}</td>
                  <td className="px-6 py-3">{r.prof}</td>
                  <td className="px-6 py-3">{r.data}</td>
                  <td className="px-6 py-3">{r.horario}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      r.status === "Confirmada" ? "bg-green-50 text-green-700"
                        : r.status === "Pendente" ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {r.status}
                    </span>
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
