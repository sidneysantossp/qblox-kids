import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Twitter } from 'lucide-react';
import { usePublicSettings } from '@/hooks/use-public-settings';

export function Footer() {
  const { footer_logo_url } = usePublicSettings();

  return (
    <footer className="bg-[#1a1a1a] text-white mt-16 xl:mt-24">
      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div>
            {footer_logo_url ? (
              <img src={footer_logo_url} alt="QBLOX" className="h-12 w-auto object-contain mb-4" />
            ) : (
              <h3 className="font-bold text-lg mb-4 gradient-logo-text">QBLOX KIDS</h3>
            )}
            <p className="text-sm text-gray-300 mb-4">
              A melhor loja de bonecos de montar para crianças. Produtos de qualidade com entrega rápida e segura.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-[#FF6B35] transition-colors">Início</Link></li>
              <li><Link to="/categoria/lancamentos" className="text-gray-300 hover:text-[#FF6B35] transition-colors">Lançamentos</Link></li>
              <li><Link to="/categoria/super-herois" className="text-gray-300 hover:text-[#FF6B35] transition-colors">Super Heróis</Link></li>
              <li><Link to="/carrinho" className="text-gray-300 hover:text-[#FF6B35] transition-colors">Carrinho</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Atendimento</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/central-de-ajuda" className="text-gray-300 hover:text-[#FF6B35] transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/politica-de-troca" className="text-gray-300 hover:text-[#FF6B35] transition-colors">Política de Troca</Link></li>
              <li><Link to="/politica-de-privacidade" className="text-gray-300 hover:text-[#FF6B35] transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos-de-uso" className="text-gray-300 hover:text-[#FF6B35] transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#FF6B35]" />
                <span className="text-gray-300">
                  R. Baronesa de Bela Vista, 411 - Vila Congonhas<br />
                  São Paulo - SP, 04612-001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#FF6B35]" />
                <a href="mailto:contato@kidsblockstore.com.br" className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                  contato@kidsblockstore.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 <span className="gradient-logo-text font-semibold">QBLOX KIDS</span>. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
