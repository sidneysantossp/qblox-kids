import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselNavButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  visible: boolean;
}

export function CarouselNavButton({ direction, onClick, visible }: CarouselNavButtonProps) {
  if (!visible) return null;

  const isPrev = direction === 'prev';

  return (
    <button
      onClick={onClick}
      aria-label={isPrev ? 'Anterior' : 'Próximo'}
      className={`absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 xl:w-12 xl:h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all ${
        isPrev ? 'left-2 xl:left-4' : 'right-2 xl:right-4'
      }`}
    >
      {isPrev ? (
        <ChevronLeft className="w-6 h-6 text-foreground" />
      ) : (
        <ChevronRight className="w-6 h-6 text-foreground" />
      )}
    </button>
  );
}
