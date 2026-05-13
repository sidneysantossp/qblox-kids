import { Link } from 'react-router-dom';
import { CardImageGallery } from './CardImageGallery';
import { Badge } from '@/components/ui/badge';
import type { AvailabilityStatus } from '@/types';
import { getProductPath } from '@/lib/urls';

export interface FeaturedProduct {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  availability_status?: AvailabilityStatus;
}

interface FeaturedProductCardProps {
  product: FeaturedProduct;
}

// Helper para obter as configurações do badge de disponibilidade
const getAvailabilityBadge = (status: AvailabilityStatus) => {
  switch (status) {
    case 'in_stock':
      return {
        label: 'Pronta Entrega',
        variant: 'default' as const,
        className: 'bg-green-600 hover:bg-green-700 text-white',
      };
    case 'made_to_order':
      return {
        label: 'Sob Encomenda',
        variant: 'secondary' as const,
        className: 'bg-blue-600 hover:bg-blue-700 text-white',
      };
    case 'unavailable':
      return {
        label: 'Indisponível',
        variant: 'destructive' as const,
        className: 'bg-red-600 hover:bg-red-700 text-white',
      };
    default:
      return {
        label: 'Pronta Entrega',
        variant: 'default' as const,
        className: 'bg-green-600 hover:bg-green-700 text-white',
      };
  }
};

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link 
      to={getProductPath({ id: product.id, name: product.title, slug: undefined })}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow flex-shrink-0 w-[260px] xl:w-[300px] snap-start flex flex-col block"
    >
      <CardImageGallery images={product.images} alt={product.title} discount={discount} />
      
      {/* Badge de Disponibilidade */}
      <div className="px-4 pt-3">
        <Badge 
          variant={getAvailabilityBadge(product.availability_status || 'in_stock').variant}
          className={getAvailabilityBadge(product.availability_status || 'in_stock').className}
        >
          {getAvailabilityBadge(product.availability_status || 'in_stock').label}
        </Badge>
      </div>

      <div className="p-4 xl:p-5 flex flex-col flex-1">
        <h3 className="font-medium text-sm xl:text-base text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-lg xl:text-xl font-semibold text-foreground">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
          {product.compareAtPrice && (
            <p className="text-sm text-muted-foreground line-through">
              R$ {product.compareAtPrice.toFixed(2).replace('.', ',')}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
