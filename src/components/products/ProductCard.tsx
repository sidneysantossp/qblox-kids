import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import type { Product } from '@/types';
import { getProductPath } from '@/lib/urls';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const hasDiscount = product.original_price && product.original_price > product.price;
  const finalPrice = product.price;
  const originalPrice = product.original_price || product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;
  
  const installmentPrice = (finalPrice / 3).toFixed(2);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Link 
      to={getProductPath(product)}
      className="group relative bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 block"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={`Boneco de montar ${product.name} - compatível com blocos tipo LEGO - ${product.category}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Discount Badge - Top Left */}
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-black text-white hover:bg-black rounded-full px-2 py-0.5 text-xs font-bold">
            -{discountPercentage}% OFF
          </Badge>
        )}
        
        {/* Wishlist Heart - Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleToggleFavorite();
          }}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* SKU Code */}
        {product.sku && (
          <p className="text-xs text-muted-foreground font-mono">
            SKU: {product.sku}
          </p>
        )}

        {/* Pricing */}
        <div className="space-y-1">
          {hasDiscount && (
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </p>
              <span className="text-[10px] font-bold text-[#E52421]">
                {discountPercentage}% OFF
              </span>
            </div>
          )}
          
          {/* PIX Price Highlight */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="text-2xl md:text-[1.7rem] font-extrabold text-[#0057D9] leading-none">
              R$ {finalPrice.toFixed(2).replace('.', ',')}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <span>•</span>
              <svg className="h-3.5 w-3.5" viewBox="0 0 512 512" fill="currentColor">
                <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.5H112.6C132.6 391.5 151.5 383.7 165.7 369.5L242.4 292.5zM262.5 218.9C257.1 224.3 247.8 224.3 242.4 218.9L165.7 142.1C151.5 127.9 132.6 120.1 112.6 120.1H103.3L200.7 23.37C231.1-6.124 280.3-6.124 310.6 23.37L407.7 120.1H392.6C372.6 120.1 353.7 127.9 339.5 142.1L262.5 218.9zM112.6 142.1C126.4 142.1 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.1 392.6 142.1H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 362.9 355.5 353.1L278.5 276.1C264.6 262.2 240.3 262.2 226.4 276.1L149.7 352.8C139.1 362.6 126.4 368.6 112.6 368.6H80.78L23.37 311.2C-6.124 280.9-6.124 231.7 23.37 201.4L80.78 143.1H112.6z"/>
              </svg>
              <span>via pix</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            até 3x de R$ {installmentPrice.replace('.', ',')} sem juros
          </p>
        </div>
      </div>
    </Link>
  );
}
