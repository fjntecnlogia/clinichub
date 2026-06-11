"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const allProducts: Record<string, { nome: string; cat: string; preco: number; precoAntigo?: number; desc: string; imgs: string[]; specs: { k: string; v: string }[] }> = {
  "jaleco-premium-branco": {
    nome: "Jaleco Premium Branco",
    cat: "Jalecos",
    preco: 189.9,
    precoAntigo: 229.9,
    desc: "Jaleco profissional confeccionado em tecido Oxford Premium com tratamento antimicrobiano. Modelagem ergonomica, botoes resistentes e bolsos funcionais. Ideal para consultorios e clinicas.",
    imgs: [
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=600&fit=crop",
    ],
    specs: [
      { k: "Material", v: "Oxford Premium" },
      { k: "Tratamento", v: "Antimicrobiano" },
      { k: "Tamanhos", v: "PP ao GG" },
      { k: "Cor", v: "Branco" },
    ],
  },
};

const fallback = {
  nome: "Produto",
  cat: "Geral",
  preco: 99.9,
  desc: "Descricao detalhada do produto. Material de alta qualidade, ideal para profissionais de saude que buscam excelencia.",
  imgs: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=600&fit=crop"],
  specs: [
    { k: "Material", v: "Premium" },
    { k: "Garantia", v: "12 meses" },
  ],
};

export default function ProductPage() {
  const { id } = useParams();
  const product = allProducts[id as string] || fallback;
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/loja" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Voltar para a loja
          </Link>
          <Link href="/carrinho" className="relative p-2 text-slate-600 hover:text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden aspect-square mb-3">
              <img src={product.imgs[imgIdx]} alt={product.nome} className="w-full h-full object-cover" />
            </div>
            {product.imgs.length > 1 && (
              <div className="flex gap-3">
                {product.imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      i === imgIdx ? "border-primary" : "border-slate-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold text-primary bg-primary-bg px-3 py-1 rounded-full">{product.cat}</span>
            <h1 className="text-3xl font-extrabold text-dark mt-3 mb-2">{product.nome}</h1>
            <p className="text-slate-500 leading-relaxed mb-6">{product.desc}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-extrabold text-primary">R$ {product.preco.toFixed(2)}</span>
              {product.precoAntigo && (
                <span className="text-lg text-slate-400 line-through">R$ {product.precoAntigo.toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-slate-200 rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-slate-500 hover:text-dark">-</button>
                <span className="px-3 py-2 font-bold text-dark min-w-[2rem] text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-slate-500 hover:text-dark">+</button>
              </div>
              <button className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors text-sm">
                Adicionar ao Carrinho
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-bold text-dark mb-3">Especificacoes</h3>
              <div className="space-y-2">
                {product.specs.map((s) => (
                  <div key={s.k} className="flex justify-between text-sm">
                    <span className="text-slate-500">{s.k}</span>
                    <span className="font-medium text-dark">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Frete gratis acima de R$ 299
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Garantia de 12 meses
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
