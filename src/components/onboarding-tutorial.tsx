"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "macihub_onboarding_done";

const steps = [
  {
    icon: (
      <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Bem-vindo ao MaciHub!",
    description: "Estamos felizes em ter você aqui! Vamos fazer um tour rápido pelas principais funcionalidades da plataforma para você aproveitar ao máximo.",
    tip: "O tutorial leva menos de 1 minuto",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    ),
    title: "Reserve Salas com Facilidade",
    description: "Clique em \"Nova Reserva\" para agendar uma sala equipada por hora, turno ou mês. Escolha o horário, a sala e confirme em segundos. Sem burocracia!",
    tip: "Use o botão azul no topo do painel",
    highlight: "Nova Reserva",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: "Loja de Materiais",
    description: "Acesse nossa loja com materiais odontológicos essenciais. Compre com frete grátis acima de R$150 e receba diretamente na clínica. Tudo em um só lugar!",
    tip: "Use o botão laranja no topo do painel",
    highlight: "Loja",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Painel de Controle",
    description: "No seu painel você acompanha tudo: próximas reservas, status dos pedidos, histórico completo e estatísticas. Tudo organizado para você focar no que importa: seus pacientes.",
    tip: "O dashboard mostra um resumo rápido de tudo",
    highlight: "Visão Geral",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Complete seu Perfil",
    description: "Adicione sua especialidade, CRM, telefone e foto. Um perfil completo transmite mais confiança e ajuda na hora de agendar salas especializadas.",
    tip: "Acesse \"Meu Perfil\" no menu lateral",
    highlight: "Meu Perfil",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    title: "Suporte Sempre Disponível",
    description: "Precisa de ajuda? Use o chat de suporte direto do seu painel. Nossa equipe responde rapidamente para resolver qualquer dúvida sobre reservas, pagamentos ou a plataforma.",
    tip: "Clique em \"Suporte\" no menu lateral",
    highlight: "Suporte",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-8.42a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    title: "Tudo Pronto!",
    description: "Você já conhece as principais funcionalidades do MaciHub. Agora é só reservar sua primeira sala e começar a atender. Bons atendimentos!",
    tip: "Você pode rever este tutorial a qualquer momento no seu perfil",
  },
];

export function OnboardingTutorial() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function finish() {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }

  function next() {
    if (step >= steps.length - 1) {
      finish();
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 200);
  }

  function prev() {
    if (step <= 0) return;
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setAnimating(false);
    }, 200);
  }

  if (!show) return null;

  const current = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={finish} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={finish}
            className="absolute top-5 right-5 text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors z-10"
          >
            Pular tutorial
          </button>
        )}

        {/* Content */}
        <div className={`px-8 pt-10 pb-8 text-center transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
          {/* Step indicator */}
          <div className="text-xs text-slate-400 font-semibold mb-6 tracking-wider">
            {step + 1} DE {steps.length}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center">
              {current.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-dark mb-3">
            {current.title}
          </h2>

          {/* Description */}
          <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-sm mx-auto">
            {current.description}
          </p>

          {/* Tip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-bg rounded-full mb-8">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-primary font-semibold">{current.tip}</span>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAnimating(true); setTimeout(() => { setStep(i); setAnimating(false); }, 200); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-primary" : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {!isFirst && (
              <button
                onClick={prev}
                className="flex-1 py-3.5 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Voltar
              </button>
            )}
            <button
              onClick={next}
              className={`flex-1 py-3.5 text-white text-sm font-bold rounded-xl transition-colors ${
                isLast
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-primary hover:bg-primary-dark"
              }`}
            >
              {isLast ? "Começar a usar!" : "Próximo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
