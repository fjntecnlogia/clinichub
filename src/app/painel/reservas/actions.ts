"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMinhasReservas() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("reservas")
    .select("*, sala:salas(nome)")
    .eq("user_id", user.id)
    .order("data", { ascending: false });

  if (error) return [];
  return data;
}

export async function cancelarReserva(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reservas")
    .update({ status: "Cancelada" })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/painel/reservas");
}
