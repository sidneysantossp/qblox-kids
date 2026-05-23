import Autoplay from 'embla-carousel-autoplay';
import type { Product } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BrickStoreProductCard, mapProductToBrickStoreProductCardProps } from './BrickStoreProductCard';

interface LaunchesSectionProps {
  products: Product[];
}

export function LaunchesSection({ products }: LaunchesSectionProps) {
  if (products.length === 0) {
    return null;
  }

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
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-[75%] sm:basis-[45%] md:basis-[32%] lg:basis-[25%]"
              >
                <BrickStoreProductCard {...mapProductToBrickStoreProductCardProps(product)} />
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
