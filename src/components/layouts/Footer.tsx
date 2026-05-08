import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getWhatsAppSettings } from '@/db/api';
import type { WhatsAppSettings } from '@/types';

export function Footer() {
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings | null>(null);

  useEffect(() => {
    const loadWhatsAppSettings = async () => {
      try {
        const data = await getWhatsAppSettings();
        setWhatsappSettings(data);
      } catch (error) {
        console.error('Erro ao carregar configurações do WhatsApp:', error);
      }
    };

    loadWhatsAppSettings();
  }, []);

  const handleWhatsAppClick = () => {
    if (!whatsappSettings) return;
    let phone = whatsappSettings.phone_number.replace(/\D/g, '');
    
    // Garantir que o número tenha o código do país (55 para Brasil)
    if (!phone.startsWith('55')) {
      phone = '55' + phone;
    }
    
    const message = encodeURIComponent(whatsappSettings.welcome_message);
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-[#1a1a1a] text-white mt-16 xl:mt-24">
      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-logo-text">
              QBLOX KIDS
            </h3>
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

          {/* Links Rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/categoria/Lançamentos" className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                  Lançamentos
                </Link>
              </li>
              <li>
                <Link to="/categoria/Super Heróis" className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                  Super Heróis
                </Link>
              </li>
              <li>
                <Link to="/carrinho" className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="font-bold text-lg mb-4">Atendimento</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/central-de-ajuda" className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/politica-de-troca" className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                  Política de Troca
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidade" className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos-de-uso" className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
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
              {whatsappSettings && whatsappSettings.is_active && (
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366]" />
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-gray-300 hover:text-[#25D366] transition-colors text-left"
                  >
                    WhatsApp: {whatsappSettings.phone_number}
                  </button>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#FF6B35]" />
                <span className="text-gray-300">contato@kidsblockstore.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 <span className="gradient-logo-text font-semibold">QBLOX KIDS</span>. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
