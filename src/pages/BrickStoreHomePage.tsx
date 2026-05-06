import { HeroBanner } from '@/components/brickstore/HeroBanner';
import { CategoryStrip } from '@/components/brickstore/CategoryStrip';
import { FilterSidebar } from '@/components/brickstore/FilterSidebar';
import { BrickStoreProductCard } from '@/components/brickstore/BrickStoreProductCard';
import { PromoBenefits } from '@/components/brickstore/PromoBenefits';
import { FeaturedSection } from '@/components/brickstore/FeaturedSection';
import { PromotionsSection } from '@/components/brickstore/PromotionsSection';
import { LaunchesSection } from '@/components/brickstore/LaunchesSection';
import { ThematicBanners } from '@/components/brickstore/ThematicBanners';
import { TrustBenefits } from '@/components/brickstore/TrustBenefits';
import { Newsletter } from '@/components/brickstore/Newsletter';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock products data
const featuredProducts = [
  { id: '1', name: 'Agente Tático', category: 'Série Cidade', price: 49.90, rating: 5, reviews: 124, badge: 'MAIS VENDIDO' as const },
  { id: '2', name: 'Arqueiro da Floresta', category: 'Série Aventura', price: 39.90, rating: 5, reviews: 96, badge: 'NOVO' as const },
  { id: '3', name: 'Exploradora Estelar', category: 'Série Espaço', price: 42.90, rating: 5, reviews: 77, badge: 'NOVO' as const },
  { id: '4', name: 'Bombeiro Urbano', category: 'Série Cidade', price: 44.90, rating: 5, reviews: 112, badge: 'MAIS VENDIDO' as const },
  { id: '5', name: 'Capitão dos Mares', category: 'Série Piratas', price: 54.90, rating: 5, reviews: 68, badge: 'NOVO' as const },
  { id: '6', name: 'Guardião Dourado', category: 'Série Colecionáveis', price: 59.90, rating: 5, reviews: 90, badge: 'MAIS VENDIDO' as const },
  { id: '7', name: 'Cientista Maluco', category: 'Série Profissões', price: 34.90, rating: 4, reviews: 45, badge: 'NOVO' as const },
  { id: '8', name: 'Construtor Master', category: 'Série Construção', price: 37.90, rating: 5, reviews: 53, badge: 'NOVO' as const },
];

export default function BrickStoreHomePage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Strip */}
      <CategoryStrip />

      {/* Main Content - Destaques da Semana */}
      <section className="container mx-auto px-4 mt-12">
        {/* Section Title */}
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

        {/* Grid Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar - Desktop only */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {featuredProducts.map((product) => (
              <BrickStoreProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Benefits */}
      <PromoBenefits />

      {/* Featured Section */}
      <FeaturedSection />

      {/* Promotions Section */}
      <PromotionsSection />

      {/* Launches Section */}
      <LaunchesSection />

      {/* Thematic Banners */}
      <ThematicBanners />

      {/* Trust Benefits */}
      <TrustBenefits />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
