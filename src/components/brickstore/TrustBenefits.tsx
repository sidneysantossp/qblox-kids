import { Lock, Truck, Star, Headset } from 'lucide-react';

const benefits = [
  {
    icon: Lock,
    title: 'Compra 100% segura',
    description: 'Seus dados protegidos em todas as etapas.',
    color: 'text-[#0057D9]',
  },
  {
    icon: Truck,
    title: 'Envio para todo o Brasil',
    description: 'Receba seus bonecos no conforto da sua casa.',
    color: 'text-[#FFD200]',
  },
  {
    icon: Star,
    title: 'Produtos selecionados',
    description: 'Minifiguras escolhidas com padrão de qualidade.',
    color: 'text-[#E52421]',
  },
  {
    icon: Headset,
    title: 'Atendimento especializado',
    description: 'Suporte para ajudar antes e depois da compra.',
    color: 'text-[#0057D9]',
  },
];

export function TrustBenefits() {
  return (
    <section className="container mx-auto px-4 my-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4 ${benefit.color}`}>
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
