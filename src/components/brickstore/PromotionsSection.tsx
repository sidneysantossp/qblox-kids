import { BrickStoreProductCard } from './BrickStoreProductCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getOnSaleProducts } from '@/db/api';
import type { Product } from '@/types';

export function PromotionsSection() {
  const [promotionalProducts, setPromotionalProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadPromotionalProducts = async () => {
      try {
        const data = await getOnSaleProducts(8);
        setPromotionalProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos em promoção:', error);
      }
    };

    loadPromotionalProducts();
  }, []);

  if (promotionalProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 my-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[28px] font-bold text-foreground mb-1">Promoções</h2>
          <p className="text-muted-foreground text-sm">
            Ofertas por tempo limitado para completar sua coleção
          </p>
        </div>
        <Link
          to="/ofertas-especiais"
          className="hidden md:flex text-sm font-semibold text-primary hover:text-primary/80 items-center gap-1"
        >
          Ver todas as ofertas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="relative">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {promotionalProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-[75%] sm:basis-[45%] md:basis-[32%] lg:basis-[25%]"
              >
                <BrickStoreProductCard
                  id={product.id}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  oldPrice={product.original_price || undefined}
                  rating={Math.round(product.rating || 0)}
                  reviews={product.reviews_count || 0}
                  sku={product.sku}
                  image={product.image_url}
                  images={product.images}
                  badge="OFERTA"
                  showCartControls={false}
                  showTrustBadges={false}
                  discount={
                    product.original_price && product.original_price > product.price
                      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                      : undefined
                  }
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden xl:flex -left-12 bg-white shadow-lg hover:bg-gray-100" />
          <CarouselNext className="hidden xl:flex -right-12 bg-white shadow-lg hover:bg-gray-100" />
        </Carousel>
      </div>

      <div className="md:hidden mt-6 text-center">
        <Link
          to="/ofertas-especiais"
          className="text-sm font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1"
        >
          Ver todas as ofertas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
