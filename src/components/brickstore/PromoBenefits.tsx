import Autoplay from 'embla-carousel-autoplay';
import { Truck, Percent, Package, Award } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const promoCards = [
  {
    icon: Truck,
    bg: 'bg-red-50',
    iconColor: 'text-[#E52421]',
    title: 'FRETE GRÁTIS',
    text: 'Em compras acima de R$199',
    subtext: 'Para todo o Brasil',
    textDark: true,
  },
  {
    icon: Percent,
    bg: 'bg-yellow-50',
    iconColor: 'text-[#B88A00]',
    title: '5% DE DESCONTO',
    text: 'No Pix ou Boleto',
    subtext: 'Aproveite agora!',
    textDark: true,
  },
  {
    icon: Package,
    bg: 'bg-blue-50',
    iconColor: 'text-[#0057D9]',
    title: 'KITS COLECIONÁVEIS',
    text: 'Monte seu mundo!',
    subtext: 'Kits exclusivos e limitados',
    textDark: true,
  },
  {
    icon: Award,
    bg: 'bg-slate-50',
    iconColor: 'text-[#061A33]',
    title: 'PROGRAMA VIP',
    text: 'Pontos, benefícios e',
    subtext: 'descontos especiais',
    textDark: true,
  },
];

export function PromoBenefits() {
  return (
    <div className="container mx-auto px-4 my-12">
      <div className="md:hidden">
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {promoCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <CarouselItem key={index} className="pl-3 basis-[86%]">
                  <div className="bg-[#F5F5F5] rounded-2xl p-5 flex items-center gap-4 border border-border">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-extrabold text-sm mb-0.5 text-[#111827]">{card.title}</h3>
                      <p className="text-xs font-medium text-[#111827]">{card.text}</p>
                      <p className="text-[10px] text-[#111827]/70">{card.subtext}</p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {promoCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-[#F5F5F5] rounded-2xl p-5 flex items-center gap-4 border border-border hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-sm mb-0.5 text-[#111827]">{card.title}</h3>
                <p className="text-xs font-medium text-[#111827]">{card.text}</p>
                <p className="text-[10px] text-[#111827]/70">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
