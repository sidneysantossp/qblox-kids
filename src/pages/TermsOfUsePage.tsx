import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShoppingCart, CreditCard, Ban, Scale, AlertCircle } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent py-12 xl:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl xl:text-4xl font-bold text-white text-center mb-4">
            Termos de Uso
          </h1>
          <p className="text-white/90 text-center max-w-2xl mx-auto">
            Leia atentamente os termos e condições de uso da nossa plataforma
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 xl:py-12 max-w-4xl">
        {/* Introdução */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              Bem-vindo à <strong className="text-foreground">QBLOX</strong>! Estes Termos de Uso estabelecem
              as condições gerais aplicáveis ao uso do nosso site e à compra de produtos. Ao acessar e utilizar
              nossos serviços, você concorda com estes termos.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Última atualização:</strong> 22 de dezembro de 2025
            </p>
          </CardContent>
        </Card>

        {/* Aceitação dos Termos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              Aceitação dos Termos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ao acessar e usar o site da QBLOX, você declara que:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Leu, compreendeu e concorda com estes Termos de Uso
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Tem capacidade legal para celebrar contratos vinculativos
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Fornecerá informações verdadeiras, precisas e completas
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Usará o site apenas para fins legais e de acordo com estes termos
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Cadastro e Conta */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cadastro e Conta de Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Para realizar compras, você precisa criar uma conta fornecendo informações precisas e atualizadas.
            </p>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Responsabilidades do Usuário:</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Manter a confidencialidade de sua senha e informações de login
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Garantir que todas as informações fornecidas sejam verdadeiras e atualizadas
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Ser responsável por todas as atividades realizadas em sua conta
                  </p>
                </li>
              </ul>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Atenção:</strong> Reservamo-nos o direito de suspender ou encerrar contas que violem
                estes termos ou que sejam usadas para atividades fraudulentas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Produtos e Preços */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Produtos e Preços
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Informações sobre Produtos</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Fazemos o possível para exibir informações precisas sobre nossos produtos, incluindo:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Descrições detalhadas e especificações técnicas
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Imagens ilustrativas (cores podem variar conforme o monitor)
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Preços atualizados e disponibilidade em estoque
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Preços e Pagamento</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Todos os preços estão em Reais (R$) e incluem impostos aplicáveis
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Reservamo-nos o direito de alterar preços sem aviso prévio
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Erros de preço serão corrigidos e você será notificado antes do envio
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    O preço válido é o exibido no momento da finalização do pedido
                  </p>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Pedidos e Pagamento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-primary" />
              Pedidos e Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Processo de Compra</h3>
              <ol className="space-y-2 ml-4 list-decimal list-inside">
                <li className="text-sm text-muted-foreground">
                  Adicione produtos ao carrinho e prossiga para o checkout
                </li>
                <li className="text-sm text-muted-foreground">
                  Forneça informações de entrega e escolha a forma de pagamento
                </li>
                <li className="text-sm text-muted-foreground">
                  Revise seu pedido e confirme a compra
                </li>
                <li className="text-sm text-muted-foreground">
                  Aguarde a confirmação do pagamento por e-mail
                </li>
                <li className="text-sm text-muted-foreground">
                  Acompanhe o status do pedido em "Meus Pedidos"
                </li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Confirmação e Cancelamento</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Ao finalizar um pedido, você receberá um e-mail de confirmação. Reservamo-nos o direito de:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Recusar ou cancelar pedidos por motivos como indisponibilidade de estoque, erros de preço
                    ou suspeita de fraude
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Limitar quantidades de produtos por pedido ou por cliente
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Solicitar informações adicionais para verificação de identidade
                  </p>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Entrega */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Entrega e Frete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Realizamos entregas para todo o Brasil através de transportadoras parceiras.
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Os prazos de entrega são estimados e podem variar conforme a região
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Frete grátis para compras acima de R$ 99,00
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Não nos responsabilizamos por atrasos causados por transportadoras ou eventos fora do nosso controle
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  É responsabilidade do cliente fornecer um endereço correto e completo
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Propriedade Intelectual */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-primary" />
              Propriedade Intelectual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Todo o conteúdo do site, incluindo textos, imagens, logotipos, gráficos, vídeos e software,
              é de propriedade da QBLOX ou de seus licenciadores e está protegido por leis de direitos autorais.
            </p>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Uso Permitido</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Você pode visualizar e imprimir conteúdo do site apenas para uso pessoal e não comercial.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Uso Proibido</h3>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Copiar, modificar, distribuir ou reproduzir qualquer conteúdo sem autorização
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Usar o conteúdo para fins comerciais ou publicitários
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    Remover avisos de direitos autorais ou marcas registradas
                  </p>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Conduta do Usuário */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Ban className="h-6 w-6 text-primary" />
              Conduta do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ao usar nosso site, você concorda em não:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 text-destructive shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Violar qualquer lei ou regulamento aplicável
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 text-destructive shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Usar o site para fins fraudulentos ou ilegais
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 text-destructive shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Transmitir vírus, malware ou qualquer código malicioso
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 text-destructive shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Interferir no funcionamento do site ou servidores
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 text-destructive shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Coletar informações de outros usuários sem consentimento
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Ban className="h-4 w-4 text-destructive shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Fazer engenharia reversa ou tentar acessar áreas restritas
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitação de Responsabilidade */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-primary" />
              Limitação de Responsabilidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Na máxima extensão permitida por lei, a QBLOX não será responsável por:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Danos indiretos, incidentais, especiais ou consequenciais
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Perda de lucros, dados ou oportunidades de negócio
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Interrupções ou erros no funcionamento do site
                </p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <p className="text-sm text-muted-foreground">
                  Ações de terceiros, incluindo transportadoras e processadores de pagamento
                </p>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Nossa responsabilidade total não excederá o valor pago pelo produto em questão.
            </p>
          </CardContent>
        </Card>

        {/* Lei Aplicável */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lei Aplicável e Foro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil.
            </p>
            <p className="text-muted-foreground">
              Qualquer disputa decorrente destes termos será submetida ao foro da comarca de São Paulo - SP,
              com exclusão de qualquer outro, por mais privilegiado que seja.
            </p>
          </CardContent>
        </Card>

        {/* Alterações */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Alterações nos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão
              em vigor imediatamente após a publicação no site. Recomendamos que você revise periodicamente esta
              página. O uso continuado do site após alterações constitui aceitação dos novos termos.
            </p>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-none">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-3">Dúvidas sobre os Termos?</h3>
            <p className="text-muted-foreground mb-6">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>E-mail:</strong>{' '}
                <a href="mailto:contato@kidsblockstore.com.br" className="text-primary hover:underline">
                  contato@kidsblockstore.com.br
                </a>
              </p>
              <p>
                <strong>Telefone:</strong> (11) 99638-4376
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
