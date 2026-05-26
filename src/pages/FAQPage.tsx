import { Link } from 'react-router-dom';
import { CreditCard, Package, ShieldCheck, Truck } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FAQPage() {
  return (
    <>
      <SEO
        title="Perguntas Frequentes | QBLOX KIDS"
        description="Respostas sobre pedidos, pagamentos, envio, trocas e atendimento da QBLOX KIDS."
        keywords="perguntas frequentes QBLOX, dúvidas pedidos, pagamento, envio, troca"
      />

      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary via-secondary to-accent py-14 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-3xl font-bold xl:text-4xl">Perguntas Frequentes</h1>
            <p className="mx-auto max-w-2xl text-white/90">
              As principais respostas para comprar com mais segurança na QBLOX KIDS.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <Card className="mx-auto max-w-4xl">
            <CardHeader>
              <CardTitle>Dúvidas comuns</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="orders">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3 text-left">
                      <Package className="h-5 w-5 text-primary" />
                      Como acompanho meu pedido?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    Acesse sua conta em "Meus Pedidos". Quando o status mudar, você também receberá atualizações por e-mail.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3 text-left">
                      <Truck className="h-5 w-5 text-primary" />
                      Como funciona o frete?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    O frete é calculado no carrinho conforme o endereço de entrega. Compras acima de R$ 99,00 podem receber frete grátis.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payments">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3 text-left">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Quais pagamentos são aceitos?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    As opções disponíveis aparecem no checkout, incluindo Pix, boleto e cartão quando habilitados para o pedido.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="exchange">
                  <AccordionTrigger>
                    <span className="flex items-center gap-3 text-left">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Posso trocar ou devolver?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    Sim. Consulte a <Link to="/politica-de-troca" className="text-primary hover:underline">Política de Troca</Link> para prazos, condições e orientações.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
