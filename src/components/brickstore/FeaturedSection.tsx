import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedSectionConfig {
  badge_text?: string;
  headline?: string;
  description?: string;
  features?: string[];
  image_url?: string;
  price_prefix?: string;
  price_value?: string;
  primary_cta_text?: string;
  primary_cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
}

interface FeaturedSectionProps {
  title?: string;
  subtitle?: string;
  config?: FeaturedSectionConfig;
}

export function FeaturedSection({ title, subtitle, config }: FeaturedSectionProps) {
  const badgeText = config?.badge_text || 'EDIÇÃO LIMITADA';
  const headline = config?.headline || 'Coleção Guardiões Galácticos';
  const description =
    config?.description ||
    'Uma seleção exclusiva de minifiguras inspiradas em aventuras espaciais, perfeita para colecionadores que buscam peças únicas.';
  const features = config?.features?.length
    ? config.features
    : ['6 personagens exclusivos', 'Acessórios especiais inclusos', 'Embalagem colecionável'];
  const imageUrl = config?.image_url || '';
  const pricePrefix = config?.price_prefix || 'A partir de';
  const priceValue = config?.price_value || 'R$ 149,90';
  const primaryCtaText = config?.primary_cta_text || 'Comprar agora';
  const primaryCtaUrl = config?.primary_cta_url || '/produto/colecao-guardioes-galacticos';
  const secondaryCtaText = config?.secondary_cta_text || 'Ver detalhes';
  const secondaryCtaUrl = config?.secondary_cta_url || '/produto/colecao-guardioes-galacticos';

  return (
    <section className="container mx-auto px-4 my-16">
      <div className="text-center mb-8">
        <h2 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2">
          {title || 'Destaque Especial'}
        </h2>
        <p className="text-muted-foreground">
          {subtitle || 'Os bonecos mais desejados pelos colecionadores esta semana'}
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#061A33] via-[#0057D9] to-[#003A99] rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
          <div className="flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,210,0,0.2)_0%,_transparent_70%)]" />

            <div className="relative z-10 w-full max-w-sm aspect-square bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt={headline} className="w-full h-full object-cover" />
              ) : (
                <div className="w-48 h-48 bg-gradient-to-br from-[#FFD200]/30 to-[#E52421]/30 rounded-xl" />
              )}
            </div>

            <div className="absolute top-10 left-10 w-8 h-8 bg-[#FFD200]/20 rounded-lg rotate-12 animate-pulse" />
            <div className="absolute bottom-10 right-10 w-10 h-10 bg-[#E52421]/20 rounded-lg -rotate-6 animate-pulse delay-75" />
          </div>

          <div className="flex flex-col justify-center text-white">
            <Badge className="bg-[#FFD200] text-[#111827] font-extrabold text-xs w-fit mb-4">
              {badgeText}
            </Badge>

            <h3 className="text-[32px] md:text-[40px] font-extrabold mb-4 leading-tight">
              {headline}
            </h3>

            <p className="text-white/90 text-base mb-6 leading-relaxed">{description}</p>

            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#FFD200]" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <span className="text-sm text-white/70">{pricePrefix}</span>
              <div className="text-[40px] font-extrabold text-[#FFD200]">{priceValue}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={primaryCtaUrl} className="flex-1">
                <Button size="lg" className="w-full bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-extrabold">
                  {primaryCtaText}
                </Button>
              </Link>
              <Link to={secondaryCtaUrl} className="flex-1">
                <Button size="lg" variant="outline" className="w-full border-white hover:bg-white/10">
                  {secondaryCtaText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
