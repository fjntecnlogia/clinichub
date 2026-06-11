import Link from "next/link";

const produtos = [
  { id: "jaleco-premium-branco", nome: "Jaleco Premium Branco", cat: "Jalecos", preco: 189.9, precoAntigo: 229.9, img: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop", badge: "Mais vendido" },
  { id: "estetoscopio-littmann", nome: "Estetoscopio Littmann Classic III", cat: "Equipamentos", preco: 849.9, img: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=400&fit=crop" },
  { id: "kit-curativos", nome: "Kit Curativos Estereis (50 un)", cat: "Materiais", preco: 45.9, img: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop" },
  { id: "luvas-nitrilo", nome: "Luvas Nitrilo Descartaveis (cx 100)", cat: "Materiais", preco: 54.9, img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&h=400&fit=crop", badge: "Oferta" },
  { id: "maca-portatil", nome: "Maca Portatil Premium Dobravel", cat: "Mobiliario", preco: 1290.0, precoAntigo: 1490.0, img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=400&fit=crop" },
  { id: "scrub-cirurgico-azul", nome: "Scrub Cirurgico Azul P/M/G", cat: "Roupas", preco: 129.9, img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop" },
  { id: "otoscopio-digital", nome: "Otoscopio Digital HD com Camera", cat: "Equipamentos", preco: 1450.0, img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop", badge: "Novo" },
  { id: "mascara-n95", nome: "Mascara N95 PFF2 (cx 20)", cat: "Materiais", preco: 39.9, img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=400&fit=crop" },
];

export default function LojaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-extrabold text-sm">CH</div>
            <span className="font-extrabold text-dark">Clinic<span className="text-primary">Hub</span> <span className="text-xs font-medium text-slate-400 ml-1">Loja</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/carrinho" className="relative p-2 text-slate-600 hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
            </Link>
            <Link href="/login" className="text-sm font-semibold text-primary hover:text-primary-dark">Entrar</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-dark">Loja</h1>
          <p className="text-slate-500 mt-1">Equipamentos, materiais e roupas para profissionais de saude</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {["Todos", "Equipamentos", "Materiais", "Jalecos", "Roupas", "Mobiliario"].map((c) => (
            <button
              key={c}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                c === "Todos" ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {produtos.map((p) => (
            <Link key={p.id} href={`/loja/${p.id}`} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
              <div className="relative aspect-square bg-slate-100">
                <img src={p.img} alt={p.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {p.badge && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white ${
                    p.badge === "Oferta" ? "bg-red-500" : p.badge === "Novo" ? "bg-accent" : "bg-secondary"
                  }`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-slate-400 font-medium">{p.cat}</span>
                <h3 className="font-bold text-dark mt-1 leading-snug group-hover:text-primary transition-colors">{p.nome}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-extrabold text-primary">R$ {p.preco.toFixed(2)}</span>
                  {p.precoAntigo && (
                    <span className="text-sm text-slate-400 line-through">R$ {p.precoAntigo.toFixed(2)}</span>
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
