"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Conversa {
  id: string;
  user_id: string | null;
  nome_visitante: string | null;
  email_visitante: string | null;
  assunto: string;
  status: string;
  created_at: string;
  updated_at: string;
  profile?: { nome: string; email: string } | null;
}

interface Msg {
  id: string;
  remetente: "usuario" | "suporte";
  texto: string;
  created_at: string;
}

export default function AdminSuportePage() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("aberta");
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadConversas = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("conversas_suporte")
      .select("*, profile:profiles(nome, email)")
      .order("updated_at", { ascending: false });
    setConversas(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadConversas(); }, [loadConversas]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-conversas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversas_suporte" },
        () => { loadConversas(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadConversas]);

  async function loadMsgs(conversaId: string) {
    setActiveId(conversaId);
    const supabase = createClient();
    const { data } = await supabase
      .from("mensagens_suporte")
      .select("*")
      .eq("conversa_id", conversaId)
      .order("created_at", { ascending: true });
    setMsgs(data ?? []);
  }

  useEffect(() => {
    if (!activeId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`admin-chat-${activeId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensagens_suporte", filter: `conversa_id=eq.${activeId}` },
        (payload) => {
          const novo = payload.new as Msg;
          setMsgs((prev) => prev.some((m) => m.id === novo.id) ? prev : [...prev, novo]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeId || sending) return;
    const texto = input.trim();
    setInput("");
    setSending(true);

    const supabase = createClient();
    await supabase.from("mensagens_suporte").insert({
      conversa_id: activeId,
      remetente: "suporte",
      texto,
    });
    await supabase
      .from("conversas_suporte")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", activeId);

    setSending(false);
  }

  async function handleFechar(id: string) {
    const supabase = createClient();
    await supabase
      .from("conversas_suporte")
      .update({ status: "fechada" })
      .eq("id", id);
    await loadConversas();
  }

  async function handleReabrir(id: string) {
    const supabase = createClient();
    await supabase
      .from("conversas_suporte")
      .update({ status: "aberta" })
      .eq("id", id);
    await loadConversas();
  }

  const filtered = conversas.filter((c) => c.status === filtro);
  const activeConversa = conversas.find((c) => c.id === activeId);
  const abertas = conversas.filter((c) => c.status === "aberta").length;
  const fechadas = conversas.filter((c) => c.status === "fechada").length;

  function getNome(c: Conversa) {
    return c.profile?.nome || c.nome_visitante || "Visitante";
  }

  function getEmail(c: Conversa) {
    return c.profile?.email || c.email_visitante || "";
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 h-[calc(100vh-0px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Suporte</h1>
          <p className="text-slate-500 text-sm mt-1">
            {abertas} abertas · {fechadas} fechadas
          </p>
        </div>
        <div className="flex gap-2">
          {(["aberta", "fechada"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                filtro === f ? "bg-primary text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f === "aberta" ? `Abertas (${abertas})` : `Fechadas (${fechadas})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex" style={{ height: "calc(100vh - 180px)" }}>
        {/* Lista */}
        <div className="w-80 border-r border-slate-200 flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                Nenhuma conversa {filtro}
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => loadMsgs(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    activeId === c.id ? "bg-primary-bg" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-dark text-sm truncate">{getNome(c)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      c.user_id ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {c.user_id ? "Cliente" : "Visitante"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{c.assunto}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(c.updated_at).toLocaleDateString("pt-BR")} {new Date(c.updated_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {activeId && activeConversa ? (
            <>
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-dark text-sm">{getNome(activeConversa)}</span>
                    <span className="text-xs text-slate-400">{getEmail(activeConversa)}</span>
                  </div>
                  <span className="text-xs text-slate-500">{activeConversa.assunto}</span>
                </div>
                <div className="flex gap-2">
                  {activeConversa.status === "aberta" ? (
                    <button
                      onClick={() => handleFechar(activeConversa.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Fechar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReabrir(activeConversa.id)}
                      className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Reabrir
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {msgs.map((m) => (
                  <div key={m.id} className={`flex ${m.remetente === "suporte" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.remetente === "suporte"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-slate-100 text-dark rounded-bl-md"
                    }`}>
                      {m.texto}
                      <div className={`text-[10px] mt-1 ${m.remetente === "suporte" ? "text-white/60" : "text-slate-400"}`}>
                        {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSend} className="border-t border-slate-100 p-4 flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Responder como suporte..."
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:bg-slate-200 text-white font-bold rounded-lg text-sm transition-colors"
                >
                  Enviar
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Selecione uma conversa para responder
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
