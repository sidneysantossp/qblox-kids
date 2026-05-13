import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { getActiveMiniBanners } from '@/db/api';
import type { MiniBanner } from '@/types';

const bannerBackgrounds = [
  'bg-gradient-to-br from-green-600 to-green-800',
  'bg-gradient-to-br from-purple-600 to-blue-700',
  'bg-gradient-to-br from-sky-500 to-blue-600',
  'bg-gradient-to-br from-teal-700 to-cyan-900',
  'bg-gradient-to-br from-amber-600 to-orange-700',
];

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

interface ThematicBannersProps {
  title?: string;
  subtitle?: string;
}

export function ThematicBanners({ title, subtitle }: ThematicBannersProps) {
  const [thematicBanners, setThematicBanners] = useState<MiniBanner[]>([]);

  useEffect(() => {
    const loadThematicBanners = async () => {
      try {
        const data = await getActiveMiniBanners('thematic_collection', 6);
        setThematicBanners(data);
      } catch (error) {
        console.error('Erro ao carregar coleções temáticas:', error);
      }
    };

    loadThematicBanners();
  }, []);

  const sanitizedTitles = useMemo(
    () =>
      thematicBanners.map((banner) =>
        DOMPurify.sanitize(banner.title, {
          ALLOWED_TAGS: ['strong', 'br', 'p'],
          ALLOWED_ATTR: [],
        })
      ),
    [thematicBanners]
  );

  if (thematicBanners.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 my-16">
      <div className="text-center mb-8">
        <h2 className="text-[28px] font-bold text-foreground mb-1">{title || 'Coleções Temáticas'}</h2>
        <p className="text-muted-foreground text-sm">
          {subtitle || 'Explore mundos diferentes e encontre seus personagens favoritos'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {thematicBanners.slice(0, 2).map((banner, index) => (
          <Link
            key={banner.id}
            to={banner.link_url || '#'}
            className={`${banner.image_url ? '' : bannerBackgrounds[index] || bannerBackgrounds[0]} rounded-3xl p-8 min-h-[240px] flex flex-col justify-between text-white hover:scale-105 transition-transform duration-200 overflow-hidden relative group ${
              index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
            }`}
          >
            {banner.image_url && (
              <img src={banner.image_url} alt={stripHtml(banner.title)} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-300" />
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-lg -rotate-6 group-hover:-rotate-12 transition-transform duration-300" />

            <div className="relative z-10">
              <div
                className="text-[24px] font-extrabold mb-2 leading-tight [&_p]:m-0 [&_strong]:font-extrabold"
                dangerouslySetInnerHTML={{ __html: sanitizedTitles[index] || '' }}
              />
              <p className="text-sm text-white/90">{banner.subtitle}</p>
            </div>

            <Button variant="secondary" size="sm" className="w-fit relative z-10">
              {banner.button_text || 'Explorar'}
            </Button>
          </Link>
        ))}

        {thematicBanners.slice(2).map((banner, index) => (
          <Link
            key={banner.id}
            to={banner.link_url || '#'}
            className={`${banner.image_url ? '' : bannerBackgrounds[index + 2] || bannerBackgrounds[0]} rounded-3xl p-8 min-h-[240px] flex flex-col justify-between text-white hover:scale-105 transition-transform duration-200 overflow-hidden relative group`}
          >
            {banner.image_url && (
              <img src={banner.image_url} alt={stripHtml(banner.title)} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute top-3 right-3 w-12 h-12 bg-white/10 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-300" />

            <div className="relative z-10">
              <div
                className="text-[24px] font-extrabold mb-2 leading-tight [&_p]:m-0 [&_strong]:font-extrabold"
                dangerouslySetInnerHTML={{ __html: sanitizedTitles[index + 2] || '' }}
              />
              <p className="text-sm text-white/90">{banner.subtitle}</p>
            </div>

            <Button variant="secondary" size="sm" className="w-fit relative z-10">
              {banner.button_text || 'Ver coleção'}
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
