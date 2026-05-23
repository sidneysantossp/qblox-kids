import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserDashboardLayout from '@/components/layouts/UserDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Package, User, MapPin, Settings, Heart, TicketPercent } from 'lucide-react';
import { formatOrderNumber, getOrderStatusLabel } from '@/lib/orders';

interface DashboardOrderSummary {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { favorites } = useFavorites();
  const [recentOrders, setRecentOrders] = useState<DashboardOrderSummary[]>([]);
  const [availableCouponsCount, setAvailableCouponsCount] = useState(0);

  useEffect(() => {
    const loadSummary = async () => {
      if (!user) return;

      const [ordersResponse, couponsResponse] = await Promise.all([
        supabase
          .from('orders')
          .select('id, status, total_amount, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('coupons')
          .select('id', { count: 'exact', head: true })
          .eq('active', true),
      ]);

      if (!ordersResponse.error && ordersResponse.data) {
        setRecentOrders(ordersResponse.data as DashboardOrderSummary[]);
      }

      if (!couponsResponse.error) {
        setAvailableCouponsCount(couponsResponse.count || 0);
      }
    };

    loadSummary();
  }, [user]);

  return (
    <UserDashboardLayout>
      <div className="max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
          <p className="text-muted-foreground">
            Acompanhe pedidos, favoritos, cupons e gerencie seus dados em um só lugar.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link to="/perfil">
            <Card className="h-full hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Meu Perfil</h2>
                </div>
                <p className="text-sm text-muted-foreground">Atualize seu nome, telefone e dados principais da conta.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/meus-pedidos">
            <Card className="h-full hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Meus Pedidos</h2>
                </div>
                <p className="text-sm text-muted-foreground">Veja pedidos em andamento, pagamentos pendentes e histórico completo.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/favoritos">
            <Card className="h-full hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Meus Favoritos</h2>
                </div>
                <p className="text-sm text-muted-foreground">Você tem {favorites.length} produto(s) salvo(s) para comparar ou comprar depois.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/meus-cupons">
            <Card className="h-full hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <TicketPercent className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Meus Cupons</h2>
                </div>
                <p className="text-sm text-muted-foreground">Há {availableCouponsCount} cupom(ns) ativo(s) disponível(is) para consulta.</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Você ainda não realizou nenhuma compra.</p>
                ) : (
                  recentOrders.map((order) => (
                    <Link key={order.id} to="/meus-pedidos" className="block rounded-lg border p-4 hover:border-primary transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">Pedido {formatOrderNumber(order.id)}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">R$ {order.total_amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{getOrderStatusLabel(order.status)}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.address ? (
                  <div className="text-sm space-y-1">
                    <p>{profile.address}, {profile.number}</p>
                    {profile.complement ? <p>{profile.complement}</p> : null}
                    <p>{profile.neighborhood} - {profile.city}/{profile.state}</p>
                    <p>CEP: {profile.zip_code}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado ainda.</p>
                )}
                <Link to="/enderecos" className="inline-block mt-4 text-sm font-medium text-primary hover:underline">
                  Gerenciar endereços
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Ajuste notificações, preferências e dados da sua conta com mais facilidade.</p>
                <Link to="/configuracoes" className="inline-block mt-4 text-sm font-medium text-primary hover:underline">
                  Abrir configurações
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
