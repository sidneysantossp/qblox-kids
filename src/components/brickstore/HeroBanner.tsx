import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  button_text?: string;
}

export function HeroBanner() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        console.log('🎯 Carregando banners...');
        const { data, error } = await supabase
          .from('hero_banners')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(4);

        if (error) {
          console.error('❌ Erro ao carregar banners:', error);
          throw error;
        }
        
        console.log('✅ Banners carregados:', data);
        
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
        console.error('❌ Erro ao carregar banners (catch):', error);
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

  // Auto-play carrossel
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Muda a cada 5 segundos

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

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-[#0057D9] to-[#003A99] overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center min-h-[420px] md:min-h-[380px]">
            <div className="animate-pulse text-white text-2xl">Carregando...</div>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];
  const title = currentBanner?.title || 'COLECIONE. MONTE. AVENTURE-SE!';
  const subtitle = currentBanner?.subtitle || 'MINIFIGURAS ÚNICAS PARA HISTÓRIAS INCRÍVEIS!';
  const buttonText = currentBanner?.button_text || 'VER LANÇAMENTOS';
  const linkUrl = currentBanner?.link_url || '/categoria/lancamentos';

  // Parse title for styling (split by periods)
  const titleParts = title.split('.').filter(part => part.trim());

  return (
    <section className="relative bg-gradient-to-br from-[#0057D9] to-[#003A99] overflow-hidden">
      {/* Background Image */}
      {currentBanner?.image_url && (
        <div className="absolute inset-0 transition-opacity duration-500">
          <img
            src={currentBanner.image_url}
            alt={title}
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-16 h-16 bg-[#FFD200] rounded-lg rotate-12" />
        <div className="absolute top-20 right-20 w-12 h-12 bg-[#FFD200] rounded-lg -rotate-6" />
        <div className="absolute bottom-20 left-1/4 w-14 h-14 bg-[#FFD200] rounded-lg rotate-45" />
        <div className="absolute bottom-10 right-1/3 w-10 h-10 bg-[#FFD200] rounded-lg -rotate-12" />
        <div className="absolute top-1/2 right-10 w-8 h-8 bg-[#FFD200] rounded-lg rotate-6" />
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />

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
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[420px] md:min-h-[380px] py-12 md:py-0 gap-8">
          {/* Left minifigures placeholder */}
          <div className="hidden lg:flex items-end gap-2 shrink-0">
            <div className="w-24 h-32 bg-white/10 rounded-lg backdrop-blur-sm" />
            <div className="w-24 h-36 bg-white/10 rounded-lg backdrop-blur-sm" />
          </div>

          {/* Center content */}
          <div className="flex flex-col items-center text-center gap-6 z-10">
            {/* Main text */}
            <div className="flex flex-col items-center">
              <h1 className="text-white font-extrabold leading-none drop-shadow-[0_4px_8px_rgba(6,26,51,0.5)]">
                {titleParts.map((part, index) => {
                  const isMiddle = titleParts.length === 3 && index === 1;
                  return (
                    <div
                      key={index}
                      className={`${
                        isMiddle
                          ? 'text-[48px] md:text-[68px] text-[#FFD200] my-1'
                          : index === 0
                          ? 'text-[32px] md:text-[44px]'
                          : 'text-[36px] md:text-[48px]'
                      }`}
                    >
                      {part.trim()}.
                    </div>
                  );
                })}
              </h1>
            </div>

            {/* Subheadline */}
            <div className="bg-[#E52421] text-white px-6 py-2.5 rounded-lg shadow-lg font-bold text-sm md:text-base">
              {subtitle}
            </div>

            {/* CTA Button */}
            <Link to={linkUrl}>
              <Button 
                size="lg"
                className="bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-extrabold text-sm md:text-base px-8 h-12 rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                {buttonText}
              </Button>
            </Link>

            {/* Carousel dots */}
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

          {/* Right minifigures placeholder */}
          <div className="hidden lg:flex items-end gap-2 shrink-0">
            <div className="w-24 h-36 bg-white/10 rounded-lg backdrop-blur-sm" />
            <div className="w-24 h-32 bg-white/10 rounded-lg backdrop-blur-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
