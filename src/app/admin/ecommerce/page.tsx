import { createClient } from "@/lib/supabase/server";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  categoria: string;
  preco: number;
  preco_antigo: number | null;
  estoque: number;
  foto_url: string | null;
  ativo: boolean;
}

interface Pedido {
  id: string;
  total: number;
  status: string;
  created_at: string;
  profile: { nome: string; email: string } | null;
}

const mockProdutos: Produto[] = [
  { id: "1", nome: "Jaleco Premium Branco", slug: "jaleco", categoria: "Vestuario", preco: 189.9, preco_antigo: null, estoque: 45, foto_url: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=80&h=80&fit=crop", ativo: true },
  { id: "2", nome: "Estetoscopio Littmann", slug: "esteto", categoria: "Equipamentos", preco: 849.9, preco_antigo: null, estoque: 12, foto_url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=80&h=80&fit=crop", ativo: true },
  { id: "3", nome: "Luvas Nitrilo (cx 100)", slug: "luvas", categoria: "Descartaveis", preco: 54.9, preco_antigo: null, estoque: 180, foto_url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=80&h=80&fit=crop", ativo: true },
];

async function getEcommerceData() {
  try {
    const supabase = await createClient();

    const [produtosRes, pedidosRes] = await Promise.all([
      supabase.from("produtos").select("*").order("created_at", { ascending: false }),
      supabase.from("pedidos").select("*, profile:profiles(nome, email)").order("created_at", { ascending: false }).limit(10),
    ]);

    const produtos = (produtosRes.data && produtosRes.data.length > 0 ? produtosRes.data : mockProdutos) as Produto[];
    const pedidos = (pedidosRes.data ?? []) as Pedido[];

    return {
      produtos,
      pedidos,
      real: !!(produtosRes.data && produtosRes.data.length > 0),
    };
  } catch {
    return { produtos: mockProdutos, pedidos: [] as Pedido[], real: false };
  }
}

export default async function AdminEcommerce() {
  const { produtos, pedidos, real } = await getEcommerceData();

  const totalEstoque = produtos.reduce((s, p) => s + p.estoque, 0);
  const baixoEstoque = produtos.filter((p) => p.estoque < 10).length;
  const receitaPedidos = pedidos.reduce((s, p) => s + Number(p.total), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">E-commerce</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie produtos e pedidos
            {!real && <span className="text-amber-500 ml-2">(dados de demonstracao)</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Produtos</span>
          <div className="text-2xl font-extrabold text-dark mt-1">{produtos.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Estoque Total</span>
          <div className="text-2xl font-extrabold text-dark mt-1">{totalEstoque}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Estoque Baixo</span>
          <div className={`text-2xl font-extrabold mt-1 ${baixoEstoque > 0 ? "text-red-600" : "text-green-600"}`}>
            {baixoEstoque}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Receita Pedidos</span>
          <div className="text-2xl font-extrabold text-dark mt-1">
            R$ {receitaPedidos.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-dark">Produtos ({produtos.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
                  <th className="px-6 py-3">Produto</th>
                  <th className="px-6 py-3">Categoria</th>
                  <th className="px-6 py-3">Preco</th>
                  <th className="px-6 py-3">Estoque</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produtos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.foto_url ? (
                          <img src={p.foto_url} alt={p.nome} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400">?</div>
                        )}
                        <span className="font-medium text-dark">{p.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{p.categoria}</td>
                    <td className="px-6 py-4 font-semibold">R$ {Number(p.preco).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={p.estoque < 10 ? "text-red-600 font-semibold" : ""}>
                        {p.estoque}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-dark">Pedidos Recentes</h2>
          </div>
          {pedidos.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">
              Nenhum pedido ainda
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pedidos.map((p) => (
                <div key={p.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-dark text-sm">{p.profile?.nome ?? "—"}</span>
                    <span className="font-semibold text-sm">R$ {Number(p.total).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {new Date(p.created_at).toLocaleDateString("pt-BR")}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.status === "Entregue" ? "bg-green-50 text-green-700"
                        : p.status === "Pago" || p.status === "Em transito" ? "bg-blue-50 text-blue-700"
                        : p.status === "Pendente" ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
