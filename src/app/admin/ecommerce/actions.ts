"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProdutos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("produtos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProduto(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("produtos").insert({
    slug: (formData.get("nome") as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    nome: formData.get("nome") as string,
    descricao: formData.get("descricao") as string,
    categoria: formData.get("categoria") as string,
    preco: parseFloat(formData.get("preco") as string),
    preco_antigo: formData.get("preco_antigo")
      ? parseFloat(formData.get("preco_antigo") as string)
      : null,
    estoque: parseInt(formData.get("estoque") as string),
    foto_url: formData.get("foto_url") as string || null,
    badge: formData.get("badge") as string || null,
  });

  if (error) throw error;
  revalidatePath("/admin/ecommerce");
  revalidatePath("/loja");
}

export async function deleteProduto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("produtos").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/ecommerce");
  revalidatePath("/loja");
}
