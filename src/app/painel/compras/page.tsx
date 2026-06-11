const pedidos = [
  {
    id: "#P-1023",
    data: "10/06/2026",
    itens: ["Jaleco Premium Branco (M)", "Kit Curativos Estereis x2"],
    total: "R$ 281,70",
    status: "Em transito",
    rastreio: "BR1234567890",
  },
  {
    id: "#P-1019",
    data: "02/06/2026",
    itens: ["Luvas Nitrilo (cx 100)"],
    total: "R$ 54,90",
    status: "Entregue",
  },
  {
    id: "#P-1014",
    data: "25/05/2026",
    itens: ["Estetoscopio Littmann Classic III"],
    total: "R$ 849,90",
    status: "Entregue",
  },
];

export default function MinhasCompras() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-dark">Minhas Compras</h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhe seus pedidos da loja</p>
      </div>

      <div className="space-y-4">
        {pedidos.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs text-slate-400">Pedido {p.id}</span>
                <div className="text-xs text-slate-400">{p.data}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                p.status === "Entregue" ? "bg-green-50 text-green-700"
                  : p.status === "Em transito" ? "bg-blue-50 text-blue-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {p.status}
              </span>
            </div>

            <div className="space-y-1 mb-4">
              {p.itens.map((item) => (
                <div key={item} className="text-sm text-dark">{item}</div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-lg font-extrabold text-primary">{p.total}</span>
              <div className="flex gap-2">
                {p.rastreio && (
                  <button className="px-3 py-1.5 bg-primary-bg text-primary text-xs font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Rastrear
                  </button>
                )}
                <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                  Detalhes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
