import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0057D9] to-[#003A99] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Decorative blocks */}
        <div className="relative mb-8">
          <div className="absolute top-0 left-1/4 w-12 h-12 bg-[#FFD200] rounded-lg rotate-12 opacity-20 animate-pulse" />
          <div className="absolute top-10 right-1/4 w-16 h-16 bg-[#E52421] rounded-lg -rotate-6 opacity-20 animate-pulse delay-75" />
          <div className="absolute bottom-0 left-1/3 w-10 h-10 bg-[#FFD200] rounded-lg rotate-45 opacity-20 animate-pulse delay-150" />
        </div>

        {/* 404 Number */}
        <div className="relative z-10 mb-8">
          <h1 className="text-[120px] md:text-[180px] font-extrabold text-white leading-none drop-shadow-2xl">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[120px] md:text-[180px] font-extrabold text-[#FFD200] opacity-20 blur-sm">
              404
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="relative z-10 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ops! Página não encontrada
          </h2>
          <p className="text-white/90 text-base md:text-lg mb-2">
            Parece que esta página foi desmontada como um bloco de LEGO...
          </p>
          <p className="text-white/80 text-sm md:text-base">
            Mas não se preocupe! Vamos te ajudar a encontrar o que você procura.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
          <Link to="/">
            <Button 
              size="lg"
              className="bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-extrabold w-full sm:w-auto"
            >
              <Home className="w-5 h-5 mr-2" />
              Voltar para Home
            </Button>
          </Link>
          
          <Link to="/loja">
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-bold w-full sm:w-auto"
            >
              <Search className="w-5 h-5 mr-2" />
              Ver Produtos
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
          <p className="text-white/70 text-sm mb-4">Links rápidos:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link to="/categoria/super-herois" className="text-white hover:text-[#FFD200] transition-colors">
              Super Heróis
            </Link>
            <Link to="/categoria/aventura" className="text-white hover:text-[#FFD200] transition-colors">
              Aventura
            </Link>
            <Link to="/categoria/espaco" className="text-white hover:text-[#FFD200] transition-colors">
              Espaço
            </Link>
            <Link to="/categoria/lancamentos" className="text-white hover:text-[#FFD200] transition-colors">
              Lançamentos
            </Link>
            <Link to="/ofertas-especiais" className="text-white hover:text-[#FFD200] transition-colors">
              Ofertas
            </Link>
            <Link to="/central-de-ajuda" className="text-white hover:text-[#FFD200] transition-colors">
              Ajuda
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 relative z-10">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para página anterior
          </Button>
        </div>
      </div>
    </div>
  );
}
