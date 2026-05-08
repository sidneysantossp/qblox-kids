import { Truck, Percent, Package, Award } from 'lucide-react';

const promoCards = [
  {
    icon: Truck,
    bg: 'bg-[#E52421]',
    title: 'FRETE GRÁTIS',
    text: 'Em compras acima de R$199',
    subtext: 'Para todo o Brasil',
  },
  {
    icon: Percent,
    bg: 'bg-[#FFD200]',
    title: '5% DE DESCONTO',
    text: 'No Pix ou Boleto',
    subtext: 'Aproveite agora!',
    textDark: true,
  },
  {
    icon: Package,
    bg: 'bg-[#0057D9]',
    title: 'KITS COLECIONÁVEIS',
    text: 'Monte seu mundo!',
    subtext: 'Kits exclusivos e limitados',
  },
  {
    icon: Award,
    bg: 'bg-[#061A33]',
    title: 'PROGRAMA VIP',
    text: 'Pontos, benefícios e',
    subtext: 'descontos especiais',
  },
];

export function PromoBenefits() {
  return (
    <div className="container mx-auto px-4 my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {promoCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.bg} rounded-2xl p-5 flex items-center gap-4 hover:scale-105 transition-transform duration-200 cursor-pointer`}
            >
              <Icon className={`w-10 h-10 shrink-0 ${card.textDark ? 'text-[#111827]' : 'text-white'}`} />
              <div className="flex flex-col">
                <h3 className={`font-extrabold text-sm mb-0.5 ${card.textDark ? 'text-[#111827]' : 'text-white'}`}>
                  {card.title}
                </h3>
                <p className={`text-xs font-medium ${card.textDark ? 'text-[#111827]' : 'text-white'}`}>
                  {card.text}
                </p>
                <p className={`text-[10px] ${card.textDark ? 'text-[#111827]/80' : 'text-white/80'}`}>
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
