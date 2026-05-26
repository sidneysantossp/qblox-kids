import { CreditCard, Headset, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Compra segura',
    description: 'Ambiente protegido para comprar com tranquilidade.',
    color: 'text-[#0057D9]',
  },
  {
    icon: Truck,
    title: 'Envio com rastreio',
    description: 'Acompanhe seu pedido do envio ate a entrega.',
    color: 'text-[#FFD200]',
  },
  {
    icon: Headset,
    title: 'Atendimento por e-mail',
    description: 'Suporte organizado antes e depois da compra.',
    color: 'text-[#E52421]',
  },
  {
    icon: RotateCcw,
    title: 'Troca facil em 7 dias',
    description: 'Politica clara para trocar ou devolver.',
    color: 'text-[#0057D9]',
  },
  {
    icon: CreditCard,
    title: 'Pagamento seguro',
    description: 'Pix, boleto e cartao com dados protegidos.',
    color: 'text-[#4B1599]',
  },
];

export function TrustBenefits() {
  return (
    <section className="container mx-auto px-4 my-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="rounded-2xl p-6 text-center border border-slate-100/70 bg-transparent transition-colors"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 mb-4 ${benefit.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
