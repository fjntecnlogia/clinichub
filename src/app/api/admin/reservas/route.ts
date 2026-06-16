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
    const sala_id = url.searchParams.get("sala_id");
    const de = url.searchParams.get("de");
    const ate = url.searchParams.get("ate");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let query = supabase
      .from("reservas")
      .select("*, sala:salas(id, nome, preco_hora), profile:profiles(nome, email, telefone)", { count: "exact" })
      .order("data", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (sala_id) query = query.eq("sala_id", sala_id);
    if (de) query = query.gte("data", de);
    if (ate) query = query.lte("data", ate);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Erro ao buscar reservas" }, { status: 500 });
    }

    return NextResponse.json({ reservas: data || [], total: count || 0, limit, offset });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (isErrorResponse(auth)) return auth;

  try {
    const { id, status, notas } = (await req.json()) as {
      id: string;
      status?: string;
      notas?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const allowed = ["Confirmada", "Pendente", "Cancelada", "Concluída"];
    if (status && !allowed.includes(status)) {
      return NextResponse.json({ error: `Status inválido. Use: ${allowed.join(", ")}` }, { status: 400 });
    }

    const supabase = await createClient();
    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (notas !== undefined) update.notas = notas;

    const { data, error } = await supabase
      .from("reservas")
      .update(update)
      .eq("id", id)
      .select("id, status, notas")
      .single();

    if (error) {
      return NextResponse.json({ error: "Erro ao atualizar reserva" }, { status: 500 });
    }

    return NextResponse.json({ reserva: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
