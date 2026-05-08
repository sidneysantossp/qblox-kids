import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, Phone, MessageCircle, Package, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent py-12 xl:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl xl:text-4xl font-bold text-white text-center mb-4">
            Central de Ajuda
          </h1>
          <p className="text-white/90 text-center max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais frequentes sobre nossos produtos e serviços
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 xl:py-12">
        {/* Contato Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Telefone</h3>
              <p className="text-sm text-muted-foreground mb-2">(11) 99638-4376</p>
              <p className="text-xs text-muted-foreground">Seg-Sex: 9h às 18h</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">E-mail</h3>
              <p className="text-sm text-muted-foreground mb-2">contato@kidsblockstore.com.br</p>
              <p className="text-xs text-muted-foreground">Resposta em até 24h</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-2">(11) 99638-4376</p>
              <p className="text-xs text-muted-foreground">Atendimento rápido</p>
            </CardContent>
          </Card>
        </div>

        {/* Perguntas Frequentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* Pedidos */}
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary shrink-0" />
                    <span>Como faço para acompanhar meu pedido?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-3">
                    Você pode acompanhar seu pedido de duas formas:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Acesse sua conta e vá em "Meus Pedidos"</li>
                    <li>Utilize o código de rastreamento enviado por e-mail</li>
                  </ol>
                  <p className="mt-3">
                    Após a confirmação do pagamento, você receberá atualizações sobre o status do seu pedido por e-mail.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary shrink-0" />
                    <span>Qual o prazo de entrega?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-3">Os prazos de entrega variam conforme sua região:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Capitais:</strong> 3 a 5 dias úteis</li>
                    <li><strong>Região Metropolitana:</strong> 5 a 7 dias úteis</li>
                    <li><strong>Interior:</strong> 7 a 12 dias úteis</li>
                  </ul>
                  <p className="mt-3">
                    O prazo começa a contar após a confirmação do pagamento. Frete grátis para compras acima de R$ 99,00.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary shrink-0" />
                    <span>Quais formas de pagamento são aceitas?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-3">Aceitamos as seguintes formas de pagamento:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Cartão de Crédito:</strong> Visa, Mastercard, Elo, American Express (parcelamento em até 12x)</li>
                    <li><strong>PIX:</strong> Pagamento instantâneo com desconto de 5%</li>
                    <li><strong>Boleto Bancário:</strong> Vencimento em 3 dias úteis</li>
                    <li><strong>Dinheiro:</strong> Pagamento na entrega (consulte disponibilidade)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <span>Os produtos têm garantia?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-3">
                    Sim! Todos os nossos produtos possuem garantia de qualidade:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Garantia do fabricante:</strong> 90 dias contra defeitos de fabricação</li>
                    <li><strong>Garantia da loja:</strong> 7 dias para troca ou devolução (produto sem uso)</li>
                    <li><strong>Peças faltantes:</strong> Reposição gratuita em até 15 dias</li>
                  </ul>
                  <p className="mt-3">
                    Para acionar a garantia, entre em contato com nossa central de atendimento.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary shrink-0" />
                    <span>Como funciona a política de troca?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-3">
                    Você tem até 7 dias após o recebimento para solicitar a troca ou devolução do produto.
                  </p>
                  <p className="mb-3">
                    <strong>Condições para troca:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Produto sem uso e na embalagem original</li>
                    <li>Todos os acessórios e manuais inclusos</li>
                    <li>Nota fiscal do pedido</li>
                  </ul>
                  <p className="mt-3">
                    Para mais detalhes, consulte nossa{' '}
                    <Link to="/politica-de-troca" className="text-primary hover:underline">
                      Política de Troca
                    </Link>
                    .
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary shrink-0" />
                    <span>Posso cancelar meu pedido?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-3">
                    Sim, você pode cancelar seu pedido antes do envio. Para isso:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Acesse "Meus Pedidos" na sua conta</li>
                    <li>Selecione o pedido que deseja cancelar</li>
                    <li>Clique em "Cancelar Pedido"</li>
                  </ol>
                  <p className="mt-3">
                    Se o pedido já foi enviado, você precisará recusá-lo na entrega ou solicitar a devolução após o recebimento.
                    O reembolso será processado em até 7 dias úteis.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <span>Os produtos são originais?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-3">
                    Sim! Trabalhamos apenas com produtos de alta qualidade. Nossos bonecos de montar são compatíveis
                    com as principais marcas do mercado e passam por rigoroso controle de qualidade.
                  </p>
                  <p>
                    Todos os produtos possuem certificação de segurança e são adequados para a faixa etária indicada.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary shrink-0" />
                    <span>Como funciona o frete grátis?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="mb-3">
                    Oferecemos frete grátis para todo o Brasil em compras acima de R$ 99,00.
                  </p>
                  <p className="mb-3">
                    <strong>Importante:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>O desconto é aplicado automaticamente no carrinho</li>
                    <li>Válido para todos os produtos da loja</li>
                    <li>Não acumulativo com outras promoções de frete</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Ainda tem dúvidas? */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-none">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-3">Ainda tem dúvidas?</h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para ajudar você!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contato@kidsblockstore.com.br"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-5 w-5" />
                Enviar E-mail
              </a>
              <a
                href="https://wa.me/5511996384376"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
