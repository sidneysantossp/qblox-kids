import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/db/supabase';
import type { Coupon, CouponUsage } from '@/types';
import { TicketPercent } from 'lucide-react';

interface CouponsPanelProps {
  userId: string;
}

export function CouponsPanel({ userId }: CouponsPanelProps) {
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [usedCoupons, setUsedCoupons] = useState<CouponUsage[]>([]);

  useEffect(() => {
    const loadCoupons = async () => {
      const [couponsResponse, usageResponse] = await Promise.all([
        supabase.from('coupons').select('*').eq('active', true).order('created_at', { ascending: false }),
        supabase.from('coupon_usage').select('*').eq('user_id', userId).order('used_at', { ascending: false }),
      ]);

      if (!couponsResponse.error && couponsResponse.data) {
        setAvailableCoupons(couponsResponse.data as Coupon[]);
      }

      if (!usageResponse.error && usageResponse.data) {
        setUsedCoupons(usageResponse.data as CouponUsage[]);
      }
    };

    loadCoupons();
  }, [userId]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TicketPercent className="h-5 w-5" />
            Cupons Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableCoupons.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum cupom ativo no momento.</p>
          ) : (
            availableCoupons.map((coupon) => (
              <div key={coupon.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{coupon.code}</p>
                    <p className="text-sm text-muted-foreground">{coupon.description || 'Cupom disponível para uso.'}</p>
                  </div>
                  <Badge variant="outline">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `R$ ${coupon.discount_value.toFixed(2)}`}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cupons já utilizados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {usedCoupons.length === 0 ? (
            <p className="text-sm text-muted-foreground">Você ainda não utilizou cupons.</p>
          ) : (
            usedCoupons.map((usage) => (
              <div key={usage.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Cupom aplicado</p>
                    <p className="text-sm text-muted-foreground">Usado em {new Date(usage.used_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">- R$ {usage.discount_amount.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
