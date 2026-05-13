import { useRef, useState } from 'react';

interface CardImageGalleryProps {
  images: string[];
  alt: string;
  discount?: number;
}

export function CardImageGallery({ images, alt, discount }: CardImageGalleryProps) {
  const validImages = images.filter(Boolean).slice(0, 2);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);


  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (validImages.length <= 1) return;

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      setCurrentIndex(1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (validImages.length === 0) return null;

  return (
    <div className="relative w-full h-full bg-muted overflow-hidden">
      {discount && discount > 0 ? (
        <div className="absolute top-2 left-2 z-10 bg-sale text-white text-xs font-bold px-2 py-0.5 rounded">
          -{discount}%
        </div>
      ) : null}

      <div
        className="relative w-full h-full"
        onMouseEnter={() => {
          if (validImages.length > 1) {
            setCurrentIndex(1);
          }
        }}
        onMouseLeave={() => setCurrentIndex(0)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {validImages.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={`${alt} - Imagem ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        ))}
      </div>

      {validImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {validImages.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-foreground w-4' : 'bg-foreground/30 w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
