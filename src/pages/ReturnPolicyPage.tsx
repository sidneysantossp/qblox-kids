import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle, Package, Clock, FileText } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent py-12 xl:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl xl:text-4xl font-bold text-white text-center mb-4">
            Política de Troca e Devolução
          </h1>
          <p className="text-white/90 text-center max-w-2xl mx-auto">
            Sua satisfação é nossa prioridade. Conheça nossos termos de troca e devolução.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 xl:py-12 max-w-4xl">
        {/* Prazo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              Prazo para Troca e Devolução
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              De acordo com o Código de Defesa do Consumidor (CDC), você tem o direito de desistir da compra
              em até <strong className="text-foreground">7 dias corridos</strong> após o recebimento do produto,
              sem necessidade de justificativa.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>Importante:</strong> O prazo de 7 dias começa a contar a partir da data de recebimento
                do produto, conforme comprovante de entrega.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Condições para Troca */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary" />
              Condições para Troca ou Devolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Para que a troca ou devolução seja aceita, o produto deve atender aos seguintes requisitos:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Produto sem uso:</strong>
                  <p className="text-sm text-muted-foreground">
                    O produto não pode ter sido montado, usado ou apresentar sinais de manuseio.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Embalagem original:</strong>
                  <p className="text-sm text-muted-foreground">
                    O produto deve estar na embalagem original, sem violação ou danos.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Acessórios completos:</strong>
                  <p className="text-sm text-muted-foreground">
                    Todos os acessórios, manuais e brindes devem estar inclusos.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Nota fiscal:</strong>
                  <p className="text-sm text-muted-foreground">
                    É necessário apresentar a nota fiscal do pedido.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Como Solicitar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              Como Solicitar a Troca ou Devolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Para solicitar a troca ou devolução, siga os passos abaixo:
            </p>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-foreground">Entre em contato:</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Envie um e-mail para <a href="mailto:contato@kidsblockstore.com.br" className="text-primary hover:underline">contato@kidsblockstore.com.br</a>
                    ou use o formulario da <Link to="/central-de-ajuda" className="text-primary hover:underline">Central de Ajuda</Link>.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-foreground">Informe os dados:</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Número do pedido, motivo da troca/devolução e fotos do produto (se aplicável).
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-foreground">Aguarde a autorização:</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nossa equipe analisará sua solicitação e enviará as instruções para devolução em até 24 horas.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                  4
                </span>
                <div>
                  <strong className="text-foreground">Envie o produto:</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Após a autorização, envie o produto para o endereço indicado. O frete de devolução é por nossa conta
                    em casos de defeito ou erro no envio.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                  5
                </span>
                <div>
                  <strong className="text-foreground">Receba o reembolso ou novo produto:</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Após recebermos e analisarmos o produto, processaremos o reembolso ou enviaremos o novo produto
                    em até 7 dias úteis.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Casos Especiais */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-primary" />
              Casos Especiais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Produto com Defeito</h3>
              <p className="text-sm text-muted-foreground">
                Se o produto apresentar defeito de fabricação, você tem até <strong>90 dias</strong> para solicitar
                a troca. Neste caso, o frete de devolução é por nossa conta e o prazo de análise é de até 30 dias.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Produto Errado ou Danificado</h3>
              <p className="text-sm text-muted-foreground">
                Se você recebeu um produto diferente do pedido ou danificado durante o transporte, entre em contato
                imediatamente. Faremos a troca sem custos adicionais e com prioridade no envio.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Peças Faltantes</h3>
              <p className="text-sm text-muted-foreground">
                Caso identifique peças faltantes no produto, entre em contato em até 15 dias após o recebimento.
                Enviaremos as peças gratuitamente sem necessidade de devolução do produto.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Não Aceitamos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-destructive" />
              Quando Não Aceitamos Troca ou Devolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Não será possível realizar a troca ou devolução nos seguintes casos:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Produtos com sinais de uso, montagem ou manuseio inadequado
                </p>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Embalagem violada, danificada ou sem as etiquetas originais
                </p>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Produtos sem acessórios, manuais ou itens que acompanham o produto
                </p>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Solicitações fora do prazo de 7 dias (exceto defeitos de fabricação)
                </p>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Produtos danificados por mau uso ou armazenamento inadequado
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Reembolso */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              Reembolso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              O reembolso será processado de acordo com a forma de pagamento utilizada na compra:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Cartão de Crédito:</strong>
                  <p className="text-sm text-muted-foreground">
                    O estorno será realizado em até 2 faturas após a aprovação da devolução.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">PIX ou Boleto:</strong>
                  <p className="text-sm text-muted-foreground">
                    O reembolso será feito via transferência bancária em até 7 dias úteis após a aprovação.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <strong className="text-foreground">Dinheiro:</strong>
                  <p className="text-sm text-muted-foreground">
                    O reembolso será feito via transferência bancária ou PIX em até 7 dias úteis.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-none">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-3">Precisa de Ajuda?</h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para auxiliar você no processo de troca ou devolução.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contato@kidsblockstore.com.br"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                E-mail: contato@kidsblockstore.com.br
              </a>
              <Link
                to="/central-de-ajuda"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Enviar formulario
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
