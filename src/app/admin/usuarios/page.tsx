import { createClient } from "@/lib/supabase/server";

interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  especialidade: string | null;
  crm: string | null;
  telefone: string | null;
  created_at: string;
}

const mockUsers: Profile[] = [
  { id: "1", nome: "Dra. Ana Costa", email: "ana.costa@email.com", tipo: "profissional", especialidade: "Dermatologia", crm: "CRM-12345", telefone: "(84) 99999-0001", created_at: "2026-01-15" },
  { id: "2", nome: "Dr. Pedro Alves", email: "pedro.alves@email.com", tipo: "profissional", especialidade: "Cirurgia Geral", crm: "CRM-23456", telefone: "(84) 99999-0002", created_at: "2025-11-20" },
  { id: "3", nome: "Dra. Maria Lima", email: "maria.lima@email.com", tipo: "profissional", especialidade: "Psicologia", crm: "CRP-34567", telefone: "(84) 99999-0003", created_at: "2025-09-10" },
  { id: "4", nome: "Dr. Lucas Neto", email: "lucas.neto@email.com", tipo: "profissional", especialidade: "Ortopedia", crm: "CRM-45678", telefone: null, created_at: "2026-03-05" },
  { id: "5", nome: "Clinica Vida Plena", email: "contato@vidaplena.com", tipo: "clinica", especialidade: "Multi-especialidade", crm: null, telefone: "(84) 3333-4444", created_at: "2026-06-01" },
];

async function getUsuarios() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return { users: mockUsers, real: false };
    return { users: data as Profile[], real: true };
  } catch {
    return { users: mockUsers, real: false };
  }
}

export default async function AdminUsuarios() {
  const { users, real } = await getUsuarios();

  const profissionais = users.filter((u) => u.tipo === "profissional").length;
  const clinicas = users.filter((u) => u.tipo === "clinica").length;
  const admins = users.filter((u) => u.tipo === "admin").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1">
            {users.length} usuarios cadastrados
            {!real && <span className="text-amber-500 ml-2">(dados de demonstracao)</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Profissionais</span>
          <div className="text-2xl font-extrabold text-dark mt-1">{profissionais}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Clinicas</span>
          <div className="text-2xl font-extrabold text-dark mt-1">{clinicas}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-sm text-slate-500">Administradores</span>
          <div className="text-2xl font-extrabold text-dark mt-1">{admins}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Especialidade</th>
                <th className="px-6 py-3">Registro</th>
                <th className="px-6 py-3">Telefone</th>
                <th className="px-6 py-3">Desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                        u.tipo === "admin" ? "bg-red-50 text-red-600"
                          : u.tipo === "clinica" ? "bg-purple-50 text-purple-700"
                          : "bg-primary-bg text-primary"
                      }`}>
                        {u.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-dark">{u.nome}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.tipo === "admin" ? "bg-red-50 text-red-600"
                        : u.tipo === "clinica" ? "bg-purple-50 text-purple-700"
                        : "bg-blue-50 text-blue-700"
                    }`}>
                      {u.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">{u.especialidade ?? "—"}</td>
                  <td className="px-6 py-4 font-mono text-xs">{u.crm ?? "—"}</td>
                  <td className="px-6 py-4">{u.telefone ?? "—"}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(u.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
