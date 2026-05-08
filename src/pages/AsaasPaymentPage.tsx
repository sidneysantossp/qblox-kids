import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, Loader2, Copy, Download, QrCode as QrCodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { verifyAsaasPayment } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types';
import QRCode from 'qrcode';

export default function AsaasPaymentPage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [asaasStatus, setAsaasStatus] = useState<string>('');
  const [invoiceUrl, setInvoiceUrl] = useState<string>('');
  const [bankSlipUrl, setBankSlipUrl] = useState<string>('');
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState<string>('');

  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        toast({
          title: 'Erro',
          description: 'ID de pagamento não encontrado',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await verifyAsaasPayment(paymentId);
        
        if (response.verified) {
          setOrder(response.order);
          setPaymentStatus(response.status);
          setAsaasStatus(response.asaasStatus);
          setInvoiceUrl(response.invoiceUrl || '');
          setBankSlipUrl(response.bankSlipUrl || '');

          // Gerar QR Code do Pix se disponível
          if (response.order?.asaas_pix_qr_code) {
            setPixQrCodeUrl(`data:image/png;base64,${response.order.asaas_pix_qr_code}`);
          } else if (response.order?.asaas_pix_copy_paste) {
            // Gerar QR Code a partir do código Pix
            try {
              const qrCodeDataUrl = await QRCode.toDataURL(response.order.asaas_pix_copy_paste, {
                width: 300,
                margin: 2,
              });
              setPixQrCodeUrl(qrCodeDataUrl);
            } catch (error) {
              console.error('Erro ao gerar QR Code:', error);
            }
          }
        } else {
          toast({
            title: 'Erro ao verificar pagamento',
            description: 'Não foi possível verificar o status do pagamento',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Erro ao verificar pagamento:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao verificar pagamento',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [paymentId, toast]);

  const copyPixCode = () => {
    if (order?.asaas_pix_copy_paste) {
      navigator.clipboard.writeText(order.asaas_pix_copy_paste);
      toast({
        title: 'Código copiado!',
        description: 'O código Pix foi copiado para a área de transferência',
      });
    }
  };

  const getStatusIcon = () => {
    if (paymentStatus === 'completed') {
      return <CheckCircle2 className="h-16 w-16 text-green-500" />;
    }
    if (paymentStatus === 'pending') {
      return <Clock className="h-16 w-16 text-yellow-500" />;
    }
    return <XCircle className="h-16 w-16 text-red-500" />;
  };

  const getStatusText = () => {
    if (paymentStatus === 'completed') {
      return {
        title: 'Pagamento Confirmado!',
        description: 'Seu pedido foi confirmado e será processado em breve.',
      };
    }
    if (paymentStatus === 'pending') {
      return {
        title: 'Aguardando Pagamento',
        description: 'Complete o pagamento para confirmar seu pedido.',
      };
    }
    return {
      title: 'Pagamento Não Confirmado',
      description: 'Houve um problema com seu pagamento.',
    };
  };

  const getStatusBadge = () => {
    switch (paymentStatus) {
      case 'completed':
        return <Badge className="bg-green-500">Confirmado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusText();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <div className="space-y-6">
          {/* Status do Pagamento */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                {getStatusIcon()}
                <div>
                  <h1 className="text-2xl font-bold">{statusInfo.title}</h1>
                  <p className="text-muted-foreground">{statusInfo.description}</p>
                </div>
                {getStatusBadge()}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Pedido */}
          {order && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número do Pedido:</span>
                    <span className="font-mono">{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método de Pagamento:</span>
                    <span className="capitalize">{order.payment_method_type || order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold text-lg">R$ {order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Itens do Pedido */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Itens:</h3>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pix - QR Code e Código Copia e Cola */}
          {order?.payment_method_type === 'pix' && paymentStatus === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCodeIcon className="h-5 w-5" />
                  Pagamento via Pix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pixQrCodeUrl && (
                  <div className="flex justify-center">
                    <img src={pixQrCodeUrl} alt="QR Code Pix" className="w-64 h-64" />
                  </div>
                )}
                
                {order.asaas_pix_copy_paste && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center">
                      Ou copie o código abaixo:
                    </p>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-xs break-all">
                        {order.asaas_pix_copy_paste}
                      </div>
                      <Button onClick={copyPixCode} size="icon" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                  <p>Escaneie o QR Code ou copie o código para pagar via Pix</p>
                  <p className="mt-2">O pagamento será confirmado automaticamente</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Boleto */}
          {order?.payment_method_type === 'boleto' && paymentStatus === 'pending' && bankSlipUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Boleto Bancário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Seu boleto foi gerado com sucesso. Clique no botão abaixo para visualizar e imprimir.
                </p>
                <Button asChild className="w-full">
                  <a href={bankSlipUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Boleto
                  </a>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  O boleto vence em 3 dias. Após o pagamento, pode levar até 2 dias úteis para confirmação.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Nota Fiscal */}
          {invoiceUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Nota Fiscal</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Nota Fiscal
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button asChild className="flex-1">
              <Link to="/meus-pedidos">Ver Meus Pedidos</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">Continuar Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
