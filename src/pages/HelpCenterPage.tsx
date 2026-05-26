import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CreditCard, FileText, Mail, Package, Send, ShieldCheck, Truck } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';

const SUPPORT_EMAIL = 'contato@kidsblockstore.com.br';

export default function HelpCenterPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    orderNumber: '',
    message: '',
  });

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send_contact_email', {
        body: contactForm,
      });

      if (error) throw error;

      toast({
        title: 'Mensagem enviada',
        description: 'Recebemos sua solicitação e vamos responder por e-mail.',
      });

      setContactForm({
        name: '',
        email: '',
        orderNumber: '',
        message: '',
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem de contato:', error);
      toast({
        title: 'Não foi possível enviar',
        description: `Envie sua mensagem diretamente para ${SUPPORT_EMAIL}.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary via-secondary to-accent py-12 xl:py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-center text-3xl font-bold text-white xl:text-4xl">
            Central de Ajuda
          </h1>
          <p className="mx-auto max-w-2xl text-center text-white/90">
            Encontre respostas sobre pedidos, pagamentos, envio, trocas e atendimento.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">E-mail</h3>
              <p className="mb-2 text-sm text-muted-foreground">{SUPPORT_EMAIL}</p>
              <p className="text-xs text-muted-foreground">Resposta em até 24h</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 font-semibold">Formulário</h3>
              <p className="mb-2 text-sm text-muted-foreground">Envie sua dúvida pela página</p>
              <p className="text-xs text-muted-foreground">Inclua o número do pedido, se tiver</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold">Horário</h3>
              <p className="mb-2 text-sm text-muted-foreground">Segunda a sexta</p>
              <p className="text-xs text-muted-foreground">9h às 18h</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Enviar mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Nome</Label>
                <Input
                  id="contact-name"
                  value={contactForm.name}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">E-mail</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactForm.email}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contact-order">Número do pedido (opcional)</Label>
                <Input
                  id="contact-order"
                  value={contactForm.orderNumber}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, orderNumber: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contact-message">Mensagem</Label>
                <Textarea
                  id="contact-message"
                  rows={5}
                  value={contactForm.message}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="bg-[#FFD200] text-[#111827] hover:bg-[#F5C400]" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="orders">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 shrink-0 text-primary" />
                    <span>Como faço para acompanhar meu pedido?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Acesse sua conta em "Meus Pedidos". Após a confirmação do pagamento, você também receberá atualizações por e-mail.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 shrink-0 text-primary" />
                    <span>Qual o prazo de entrega?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  O prazo varia por região e começa após a confirmação do pagamento. O frete grátis é aplicado para compras acima de R$ 99,00.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payments">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 shrink-0 text-primary" />
                    <span>Quais formas de pagamento são aceitas?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Aceitamos Pix, boleto e cartão de crédito. As opções disponíveis aparecem durante o checkout.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="exchange">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                    <span>Como funciona a política de troca?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Você tem até 7 dias após o recebimento para solicitar troca ou devolução. Veja os detalhes na{' '}
                  <Link to="/politica-de-troca" className="text-primary hover:underline">
                    Política de Troca
                  </Link>
                  .
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
