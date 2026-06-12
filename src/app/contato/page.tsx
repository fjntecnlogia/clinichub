import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-dark via-dark-2 to-primary-dark py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Fale <span className="text-primary-light">Conosco</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Estamos prontos para ajudar voce a encontrar a sala perfeita.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-extrabold text-dark mb-6">Entre em contato</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Tem duvidas sobre como funciona? Quer saber mais sobre os pacotes ou precisa de ajuda
                  com sua reserva? Escolha o canal mais conveniente para voce.
                </p>

                <div className="space-y-5">
                  <a href="https://wa.me/5584999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100 hover:border-green-200 transition-colors group">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-dark group-hover:text-green-700 transition-colors">WhatsApp</h3>
                      <p className="text-sm text-slate-500">Resposta rapida em horario comercial</p>
                    </div>
                  </a>

                  <a href="mailto:contato@clinichub.com.br" className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10 hover:border-primary/20 transition-colors group">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-dark group-hover:text-primary transition-colors">E-mail</h3>
                      <p className="text-sm text-slate-500">contato@clinichub.com.br</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">Horario de Atendimento</h3>
                      <p className="text-sm text-slate-500">Seg a Sex, 08h as 18h</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-lg font-bold text-dark mb-6">Perguntas Frequentes</h3>
                <div className="space-y-4">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-3 border-b border-slate-200 text-sm font-semibold text-dark">
                      Como funciona o aluguel de salas?
                      <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <p className="text-sm text-slate-500 py-3">Voce escolhe a sala, o horario e reserva online. Pague apenas pelas horas que usar, sem contrato de longo prazo.</p>
                  </details>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-3 border-b border-slate-200 text-sm font-semibold text-dark">
                      Preciso levar equipamentos?
                      <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <p className="text-sm text-slate-500 py-3">Nao! Todas as salas ja vem equipadas. Voce pode ver a lista de equipamentos na descricao de cada sala.</p>
                  </details>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-3 border-b border-slate-200 text-sm font-semibold text-dark">
                      Posso cancelar uma reserva?
                      <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <p className="text-sm text-slate-500 py-3">Sim, cancelamentos com ate 24h de antecedencia sao gratuitos. Apos esse prazo, pode haver uma taxa.</p>
                  </details>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-3 border-b border-slate-200 text-sm font-semibold text-dark">
                      Quais formas de pagamento?
                      <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <p className="text-sm text-slate-500 py-3">Aceitamos cartao de credito, debito, Pix e boleto bancario. Para planos mensais, oferecemos desconto no Pix.</p>
                  </details>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer py-3 text-sm font-semibold text-dark">
                      Tem fidelidade ou multa?
                      <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <p className="text-sm text-slate-500 py-3">Nao. Sem contrato de fidelidade, sem multa. Voce pode parar de usar a plataforma quando quiser.</p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
