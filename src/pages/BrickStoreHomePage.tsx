import { HeroBanner } from '@/components/brickstore/HeroBanner';
import { CategoryStrip } from '@/components/brickstore/CategoryStrip';
import { PromoBenefits } from '@/components/brickstore/PromoBenefits';
import { FeaturedProductsSection } from '@/components/brickstore/FeaturedProductsSection';
import { BestsellersSection } from '@/components/brickstore/BestsellersSection';
import { FeaturedSection } from '@/components/brickstore/FeaturedSection';
import { PromotionsSection } from '@/components/brickstore/PromotionsSection';
import { LaunchesSection } from '@/components/brickstore/LaunchesSection';
import { ThematicBanners } from '@/components/brickstore/ThematicBanners';
import { TrustBenefits } from '@/components/brickstore/TrustBenefits';
import { Newsletter } from '@/components/brickstore/Newsletter';
import { useEffect, useState } from 'react';
import { getBestsellerProducts, getFeaturedProducts } from '@/db/api';
import { getActiveHomepageSections } from '@/db/admin-api';
import type { HomepageSection, Product } from '@/types';

export default function BrickStoreHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const [featuredProductsData, bestsellerProductsData, homepageSectionsData] = await Promise.all([
          getFeaturedProducts(8),
          getBestsellerProducts(8),
          getActiveHomepageSections(),
        ]);
        setFeaturedProducts(featuredProductsData);
        setBestsellerProducts(bestsellerProductsData);
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
        return <PromotionsSection key={section.id} />;
      case 'best_sellers':
        return <BestsellersSection key={section.id} products={bestsellerProducts} />;
      case 'special_highlight':
        return (
          <FeaturedSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle || undefined}
            config={section.config}
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

      {homepageSections.map(renderHomepageSection)}

      {/* Launches Section */}
      <LaunchesSection />

      {/* Trust Benefits */}
      <TrustBenefits />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
