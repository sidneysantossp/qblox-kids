import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, RefreshCw, ShoppingBag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserOrders, retryOrderPayment, verifyAsaasPayment, verifyStripePayment } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types';
import UserDashboardLayout from '@/components/layouts/UserDashboardLayout';

export default function UserOrdersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshingOrders, setRefreshingOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getUserOrders(user.id);
      setOrders(data);
    } catch (error: any) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = async (order: Order) => {
    try {
      if (order.payment_gateway === 'asaas' && order.asaas_payment_id) {
        navigate(`/pagamento-asaas?payment_id=${order.asaas_payment_id}&order_id=${order.id}`);
        return;
      }

      const response = await retryOrderPayment(order.id);

      if (response?.url) {
        window.open(response.url, '_blank');

        toast({
          title: "Redirecionando para pagamento",
          description: "Você será redirecionado para completar o pagamento.",
        });
      }
    } catch (error: any) {
      console.error('Erro ao retentar pagamento:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRefreshOrder = async (order: Order) => {
    try {
      setRefreshingOrders(prev => new Set(prev).add(order.id));

      if (order.payment_gateway === 'asaas') {
        if (!order.asaas_payment_id) {
          throw new Error('Pedido não possui identificador de pagamento Asaas');
        }

        const response = await verifyAsaasPayment(order.asaas_payment_id);

        if (response?.verified) {
          toast({
            title: response.status === 'completed' ? 'Pagamento confirmado!' : 'Pedido atualizado',
            description:
              response.status === 'completed'
                ? 'O status do pedido foi atualizado.'
                : 'O pedido ainda está aguardando pagamento.',
          });
          await loadOrders();
        }

        return;
      }

      if (!order.stripe_session_id) {
        throw new Error('Pedido não possui sessão de pagamento');
      }

      const response = await verifyStripePayment(order.stripe_session_id);

      if (response?.data?.verified) {
        toast({
          title: 'Pagamento confirmado!',
          description: 'O status do pedido foi atualizado.',
        });
        await loadOrders();
      } else {
        toast({
          title: 'Pagamento pendente',
          description: 'O pagamento ainda não foi confirmado.',
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar pedido:', error);
      toast({
        title: 'Erro ao atualizar pedido',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setRefreshingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(order.id);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      completed: { label: 'Concluído', variant: 'default' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const },
      refunded: { label: 'Reembolsado', variant: 'outline' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className={config.variant === 'default' ? 'bg-success' : ''}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const getOrderItemTotal = (order: Order, item: Order['items'][number]) => {
    const unitPrice = order.payment_gateway === 'stripe' ? item.price / 100 : item.price;
    return unitPrice * item.quantity;
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para ver seus pedidos
            </p>
            <Link to="/login">
              <Button>Fazer Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <UserDashboardLayout>
        <div className="text-center py-8">Carregando pedidos...</div>
      </UserDashboardLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <UserDashboardLayout>
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Nenhum pedido encontrado</h2>
            <p className="text-muted-foreground mb-6">
              Você ainda não realizou nenhuma compra
            </p>
            <Link to="/">
              <Button>Começar a Comprar</Button>
            </Link>
          </CardContent>
        </Card>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl xl:text-4xl font-bold mb-2">Meus Pedidos</h1>
        <p className="text-muted-foreground">
          Acompanhe o status dos seus pedidos
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Pedido #{order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  {order.status === 'pending' && (order.stripe_session_id || order.asaas_payment_id) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRefreshOrder(order)}
                      disabled={refreshingOrders.has(order.id)}
                    >
                      {refreshingOrders.has(order.id) ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Atualizar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Itens do Pedido */}
              <div>
                <h3 className="font-semibold mb-3">Itens</h3>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qtd: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(getOrderItemTotal(order, item))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Resumo do Pedido */}
              <div className="space-y-2">
                {order.shipping_cost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete:</span>
                    <span>{formatCurrency(order.shipping_cost)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto:</span>
                    <span className="text-success">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>

              {/* Informações de Pagamento */}
              {order.customer_email && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-semibold text-sm">Informações de Pagamento</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {order.customer_name && (
                      <p className="text-muted-foreground">
                        Nome: <span className="text-foreground">{order.customer_name}</span>
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      Email: <span className="text-foreground">{order.customer_email}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Ações */}
              {order.status === 'pending' && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Pagamento pendente. Complete o pagamento para processar o pedido.</span>
                    <Button
                      size="sm"
                      onClick={() => handleRetryPayment(order)}
                      className="ml-4"
                    >
                      Pagar Agora
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </UserDashboardLayout>
  );
}
