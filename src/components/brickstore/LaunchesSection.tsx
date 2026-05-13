import { BrickStoreProductCard } from './BrickStoreProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const newProducts = [
  {
    id: 'new-1',
    name: 'Astronauta Neon',
    category: 'Série Espaço',
    price: 64.90,
    rating: 5,
    reviews: 23,
    badge: 'NOVO' as const,
    images: [],
  },
  {
    id: 'new-2',
    name: 'Piloto Radical',
    category: 'Série Cidade',
    price: 46.90,
    rating: 5,
    reviews: 18,
    badge: 'NOVO' as const,
    images: [],
  },
  {
    id: 'new-3',
    name: 'Samurai Flamejante',
    category: 'Série Colecionáveis',
    price: 74.90,
    rating: 5,
    reviews: 31,
    badge: 'NOVO' as const,
    images: [],
  },
  {
    id: 'new-4',
    name: 'Detetive Vintage',
    category: 'Série Aventura',
    price: 52.90,
    rating: 4,
    reviews: 15,
    badge: 'NOVO' as const,
    images: [],
  },
  {
    id: 'new-5',
    name: 'Mergulhadora Oceânica',
    category: 'Série Aventura',
    price: 57.90,
    rating: 5,
    reviews: 27,
    badge: 'NOVO' as const,
    images: [],
  },
  {
    id: 'new-6',
    name: 'Mecânico Turbo',
    category: 'Série Profissões',
    price: 41.90,
    rating: 4,
    reviews: 12,
    badge: 'NOVO' as const,
    images: [],
  },
];

export function LaunchesSection() {
  return (
    <section className="container mx-auto px-4 my-16">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-[28px] font-bold text-foreground mb-1">Lançamentos</h2>
        <p className="text-muted-foreground text-sm">
          Novas minifiguras que acabaram de chegar na QBLOX KIDS
        </p>
      </div>

      <div className="relative">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3500,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {newProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-[75%] sm:basis-[45%] md:basis-[32%] lg:basis-[25%]"
              >
                <BrickStoreProductCard {...product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden xl:flex -left-12 bg-white shadow-lg hover:bg-gray-100" />
          <CarouselNext className="hidden xl:flex -right-12 bg-white shadow-lg hover:bg-gray-100" />
        </Carousel>
      </div>
    </section>
  );
}
