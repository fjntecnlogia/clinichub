"use client";

import { useState } from "react";

const products = [
  { id: 1, nome: "Jaleco Premium Branco", cat: "Jalecos", preco: 189.9, estoque: 45, vendas: 128, img: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=80&h=80&fit=crop" },
  { id: 2, nome: "Estetoscopio Littmann", cat: "Equipamentos", preco: 849.9, estoque: 12, vendas: 67, img: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=80&h=80&fit=crop" },
  { id: 3, nome: "Kit Curativos Estereis", cat: "Materiais", preco: 45.9, estoque: 230, vendas: 312, img: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=80&h=80&fit=crop" },
  { id: 4, nome: "Luvas Nitrilo (cx 100)", cat: "Materiais", preco: 54.9, estoque: 180, vendas: 456, img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=80&h=80&fit=crop" },
  { id: 5, nome: "Maca Portatil Premium", cat: "Mobiliario", preco: 1290.0, estoque: 8, vendas: 23, img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=80&h=80&fit=crop" },
  { id: 6, nome: "Scrub Cirurgico Azul", cat: "Roupas", preco: 129.9, estoque: 67, vendas: 89, img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=80&h=80&fit=crop" },
];

export default function AdminEcommerce() {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()));

  const totalVendas = products.reduce((s, p) => s + p.vendas * p.preco, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">E-commerce</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie produtos e pedidos</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors">
          + Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Total Produtos</span>
          <div className="text-2xl font-extrabold text-dark mt-1">{products.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Vendas Totais</span>
          <div className="text-2xl font-extrabold text-dark mt-1">{products.reduce((s, p) => s + p.vendas, 0)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Receita Produtos</span>
          <div className="text-2xl font-extrabold text-dark mt-1">
            R$ {totalVendas.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full max-w-md px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="px-6 py-3">Produto</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Preco</th>
                <th className="px-6 py-3">Estoque</th>
                <th className="px-6 py-3">Vendas</th>
                <th className="px-6 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.img} alt={p.nome} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-dark">{p.nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{p.cat}</td>
                  <td className="px-6 py-4 font-semibold">R$ {p.preco.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={p.estoque < 15 ? "text-red-600 font-semibold" : ""}>
                      {p.estoque}
                    </span>
                  </td>
                  <td className="px-6 py-4">{p.vendas}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-primary hover:text-primary-dark text-xs font-semibold">Editar</button>
                    <button className="text-red-500 hover:text-red-700 text-xs font-semibold">Remover</button>
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
