import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade do Controle de Estoque",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Política de Privacidade</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Esta Política de Privacidade descreve como o Sistema de Controle de Estoque ("nós", "nosso" ou "o Sistema") coleta, usa, armazena e protege suas informações pessoais quando você utiliza nossos serviços. Estamos comprometidos em proteger sua privacidade e garantir a segurança dos seus dados.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Informações que Coletamos</h2>
          <p className="text-muted-foreground mb-4">
            Coletamos as seguintes categorias de informações pessoais:
          </p>
          <ul className="text-muted-foreground mb-4 list-disc list-inside">
            <li><strong>Informações de identificação:</strong> Nome de guerra, posto/graduação e telefone</li>
            <li><strong>Informações de conta:</strong> Endereço de email e senha (criptografada)</li>
            <li><strong>Dados de uso:</strong> Informações sobre como você interage com o sistema, incluindo logs de acesso e atividades realizadas</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Como Usamos suas Informações</h2>
          <p className="text-muted-foreground mb-4">
            Utilizamos suas informações pessoais para os seguintes propósitos:
          </p>
          <ul className="text-muted-foreground mb-4 list-disc list-inside">
            <li>Fornecer e manter o acesso ao sistema de controle de estoque</li>
            <li>Processar transações e gerenciar cobranças</li>
            <li>Enviar notificações importantes sobre sua conta e atividades</li>
            <li>Melhorar a segurança e prevenir fraudes</li>
            <li>Analisar o uso do sistema para melhorias técnicas e funcionais</li>
            <li>Cumprir obrigações legais e regulatórias</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Compartilhamento de Informações</h2>
          <p className="text-muted-foreground mb-4">
            A príncipio não é feito em hipótese alguma quaisquer compartilhamento de dados pessoais, não vendemos, alugamos ou comercializamos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes circunstâncias:
          </p>
          <ul className="text-muted-foreground mb-4 list-disc list-inside">
            <li>Com seu consentimento explícito</li>
            <li>Para cumprir obrigações legais ou ordens judiciais</li>
            <li>Para proteger direitos, propriedade ou segurança de usuários</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Segurança dos Dados</h2>
          <p className="text-muted-foreground mb-4">
            Implementamos medidas de segurança técnicas, administrativas e físicas robustas para proteger suas informações pessoais:
          </p>
          <ul className="text-muted-foreground mb-4 list-disc list-inside">
            <li>Criptografia de dados em trânsito e em repouso</li>
            <li>Controles de acesso rigorosos com autenticação multifator</li>
            <li>Monitoramento contínuo de segurança e detecção de ameaças</li>
            <li>Auditorias regulares de segurança</li>
            <li>Backups criptografados e planos de recuperação de desastres</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Retenção de Dados</h2>
          <p className="text-muted-foreground mb-4">
            Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, ou conforme exigido por lei. Dados de contas inativas podem ser retidos por até 5 anos para fins de auditoria e conformidade legal.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Seus Direitos</h2>
          <p className="text-muted-foreground mb-4">
            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
          </p>
          <ul className="text-muted-foreground mb-4 list-disc list-inside">
            <li><strong>Acesso:</strong> Solicitar uma cópia dos seus dados pessoais</li>
            <li><strong>Correção:</strong> Solicitar a correção de dados incompletos ou incorretos</li>
            <li><strong>Exclusão:</strong> Solicitar a exclusão dos seus dados pessoais</li>
            <li><strong>Portabilidade:</strong> Solicitar a transferência dos seus dados para outro fornecedor</li>
            <li><strong>Oposição:</strong> Opor-se ao processamento dos seus dados em certas circunstâncias</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Cookies e Tecnologias Similares</h2>
          <p className="text-muted-foreground mb-4">
            Utilizamos cookies e tecnologias similares para melhorar sua experiência no sistema. Você pode controlar o uso de cookies através das configurações do seu navegador, embora isso possa afetar algumas funcionalidades.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Menores de Idade</h2>
          <p className="text-muted-foreground mb-4">
            O sistema é destinado exclusivamente para pessoas maiores de idade. Não coletamos intencionalmente dados de menores de 18 anos. Se tomarmos conhecimento de tal coleta, excluiremos imediatamente os dados.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Alterações nesta Política</h2>
          <p className="text-muted-foreground mb-4">
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através do sistema ou por email. O uso continuado do sistema após alterações constitui aceitação da política atualizada.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Contato</h2>
          <p className="text-muted-foreground mb-4">
            Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato conosco através do sistema de suporte ou envie um email para o administrador responsável.
          </p>

          <p className="text-muted-foreground mt-6 text-sm">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  )
}
