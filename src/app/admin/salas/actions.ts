"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSalas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("salas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createSala(formData: FormData) {
  const supabase = await createClient();

  const equipamentos = (formData.get("equipamentos") as string)
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const { error } = await supabase.from("salas").insert({
    nome: formData.get("nome") as string,
    tipo: formData.get("tipo") as string,
    andar: formData.get("andar") as string,
    preco_hora: parseFloat(formData.get("preco_hora") as string),
    status: "Disponivel",
    equipamentos,
  });

  if (error) throw error;
  revalidatePath("/admin/salas");
}

export async function updateSala(id: string, formData: FormData) {
  const supabase = await createClient();

  const equipamentos = (formData.get("equipamentos") as string)
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("salas")
    .update({
      nome: formData.get("nome") as string,
      tipo: formData.get("tipo") as string,
      andar: formData.get("andar") as string,
      preco_hora: parseFloat(formData.get("preco_hora") as string),
      status: formData.get("status") as string,
      equipamentos,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/salas");
}

export async function deleteSala(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("salas").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/salas");
}
