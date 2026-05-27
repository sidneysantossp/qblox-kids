import { BrickStoreProductCard } from './BrickStoreProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';

interface FeaturedProductsSectionProps {
  products: Product[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <section className="container mx-auto px-4 mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FFD200]" />
          <h2 className="text-[22px] font-bold text-foreground">Destaques da Semana</h2>
        </div>
        <Link
          to="/loja"
          className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
        >
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {products.map((product) => (
          <BrickStoreProductCard
            key={product.id}
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
            badge={product.is_bestseller ? 'MAIS VENDIDO' : product.is_on_sale ? 'OFERTA' : 'NOVO'}
            showCartControls={false}
            showTrustBadges={false}
            discount={
              product.original_price && product.original_price > product.price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
