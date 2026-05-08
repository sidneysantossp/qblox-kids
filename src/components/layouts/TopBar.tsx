import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const announcements = [
  'Aceitamos pagamento via 💳 pix | Compre parcelado e sem juros!',
  'Frete Grátis em compras acima de R$ 99,00 🚚',
  'Desconto de 10% na primeira compra! Use: BEMVINDO10 🎉',
];

export function TopBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="bg-green-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-7 xl:h-8 text-[10px] md:text-xs xl:text-sm">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 hover:opacity-80 transition-opacity shrink-0"
            aria-label="Anúncio anterior"
          >
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
          </button>
          
          <div className="flex-1 text-center font-medium whitespace-nowrap overflow-hidden text-ellipsis px-1">
            {announcements[currentIndex]}
          </div>
          
          <button
            type="button"
            onClick={handleNext}
            className="p-1 hover:opacity-80 transition-opacity shrink-0"
            aria-label="Próximo anúncio"
          >
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
