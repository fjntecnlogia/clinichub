import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-dark via-dark-2 to-primary-dark py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Política de <span className="text-primary-light">Privacidade</span>
            </h1>
            <p className="text-sm text-slate-400">Última atualização: 11 de junho de 2026</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xl font-extrabold text-dark mt-0">1. Dados que Coletamos</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Coletamos as seguintes informações quando você utiliza o MaciHub: nome completo, e-mail,
              telefone, CPF/CNPJ, registro profissional (CRM, CRO, etc.), dados de pagamento e histórico
              de reservas.
            </p>

            <h2 className="text-xl font-extrabold text-dark">2. Como Usamos seus Dados</h2>
            <p className="text-slate-600 leading-relaxed mb-4">Utilizamos seus dados para:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6">
              <li>Processar reservas e pagamentos</li>
              <li>Enviar confirmações e lembretes</li>
              <li>Melhorar a experiência na plataforma</li>
              <li>Comunicar novidades e ofertas (com seu consentimento)</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h2 className="text-xl font-extrabold text-dark">3. Compartilhamento de Dados</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Não vendemos seus dados pessoais. Compartilhamos informações apenas com: processadores de
              pagamento para concluir transações, parceiros de infraestrutura necessários para operação
              da plataforma, e autoridades quando exigido por lei.
            </p>

            <h2 className="text-xl font-extrabold text-dark">4. Armazenamento e Segurança</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Seus dados são armazenados em servidores seguros com criptografia. Utilizamos medidas técnicas
              e organizacionais para proteger suas informações contra acesso não autorizado, perda ou
              alteração.
            </p>

            <h2 className="text-xl font-extrabold text-dark">5. Seus Direitos (LGPD)</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusao de seus dados</li>
              <li>Revogar consentimento para comunicações</li>
              <li>Solicitar portabilidade dos dados</li>
            </ul>

            <h2 className="text-xl font-extrabold text-dark">6. Cookies</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para
              entender como os usuários interagem com o site. Você pode desabilitar cookies no seu
              navegador, mas alguns recursos podem nao funcionar corretamente.
            </p>

            <h2 className="text-xl font-extrabold text-dark">7. Retenção de Dados</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Mantemos seus dados enquanto sua conta estiver ativa ou pelo período necessário para cumprir
              obrigações legais. Após a exclusão da conta, os dados são removidos em até 30 dias,
              exceto quando a legislação exigir retenção por período maior.
            </p>

            <h2 className="text-xl font-extrabold text-dark">8. Contato do Encarregado (DPO)</h2>
            <p className="text-slate-600 leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato com
              nosso Encarregado de Proteção de Dados pelo e-mail{" "}
              <a href="mailto:privacidade@macihub.com.br" className="text-primary hover:text-primary-dark font-medium">
                privacidade@macihub.com.br
              </a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
