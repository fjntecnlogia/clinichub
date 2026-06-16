import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (isErrorResponse(auth)) return auth;

  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let query = supabase
      .from("pedidos")
      .select("*, profile:profiles(nome, email, telefone)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
    }

    return NextResponse.json({ pedidos: data || [], total: count || 0, limit, offset });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (isErrorResponse(auth)) return auth;

  try {
    const { id, status, rastreio, notas } = (await req.json()) as {
      id: string;
      status?: string;
      rastreio?: string;
      notas?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const allowed = ["Pendente", "Pago", "Em transito", "Entregue", "Cancelado"];
    if (status && !allowed.includes(status)) {
      return NextResponse.json({ error: `Status inválido. Use: ${allowed.join(", ")}` }, { status: 400 });
    }

    const supabase = await createClient();
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) update.status = status;
    if (rastreio !== undefined) update.rastreio = rastreio;
    if (notas !== undefined) update.notas = notas;

    const { data, error } = await supabase
      .from("pedidos")
      .update(update)
      .eq("id", id)
      .select("id, status, rastreio, notas")
      .single();

    if (error) {
      return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: 500 });
    }

    return NextResponse.json({ pedido: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
