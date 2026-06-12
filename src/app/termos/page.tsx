import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-dark via-dark-2 to-primary-dark py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Termos de <span className="text-primary-light">Uso</span>
            </h1>
            <p className="text-sm text-slate-400">Ultima atualizacao: 11 de junho de 2026</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6 prose prose-slate prose-headings:text-dark prose-headings:font-extrabold prose-a:text-primary">
            <h2 className="text-xl font-extrabold text-dark mt-0">1. Aceitacao dos Termos</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Ao acessar e utilizar a plataforma ClinicHub, voce concorda com estes Termos de Uso.
              Se voce nao concordar com algum dos termos, nao utilize a plataforma.
            </p>

            <h2 className="text-xl font-extrabold text-dark">2. Descricao do Servico</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              O ClinicHub e uma plataforma digital que conecta profissionais de saude a espacos clinicos
              disponíveis para locacao por hora, turno ou mes. A plataforma oferece tambem um e-commerce
              de equipamentos e materiais medicos.
            </p>

            <h2 className="text-xl font-extrabold text-dark">3. Cadastro e Conta</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Para utilizar os servicos, voce deve criar uma conta fornecendo informacoes verdadeiras e atualizadas.
              Voce e responsavel por manter a confidencialidade de suas credenciais de acesso e por todas as
              atividades realizadas em sua conta.
            </p>

            <h2 className="text-xl font-extrabold text-dark">4. Reservas e Pagamentos</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              As reservas de salas estao sujeitas a disponibilidade. Os precos sao apresentados na plataforma
              e podem ser alterados sem aviso previo. Cancelamentos com ate 24 horas de antecedencia sao
              gratuitos. Cancelamentos com menos de 24 horas podem estar sujeitos a cobranca.
            </p>

            <h2 className="text-xl font-extrabold text-dark">5. Uso das Instalacoes</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              O profissional se compromete a utilizar as salas exclusivamente para fins de atendimento em saude,
              manter a limpeza e conservacao do espaco, e respeitar os horarios reservados. Danos as instalacoes
              ou equipamentos serao de responsabilidade do usuario.
            </p>

            <h2 className="text-xl font-extrabold text-dark">6. Propriedade Intelectual</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Todo o conteudo da plataforma, incluindo marca, logotipos, textos e imagens, e de propriedade
              do ClinicHub ou de seus licenciadores. E proibida a reproducao sem autorizacao previa.
            </p>

            <h2 className="text-xl font-extrabold text-dark">7. Limitacao de Responsabilidade</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              O ClinicHub nao se responsabiliza por: interrupcoes temporarias do servico, atos de terceiros
              nas dependencias, perdas ou danos indiretos decorrentes do uso da plataforma.
            </p>

            <h2 className="text-xl font-extrabold text-dark">8. Modificacoes</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              O ClinicHub reserva-se o direito de modificar estes termos a qualquer momento.
              As alteracoes serao comunicadas pela plataforma e entrarao em vigor na data da publicacao.
            </p>

            <h2 className="text-xl font-extrabold text-dark">9. Contato</h2>
            <p className="text-slate-600 leading-relaxed">
              Em caso de duvidas sobre estes termos, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@clinichub.com.br" className="text-primary hover:text-primary-dark font-medium">
                contato@clinichub.com.br
              </a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
