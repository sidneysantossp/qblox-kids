import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export function BrickStoreFooter() {
  return (
    <footer className="bg-[#4B1599] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1 mb-4">
              <div className="flex flex-col gap-0.5">
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 bg-[#FFD200] rounded-sm" />
                  <div className="w-3 h-3 bg-[#E52421] rounded-sm" />
                </div>
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 bg-[#E52421] rounded-sm" />
                  <div className="w-3 h-3 bg-[#FFD200] rounded-sm" />
                </div>
              </div>
              <div className="text-[28px] font-bold leading-none">
                <span className="text-white">QBLOX</span>
                <span className="text-[#E52421]"> KIDS</span>
              </div>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Especialista em minifiguras de blocos de montar. Qualidade, variedade e diversão para colecionadores e fãs!
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-bold text-sm mb-4">Institucional</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/quem-somos" className="hover:text-white transition-colors">Quem somos</Link></li>
              <li><Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Política de privacidade</Link></li>
              <li><Link to="/politica-de-troca" className="hover:text-white transition-colors">Trocas e devoluções</Link></li>
              <li><Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de uso</Link></li>
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h3 className="font-bold text-sm mb-4">Ajuda</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/central-de-ajuda" className="hover:text-white transition-colors">Central de atendimento</Link></li>
              <li><Link to="/como-comprar" className="hover:text-white transition-colors">Como comprar</Link></li>
              <li><Link to="/formas-de-pagamento" className="hover:text-white transition-colors">Formas de pagamento</Link></li>
              <li><Link to="/rastreamento" className="hover:text-white transition-colors">Rastreamento de pedido</Link></li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="font-bold text-sm mb-4">Categorias</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/categoria/super-herois" className="hover:text-white transition-colors">Heróis</Link></li>
              <li><Link to="/categoria/aventura" className="hover:text-white transition-colors">Aventura</Link></li>
              <li><Link to="/categoria/espaco" className="hover:text-white transition-colors">Espaço</Link></li>
              <li><Link to="/categoria/cidade" className="hover:text-white transition-colors">Cidade</Link></li>
              <li><Link to="/loja" className="hover:text-white transition-colors">Ver todas +</Link></li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h4 className="font-bold text-sm mb-4">Formas de pagamento</h4>
          <div className="flex flex-wrap gap-3">
            {['Pix', 'Boleto', 'Visa', 'Mastercard', 'Elo'].map((method) => (
              <div key={method} className="bg-white/10 px-4 py-2 rounded text-xs font-medium">
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 text-center text-sm text-white/70">
          <p>© 2026 QBLOX KIDS — Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
