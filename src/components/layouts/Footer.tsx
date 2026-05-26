import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Twitter } from 'lucide-react';
import { usePublicSettings } from '@/hooks/use-public-settings';

const footerSections = [
  {
    title: 'Institucional',
    links: [
      { label: 'Sobre a QBlox Kids', to: '/quem-somos' },
      { label: 'Contato', to: '/contato' },
      { label: 'Perguntas Frequentes', to: '/perguntas-frequentes' },
    ],
  },
  {
    title: 'Segurança',
    links: [
      { label: 'Compra Segura', to: '/compra-segura' },
      { label: 'Política de Privacidade', to: '/politica-de-privacidade' },
      { label: 'Termos de Uso', to: '/termos-de-uso' },
      { label: 'Política de Troca', to: '/politica-de-troca' },
    ],
  },
  {
    title: 'Produtos',
    links: [
      { label: 'Compatibilidade dos Bonecos', to: '/compatibilidade-dos-bonecos' },
      { label: 'Cuidados e Idade Recomendada', to: '/cuidados-e-idade-recomendada' },
      { label: 'Lançamentos', to: '/categoria/lancamentos' },
      { label: 'Super Heróis', to: '/categoria/super-herois' },
    ],
  },
];

export function Footer() {
  const { footer_logo_url } = usePublicSettings();

  return (
    <footer className="bg-[#1a1a1a] text-white mt-16 xl:mt-24">
      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            {footer_logo_url ? (
              <img src={footer_logo_url} alt="QBLOX" className="h-12 w-auto object-contain mb-4" />
            ) : (
              <h3 className="font-bold text-lg mb-4 gradient-logo-text">QBLOX KIDS</h3>
            )}
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-gray-300">
              A melhor loja de bonecos de montar para crianças. Produtos de qualidade com entrega rápida e segura.
            </p>
            <ul className="mb-5 space-y-3 text-sm">
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
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-gray-300 hover:text-[#FF6B35] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 <span className="gradient-logo-text font-semibold">QBLOX KIDS</span>. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
