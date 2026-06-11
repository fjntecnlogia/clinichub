"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getReservas(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("reservas")
    .select("*, sala:salas(nome), profile:profiles(nome, email)")
    .order("data", { ascending: false });

  if (status && status !== "Todas") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateReservaStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reservas")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/reservas");
}
