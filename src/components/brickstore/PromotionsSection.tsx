import { BrickStoreProductCard } from './BrickStoreProductCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const promotionalProducts = [
  {
    id: 'promo-1',
    name: 'Robô Explorador',
    category: 'Série Espaço',
    price: 49.90,
    oldPrice: 69.90,
    rating: 5,
    reviews: 82,
    badge: 'OFERTA' as const,
    discount: 29,
  },
  {
    id: 'promo-2',
    name: 'Pirata dos Sete Mares',
    category: 'Série Piratas',
    price: 44.90,
    oldPrice: 59.90,
    rating: 5,
    reviews: 67,
    badge: 'OFERTA' as const,
    discount: 25,
  },
  {
    id: 'promo-3',
    name: 'Engenheira Criativa',
    category: 'Série Profissões',
    price: 39.90,
    oldPrice: 54.90,
    rating: 4,
    reviews: 54,
    badge: 'OFERTA' as const,
    discount: 27,
  },
  {
    id: 'promo-4',
    name: 'Cavaleiro Medieval',
    category: 'Série Colecionáveis',
    price: 59.90,
    oldPrice: 79.90,
    rating: 5,
    reviews: 91,
    badge: 'OFERTA' as const,
    discount: 25,
  },
];

export function PromotionsSection() {
  return (
    <section className="container mx-auto px-4 my-16">
      {/* Section Title */}
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

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {promotionalProducts.map((product) => (
          <BrickStoreProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Mobile "Ver todas" link */}
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
