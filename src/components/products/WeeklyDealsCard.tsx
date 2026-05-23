import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { Product } from '@/types';
import { getProductPath } from '@/lib/urls';

interface WeeklyDealsCardProps {
  product: Product;
}

export function WeeklyDealsCard({ product }: WeeklyDealsCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  // Só mostrar desconto se original_price estiver configurado e for maior que o preço atual
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const installmentValue = product.price / 12;

  return (
    <Link 
      to={getProductPath(product)}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full block"
    >
      {/* Imagem do Produto */}
      <div className="relative group">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        
        {/* Badge de Desconto - só aparece se houver desconto configurado */}
        {hasDiscount && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 rounded-full text-xs font-bold">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Botão de Favorito */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            const toggled = await toggleFavorite(product);
            if (!toggled) {
              window.location.href = '/login';
            }
          }}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
      </div>

      {/* Informações do Produto */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 hover:text-[#FF6B35] transition-colors min-h-[40px]">
          {product.name}
        </h3>

        {product.sku ? (
          <p className="text-[10px] text-gray-500 font-mono uppercase mb-3">
            SKU: {product.sku}
          </p>
        ) : null}

        {/* Preços */}
        <div className="mb-3">
          {/* Preço Original - só aparece se houver desconto configurado */}
          {hasDiscount && (
            <div className="text-xs text-gray-500 line-through mb-1">
              R$ {product.original_price!.toFixed(2).replace('.', ',')}
            </div>
          )}

          {/* PIX Price Highlight */}
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-black text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              <svg className="h-3 w-3" viewBox="0 0 512 512" fill="currentColor">
                <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.5H112.6C132.6 391.5 151.5 383.7 165.7 369.5L242.4 292.5zM262.5 218.9C257.1 224.3 247.8 224.3 242.4 218.9L165.7 142.1C151.5 127.9 132.6 120.1 112.6 120.1H103.3L200.7 23.37C231.1-6.124 280.3-6.124 310.6 23.37L407.7 120.1H392.6C372.6 120.1 353.7 127.9 339.5 142.1L262.5 218.9zM112.6 142.1C126.4 142.1 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.1 392.6 142.1H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 362.9 355.5 353.1L278.5 276.1C264.6 262.2 240.3 262.2 226.4 276.1L149.7 352.8C139.1 362.6 126.4 368.6 112.6 368.6H80.78L23.37 311.2C-6.124 280.9-6.124 231.7 23.37 201.4L80.78 143.1H112.6z"/>
              </svg>
              <span>R$ {product.price.toFixed(2).replace('.', ',')}</span>
            </div>
            <span className="text-[10px] text-gray-500">via pix</span>
          </div>

          {/* Preço Normal */}
          <div className="text-sm text-gray-900 mb-1">
            R$ {(hasDiscount ? product.original_price! : product.price).toFixed(2).replace('.', ',')}
          </div>

          {/* Parcelamento */}
          <div className="text-xs text-gray-600">
            até 12x de R$ {installmentValue.toFixed(2).replace('.', ',')} sem juros
          </div>
        </div>
      </div>
    </Link>
  );
}
