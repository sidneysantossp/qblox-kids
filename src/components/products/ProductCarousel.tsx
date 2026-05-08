import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

interface ProductCarouselProps {
  products: Product[];
  title?: string;
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl xl:text-3xl font-bold mb-6 text-center">{title}</h2>
      )}
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 xl:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 xl:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden xl:flex" />
        <CarouselNext className="hidden xl:flex" />
      </Carousel>
    </div>
  );
}
