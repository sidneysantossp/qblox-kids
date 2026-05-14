import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllCategories } from '@/db/admin-api';
import type { Category } from '@/types';
import { Shield, Compass, Rocket, Building2, Star, Hammer, Anchor, Briefcase } from 'lucide-react';
import { getCategoryPath } from '@/lib/urls';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// Fallback icons
const iconMap: Record<string, typeof Shield> = {
  'super-herois': Shield,
  'aventura': Compass,
  'espaco': Rocket,
  'cidade': Building2,
  'colecionaveis': Star,
  'construcao': Hammer,
  'piratas': Anchor,
  'profissoes': Briefcase,
};

const colorMap: Record<string, string> = {
  'super-herois': 'bg-blue-500',
  'aventura': 'bg-green-500',
  'espaco': 'bg-purple-500',
  'cidade': 'bg-sky-400',
  'colecionaveis': 'bg-orange-500',
  'construcao': 'bg-red-500',
  'piratas': 'bg-teal-500',
  'profissoes': 'bg-yellow-500',
};

export function CategoryStrip() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        // Filter active categories and sort by display_order
        const activeCategories = data
          .filter(cat => cat.is_active)
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        setCategories(activeCategories);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 mt-6 md:mt-8 relative z-10">
        <div className="p-2 md:p-4">
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-6 md:mt-8 relative z-10">
      <div className="p-2 md:p-4">
        {/* Desktop - Carousel */}
        <div className="hidden md:block">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              slidesToScroll: 1,
            }}
            plugins={[
              Autoplay({
                delay: 3200,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }) as any,
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {categories.map((category) => {
                const Icon = iconMap[category.slug] || Star;
                const colorClass = colorMap[category.slug] || 'bg-gray-500';

                return (
                  <CarouselItem key={category.id} className="pl-6 basis-1/4 lg:basis-1/6">
                    <Link
                      to={getCategoryPath(category.slug)}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div className={`w-24 h-24 xl:w-28 xl:h-28 ${colorClass} rounded-full flex items-center justify-center text-white transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl overflow-hidden`}>
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : category.icon ? (
                          <span className="text-3xl leading-none">{category.icon}</span>
                        ) : (
                          <Icon className="w-10 h-10 xl:w-12 xl:h-12" />
                        )}
                      </div>
                      <span className="text-sm xl:text-base font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Mobile - Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-5 px-5">
          <div className="flex gap-6 pb-2">
            {categories.map((category) => {
              const Icon = iconMap[category.slug] || Star;
              const colorClass = colorMap[category.slug] || 'bg-gray-500';
              
              return (
                <Link
                  key={category.id}
                  to={getCategoryPath(category.slug)}
                  className="flex flex-col items-center gap-2 shrink-0"
                >
                  <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center text-white overflow-hidden`}>
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : category.icon ? (
                      <span className="text-2xl leading-none">{category.icon}</span>
                    ) : (
                      <Icon className="w-7 h-7" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-center text-foreground whitespace-nowrap">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
