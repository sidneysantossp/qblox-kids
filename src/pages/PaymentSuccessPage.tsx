import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Package, CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { verifyStripePayment } from '@/db/api';
import { useCart } from '@/contexts/CartContext';
import type { PaymentVerificationResponse } from '@/types';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart: clearCartContext } = useCart();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentData, setPaymentData] = useState<PaymentVerificationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setVerificationStatus('error');
      setErrorMessage('ID da sessão de pagamento não encontrado');
      return;
    }

    verifyPayment(sessionId);
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await verifyStripePayment(sessionId);

      if (response?.data?.verified) {
        setVerificationStatus('success');
        setPaymentData(response.data);
        
        // Limpar carrinho após pagamento bem-sucedido
        await clearCartContext();
      } else {
        setVerificationStatus('error');
        setErrorMessage(response?.data?.message || 'Pagamento não foi confirmado');
      }
    } catch (error: any) {
      console.error('Erro ao verificar pagamento:', error);
      setVerificationStatus('error');
      setErrorMessage(error.message || 'Erro ao verificar pagamento');
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Verificando pagamento...</h2>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos seu pagamento
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardContent className="p-12 text-center">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Erro na verificação</h2>
            <p className="text-muted-foreground mb-6">
              {errorMessage}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/carrinho">
                <Button variant="outline">Voltar ao Carrinho</Button>
              </Link>
              <Link to="/">
                <Button>Ir para Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-3xl mx-auto border-success">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-success/10 p-4">
              <CheckCircle2 className="h-16 w-16 text-success" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">
            Pagamento Confirmado!
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Seu pedido foi processado com sucesso
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações do Pedido */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalhes do Pedido
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Número do Pedido:</span>
                <span className="font-mono font-semibold">
                  {paymentData?.order?.id?.slice(0, 8).toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="default" className="bg-success">
                  Pago
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Data:</span>
                <span className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {paymentData?.order?.completed_at && formatDate(paymentData.order.completed_at)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Pago:</span>
                <span className="text-2xl font-bold text-success">
                  {paymentData?.amount && paymentData?.currency && 
                    formatCurrency(paymentData.amount, paymentData.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Informações de Pagamento */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informações de Pagamento
            </h3>
            
            <div className="space-y-3">
              {paymentData?.customerEmail && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{paymentData.customerEmail}</span>
                </div>
              )}

              {paymentData?.customerName && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-medium">{paymentData.customerName}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ID da Transação:</span>
                <span className="font-mono text-sm">
                  {paymentData?.paymentIntentId?.slice(0, 20)}...
                </span>
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
          {paymentData?.order?.items && paymentData.order.items.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Itens do Pedido</h3>
              <div className="space-y-3">
                {paymentData.order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
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
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      R$ {((item.price / 100) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Próximos Passos */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">Próximos Passos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Você receberá um email de confirmação em breve</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Seu pedido será processado e enviado em até 2 dias úteis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Você pode acompanhar o status do pedido na área "Meus Pedidos"</span>
              </li>
            </ul>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/meus-pedidos" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Ver Meus Pedidos
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button size="lg" className="w-full">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
