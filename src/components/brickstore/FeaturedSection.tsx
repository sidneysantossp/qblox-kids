import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturedSection() {
  return (
    <section className="container mx-auto px-4 my-16">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2">
          Destaque Especial
        </h2>
        <p className="text-muted-foreground">
          Os bonecos mais desejados pelos colecionadores esta semana
        </p>
      </div>

      {/* Featured Card */}
      <div className="bg-gradient-to-br from-[#061A33] via-[#0057D9] to-[#003A99] rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Left - Image */}
          <div className="flex items-center justify-center relative">
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,210,0,0.2)_0%,_transparent_70%)]" />
            
            {/* Product placeholder */}
            <div className="relative z-10 w-full max-w-sm aspect-square bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-[#FFD200]/30 to-[#E52421]/30 rounded-xl" />
            </div>

            {/* Floating blocks */}
            <div className="absolute top-10 left-10 w-8 h-8 bg-[#FFD200]/20 rounded-lg rotate-12 animate-pulse" />
            <div className="absolute bottom-10 right-10 w-10 h-10 bg-[#E52421]/20 rounded-lg -rotate-6 animate-pulse delay-75" />
          </div>

          {/* Right - Content */}
          <div className="flex flex-col justify-center text-white">
            <Badge className="bg-[#FFD200] text-[#111827] font-extrabold text-xs w-fit mb-4">
              EDIÇÃO LIMITADA
            </Badge>

            <h3 className="text-[32px] md:text-[40px] font-extrabold mb-4 leading-tight">
              Coleção Guardiões Galácticos
            </h3>

            <p className="text-white/90 text-base mb-6 leading-relaxed">
              Uma seleção exclusiva de minifiguras inspiradas em aventuras espaciais, 
              perfeita para colecionadores que buscam peças únicas.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#FFD200]" />
                <span className="text-sm">6 personagens exclusivos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#FFD200]" />
                <span className="text-sm">Acessórios especiais inclusos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#FFD200]" />
                <span className="text-sm">Embalagem colecionável</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-sm text-white/70">A partir de</span>
              <div className="text-[40px] font-extrabold text-[#FFD200]">
                R$ 149,90
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/produto/colecao-guardioes-galacticos" className="flex-1">
                <Button 
                  size="lg"
                  className="w-full bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-extrabold"
                >
                  Comprar agora
                </Button>
              </Link>
              <Link to="/produto/colecao-guardioes-galacticos" className="flex-1">
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/10"
                >
                  Ver detalhes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
