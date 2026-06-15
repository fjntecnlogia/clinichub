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
            <p className="text-sm text-slate-400">Última atualização: 11 de junho de 2026</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6 prose prose-slate prose-headings:text-dark prose-headings:font-extrabold prose-a:text-primary">
            <h2 className="text-xl font-extrabold text-dark mt-0">1. Aceitação dos Termos</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Ao acessar e utilizar a plataforma MaciHub, você concorda com estes Termos de Uso.
              Se você não concordar com algum dos termos, não utilize a plataforma.
            </p>

            <h2 className="text-xl font-extrabold text-dark">2. Descrição do Serviço</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              O MaciHub é uma plataforma digital que conecta profissionais de saúde a espaços clínicos
              disponíveis para locação por hora, turno ou mês. A plataforma oferece também um e-commerce
              de equipamentos e materiais médicos.
            </p>

            <h2 className="text-xl font-extrabold text-dark">3. Cadastro e Conta</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Para utilizar os serviços, você deve criar uma conta fornecendo informações verdadeiras e atualizadas.
              Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as
              atividades realizadas em sua conta.
            </p>

            <h2 className="text-xl font-extrabold text-dark">4. Reservas e Pagamentos</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              As reservas de salas estão sujeitas à disponibilidade. Os preços são apresentados na plataforma
              e podem ser alterados sem aviso prévio. Cancelamentos com até 24 horas de antecedência são
              gratuitos. Cancelamentos com menos de 24 horas podem estar sujeitos a cobrança.
            </p>

            <h2 className="text-xl font-extrabold text-dark">5. Uso das Instalações</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              O profissional se compromete a utilizar as salas exclusivamente para fins de atendimento em saude,
              manter a limpeza e conservação do espaço, e respeitar os horarios reservados. Danos às instalações
              ou equipamentos serão de responsabilidade do usuário.
            </p>

            <h2 className="text-xl font-extrabold text-dark">6. Propriedade Intelectual</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Todo o conteudo da plataforma, incluindo marca, logotipos, textos e imagens, é de propriedade
              do MaciHub ou de seus licenciadores. É proibida a reprodução sem autorização prévia.
            </p>

            <h2 className="text-xl font-extrabold text-dark">7. Limitacao de Responsabilidade</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              O MaciHub não se responsabiliza por: interrupções temporárias do serviço, atos de terceiros
              nas dependências, perdas ou danos indiretos decorrentes do uso da plataforma.
            </p>

            <h2 className="text-xl font-extrabold text-dark">8. Modificações</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              O MaciHub reserva-se o direito de modificar estes termos a qualquer momento.
              As alterações serão comunicadas pela plataforma e entrarão em vigor na data da publicação.
            </p>

            <h2 className="text-xl font-extrabold text-dark">9. Contato</h2>
            <p className="text-slate-600 leading-relaxed">
              Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@macihub.com.br" className="text-primary hover:text-primary-dark font-medium">
                contato@macihub.com.br
              </a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
