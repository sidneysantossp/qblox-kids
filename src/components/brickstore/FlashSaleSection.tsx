import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { CountdownTimer } from '@/components/products/CountdownTimer';
import { getFlashSaleProducts } from '@/db/api';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

export function FlashSaleSection() {
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFlashSaleProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getFlashSaleProducts(5);
        setFlashSaleProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos em oferta relâmpago:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadFlashSaleProducts();
  }, []);

  if (!isLoading && flashSaleProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 my-16">
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#F44336] rounded-2xl p-6 xl:p-8">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-white mb-2">
              Ofertas Relâmpago ⚡
            </h2>
            <p className="text-white/90 text-lg">Aproveite antes que acabe!</p>
          </div>
          {flashSaleProducts.length > 0 && flashSaleProducts[0].flash_sale_end_time && (
            <CountdownTimer endTime={flashSaleProducts[0].flash_sale_end_time} />
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm h-[350px] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="xl:hidden">
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {flashSaleProducts.map((product) => (
                    <CarouselItem key={product.id} className="pl-4 basis-full">
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="hidden xl:grid grid-cols-5 gap-4">
              {flashSaleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        <div className="flex justify-center mt-6">
          <Link to="/ofertas-especiais" className="text-sm font-semibold text-white hover:text-white/80 transition-colors">
            Ver todas as ofertas
          </Link>
        </div>
      </div>
    </section>
  );
}
