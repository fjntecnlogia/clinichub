import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (isErrorResponse(auth)) return auth;

  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const tipo = url.searchParams.get("tipo");
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let query = supabase
      .from("pagamentos")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (tipo) query = query.eq("tipo", tipo);
    if (status) query = query.eq("status", status);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Erro ao buscar pagamentos" }, { status: 500 });
    }

    return NextResponse.json({
      pagamentos: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
