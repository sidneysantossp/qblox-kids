import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { WeeklyDealsCard } from './WeeklyDealsCard';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface WeeklyDealsProps {
  products: Product[];
  loading?: boolean;
}

export function WeeklyDeals({ products, loading = false }: WeeklyDealsProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 xl:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-left mb-8 text-black">
            Séries da TV
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="aspect-square w-full bg-muted" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                  <Skeleton className="h-8 w-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 xl:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-left mb-8 text-black">
          Séries da TV
        </h2>
        
        <div className="relative">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {products.slice(0, 5).map((product) => (
                <CarouselItem 
                  key={product.id} 
                  className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <WeeklyDealsCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden xl:flex -left-12 bg-white shadow-lg hover:bg-gray-100" />
            <CarouselNext className="hidden xl:flex -right-12 bg-white shadow-lg hover:bg-gray-100" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
