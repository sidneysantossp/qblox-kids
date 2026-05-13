import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { supabase } from '@/db/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  button_text?: string;
  background_position_y?: number;
}

export function HeroBanner() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_banners')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(4);

        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          // Fallback para banner padrão
          setBanners([{
            id: 'default',
            title: 'COLECIONE. MONTE. AVENTURE-SE!',
            subtitle: 'MINIFIGURAS ÚNICAS PARA HISTÓRIAS INCRÍVEIS!',
            button_text: 'VER LANÇAMENTOS',
            link_url: '/categoria/lancamentos',
          }]);
        }
      } catch (error) {
        console.error('Erro ao carregar banners:', error);
        // Fallback para banner padrão em caso de erro
        setBanners([{
          id: 'default',
          title: 'COLECIONE. MONTE. AVENTURE-SE!',
          subtitle: 'MINIFIGURAS ÚNICAS PARA HISTÓRIAS INCRÍVEIS!',
          button_text: 'VER LANÇAMENTOS',
          link_url: '/categoria/lancamentos',
        }]);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentBanner = banners[currentIndex];
  const title = currentBanner?.title || 'COLECIONE. MONTE. AVENTURE-SE!';
  const subtitle = currentBanner?.subtitle || 'MINIFIGURAS ÚNICAS PARA HISTÓRIAS INCRÍVEIS!';
  const buttonText = currentBanner?.button_text || 'VER LANÇAMENTOS';
  const linkUrl = currentBanner?.link_url || '/categoria/lancamentos';

  const sanitizedTitle = useMemo(
    () =>
      DOMPurify.sanitize(title, {
        ALLOWED_TAGS: ['strong', 'br', 'p'],
        ALLOWED_ATTR: [],
      }),
    [title]
  );

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-[#0f172a]">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center min-h-[460px] md:min-h-[440px]">
            <div className="animate-pulse text-white text-2xl">Carregando...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#0f172a]">
      <style>{`
        .hero-banner-title p {
          margin: 0;
        }

        .hero-banner-title strong {
          color: #ffd200;
        }
      `}</style>
      {/* Background Image */}
      {currentBanner?.image_url && (
        <div className="absolute inset-0 transition-opacity duration-500">
          <img
            src={currentBanner.image_url}
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition: `center ${currentBanner.background_position_y ?? 50}%` }}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/30" />

      {/* Navigation Arrows - Desktop Only */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all group"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all group"
            aria-label="Próximo banner"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-center min-h-[460px] md:min-h-[440px] py-12 md:py-0">
          <div className="flex flex-col items-center text-center gap-6 z-10 max-w-3xl">
            <div
              className="hero-banner-title text-white font-extrabold leading-tight text-[32px] md:text-[52px]"
              dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
            />

            {/* Subheadline */}
            <div className="bg-[#E52421] text-white px-6 py-2.5 rounded-lg font-bold text-sm md:text-base">
              {subtitle}
            </div>

            {/* CTA Button */}
            <Link to={linkUrl}>
              <Button 
                size="lg"
                className="bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-extrabold text-sm md:text-base px-8 h-12 rounded-lg"
              >
                {buttonText}
              </Button>
            </Link>

            {banners.length > 1 && (
              <div className="flex items-center gap-2 mt-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-white w-8'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Ir para banner ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
