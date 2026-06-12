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
              Politica de <span className="text-primary-light">Privacidade</span>
            </h1>
            <p className="text-sm text-slate-400">Ultima atualizacao: 11 de junho de 2026</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xl font-extrabold text-dark mt-0">1. Dados que Coletamos</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Coletamos as seguintes informacoes quando voce utiliza o ClinicHub: nome completo, e-mail,
              telefone, CPF/CNPJ, registro profissional (CRM, CRO, etc.), dados de pagamento e historico
              de reservas.
            </p>

            <h2 className="text-xl font-extrabold text-dark">2. Como Usamos seus Dados</h2>
            <p className="text-slate-600 leading-relaxed mb-4">Utilizamos seus dados para:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6">
              <li>Processar reservas e pagamentos</li>
              <li>Enviar confirmacoes e lembretes</li>
              <li>Melhorar a experiencia na plataforma</li>
              <li>Comunicar novidades e ofertas (com seu consentimento)</li>
              <li>Cumprir obrigacoes legais</li>
            </ul>

            <h2 className="text-xl font-extrabold text-dark">3. Compartilhamento de Dados</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Nao vendemos seus dados pessoais. Compartilhamos informacoes apenas com: processadores de
              pagamento para concluir transacoes, parceiros de infraestrutura necessarios para operacao
              da plataforma, e autoridades quando exigido por lei.
            </p>

            <h2 className="text-xl font-extrabold text-dark">4. Armazenamento e Seguranca</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Seus dados sao armazenados em servidores seguros com criptografia. Utilizamos medidas tecnicas
              e organizacionais para proteger suas informacoes contra acesso nao autorizado, perda ou
              alteracao.
            </p>

            <h2 className="text-xl font-extrabold text-dark">5. Seus Direitos (LGPD)</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              De acordo com a Lei Geral de Protecao de Dados (LGPD), voce tem direito a:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusao de seus dados</li>
              <li>Revogar consentimento para comunicacoes</li>
              <li>Solicitar portabilidade dos dados</li>
            </ul>

            <h2 className="text-xl font-extrabold text-dark">6. Cookies</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analiticos para
              entender como os usuarios interagem com o site. Voce pode desabilitar cookies no seu
              navegador, mas alguns recursos podem nao funcionar corretamente.
            </p>

            <h2 className="text-xl font-extrabold text-dark">7. Retencao de Dados</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Mantemos seus dados enquanto sua conta estiver ativa ou pelo periodo necessario para cumprir
              obrigacoes legais. Apos a exclusao da conta, os dados sao removidos em ate 30 dias,
              exceto quando a legislacao exigir retencao por periodo maior.
            </p>

            <h2 className="text-xl font-extrabold text-dark">8. Contato do Encarregado (DPO)</h2>
            <p className="text-slate-600 leading-relaxed">
              Para exercer seus direitos ou esclarecer duvidas sobre privacidade, entre em contato com
              nosso Encarregado de Protecao de Dados pelo e-mail{" "}
              <a href="mailto:privacidade@clinichub.com.br" className="text-primary hover:text-primary-dark font-medium">
                privacidade@clinichub.com.br
              </a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
