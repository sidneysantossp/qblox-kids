import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, QrCode, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import { createAsaasPayment } from '@/db/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { AsaasPaymentRequest } from '@/types';

// Schema de validação
const checkoutSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  postalCode: z.string().min(8, 'CEP inválido'),
  address: z.string().min(3, 'Endereço inválido'),
  addressNumber: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  province: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  paymentMethod: z.enum(['PIX', 'BOLETO', 'CREDIT_CARD']),
});

const creditCardSchema = z.object({
  holderName: z.string().min(3, 'Nome do titular obrigatório'),
  number: z.string().min(13, 'Número do cartão inválido'),
  expiryMonth: z.string().length(2, 'Mês inválido'),
  expiryYear: z.string().length(4, 'Ano inválido'),
  ccv: z.string().min(3, 'CVV inválido'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;
type CreditCardFormData = z.infer<typeof creditCardSchema>;

export default function AsaasCheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingCost] = useState(15.0); // Frete fixo
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'BOLETO' | 'CREDIT_CARD'>('PIX');

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      cpfCnpj: '',
      phone: '',
      postalCode: '',
      address: '',
      addressNumber: '',
      complement: '',
      province: '',
      city: '',
      state: '',
      paymentMethod: 'PIX',
    },
  });

  const creditCardForm = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      holderName: '',
      number: '',
      expiryMonth: '',
      expiryYear: '',
      ccv: '',
    },
  });

  // Verificar autenticação e carregar dados do usuário
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // Carregar dados do perfil do usuário
    const loadUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao carregar perfil:', error);
          return;
        }

        if (data) {
          form.reset({
            name: data.full_name || '',
            email: user.email || '',
            cpfCnpj: '',
            phone: data.phone || '',
            postalCode: data.zip_code || '',
            address: data.address || '',
            addressNumber: data.number || '',
            complement: data.complement || '',
            province: data.neighborhood || '',
            city: data.city || '',
            state: data.state || '',
            paymentMethod: 'PIX',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };

    loadUserProfile();
  }, [user, navigate, location, form]);

  // Verificar se há itens no carrinho
  useEffect(() => {
    if (cartItems.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar a compra.',
        variant: 'destructive',
      });
      navigate('/carrinho');
    }
  }, [cartItems, navigate, toast]);

  const total = cartTotal + shippingCost;

  const handleSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      // Preparar dados do pagamento
      const paymentData: AsaasPaymentRequest = {
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          name: item.product?.name || '',
          price: item.product?.price || 0,
          quantity: item.quantity,
          image_url: item.product?.image_url,
        })),
        customer: {
          name: data.name,
          email: data.email,
          cpfCnpj: data.cpfCnpj,
          phone: data.phone,
          postalCode: data.postalCode,
          address: data.address,
          addressNumber: data.addressNumber,
          complement: data.complement,
          province: data.province,
          city: data.city,
          state: data.state,
        },
        paymentMethod,
        shipping_cost: shippingCost,
      };

      // Adicionar dados do cartão se for pagamento com cartão
      if (paymentMethod === 'CREDIT_CARD') {
        const cardData = creditCardForm.getValues();
        
        // Validar dados do cartão
        if (!cardData.holderName || !cardData.number || !cardData.expiryMonth || !cardData.expiryYear || !cardData.ccv) {
          toast({
            title: 'Dados do cartão incompletos',
            description: 'Preencha todos os campos do cartão de crédito.',
            variant: 'destructive',
          });
          return;
        }
        
        paymentData.creditCard = {
          holderName: cardData.holderName,
          number: cardData.number,
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          ccv: cardData.ccv,
        };
        paymentData.creditCardHolderInfo = {
          name: cardData.holderName,
          email: data.email,
          cpfCnpj: data.cpfCnpj,
          postalCode: data.postalCode,
          addressNumber: data.addressNumber,
          phone: data.phone,
        };
      }

      // Criar pagamento no Asaas
      const response = await createAsaasPayment(paymentData);

      if (response.success) {
        // Limpar carrinho
        await clearCart();

        // Redirecionar para página de sucesso
        navigate(`/pagamento-asaas?payment_id=${response.paymentId}&order_id=${response.orderId}`);
      } else {
        throw new Error('Erro ao criar pagamento');
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      toast({
        title: 'Erro ao processar pagamento',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/carrinho">Carrinho</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Checkout</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 xl:grid-cols-3">
          {/* Formulário */}
          <div className="xl:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Dados Pessoais */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dados Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="João Silva" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cpfCnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF/CNPJ</FormLabel>
                            <FormControl>
                              <Input placeholder="000.000.000-00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="joao@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Endereço de Entrega */}
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input placeholder="00000-000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="São Paulo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="SP" maxLength={2} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input placeholder="Rua Example" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="complement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input placeholder="Apto 45" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Centro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Método de Pagamento */}
                <Card>
                  <CardHeader>
                    <CardTitle>Método de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => {
                        setPaymentMethod(value as 'PIX' | 'BOLETO' | 'CREDIT_CARD');
                        form.setValue('paymentMethod', value as any);
                      }}
                      className="grid gap-4"
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="PIX" id="pix" />
                        <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                          <QrCode className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">Pix</div>
                            <div className="text-sm text-muted-foreground">
                              Pagamento instantâneo
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="BOLETO" id="boleto" />
                        <Label htmlFor="boleto" className="flex items-center gap-2 cursor-pointer flex-1">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">Boleto Bancário</div>
                            <div className="text-sm text-muted-foreground">
                              Vencimento em 3 dias
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="CREDIT_CARD" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">Cartão de Crédito</div>
                            <div className="text-sm text-muted-foreground">
                              Aprovação imediata
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Formulário de Cartão de Crédito */}
                    {paymentMethod === 'CREDIT_CARD' && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="grid gap-4">
                          <div>
                            <Label htmlFor="cardHolder">Nome no Cartão</Label>
                            <Input
                              id="cardHolder"
                              placeholder="JOÃO SILVA"
                              {...creditCardForm.register('holderName')}
                            />
                            {creditCardForm.formState.errors.holderName && (
                              <p className="text-sm text-destructive mt-1">
                                {creditCardForm.formState.errors.holderName.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="cardNumber">Número do Cartão</Label>
                            <Input
                              id="cardNumber"
                              placeholder="0000 0000 0000 0000"
                              {...creditCardForm.register('number')}
                            />
                            {creditCardForm.formState.errors.number && (
                              <p className="text-sm text-destructive mt-1">
                                {creditCardForm.formState.errors.number.message}
                              </p>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="expiryMonth">Mês</Label>
                              <Input
                                id="expiryMonth"
                                placeholder="MM"
                                maxLength={2}
                                {...creditCardForm.register('expiryMonth')}
                              />
                              {creditCardForm.formState.errors.expiryMonth && (
                                <p className="text-sm text-destructive mt-1">
                                  {creditCardForm.formState.errors.expiryMonth.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="expiryYear">Ano</Label>
                              <Input
                                id="expiryYear"
                                placeholder="AAAA"
                                maxLength={4}
                                {...creditCardForm.register('expiryYear')}
                              />
                              {creditCardForm.formState.errors.expiryYear && (
                                <p className="text-sm text-destructive mt-1">
                                  {creditCardForm.formState.errors.expiryYear.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="ccv">CVV</Label>
                              <Input
                                id="ccv"
                                placeholder="123"
                                maxLength={4}
                                {...creditCardForm.register('ccv')}
                              />
                              {creditCardForm.formState.errors.ccv && (
                                <p className="text-sm text-destructive mt-1">
                                  {creditCardForm.formState.errors.ccv.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Finalizar Pedido
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Resumo do Pedido */}
          <div className="xl:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Itens */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.product?.image_url}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          R$ {((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totais */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span>R$ {shippingCost.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
