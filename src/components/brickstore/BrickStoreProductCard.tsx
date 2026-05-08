import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BrickStoreProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  image?: string;
  badge?: 'MAIS VENDIDO' | 'NOVO' | 'OFERTA';
  discount?: number;
}

export function BrickStoreProductCard({
  id,
  name,
  category,
  price,
  oldPrice,
  rating = 5,
  reviews = 0,
  image,
  badge,
  discount,
}: BrickStoreProductCardProps) {
  const badgeColors = {
    'MAIS VENDIDO': 'bg-[#FFD200] text-[#111827]',
    'NOVO': 'bg-[#0057D9] text-white',
    'OFERTA': 'bg-[#E52421] text-white',
  };

  return (
    <Link to={`/produto/${id}`}>
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#FFD200] transition-all duration-200 h-full flex flex-col">
        {/* Image Area */}
        <div className="relative bg-[#F8FAFC] h-[180px] flex items-center justify-center p-4">
          {badge && (
            <Badge className={`absolute top-2 left-2 text-[10px] font-extrabold px-2 py-1 ${badgeColors[badge]}`}>
              {badge}
            </Badge>
          )}
          {discount && (
            <Badge className="absolute top-2 right-2 text-[10px] font-extrabold px-2 py-1 bg-[#E52421] text-white">
              -{discount}%
            </Badge>
          )}
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-[#0057D9]/20 to-[#FFD200]/20 rounded-lg" />
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Category */}
          <span className="text-xs text-muted-foreground uppercase font-medium">
            {category}
          </span>

          {/* Name */}
          <h3 className="font-bold text-sm line-clamp-2 text-foreground">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < rating
                      ? 'fill-[#FFD200] text-[#FFD200]'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            {reviews > 0 && (
              <span className="text-[10px] text-muted-foreground">
                ({reviews})
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 mt-auto">
            {oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                R$ {oldPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="text-lg font-bold text-[#0057D9]">
              R$ {price.toFixed(2).replace('.', ',')}
            </span>
          </div>

          {/* Buy Button */}
          <Button 
            className="w-full bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-extrabold text-xs h-9 rounded-lg mt-2"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            COMPRAR
          </Button>
        </div>
      </div>
    </Link>
  );
}
