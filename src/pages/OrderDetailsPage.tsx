import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, Truck, MapPin, CreditCard, Calendar, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import UserDashboardLayout from '@/components/layouts/UserDashboardLayout';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

interface ShippingAddress {
  name: string;
  phone: string;
  zipCode: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  shipping_cost: number;
  discount: number;
  coupon_code: string | null;
  payment_method: string;
  payment_method_id: string | null;
  status: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (!orderId) {
      navigate('/minha-conta', { replace: true });
      return;
    }

    loadOrderDetails();
  }, [user, orderId, navigate]);

  const loadOrderDetails = async () => {
    try {
      // Carregar pedido
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (orderError) {
        console.error('Erro ao carregar pedido:', orderError);
        navigate('/minha-conta', { replace: true });
        return;
      }

      if (!orderData) {
        navigate('/minha-conta', { replace: true });
        return;
      }

      // Carregar produtos dos itens
      const productIds = orderData.items?.map((item: OrderItem) => item.product_id) || [];
      
      if (productIds.length > 0) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, image_url')
          .in('id', productIds);

        if (!productsError && productsData) {
          // Associar produtos aos itens
          const itemsWithProducts = orderData.items.map((item: OrderItem) => ({
            ...item,
            product: productsData.find((p) => p.id === item.product_id),
          }));

          setOrder({ ...orderData, items: itemsWithProducts });
        } else {
          setOrder(orderData);
        }
      } else {
        setOrder(orderData);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do pedido:', error);
      navigate('/minha-conta', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      pending: { label: 'Aguardando Pagamento', variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Em Processamento', variant: 'default', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Enviado', variant: 'outline', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Entregue', variant: 'default', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', variant: 'destructive', color: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'outline', color: 'bg-gray-100 text-gray-800' };
    return (
      <Badge variant={statusInfo.variant} className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, { label: string; icon: React.ReactNode }> = {
      cash: { label: 'Dinheiro na Entrega', icon: <Banknote className="h-4 w-4" /> },
      card: { label: 'Cartão de Crédito', icon: <CreditCard className="h-4 w-4" /> },
      pix: { label: 'PIX', icon: <CreditCard className="h-4 w-4" /> },
      boleto: { label: 'Boleto', icon: <CreditCard className="h-4 w-4" /> },
    };
    return methodMap[method] || { label: method, icon: <CreditCard className="h-4 w-4" /> };
  };

  const getStatusTimeline = (status: string) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    
    if (status === 'cancelled') {
      return [
        { label: 'Pedido Cancelado', active: true, completed: true },
      ];
    }

    return [
      { label: 'Pedido Realizado', active: currentIndex >= 0, completed: currentIndex > 0 },
      { label: 'Em Processamento', active: currentIndex >= 1, completed: currentIndex > 1 },
      { label: 'Enviado', active: currentIndex >= 2, completed: currentIndex > 2 },
      { label: 'Entregue', active: currentIndex >= 3, completed: currentIndex >= 3 },
    ];
  };

  if (loading) {
    return (
      <UserDashboardLayout>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Carregando detalhes do pedido...</p>
          </CardContent>
        </Card>
      </UserDashboardLayout>
    );
  }

  if (!order) {
    return (
      <UserDashboardLayout>
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Package className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Pedido não encontrado</h3>
                <p className="text-muted-foreground">
                  O pedido que você está procurando não existe ou não pertence a você
                </p>
              </div>
              <Button asChild>
                <Link to="/meus-pedidos">Voltar para Meus Pedidos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </UserDashboardLayout>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const paymentMethod = getPaymentMethodLabel(order.payment_method || 'card');
  const timeline = getStatusTimeline(order.status);

  return (
    <UserDashboardLayout>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/meus-pedidos">Meus Pedidos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pedido #{order.id.slice(0, 8)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold">
              Pedido #{order.id.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground mt-2">
              Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Status do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-green-500 text-white'
                              : step.active
                              ? 'bg-[#FF6B35] text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {step.completed ? '✓' : index + 1}
                        </div>
                        {index < timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              step.completed ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p
                          className={`font-medium ${
                            step.active ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Itens do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name || 'Produto'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {item.product?.name || `Produto ${item.product_id.slice(0, 8)}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            R$ {item.price.toFixed(2)} cada
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">
                      {order.shipping_cost === 0 ? 'Grátis' : `R$ ${order.shipping_cost.toFixed(2)}`}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Desconto {order.coupon_code && `(${order.coupon_code})`}
                      </span>
                      <span className="font-medium text-green-600">
                        - R$ {order.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#FF6B35]">
                    R$ {order.total_amount.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {paymentMethod.icon}
                  Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{paymentMethod.label}</p>
                {order.payment_method === 'cash' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Pagamento será realizado na entrega
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shipping_address.name}</p>
                  <p className="text-muted-foreground">{order.shipping_address.phone}</p>
                  <Separator className="my-2" />
                  <p>
                    {order.shipping_address.address}, {order.shipping_address.number}
                  </p>
                  {order.shipping_address.complement && (
                    <p>{order.shipping_address.complement}</p>
                  )}
                  <p>
                    {order.shipping_address.neighborhood} - {order.shipping_address.city}/{order.shipping_address.state}
                  </p>
                  <p>CEP: {order.shipping_address.zipCode}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </UserDashboardLayout>
  );
}
