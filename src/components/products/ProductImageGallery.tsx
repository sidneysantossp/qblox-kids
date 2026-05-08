import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  discount?: number;
  isOnSale?: boolean;
}

export function ProductImageGallery({ 
  images, 
  productName, 
  discount = 0,
  isOnSale = false 
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Se não houver imagens, retorna null
  if (!images || images.length === 0) return null;

  // Se houver apenas uma imagem, usa ela 4 vezes para criar thumbnails
  const displayImages = images.length === 1 ? Array(4).fill(images[0]) : images;

  return (
    <div className="flex flex-col gap-4">
      {/* Imagem Principal */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={displayImages[selectedIndex]}
          alt={`Boneco de montar ${productName} - compatível com blocos tipo LEGO - Imagem ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
        {isOnSale && discount > 0 && (
          <Badge className="absolute top-4 left-4 bg-sale text-white text-lg px-4 py-2">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 xl:gap-3">
        {displayImages.slice(0, 4).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md bg-muted transition-all hover:opacity-80",
              selectedIndex === index 
                ? "ring-2 ring-primary ring-offset-2" 
                : "opacity-60"
            )}
            aria-label={`Ver imagem ${index + 1} de ${productName}`}
          >
            <img
              src={image}
              alt={`${productName} - Miniatura ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
