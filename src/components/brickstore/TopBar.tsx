import { Star, Truck, Headset, Mail } from 'lucide-react';

export function TopBar() {
  return (
    <div className="bg-[#FFD200] text-[#1F2937]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-8 text-xs md:text-[13px] font-medium">
          {/* Left/Center - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              <span>Avaliação 4,9/5 por mais de 8.000 clientes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Frete grátis para todo o Brasil em compras acima de R$199</span>
            </div>
          </div>

          {/* Mobile - Simplified */}
          <div className="flex md:hidden items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Frete grátis acima de R$199</span>
          </div>

          {/* Right - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Headset className="w-3.5 h-3.5" />
              <span>Central de Atendimento</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>contato@qbloxkids.com.br</span>
            </div>
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-1.5">
            <Headset className="w-3.5 h-3.5" />
            <span>Atendimento</span>
          </div>
        </div>
      </div>
    </div>
  );
}
