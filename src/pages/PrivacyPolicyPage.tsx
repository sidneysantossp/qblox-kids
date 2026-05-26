import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Database, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent py-12 xl:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl xl:text-4xl font-bold text-white text-center mb-4">
            Política de Privacidade
          </h1>
          <p className="text-white/90 text-center max-w-2xl mx-auto">
            Sua privacidade é importante para nós. Conheça como coletamos, usamos e protegemos seus dados.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 xl:py-12 max-w-4xl">
        {/* Introdução */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              A <strong className="text-foreground">QBLOX</strong> está comprometida em proteger a privacidade
              e os dados pessoais de seus clientes. Esta Política de Privacidade descreve como coletamos, usamos,
              armazenamos e protegemos suas informações pessoais.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Última atualização:</strong> 22 de dezembro de 2025
            </p>
          </CardContent>
        </Card>

        {/* Coleta de Dados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              Informações que Coletamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Informações Fornecidas por Você</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Coletamos informações que você nos fornece diretamente ao:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Criar uma conta (nome, e-mail, senha, telefone)
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Realizar uma compra (endereço de entrega, dados de pagamento, CPF)
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Entrar em contato conosco (mensagens, reclamações, sugestões)
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Participar de promoções ou pesquisas
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Informações Coletadas Automaticamente</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Quando você acessa nosso site, coletamos automaticamente:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Endereço IP, tipo de navegador e sistema operacional
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Páginas visitadas, tempo de navegação e produtos visualizados
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Cookies e tecnologias similares para melhorar sua experiência
                  </p>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Uso dos Dados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-primary" />
              Como Usamos Suas Informações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Utilizamos suas informações pessoais para:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Processar pedidos:</strong>
                  <p className="text-sm text-muted-foreground">
                    Confirmar, processar e entregar seus pedidos, além de enviar atualizações sobre o status.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Comunicação:</strong>
                  <p className="text-sm text-muted-foreground">
                    Enviar e-mails sobre pedidos, promoções, novidades e atualizações (você pode cancelar a qualquer momento).
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Melhorar nossos serviços:</strong>
                  <p className="text-sm text-muted-foreground">
                    Analisar o comportamento de navegação para melhorar a experiência do usuário e personalizar ofertas.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Segurança:</strong>
                  <p className="text-sm text-muted-foreground">
                    Prevenir fraudes, proteger contra atividades maliciosas e garantir a segurança da plataforma.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Cumprimento legal:</strong>
                  <p className="text-sm text-muted-foreground">
                    Cumprir obrigações legais e regulatórias, como emissão de notas fiscais.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Compartilhamento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-primary" />
              Compartilhamento de Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing.
              Podemos compartilhar seus dados apenas nas seguintes situações:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Prestadores de serviços:</strong>
                  <p className="text-sm text-muted-foreground">
                    Empresas que nos auxiliam no processamento de pagamentos, entrega de produtos e envio de e-mails.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Obrigações legais:</strong>
                  <p className="text-sm text-muted-foreground">
                    Quando exigido por lei, ordem judicial ou autoridades governamentais.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Proteção de direitos:</strong>
                  <p className="text-sm text-muted-foreground">
                    Para proteger nossos direitos, propriedade ou segurança, bem como de nossos clientes.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-primary" />
              Segurança dos Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais
              contra acesso não autorizado, perda, destruição ou alteração:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Criptografia SSL/TLS para proteger dados durante a transmissão
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Armazenamento seguro de senhas com hash e salt
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Acesso restrito aos dados apenas para funcionários autorizados
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Monitoramento contínuo para detectar e prevenir atividades suspeitas
                </p>
              </li>
            </ul>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Importante:</strong> Nenhum sistema é 100% seguro. Embora tomemos todas as precauções,
                não podemos garantir a segurança absoluta das informações transmitidas pela internet.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Direitos do Usuário */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              Seus Direitos (LGPD)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Acesso:</strong>
                  <p className="text-sm text-muted-foreground">
                    Solicitar uma cópia dos dados pessoais que mantemos sobre você.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Correção:</strong>
                  <p className="text-sm text-muted-foreground">
                    Solicitar a correção de dados incompletos, inexatos ou desatualizados.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Exclusão:</strong>
                  <p className="text-sm text-muted-foreground">
                    Solicitar a exclusão de seus dados pessoais, exceto quando houver obrigação legal de retenção.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Portabilidade:</strong>
                  <p className="text-sm text-muted-foreground">
                    Solicitar a transferência de seus dados para outro fornecedor de serviço.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Revogação de consentimento:</strong>
                  <p className="text-sm text-muted-foreground">
                    Retirar seu consentimento para o tratamento de dados a qualquer momento.
                  </p>
                </div>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Para exercer seus direitos, entre em contato conosco através do e-mail{' '}
              <a href="mailto:privacidade@kidsblockstore.com" className="text-primary hover:underline">
                privacidade@kidsblockstore.com
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-primary" />
              Cookies e Tecnologias Similares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação:
            </p>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Cookies Essenciais</h3>
              <p className="text-sm text-muted-foreground">
                Necessários para o funcionamento básico do site, como manter você logado e processar pedidos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Cookies de Desempenho</h3>
              <p className="text-sm text-muted-foreground">
                Coletam informações sobre como você usa o site para nos ajudar a melhorar o desempenho.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Cookies de Marketing</h3>
              <p className="text-sm text-muted-foreground">
                Usados para exibir anúncios relevantes e medir a eficácia de campanhas publicitárias.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
            </p>
          </CardContent>
        </Card>

        {/* Retenção de Dados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Retenção de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades descritas
              nesta política, a menos que um período de retenção mais longo seja exigido por lei.
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Dados de pedidos: 5 anos (obrigação fiscal)
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Dados de conta: Enquanto a conta estiver ativa ou conforme necessário para fornecer serviços
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Dados de marketing: Até você cancelar a inscrição ou solicitar a exclusão
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Menores de Idade */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Privacidade de Menores de Idade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nossos serviços são destinados a adultos. Não coletamos intencionalmente informações pessoais de
              menores de 18 anos sem o consentimento dos pais ou responsáveis. Se você acredita que coletamos
              inadvertidamente dados de um menor, entre em contato conosco imediatamente.
            </p>
          </CardContent>
        </Card>

        {/* Alterações */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Alterações nesta Política</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas
              ou por outros motivos operacionais, legais ou regulatórios. Notificaremos você sobre alterações
              significativas por e-mail ou através de um aviso em nosso site. A data da última atualização será
              sempre indicada no topo desta página.
            </p>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-none">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-3">Dúvidas sobre Privacidade?</h3>
            <p className="text-muted-foreground mb-6">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados,
              entre em contato conosco:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>E-mail:</strong>{' '}
                <a href="mailto:privacidade@kidsblockstore.com" className="text-primary hover:underline">
                  privacidade@kidsblockstore.com
                </a>
              </p>
              <p>
                <strong>Formulario:</strong> use a Central de Ajuda para enviar sua solicitacao.
              </p>
              <p className="text-muted-foreground">
                R. Baronesa de Bela Vista, 411 - Vila Congonhas<br />
                São Paulo - SP, 04612-001
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
