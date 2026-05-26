import { CreditCard, Lock, MailCheck, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const items = [
  {
    title: 'Pagamento seguro',
    description: 'As formas de pagamento são processadas por provedores integrados ao checkout, com proteção dos dados da compra.',
    icon: CreditCard,
  },
  {
    title: 'Atualizações por e-mail',
    description: 'Você recebe informações importantes sobre o andamento do pedido no e-mail cadastrado.',
    icon: MailCheck,
  },
  {
    title: 'Envio com acompanhamento',
    description: 'Após a confirmação e preparação do pedido, a loja informa as etapas de envio disponíveis.',
    icon: Truck,
  },
  {
    title: 'Troca em até 7 dias',
    description: 'A política de troca e devolução orienta o cliente em caso de arrependimento, defeito ou divergência.',
    icon: PackageCheck,
  },
];

export default function SecurePurchasePage() {
  return (
    <>
      <SEO
        title="Compra Segura | QBLOX KIDS"
        description="Entenda os pontos de segurança da compra na QBLOX KIDS: pagamento, envio, atendimento e troca."
        keywords="compra segura, pagamento seguro, loja confiável, QBLOX KIDS"
      />

      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary via-secondary to-accent py-14 text-white">
          <div className="container mx-auto px-4 text-center">
            <ShieldCheck className="mx-auto mb-4 h-10 w-10" />
            <h1 className="mb-4 text-3xl font-bold xl:text-4xl">Compra Segura</h1>
            <p className="mx-auto max-w-2xl text-white/90">
              Reunimos aqui os principais pontos que ajudam você a comprar com clareza e confiança.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid gap-5 px-4 py-10 md:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <CardHeader>
                  <Icon className="mb-2 h-7 w-7 text-primary" />
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="container mx-auto px-4 pb-10">
          <Card className="bg-muted/40">
            <CardContent className="flex items-start gap-3 p-6 text-sm text-muted-foreground">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p>
                A QBLOX KIDS não solicita dados sensíveis fora do checkout. Para atendimento, use o e-mail oficial ou o formulário da Central de Ajuda.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
