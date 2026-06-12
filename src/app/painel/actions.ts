"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPainelOverview() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("nome, tipo")
      .eq("id", user.id)
      .single();

    const [reservasRes, pedidosRes, proximasRes] = await Promise.all([
      supabase
        .from("reservas")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("data", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]),
      supabase
        .from("pedidos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("reservas")
        .select("*, sala:salas(nome)")
        .eq("user_id", user.id)
        .gte("data", new Date().toISOString().split("T")[0])
        .in("status", ["Confirmada", "Pendente"])
        .order("data", { ascending: true })
        .limit(5),
    ]);

    return {
      nome: profile?.nome ?? user.user_metadata?.nome ?? "Usuario",
      tipo: profile?.tipo ?? "profissional",
      reservasMes: reservasRes.count ?? 0,
      totalPedidos: pedidosRes.count ?? 0,
      proximas: proximasRes.data ?? [],
      hasData: true,
    };
  } catch {
    return null;
  }
}
