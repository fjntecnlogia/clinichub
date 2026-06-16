import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (isErrorResponse(auth)) return auth;

  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const de = url.searchParams.get("de");
    const ate = url.searchParams.get("ate");

    let reservasQuery = supabase.from("reservas").select("valor, status, data, sala:salas(nome)");
    let pedidosQuery = supabase.from("pedidos").select("total, status, created_at, metodo_pagamento");

    if (de) {
      reservasQuery = reservasQuery.gte("data", de);
      pedidosQuery = pedidosQuery.gte("created_at", de);
    }
    if (ate) {
      reservasQuery = reservasQuery.lte("data", ate);
      pedidosQuery = pedidosQuery.lte("created_at", ate);
    }

    const [resReservas, resPedidos] = await Promise.all([reservasQuery, pedidosQuery]);
    const reservas = resReservas.data || [];
    const pedidos = resPedidos.data || [];

    const receitaAlugueis = reservas
      .filter((r) => r.status !== "Cancelada")
      .reduce((s, r) => s + Number(r.valor), 0);

    const receitaEcommerce = pedidos
      .filter((p) => p.status !== "Cancelado")
      .reduce((s, p) => s + Number(p.total), 0);

    const pendAlugueis = reservas
      .filter((r) => r.status === "Pendente")
      .reduce((s, r) => s + Number(r.valor), 0);

    const pendEcommerce = pedidos
      .filter((p) => p.status === "Pendente")
      .reduce((s, p) => s + Number(p.total), 0);

    const pagoAlugueis = reservas
      .filter((r) => r.status === "Confirmada" || r.status === "Concluída")
      .reduce((s, r) => s + Number(r.valor), 0);

    const pagoEcommerce = pedidos
      .filter((p) => ["Pago", "Entregue", "Em transito"].includes(p.status))
      .reduce((s, p) => s + Number(p.total), 0);

    const canceladoTotal = reservas
      .filter((r) => r.status === "Cancelada")
      .reduce((s, r) => s + Number(r.valor), 0) +
      pedidos
        .filter((p) => p.status === "Cancelado")
        .reduce((s, p) => s + Number(p.total), 0);

    const salasReceita: Record<string, { nome: string; receita: number; count: number }> = {};
    reservas.filter((r) => r.status !== "Cancelada").forEach((r) => {
      const nome = (r.sala as { nome: string } | null)?.nome || "Desconhecida";
      if (!salasReceita[nome]) salasReceita[nome] = { nome, receita: 0, count: 0 };
      salasReceita[nome].receita += Number(r.valor);
      salasReceita[nome].count++;
    });

    const metodosPagamento: Record<string, number> = {};
    pedidos.filter((p) => p.status !== "Cancelado" && p.metodo_pagamento).forEach((p) => {
      const m = p.metodo_pagamento!;
      metodosPagamento[m] = (metodosPagamento[m] || 0) + Number(p.total);
    });

    return NextResponse.json({
      periodo: { de: de || "inicio", ate: ate || "atual" },
      receita: {
        total: receitaAlugueis + receitaEcommerce,
        alugueis: receitaAlugueis,
        ecommerce: receitaEcommerce,
      },
      recebido: pagoAlugueis + pagoEcommerce,
      pendente: {
        total: pendAlugueis + pendEcommerce,
        alugueis: pendAlugueis,
        ecommerce: pendEcommerce,
      },
      cancelado: canceladoTotal,
      totais: {
        reservas: reservas.length,
        pedidos: pedidos.length,
      },
      ticket_medio: {
        aluguel: reservas.filter((r) => r.status !== "Cancelada").length > 0
          ? receitaAlugueis / reservas.filter((r) => r.status !== "Cancelada").length : 0,
        pedido: pedidos.filter((p) => p.status !== "Cancelado").length > 0
          ? receitaEcommerce / pedidos.filter((p) => p.status !== "Cancelado").length : 0,
      },
      salas_ranking: Object.values(salasReceita).sort((a, b) => b.receita - a.receita),
      metodos_pagamento: metodosPagamento,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
