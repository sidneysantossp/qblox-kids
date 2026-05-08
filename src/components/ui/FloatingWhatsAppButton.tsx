import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppSettings } from '@/db/api';
import type { WhatsAppSettings } from '@/types';

export function FloatingWhatsAppButton() {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [isVisible, setIsVisible] = useState(true); // Sempre visível inicialmente

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getWhatsAppSettings();
        console.log('WhatsApp Settings carregadas:', data);
        console.log('show_button value:', data?.show_button);
        setSettings(data);
      } catch (error) {
        console.error('Erro ao carregar configurações do WhatsApp:', error);
      }
    };

    loadSettings();

    // Mostrar/ocultar botão baseado no scroll
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    // Iniciar visível
    setIsVisible(true);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Não mostrar se não há configurações ou se está inativo
  if (!settings || !settings.is_active) {
    console.log('Botão WhatsApp oculto: sem configurações ou inativo');
    return null;
  }

  // Não mostrar se show_button está explicitamente definido como false
  if (settings.show_button === false) {
    console.log('Botão WhatsApp oculto: show_button = false');
    return null;
  }

  console.log('Botão WhatsApp visível');

  const handleClick = () => {
    let phone = settings.phone_number.replace(/\D/g, '');
    
    // Garantir que o número tenha o código do país (55 para Brasil)
    if (!phone.startsWith('55')) {
      phone = '55' + phone;
    }
    
    const message = encodeURIComponent(settings.welcome_message);
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
      }`}
      aria-label="Falar no WhatsApp"
      title="Fale conosco no WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      <style>{`
        @keyframes pulse-whatsapp {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
        }
        
        button[aria-label="Falar no WhatsApp"] {
          animation: pulse-whatsapp 2s infinite;
        }
      `}</style>
    </button>
  );
}
