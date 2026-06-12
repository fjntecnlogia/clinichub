"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Msg {
  id: string;
  remetente: "usuario" | "suporte";
  texto: string;
  created_at: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "chat">("form");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [conversaId, setConversaId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("nome, email")
          .eq("id", user.id)
          .single();
        if (profile) {
          setNome(profile.nome);
          setEmail(profile.email);
        }
      }
    }
    checkUser();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    if (!conversaId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`chat-${conversaId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensagens_suporte", filter: `conversa_id=eq.${conversaId}` },
        (payload) => {
          const novo = payload.new as Msg;
          setMsgs((prev) => {
            if (prev.some((m) => m.id === novo.id)) return prev;
            return [...prev, novo];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversaId]);

  async function handleStartChat(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("conversas_suporte")
      .insert({
        user_id: userId,
        nome_visitante: nome,
        email_visitante: email || null,
        assunto: assunto || "Duvida geral",
      })
      .select("id")
      .single();

    if (!error && data) {
      setConversaId(data.id);
      setStep("chat");

      const autoMsg = `Ola ${nome.split(" ")[0]}! Bem-vindo ao suporte ClinicHub. Como podemos ajudar?`;
      await supabase.from("mensagens_suporte").insert({
        conversa_id: data.id,
        remetente: "suporte",
        texto: autoMsg,
      });
      setMsgs([{ id: "auto", remetente: "suporte", texto: autoMsg, created_at: new Date().toISOString() }]);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !conversaId || sending) return;

    const texto = input.trim();
    setInput("");
    setSending(true);

    const supabase = createClient();
    await supabase.from("mensagens_suporte").insert({
      conversa_id: conversaId,
      remetente: "usuario",
      texto,
    });

    setSending(false);
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        aria-label="Chat de suporte"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Janela do chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">
              CH
            </div>
            <div>
              <div className="text-white font-bold text-sm">Suporte ClinicHub</div>
              <div className="text-white/70 text-xs">Tempo medio de resposta: 5 min</div>
            </div>
          </div>

          {step === "form" ? (
            <form onSubmit={handleStartChat} className="p-5 space-y-3 flex-1">
              <p className="text-sm text-slate-500 mb-1">Preencha seus dados para iniciar o atendimento:</p>
              <div>
                <label className="block text-xs font-semibold text-dark mb-1">Nome *</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dark mb-1">Assunto</label>
                <select
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="Duvida geral">Duvida geral</option>
                  <option value="Reservas">Reservas</option>
                  <option value="Pagamento">Pagamento</option>
                  <option value="Problemas tecnicos">Problemas tecnicos</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Iniciar Chat
              </button>
            </form>
          ) : (
            <>
              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[320px]">
                {msgs.map((m) => (
                  <div key={m.id} className={`flex ${m.remetente === "usuario" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.remetente === "usuario"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-slate-100 text-dark rounded-bl-md"
                    }`}>
                      {m.texto}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="border-t border-slate-100 p-3 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="px-3 py-2 bg-primary hover:bg-primary-dark disabled:bg-slate-200 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
