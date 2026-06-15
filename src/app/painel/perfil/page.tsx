"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";

export default function PerfilPage() {
  const { profile, loading: userLoading } = useUser();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    especialidade: "",
    crm: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        nome: profile.nome || "",
        email: profile.email || "",
        telefone: profile.telefone || "",
        especialidade: profile.especialidade || "",
        crm: profile.crm || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        nome: form.nome,
        telefone: form.telefone,
        especialidade: form.especialidade,
        crm: form.crm,
        bio: form.bio,
      })
      .eq("id", profile!.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const initials = form.nome
    ? form.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  if (userLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-dark">Meu Perfil</h1>
        <p className="text-slate-500 text-sm mt-1">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-bold text-dark mb-5">Informações Pessoais</h2>

            {saved && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                Perfil atualizado com sucesso!
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Nome completo</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => set("nome", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Telefone</label>
                <input
                  type="tel"
                  value={form.telefone}
                  onChange={(e) => set("telefone", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Especialidade</label>
                <input
                  type="text"
                  value={form.especialidade}
                  onChange={(e) => set("especialidade", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">CRM</label>
                <input
                  type="text"
                  value={form.crm}
                  onChange={(e) => set("crm", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-dark mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-5 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary-bg text-primary flex items-center justify-center font-black text-3xl mx-auto mb-4">
              {initials}
            </div>
            <h3 className="font-bold text-dark">{form.nome}</h3>
            <p className="text-sm text-slate-400">{form.especialidade || profile?.tipo}</p>
            {form.crm && <p className="text-xs text-slate-400 mt-1">{form.crm}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
