import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-dark via-dark-2 to-primary-dark py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Sobre o <span className="text-primary-light">MaciHub</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Transformando a forma como profissionais de saúde acessam infraestrutura de qualidade.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-extrabold text-dark mb-4">Nossa Missão</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Democratizar o acesso a salas médicas de alto padrão para profissionais de saúde que querem
                  atender seus pacientes sem o peso de manter uma clínica própria.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Acreditamos que todo profissional de saúde merece um espaço digno para exercer sua profissão,
                  sem compromissos de longo prazo ou investimentos iniciais proibitivos.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">+50 salas</h3>
                      <p className="text-sm text-slate-500">Em diversas cidades do Brasil</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">+200 profissionais</h3>
                      <p className="text-sm text-slate-500">Confiam na plataforma</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">98% de satisfação</h3>
                      <p className="text-sm text-slate-500">Avaliação dos usuários</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-20">
              <h2 className="text-3xl font-extrabold text-dark mb-4 text-center">Nossos Valores</h2>
              <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">
                Os pilares que guiam tudo o que fazemos na MaciHub.
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-dark mb-2">Excelência</h3>
                  <p className="text-sm text-slate-500">Salas com padrão hospitalar, equipadas e higienizadas para cada atendimento.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-dark mb-2">Flexibilidade</h3>
                  <p className="text-sm text-slate-500">Sem contratos longos. Alugue por hora, turno ou mês — do seu jeito.</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-dark mb-2">Acessibilidade</h3>
                  <p className="text-sm text-slate-500">Preços justos para que mais profissionais possam atender com qualidade.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 lg:p-12 text-center">
              <h2 className="text-2xl font-extrabold text-dark mb-3">Pronto para começar?</h2>
              <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                Encontre a sala ideal para seus atendimentos e comece a atender seus pacientes em um espaço de qualidade.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/#pacotes" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors">
                  Ver Pacotes
                </Link>
                <Link href="/contato" className="px-6 py-3 bg-white hover:bg-slate-50 text-dark font-bold rounded-lg border border-slate-200 transition-colors">
                  Fale Conosco
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
