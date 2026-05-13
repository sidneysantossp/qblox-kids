import { useRef, useState, useEffect } from 'react';
import { HeroCard } from './HeroCard';
import { FeaturedProductCard, FeaturedProduct } from './FeaturedProductCard';
import { CarouselNavButton } from './CarouselNavButton';

interface FeaturedCarouselSectionProps {
  title: React.ReactNode;
  heroCard: {
    eyebrow: string;
    title: string;
    image: string;
  };
  products: FeaturedProduct[];
}

export function FeaturedCarouselSection({ title, heroCard, products }: FeaturedCarouselSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoScrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollToNext = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 300; // Largura aproximada do card + gap
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    // Loop logic - volta pro início quando chega no fim
    if (scrollLeft >= maxScroll - 10) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  const scrollTo = (direction: 'prev' | 'next') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 300; // Largura aproximada do card + gap
    const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    // Loop logic
    if (direction === 'next' && scrollLeft >= maxScroll - 10) {
      // Chegou no fim, volta pro início
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction === 'prev' && scrollLeft <= 10) {
      // Chegou no início, vai pro fim
      container.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      // Scroll normal
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollTo('prev');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollTo('next');
    }
  };

  // Auto-scroll em todos os dispositivos
  useEffect(() => {
    // Inicia auto-scroll
    const intervalId = setInterval(() => {
      scrollToNext();
    }, 3000); // Rola a cada 3 segundos

    autoScrollIntervalRef.current = intervalId;

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <section
      className="py-12 xl:py-16 bg-[#f5f5f7]"
      aria-label="Seleção em destaque"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="mb-8 xl:mb-10">
          {title}
        </div>

        {/* Carrossel */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 xl:gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Hero Card (fixo) */}
            <HeroCard {...heroCard} />

            {/* Product Cards (rolam) */}
            {products.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Botões de navegação */}
          <CarouselNavButton
            direction="prev"
            onClick={() => scrollTo('prev')}
            visible={canScrollLeft}
          />
          <CarouselNavButton
            direction="next"
            onClick={() => scrollTo('next')}
            visible={canScrollRight}
          />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
