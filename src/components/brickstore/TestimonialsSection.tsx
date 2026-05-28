import Autoplay from 'embla-carousel-autoplay';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const testimonials = [
  {
    name: 'Mariana S.',
    city: 'Campinas, SP',
    rating: 5,
    text: 'Comprei achando que seria só mais um brinquedo, mas a qualidade surpreendeu. As peças chegaram bem embaladas, os personagens são lindos e meus filhos brincaram por horas.',
  },
  {
    name: 'Rafael M.',
    city: 'Curitiba, PR',
    rating: 5,
    text: 'Eu tinha receio de acabamento, mas os detalhes ficaram acima do que eu esperava. Para quem gosta de montar coleção com apelo visual, vale muito a pena.',
  },
  {
    name: 'Bianca A.',
    city: 'Belo Horizonte, MG',
    rating: 5,
    text: 'Precisava de um presente que chamasse atenção logo no primeiro olhar e acertei em cheio. A criança amou e o produto realmente parece mais premium do que o preço sugere.',
  },
  {
    name: 'Lucas P.',
    city: 'Guarulhos, SP',
    rating: 5,
    text: 'O checkout foi simples, consegui pagar por PIX sem dificuldade e o pedido apareceu certinho. Isso passa muita segurança para continuar comprando na loja.',
  },
  {
    name: 'Fernanda R.',
    city: 'Recife, PE',
    rating: 5,
    text: 'Os personagens de super-heróis têm um apelo visual muito forte. Foi fácil escolher, o catálogo é bem organizado e a navegação ajuda a comparar melhor antes de comprar.',
  },
  {
    name: 'Henrique C.',
    city: 'Porto Alegre, RS',
    rating: 5,
    text: 'Eu não conhecia a loja e mesmo assim consegui decidir rápido. Os guias ajudam bastante, a categoria faz sentido e os produtos ficam claros sem aquele monte de informação confusa.',
  },
  {
    name: 'Juliana T.',
    city: 'Salvador, BA',
    rating: 5,
    text: 'Além de bonitos, os produtos têm cara de coleção mesmo. A entrega foi tranquila e a experiência inteira me deixou confortável para voltar e comprar mais peças e kits.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="container mx-auto px-4 my-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-3">Quem compra, recomenda</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Depoimentos que ajudam a quebrar objeções de qualidade, confiança, presente, coleção e experiência de compra.</p>
      </div>

      <Carousel
        opts={{ align: 'start', loop: true }}
        plugins={[Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true })]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-4 basis-[88%] md:basis-1/2 xl:basis-1/3">
              <Card className="h-full border">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} className={`h-4 w-4 ${starIndex < testimonial.rating ? 'fill-[#FFD200] text-[#FFD200]' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground flex-1">“{testimonial.text}”</p>
                  <div className="mt-5 pt-4 border-t">
                    <p className="font-semibold text-sm">{testimonial.name} • {testimonial.city}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
