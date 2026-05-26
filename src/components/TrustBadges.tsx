import { CreditCard, Headset, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const trustBadges = [
  { icon: ShieldCheck, label: 'Compra segura' },
  { icon: Truck, label: 'Envio com rastreio' },
  { icon: Headset, label: 'Atendimento por e-mail' },
  { icon: RotateCcw, label: 'Troca facil em 7 dias' },
  { icon: CreditCard, label: 'Pix e cartao seguros' },
];

interface TrustBadgesProps {
  compact?: boolean;
  className?: string;
  limit?: number;
}

export function TrustBadges({ compact = false, className = '', limit }: TrustBadgesProps) {
  const visibleBadges = typeof limit === 'number' ? trustBadges.slice(0, limit) : trustBadges;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {visibleBadges.map((badge) => {
        const Icon = badge.icon;
        return (
          <span
            key={badge.label}
            className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 font-semibold text-emerald-800 ${
              compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
            }`}
          >
            <Icon className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
