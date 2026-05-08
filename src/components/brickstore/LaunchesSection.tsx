import { BrickStoreProductCard } from './BrickStoreProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const newProducts = [
  {
    id: 'new-1',
    name: 'Astronauta Neon',
    category: 'Série Espaço',
    price: 64.90,
    rating: 5,
    reviews: 23,
    badge: 'NOVO' as const,
  },
  {
    id: 'new-2',
    name: 'Piloto Radical',
    category: 'Série Cidade',
    price: 46.90,
    rating: 5,
    reviews: 18,
    badge: 'NOVO' as const,
  },
  {
    id: 'new-3',
    name: 'Samurai Flamejante',
    category: 'Série Colecionáveis',
    price: 74.90,
    rating: 5,
    reviews: 31,
    badge: 'NOVO' as const,
  },
  {
    id: 'new-4',
    name: 'Detetive Vintage',
    category: 'Série Aventura',
    price: 52.90,
    rating: 4,
    reviews: 15,
    badge: 'NOVO' as const,
  },
  {
    id: 'new-5',
    name: 'Mergulhadora Oceânica',
    category: 'Série Aventura',
    price: 57.90,
    rating: 5,
    reviews: 27,
    badge: 'NOVO' as const,
  },
  {
    id: 'new-6',
    name: 'Mecânico Turbo',
    category: 'Série Profissões',
    price: 41.90,
    rating: 4,
    reviews: 12,
    badge: 'NOVO' as const,
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

      {/* Desktop - Grid with arrows */}
      <div className="hidden md:block relative">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {newProducts.map((product) => (
            <BrickStoreProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 rounded-full w-10 h-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 rounded-full w-10 h-10"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile - Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-4 pb-2">
          {newProducts.map((product) => (
            <div key={product.id} className="w-[160px] shrink-0">
              <BrickStoreProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
