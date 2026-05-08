import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package, User, CreditCard, MapPin, Loader2, Calendar, Hash, DollarSign } from 'lucide-react';
import { getOrderById, updateOrderStatus } from '@/db/admin-api';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pendente' },
  { value: 'processing', label: 'Processando' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'refunded', label: 'Reembolsado' },
];

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  'credit_card': 'Cartão de Crédito',
  'card': 'Cartão',
  'pix': 'PIX',
  'boleto': 'Boleto',
  'cash': 'Dinheiro',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  console.log('[AdminOrderDetailPage] Componente renderizado, ID:', id);

  useEffect(() => {
    console.log('[AdminOrderDetailPage] useEffect executado, ID:', id);
    if (id) {
      loadOrder();
    } else {
      console.error('[AdminOrderDetailPage] ID não encontrado nos parâmetros da URL');
      toast({
        title: 'Erro',
        description: 'ID do pedido não foi fornecido.',
        variant: 'destructive',
      });
      navigate('/admin/pedidos');
    }
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await getOrderById(id);
      console.log('[AdminOrderDetailPage] Pedido carregado:', data);
      
      if (!data) {
        toast({
          title: 'Pedido não encontrado',
          description: 'O pedido solicitado não existe ou foi removido.',
          variant: 'destructive',
        });
        navigate('/admin/pedidos');
        return;
      }
      
      setOrder(data);
    } catch (error: any) {
      console.error('[AdminOrderDetailPage] Erro ao carregar pedido:', error);
      
      let errorMessage = 'Não foi possível carregar os detalhes do pedido.';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.code) {
        errorMessage = `Erro: ${error.code}`;
      }
      
      toast({
        title: 'Erro ao carregar pedido',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Don't navigate away immediately - let user see the error
      setTimeout(() => {
        navigate('/admin/pedidos');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;

    try {
      setIsUpdating(true);
      await updateOrderStatus(id, newStatus);
      setOrder({ ...order, status: newStatus });
      toast({
        title: 'Status atualizado',
        description: 'O status do pedido foi atualizado com sucesso.',
      });
    } catch (error) {
      console.error('[AdminOrderDetailPage] Erro ao atualizar status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Não foi possível atualizar o status do pedido.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pendente', variant: 'secondary' },
      processing: { label: 'Processando', variant: 'default' },
      shipped: { label: 'Enviado', variant: 'outline' },
      delivered: { label: 'Entregue', variant: 'default' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
      refunded: { label: 'Reembolsado', variant: 'outline' },
    };
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">{statusInfo.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    return PAYMENT_METHOD_LABELS[method] || method || 'Não informado';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando detalhes do pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Package className="h-16 w-16 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Pedido não encontrado</h2>
          <p className="text-muted-foreground">O pedido solicitado não existe ou foi removido.</p>
        </div>
        <Button onClick={() => navigate('/admin/pedidos')} variant="default">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Pedidos
        </Button>
      </div>
    );
  }

  // Calcular subtotal
  const subtotal = order.order_items?.reduce((sum: number, item: any) => 
    sum + (item.price * item.quantity), 0) || 0;
  const shippingCost = order.shipping_cost || 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header com informações principais */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/pedidos')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Detalhes do Pedido</h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie todas as informações do pedido
            </p>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Número do Pedido</p>
                  <p className="text-lg font-bold">#{order.id.slice(0, 8)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Data do Pedido</p>
                  <p className="text-lg font-bold">{formatDate(order.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-lg font-bold">{formatCurrency(order.total_amount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Coluna principal - 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          {/* Produtos do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="h-5 w-5" />
                Produtos do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.order_items && order.order_items.length > 0 ? (
                <div className="space-y-4">
                  {order.order_items.map((item: any, index: number) => (
                    <div key={item.id || index}>
                      <div className="flex gap-4">
                        {/* Thumbnail do Produto */}
                        <div className="shrink-0">
                          <img
                            src={item.products?.image_url || 'https://placehold.co/100x100?text=Sem+Imagem'}
                            alt={item.products?.name || 'Produto'}
                            className="h-24 w-24 rounded-lg object-cover border-2 border-border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://placehold.co/100x100?text=Sem+Imagem';
                            }}
                          />
                        </div>

                        {/* Informações do Produto */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg line-clamp-2">
                            {item.products?.name || 'Produto não encontrado'}
                          </h4>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium">Quantidade:</span>
                              <span className="px-2 py-0.5 bg-secondary rounded">{item.quantity}x</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground font-medium">Preço unitário:</span>
                              <span className="font-semibold">{formatCurrency(item.price)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground font-medium">Subtotal:</span>
                              <span className="font-bold text-primary">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < order.order_items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum produto encontrado neste pedido</p>
                </div>
              )}

              <Separator className="my-6" />

              {/* Resumo de Valores */}
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Subtotal dos produtos</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {shippingCost > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">{formatCurrency(shippingCost)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total do Pedido</span>
                  <span className="text-primary">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Nome Completo</p>
                    <p className="text-base font-semibold">
                      {order.customer_name || order.profiles?.full_name || order.profiles?.username || 'Cliente Anônimo'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">E-mail</p>
                    <p className="text-base font-semibold">
                      {order.customer_email || 'Não informado'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {order.profiles?.phone && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Telefone</p>
                      <p className="text-base font-semibold">{order.profiles.phone}</p>
                    </div>
                  )}
                  {order.user_id && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">ID do Usuário</p>
                      <code className="text-xs bg-secondary p-2 rounded block break-all font-mono">
                        {order.user_id}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço de Entrega */}
          {order.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-base">
                  {order.shipping_address.name && (
                    <p className="font-semibold text-lg">{order.shipping_address.name}</p>
                  )}
                  <p className="font-semibold">
                    {order.shipping_address.address || order.shipping_address.street}, {order.shipping_address.number}
                  </p>
                  {order.shipping_address.complement && (
                    <p className="text-muted-foreground">{order.shipping_address.complement}</p>
                  )}
                  <p>{order.shipping_address.neighborhood}</p>
                  <p className="font-medium">
                    {order.shipping_address.city} - {order.shipping_address.state}
                  </p>
                  <p className="text-muted-foreground">
                    CEP: {order.shipping_address.zipCode || order.shipping_address.zipcode}
                  </p>
                  {order.shipping_address.phone && (
                    <p className="text-muted-foreground">
                      Telefone: {order.shipping_address.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna lateral - 1/3 */}
        <div className="space-y-6">
          {/* Gerenciar Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Gerenciar Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status Atual</label>
                <div className="p-3 bg-secondary rounded-lg">
                  {getStatusBadge(order.status)}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Alterar Status</label>
                <Select
                  value={order.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isUpdating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Atualizando status...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="h-5 w-5" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Método de Pagamento</p>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-base font-semibold">
                    {getPaymentMethodLabel(order.payment_method)}
                  </p>
                </div>
              </div>
              
              {order.stripe_payment_intent_id && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Stripe Payment ID</p>
                  <code className="text-xs bg-secondary p-2 rounded block break-all">
                    {order.stripe_payment_intent_id}
                  </code>
                </div>
              )}
              
              {order.asaas_payment_id && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Asaas Payment ID</p>
                  <code className="text-xs bg-secondary p-2 rounded block break-all">
                    {order.asaas_payment_id}
                  </code>
                </div>
              )}
              
              {order.asaas_invoice_url && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Comprovante</p>
                  <a
                    href={order.asaas_invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Ver comprovante de pagamento →
                  </a>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor dos produtos</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">{formatCurrency(shippingCost)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total Pago</span>
                  <span className="text-primary">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Detalhes do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">ID do Pedido</p>
                <code className="text-xs bg-secondary p-2 rounded block break-all font-mono">
                  {order.id}
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Data de Criação</p>
                <p className="text-sm font-semibold">
                  {formatDate(order.created_at)}
                </p>
              </div>
              {order.updated_at && order.updated_at !== order.created_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Última Atualização</p>
                  <p className="text-sm font-semibold">
                    {formatDate(order.updated_at)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/pedidos')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Lista de Pedidos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
