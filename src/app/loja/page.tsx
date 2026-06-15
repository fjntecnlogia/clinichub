import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CartBadge } from "@/components/cart-badge";

const mockProdutos = [
  { id: "1", slug: "jaleco-premium-branco", nome: "Jaleco Premium Branco", categoria: "Jalecos", preco: 189.9, preco_antigo: 229.9, foto_url: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop", badge: "Mais vendido" },
  { id: "2", slug: "estetoscopio-littmann", nome: "Estetoscópio Littmann Classic III", categoria: "Equipamentos", preco: 849.9, foto_url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=400&fit=crop", preco_antigo: null, badge: null },
  { id: "3", slug: "kit-curativos", nome: "Kit Curativos Estéreis (50 un)", categoria: "Materiais", preco: 45.9, foto_url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop", preco_antigo: null, badge: null },
  { id: "4", slug: "luvas-nitrilo", nome: "Luvas Nitrilo Descartáveis (cx 100)", categoria: "Materiais", preco: 54.9, foto_url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&h=400&fit=crop", preco_antigo: null, badge: "Oferta" },
  { id: "5", slug: "maca-portatil", nome: "Maca Portátil Premium Dobrável", categoria: "Mobiliário", preco: 1290.0, preco_antigo: 1490.0, foto_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=400&fit=crop", badge: null },
  { id: "6", slug: "scrub-cirurgico-azul", nome: "Scrub Cirúrgico Azul P/M/G", categoria: "Roupas", preco: 129.9, foto_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop", preco_antigo: null, badge: null },
  { id: "7", slug: "otoscopio-digital", nome: "Otoscópio Digital HD com Câmera", categoria: "Equipamentos", preco: 1450.0, foto_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop", preco_antigo: null, badge: "Novo" },
  { id: "8", slug: "mascara-n95", nome: "Máscara N95 PFF2 (cx 20)", categoria: "Materiais", preco: 39.9, foto_url: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=400&fit=crop", preco_antigo: null, badge: null },
];

async function getProdutos() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("ativo", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return mockProdutos;
    return data;
  } catch {
    return mockProdutos;
  }
}

export default async function LojaPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const produtos = await getProdutos();
  const params = await searchParams;
  const categoriaAtiva = params.categoria || "Todos";

  const categorias = ["Todos", ...Array.from(new Set(produtos.map((p: { categoria: string }) => p.categoria)))];
  const produtosFiltrados = categoriaAtiva === "Todos"
    ? produtos
    : produtos.filter((p: { categoria: string }) => p.categoria === categoriaAtiva);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-extrabold text-sm">CH</div>
            <span className="font-extrabold text-dark">Clinic<span className="text-primary">Hub</span> <span className="text-xs font-medium text-slate-400 ml-1">Loja</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <CartBadge />
            <Link href="/login" className="text-sm font-semibold text-primary hover:text-primary-dark">Entrar</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-dark">Loja</h1>
          <p className="text-slate-500 mt-1">Equipamentos, materiais e acessórios para profissionais de saúde</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categorias.map((c) => (
            <Link
              key={c}
              href={c === "Todos" ? "/loja" : `/loja?categoria=${encodeURIComponent(c)}`}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                c === categoriaAtiva ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {produtosFiltrados.map((p) => (
            <Link key={p.id} href={`/loja/${p.slug}`} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
              <div className="relative aspect-square bg-slate-100">
                <img src={p.foto_url || "https://placehold.co/400x400/e2e8f0/94a3b8?text=Produto"} alt={p.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {p.badge && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white ${
                    p.badge === "Oferta" ? "bg-red-500" : p.badge === "Novo" ? "bg-accent" : "bg-secondary"
                  }`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-slate-400 font-medium">{p.categoria}</span>
                <h3 className="font-bold text-dark mt-1 leading-snug group-hover:text-primary transition-colors">{p.nome}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-extrabold text-primary">R$ {Number(p.preco).toFixed(2)}</span>
                  {p.preco_antigo && (
                    <span className="text-sm text-slate-400 line-through">R$ {Number(p.preco_antigo).toFixed(2)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
