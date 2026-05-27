import { HeroBanner } from '@/components/brickstore/HeroBanner';
import { CategoryStrip } from '@/components/brickstore/CategoryStrip';
import { PromoBenefits } from '@/components/brickstore/PromoBenefits';
import { FeaturedProductsSection } from '@/components/brickstore/FeaturedProductsSection';
import { BestsellersSection } from '@/components/brickstore/BestsellersSection';
import { FeaturedSection } from '@/components/brickstore/FeaturedSection';
import { PromotionsSection } from '@/components/brickstore/PromotionsSection';
import { FlashSaleSection } from '@/components/brickstore/FlashSaleSection';
import { LaunchesSection } from '@/components/brickstore/LaunchesSection';
import { ThematicBanners } from '@/components/brickstore/ThematicBanners';
import { TrustBenefits } from '@/components/brickstore/TrustBenefits';
import { TestimonialsSection } from '@/components/brickstore/TestimonialsSection';
import { WeeklyDeals } from '@/components/products/WeeklyDeals';
import { useEffect, useState } from 'react';
import { Clock, Truck } from 'lucide-react';
import { getBestsellerProducts, getFeaturedProducts, getLaunchProducts, getWeeklyDealsProducts } from '@/db/api';
import { getActiveHomepageSections } from '@/db/admin-api';
import type { HomepageSection, Product, SpecialHighlightConfig } from '@/types';

export default function BrickStoreHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [weeklyDealsProducts, setWeeklyDealsProducts] = useState<Product[]>([]);
  const [launchProducts, setLaunchProducts] = useState<Product[]>([]);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const [featuredProductsData, bestsellerProductsData, weeklyDealsData, launchProductsData, homepageSectionsData] = await Promise.all([
          getFeaturedProducts(8),
          getBestsellerProducts(8),
          getWeeklyDealsProducts(5),
          getLaunchProducts(8),
          getActiveHomepageSections(),
        ]);
        setFeaturedProducts(featuredProductsData);
        setBestsellerProducts(bestsellerProductsData);
        setWeeklyDealsProducts(weeklyDealsData);
        setLaunchProducts(launchProductsData);
        setHomepageSections(homepageSectionsData);
      } catch (error) {
        console.error('Erro ao carregar dados da home:', error);
      }
    };

    loadHomepageData();
  }, []);

  const renderHomepageSection = (section: HomepageSection) => {
    switch (section.section_type) {
      case 'category_carousel':
        return <CategoryStrip key={section.id} />;
      case 'featured_products':
        return <FeaturedProductsSection key={section.id} products={featuredProducts} />;
      case 'promotional_cards':
        return <PromoBenefits key={section.id} />;
      case 'on_sale':
        return <FlashSaleSection key={section.id} />;
      case 'best_sellers':
        return <BestsellersSection key={section.id} products={bestsellerProducts} />;
      case 'special_highlight':
        return (
          <FeaturedSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle || undefined}
            config={section.config as SpecialHighlightConfig}
          />
        );
      case 'thematic_collections':
        return <ThematicBanners key={section.id} title={section.title} subtitle={section.subtitle || undefined} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Hero Banner */}
      <HeroBanner />

      <div className="container mx-auto px-4 mt-4">
        <div className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 shadow-sm sm:flex-row sm:items-center sm:justify-center">
          <div className="flex items-center justify-center gap-2 font-extrabold">
            <Clock className="h-4 w-4" />
            <span>Compras até as 14h</span>
          </div>
          <div className="hidden h-4 w-px bg-emerald-300 sm:block" />
          <div className="flex items-center justify-center gap-2 font-semibold">
            <Truck className="h-4 w-4" />
            <span>Envio no mesmo dia</span>
          </div>
        </div>
      </div>

      {homepageSections.map(renderHomepageSection)}

      <WeeklyDeals products={weeklyDealsProducts} loading={false} />

      {/* Launches Section */}
      <LaunchesSection products={launchProducts} />

      {/* Trust Benefits */}
      <TrustBenefits />

      {/* Testimonials */}
      <TestimonialsSection />

    </div>
  );
}
