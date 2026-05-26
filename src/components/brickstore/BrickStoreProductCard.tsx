import { Link } from 'react-router-dom';
import { Check, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types';
import { CardImageGallery } from '@/components/products/CardImageGallery';
import { getProductPath } from '@/lib/urls';
import { TrustBadges } from '@/components/TrustBadges';

export interface BrickStoreProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  sku?: string | null;
  image?: string;
  images?: string[];
  badge?: 'MAIS VENDIDO' | 'NOVO' | 'OFERTA';
  discount?: number;
}

export function mapProductToBrickStoreProductCardProps(product: Product): BrickStoreProductCardProps {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    oldPrice: product.original_price || undefined,
    rating: Math.round(product.rating || 0),
    reviews: product.reviews_count || 0,
    sku: product.sku,
    image: product.image_url,
    images: product.images,
    badge: product.is_bestseller ? 'MAIS VENDIDO' : product.is_on_sale || product.is_flash_sale ? 'OFERTA' : 'NOVO',
    discount:
      product.original_price && product.original_price > product.price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : undefined,
  };
}

export function BrickStoreProductCard({
  id,
  name,
  category,
  price,
  oldPrice,
  rating = 5,
  reviews = 0,
  sku,
  image,
  images = [],
  badge,
  discount,
}: BrickStoreProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (!showSuccessMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [showSuccessMessage]);

  const badgeColors = {
    'MAIS VENDIDO': 'bg-[#FFD200] text-[#111827]',
    'NOVO': 'bg-[#0057D9] text-white',
    'OFERTA': 'bg-[#E52421] text-white',
  };

  const galleryImages = useMemo(() => {
    const normalized = [image, ...images].filter((item): item is string => Boolean(item));
    return Array.from(new Set(normalized));
  }, [image, images]);

  const productForCart = {
    id,
    name,
    category,
    price,
    original_price: oldPrice || null,
    image_url: image || galleryImages[0] || '',
    images: galleryImages,
  } as Product;

  const hasDiscount = Boolean(oldPrice && oldPrice > price);
  const displayOriginalPrice = oldPrice || price;
  const installmentPrice = (price / 3).toFixed(2);
  const shouldShowInstallments = price >= 20;

  const stopNavigation = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    stopNavigation(event);

    if (isAddingToCart) {
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(productForCart, quantity);
      setShowSuccessMessage(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleDecrease = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopNavigation(event);
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopNavigation(event);
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  return (
    <Link to={getProductPath(productForCart)}>
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#FFD200] transition-all duration-200 h-full flex flex-col group">
        <div className="relative bg-white h-[320px] w-full overflow-hidden">
          {badge && (
            <Badge className={`absolute top-2 left-2 z-20 text-[10px] font-extrabold px-2 py-1 ${badgeColors[badge]}`}>
              {badge}
            </Badge>
          )}
          {discount && (
            <Badge className="absolute top-2 right-2 z-20 text-[10px] font-extrabold px-2 py-1 bg-[#E52421] text-white">
              -{discount}%
            </Badge>
          )}

          {galleryImages.length > 0 ? (
            <CardImageGallery
              images={galleryImages}
              alt={name}
              discount={undefined}
            />
          ) : (
            <div className="w-full h-full bg-white" />
          )}
        </div>

        <div className="p-4 flex flex-col gap-2 flex-1">
          <span className="text-xs text-muted-foreground uppercase font-medium">
            {category}
          </span>

          <h3 className="font-bold text-base md:text-lg line-clamp-2 text-foreground leading-tight">
            {name}
          </h3>

          {sku ? (
            <p className="text-[10px] text-muted-foreground font-mono uppercase">
              SKU: {sku}
            </p>
          ) : null}

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

          <div className="flex flex-col gap-1 mt-auto">
            {hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground line-through">
                  R$ {displayOriginalPrice.toFixed(2).replace('.', ',')}
                </span>
                {discount ? (
                  <span className="text-[10px] font-bold text-[#E52421]">
                    {discount}% OFF
                  </span>
                ) : null}
              </div>
            )}

            <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
              <span className="text-2xl md:text-[1.7rem] font-extrabold text-[#0057D9] leading-none">
                R$ {price.toFixed(2).replace('.', ',')}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <span>•</span>
                <svg className="h-3.5 w-3.5" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.5H112.6C132.6 391.5 151.5 383.7 165.7 369.5L242.4 292.5zM262.5 218.9C257.1 224.3 247.8 224.3 242.4 218.9L165.7 142.1C151.5 127.9 132.6 120.1 112.6 120.1H103.3L200.7 23.37C231.1-6.124 280.3-6.124 310.6 23.37L407.7 120.1H392.6C372.6 120.1 353.7 127.9 339.5 142.1L262.5 218.9zM112.6 142.1C126.4 142.1 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.1 392.6 142.1H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 362.9 355.5 353.1L278.5 276.1C264.6 262.2 240.3 262.2 226.4 276.1L149.7 352.8C139.1 362.6 126.4 368.6 112.6 368.6H80.78L23.37 311.2C-6.124 280.9-6.124 231.7 23.37 201.4L80.78 143.1H112.6z"/>
                </svg>
                <span>via pix</span>
              </div>
            </div>

            {shouldShowInstallments && (
              <p className="text-xs text-muted-foreground">
                até 3x de R$ {installmentPrice.replace('.', ',')} sem juros
              </p>
            )}
          </div>

          <TrustBadges compact limit={2} className="pt-1" />

          <div className="mt-2 space-y-2">
            <div className="flex items-stretch gap-2">
              <div className="flex items-center border border-border rounded-lg overflow-hidden h-9 bg-background shrink-0">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1 || isAddingToCart}
                  aria-label="Diminuir quantidade"
                  className="h-full w-9 flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <span className="h-full min-w-[38px] px-2 flex items-center justify-center text-sm font-medium text-foreground border-x border-border">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={quantity >= 99 || isAddingToCart}
                  aria-label="Aumentar quantidade"
                  className="h-full w-9 flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>

              <Button
                type="button"
                className="flex-1 bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-extrabold text-[11px] md:text-xs h-9 rounded-lg px-3"
                onClick={(event) => void handleAddToCart(event)}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="w-3.5 h-3.5 shrink-0 md:mr-1.5" />
                <span className="hidden md:inline">{isAddingToCart ? 'ADICIONANDO...' : 'ADICIONAR'}</span>
              </Button>
            </div>

            {showSuccessMessage && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[11px] md:text-xs font-medium text-green-800">
                <Check className="h-3.5 w-3.5 shrink-0" />
                Produto adicionado ao seu carrinho com sucesso.
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
