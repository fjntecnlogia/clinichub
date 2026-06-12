"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Conversa {
  id: string;
  assunto: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Msg {
  id: string;
  remetente: "usuario" | "suporte";
  texto: string;
  created_at: string;
}

export default function SuportePage() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [novoAssunto, setNovoAssunto] = useState("Duvida geral");
  const [novaMensagem, setNovaMensagem] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadConversas = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("conversas_suporte")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    setConversas(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadConversas(); }, [loadConversas]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

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
      .channel(`painel-chat-${activeId}`)
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

  async function handleNewConversa(e: React.FormEvent) {
    e.preventDefault();
    if (!novaMensagem.trim()) return;
    setSending(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSending(false); return; }

    const { data: conv } = await supabase
      .from("conversas_suporte")
      .insert({ user_id: user.id, assunto: novoAssunto })
      .select("id")
      .single();

    if (conv) {
      await supabase.from("mensagens_suporte").insert({
        conversa_id: conv.id,
        remetente: "usuario",
        texto: novaMensagem.trim(),
      });
      setShowNew(false);
      setNovaMensagem("");
      setNovoAssunto("Duvida geral");
      await loadConversas();
      await loadMsgs(conv.id);
    }
    setSending(false);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeId || sending) return;
    const texto = input.trim();
    setInput("");
    setSending(true);

    const supabase = createClient();
    await supabase.from("mensagens_suporte").insert({
      conversa_id: activeId,
      remetente: "usuario",
      texto,
    });
    await supabase
      .from("conversas_suporte")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", activeId);

    setSending(false);
  }

  const activeConversa = conversas.find((c) => c.id === activeId);

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
          <p className="text-slate-500 text-sm mt-1">Converse com nossa equipe</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
        >
          + Nova Conversa
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex" style={{ height: "calc(100vh - 180px)" }}>
        {/* Lista de conversas */}
        <div className="w-80 border-r border-slate-200 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Conversas ({conversas.length})
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversas.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                Nenhuma conversa ainda
              </div>
            ) : (
              conversas.map((c) => (
                <button
                  key={c.id}
                  onClick={() => loadMsgs(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    activeId === c.id ? "bg-primary-bg" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-dark text-sm truncate">{c.assunto}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === "aberta" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(c.updated_at).toLocaleDateString("pt-BR")} {new Date(c.updated_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Area do chat */}
        <div className="flex-1 flex flex-col">
          {activeId && activeConversa ? (
            <>
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-dark text-sm">{activeConversa.assunto}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeConversa.status === "aberta" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {activeConversa.status}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {msgs.map((m) => (
                  <div key={m.id} className={`flex ${m.remetente === "usuario" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.remetente === "usuario"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-slate-100 text-dark rounded-bl-md"
                    }`}>
                      {m.texto}
                      <div className={`text-[10px] mt-1 ${m.remetente === "usuario" ? "text-white/60" : "text-slate-400"}`}>
                        {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {activeConversa.status === "aberta" && (
                <form onSubmit={handleSend} className="border-t border-slate-100 p-4 flex gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
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
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Selecione uma conversa ou inicie uma nova
            </div>
          )}
        </div>
      </div>

      {/* Modal nova conversa */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNew(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-dark">Nova Conversa</h2>
              <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleNewConversa} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Assunto</label>
                <select
                  value={novoAssunto}
                  onChange={(e) => setNovoAssunto(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option>Duvida geral</option>
                  <option>Reservas</option>
                  <option>Pagamento</option>
                  <option>Problemas tecnicos</option>
                  <option>Sugestao</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Mensagem</label>
                <textarea
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  required
                  rows={3}
                  placeholder="Descreva sua duvida ou problema..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={sending} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors">
                  {sending ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
