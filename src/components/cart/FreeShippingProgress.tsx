import { cn } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 199;

interface FreeShippingProgressProps {
  cartTotal: number;
  variant?: 'compact' | 'default' | 'banner';
  className?: string;
}

const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(price);

const getProgressGradient = (cartTotal: number) => {
  if (cartTotal < FREE_SHIPPING_THRESHOLD / 2) {
    return 'linear-gradient(to right, #FF6B35, #FFA726)';
  }

  if (cartTotal < FREE_SHIPPING_THRESHOLD * 0.75) {
    return 'linear-gradient(to right, #FFA726, #66BB6A)';
  }

  return 'linear-gradient(to right, #66BB6A, #4CAF50)';
};

export function FreeShippingProgress({
  cartTotal,
  variant = 'default',
  className,
}: FreeShippingProgressProps) {
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);
  const progress = Math.min(100, Math.round((cartTotal / FREE_SHIPPING_THRESHOLD) * 100));
  const isUnlocked = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const isBanner = variant === 'banner';
  const isCompact = variant === 'compact';

  if (isUnlocked) {
    return (
      <div
        className={cn(
          'rounded-lg border border-green-200 bg-green-50 p-3 text-green-900',
          isCompact && 'p-2',
          isBanner && 'rounded-none border-0 bg-green-600/10 px-0 py-4 text-green-950',
          className,
        )}
      >
        <p className={cn('text-center font-medium', isCompact ? 'text-xs' : 'text-sm', isBanner && 'text-sm md:text-base')}>
          Você ganhou frete grátis!
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', isBanner && 'space-y-3', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className={cn('font-medium text-muted-foreground', isCompact ? 'text-xs' : 'text-sm', isBanner && 'text-sm md:text-base')}>
          Faltam {formatPrice(remaining)} para frete grátis
        </span>
        <span className={cn('font-bold text-[#FF6B35]', isCompact ? 'text-xs' : 'text-sm', isBanner && 'text-sm md:text-base')}>
          {progress}%
        </span>
      </div>

      <div
        className={cn(
          'relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
          isCompact ? 'h-2' : 'h-3',
          isBanner && 'h-3 md:h-3.5',
        )}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: getProgressGradient(cartTotal),
          }}
        />
      </div>
    </div>
  );
}

export { FREE_SHIPPING_THRESHOLD };
