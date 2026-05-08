import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Truck, Tag, ChevronRight, Banknote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import { createAsaasPayment, calculateShipping, validateCoupon, getActivePaymentMethods, type ShippingOption } from '@/db/api';
import { cpfMask, phoneMask, cepMask, fetchAddressByCEP, BRAZILIAN_STATES, creditCardMask, cvvMask, expiryMask, validateCardNumber, detectCardBrand } from '@/lib/masks';
import type { CouponValidation } from '@/types';

function CheckoutForm() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [shippingCost, setShippingCost] = useState(0);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('pix');
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [activePaymentMethods, setActivePaymentMethods] = useState<any[]>([]);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);
  const numberInputRef = useRef<HTMLInputElement>(null);

  // Estados para dados do cartão de crédito
  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
  });
  const [cardBrand, setCardBrand] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    zipCode: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  // Verificar autenticação e carregar dados do usuário
  useEffect(() => {
    if (!user) {
      // Salvar a URL atual para retornar após o login
      const returnUrl = location.pathname + location.search;
      
      // Redirecionar para login com URL de retorno
      navigate('/login', { 
        state: { returnUrl },
        replace: true 
      });
      
      toast({
        title: 'Login necessário',
        description: 'Faça login para continuar com a compra',
        variant: 'destructive',
      });
      
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
          setFormData({
            name: data.full_name || '',
            email: user.email || '',
            phone: data.phone || '',
            cpf: data.cpf || '',
            zipCode: data.zip_code || '',
            address: data.address || '',
            number: data.number || '',
            complement: data.complement || '',
            neighborhood: data.neighborhood || '',
            city: data.city || '',
            state: data.state || '',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };

    loadUserProfile();
  }, [user, navigate, location, toast]);

  // Carregar métodos de pagamento ativos
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        setIsLoadingPaymentMethods(true);
        const methods = await getActivePaymentMethods();
        setActivePaymentMethods(methods);
        
        // Definir primeiro método ativo como padrão
        if (methods.length > 0) {
          setPaymentMethod(methods[0].code);
        }
      } catch (error) {
        console.error('[Checkout] Erro ao carregar métodos de pagamento:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os métodos de pagamento',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPaymentMethods(false);
      }
    };

    loadPaymentMethods();
  }, [toast]);

  // Calcular frete quando CEP de destino estiver completo
  useEffect(() => {
    const loadShipping = async () => {
      const cleanCEP = formData.zipCode.replace(/\D/g, '');
      
      if (cleanCEP.length === 8) {
        setIsLoadingShipping(true);
        console.log('[Checkout] Calculando frete para CEP:', cleanCEP, 'Total:', cartTotal);
        
        try {
          const options = await calculateShipping(cleanCEP, cartTotal);
          console.log('[Checkout] Opções de frete recebidas:', options);
          setShippingOptions(options);
          
          // Selecionar primeira opção automaticamente
          if (options.length > 0) {
            setSelectedShipping(options[0].id);
            setShippingCost(options[0].price);
            console.log('[Checkout] Frete selecionado:', options[0]);
          } else {
            console.warn('[Checkout] Nenhuma opção de frete retornada');
          }
        } catch (error) {
          console.error('[Checkout] Erro ao calcular frete:', error);
          
          // Em caso de erro, usar frete padrão
          const defaultShipping: ShippingOption = {
            id: 'standard',
            name: 'Frete Padrão',
            price: 15.90,
            delivery_time: '5-10 dias úteis',
            company: 'Correios',
          };
          
          setShippingOptions([defaultShipping]);
          setSelectedShipping(defaultShipping.id);
          setShippingCost(defaultShipping.price);
          
          toast({
            title: 'Aviso',
            description: 'Usando frete padrão. Valor: R$ 15,90',
          });
        } finally {
          setIsLoadingShipping(false);
        }
      } else {
        // Limpar opções se CEP incompleto
        console.log('[Checkout] CEP incompleto, limpando opções');
        setShippingOptions([]);
        setSelectedShipping('');
        setShippingCost(0);
      }
    };

    loadShipping();
  }, [formData.zipCode, cartTotal, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let maskedValue = value;
    
    // Aplicar máscaras
    if (name === 'cpf') {
      maskedValue = cpfMask(value);
    } else if (name === 'phone') {
      maskedValue = phoneMask(value);
    } else if (name === 'zipCode') {
      maskedValue = cepMask(value);
      
      // Buscar endereço quando CEP estiver completo
      const cleanCEP = value.replace(/\D/g, '');
      if (cleanCEP.length === 8) {
        handleCEPLookup(cleanCEP);
      }
    }
    
    setFormData({
      ...formData,
      [name]: maskedValue
    });
  };

  // Handler para dados do cartão
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === 'number') {
      maskedValue = creditCardMask(value);
      const brand = detectCardBrand(value);
      setCardBrand(brand);
    } else if (name === 'ccv') {
      maskedValue = cvvMask(value);
    } else if (name === 'expiry') {
      maskedValue = expiryMask(value);
      
      // Separar mês e ano quando completo
      if (maskedValue.length === 5) {
        const [month, year] = maskedValue.split('/');
        setCardData(prev => ({
          ...prev,
          expiryMonth: month,
          expiryYear: `20${year}`,
        }));
        return;
      }
    }

    setCardData({
      ...cardData,
      [name]: maskedValue,
    });
  };

  const handleCEPLookup = async (cep: string) => {
    setIsLoadingCEP(true);
    
    try {
      const addressData = await fetchAddressByCEP(cep);
      
      if (addressData) {
        setFormData(prev => ({
          ...prev,
          address: addressData.logradouro,
          neighborhood: addressData.bairro,
          city: addressData.localidade,
          state: addressData.uf,
        }));
        
        // Focar no campo de número após preencher o endereço
        setTimeout(() => {
          numberInputRef.current?.focus();
        }, 100);
        
        toast({
          title: 'Endereço encontrado!',
          description: 'Preencha o número da residência.',
        });
      } else {
        toast({
          title: 'CEP não encontrado',
          description: 'Verifique o CEP digitado e tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCEP(false);
    }
  };

  const handleShippingChange = (shippingId: string) => {
    setSelectedShipping(shippingId);
    const option = shippingOptions.find(opt => opt.id === shippingId);
    if (option) {
      setShippingCost(option.price);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite um código de cupom',
        variant: 'destructive',
      });
      return;
    }

    setIsApplyingCoupon(true);

    try {
      // Validar cupom usando a função RPC do banco de dados
      // IMPORTANTE: Validar apenas com o subtotal dos produtos (sem frete)
      const result = await validateCoupon(couponCode.toUpperCase(), cartTotal);

      if (!result.valid) {
        toast({
          title: 'Cupom inválido',
          description: result.message,
          variant: 'destructive',
        });
        setIsApplyingCoupon(false);
        return;
      }

      // Garantir que o desconto não exceda o subtotal dos produtos
      const maxDiscount = Math.min(result.discount_amount || 0, cartTotal);
      
      // Aplicar desconto
      setAppliedCoupon(result);
      setDiscount(maxDiscount);
      
      toast({
        title: 'Cupom aplicado!',
        description: `Desconto de R$ ${maxDiscount.toFixed(2)} aplicado ao subtotal`,
      });
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível aplicar o cupom. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setDiscount(0);
    toast({
      title: 'Cupom removido',
      description: 'O desconto foi removido do pedido',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);

    try {
      // Validar CPF para pagamentos Asaas
      if (!formData.cpf) {
        toast({
          title: 'CPF obrigatório',
          description: 'Por favor, preencha seu CPF para continuar',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      // Validar dados do cartão se for pagamento com cartão
      if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
        if (!cardData.holderName || !cardData.number || !cardData.expiryMonth || !cardData.expiryYear || !cardData.ccv) {
          toast({
            title: 'Dados do cartão incompletos',
            description: 'Por favor, preencha todos os dados do cartão',
            variant: 'destructive',
          });
          setIsProcessing(false);
          return;
        }

        // Validar número do cartão
        if (!validateCardNumber(cardData.number)) {
          toast({
            title: 'Cartão inválido',
            description: 'O número do cartão informado é inválido',
            variant: 'destructive',
          });
          setIsProcessing(false);
          return;
        }
      }

      // Mapear método de pagamento para formato Asaas
      let asaasPaymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
      
      if (paymentMethod === 'pix') {
        asaasPaymentMethod = 'PIX';
      } else if (paymentMethod === 'boleto') {
        asaasPaymentMethod = 'BOLETO';
      } else if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
        asaasPaymentMethod = 'CREDIT_CARD';
      } else {
        toast({
          title: 'Método de pagamento inválido',
          description: 'Selecione um método de pagamento válido',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      const paymentData: any = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          name: item.product?.name || '',
          price: item.product?.price || 0,
          quantity: item.quantity,
          image_url: item.product?.image_url || '',
        })),
        customer: {
          name: formData.name,
          email: formData.email,
          cpfCnpj: formData.cpf.replace(/\D/g, ''),
          phone: formData.phone,
          postalCode: formData.zipCode,
          address: formData.address,
          addressNumber: formData.number,
          complement: formData.complement,
          province: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
        paymentMethod: asaasPaymentMethod,
        shipping_cost: shippingCost,
        discount: discount,
        coupon_code: couponCode || null,
      };

      // Adicionar dados do cartão se for pagamento com cartão
      if (asaasPaymentMethod === 'CREDIT_CARD') {
        paymentData.creditCard = {
          holderName: cardData.holderName,
          number: cardData.number.replace(/\s/g, ''),
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          ccv: cardData.ccv,
        };
        paymentData.creditCardHolderInfo = {
          name: formData.name,
          email: formData.email,
          cpfCnpj: formData.cpf.replace(/\D/g, ''),
          postalCode: formData.zipCode.replace(/\D/g, ''),
          addressNumber: formData.number,
          phone: formData.phone.replace(/\D/g, ''),
        };
      }

      const response = await createAsaasPayment(paymentData);

      if (response.success) {
        await clearCart();
        
        toast({
          title: 'Pedido criado com sucesso!',
          description: 'Redirecionando para pagamento...',
        });

        // Redirecionar para página de pagamento Asaas
        navigate(`/pagamento-asaas?payment_id=${response.paymentId}&order_id=${response.orderId}`);
      } else {
        throw new Error(response.error || 'Erro ao criar pagamento');
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      toast({
        title: 'Erro ao processar pedido',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Cálculo do total: (Subtotal - Desconto) + Frete
  // O desconto é aplicado APENAS ao subtotal dos produtos, não ao frete
  const total = cartTotal - discount + shippingCost;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/carrinho">Carrinho</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Finalizar Compra</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl xl:text-4xl font-bold mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="xl:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cpf">CPF {['pix', 'boleto'].includes(paymentMethod) && '*'}</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    required={['pix', 'boleto'].includes(paymentMethod)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Obrigatório para pagamentos via PIX e Boleto
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="zipCode">CEP *</Label>
                    <div className="relative">
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="00000-000"
                        required
                        disabled={isLoadingCEP}
                      />
                      {isLoadingCEP && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={isLoadingCEP}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      ref={numberInputRef}
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      required
                      disabled={isLoadingCEP}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      disabled={isLoadingCEP}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                      disabled={isLoadingCEP}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAZILIAN_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Options */}
            {shippingOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Opções de Frete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Progress bar para frete grátis */}
                  {cartTotal < 99 ? (
                    <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-950/20 dark:to-green-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Faltam <strong className="text-[#FF6B35]">R$ {(99 - cartTotal).toFixed(2)}</strong> para frete grátis
                        </span>
                        <span className="text-sm font-bold text-[#FF6B35]">
                          {Math.round((cartTotal / 99) * 100)}%
                        </span>
                      </div>
                      <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out shadow-md"
                          style={{
                            width: `${(cartTotal / 99) * 100}%`,
                            background: `linear-gradient(to right, 
                              ${cartTotal < 49.5 ? '#FF6B35' : cartTotal < 74.25 ? '#FFA726' : '#66BB6A'}, 
                              ${cartTotal < 49.5 ? '#FFA726' : cartTotal < 74.25 ? '#66BB6A' : '#4CAF50'})`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Continue comprando para ganhar frete grátis! 🚚
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">🎉</span>
                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                          Parabéns! Você ganhou frete grátis!
                        </span>
                        <span className="text-2xl">🚚</span>
                      </div>
                    </div>
                  )}

                  {isLoadingShipping ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Calculando frete...</span>
                    </div>
                  ) : (
                    <RadioGroup
                      value={selectedShipping}
                      onValueChange={handleShippingChange}
                      className="space-y-3"
                    >
                      {shippingOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label
                            htmlFor={option.id}
                            className="flex items-center justify-between cursor-pointer flex-1"
                          >
                            <div>
                              <p className="font-medium">{option.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {option.company} - {option.delivery_time}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#FF6B35]">
                                {option.price === 0 ? 'Grátis' : `R$ ${option.price.toFixed(2)}`}
                              </p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Mensagem quando CEP não preenchido */}
            {shippingOptions.length === 0 && formData.zipCode.replace(/\D/g, '').length < 8 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Opções de Frete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Preencha o CEP para calcular o frete</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingPaymentMethods ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Carregando métodos de pagamento...</span>
                  </div>
                ) : activePaymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum método de pagamento disponível no momento.</p>
                    <p className="text-xs text-muted-foreground mt-2">Entre em contato com o suporte.</p>
                  </div>
                ) : (
                  <>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      {activePaymentMethods.map((method) => (
                        <div
                          key={method.code}
                          className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                        >
                            <RadioGroupItem value={method.code} id={method.code} />
                            <Label
                              htmlFor={method.code}
                              className="flex items-center gap-3 cursor-pointer flex-1"
                            >
                              {/* Ícone do método de pagamento */}
                              {method.code === 'pix' && (
                                <svg className="h-5 w-5 text-[#FF6B35]" viewBox="0 0 512 512" fill="currentColor">
                                  <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.5H112.6C132.6 391.5 151.5 383.7 165.7 369.5L242.4 292.5zM262.5 218.9C257.1 224.3 247.8 224.3 242.4 218.9L165.7 142.1C151.5 127.9 132.6 120.1 112.6 120.1H103.3L200.7 22.76C231.1-7.586 280.3-7.586 310.6 22.76L407.7 120.1H392.6C372.6 120.1 353.7 127.9 339.5 142.1L262.5 218.9zM112.6 142.1C126.4 142.1 139.1 148.3 149.7 158.1L226.4 236.1C239.9 249.5 261.9 249.5 275.4 236.1L352.1 158.1C362.7 148.3 375.4 142.1 389.2 142.1H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H389.2C375.4 368.9 362.7 362.7 352.1 352.9L275.4 275.3C261.9 261.8 239.9 261.8 226.4 275.3L149.7 352.9C139.1 362.7 126.4 368.9 112.6 368.9H71.3L13.02 310.6C-17.32 280.3-17.32 231.1 13.02 200.8L71.3 142.1H112.6z"/>
                                </svg>
                              )}
                              {method.code === 'boleto' && (
                                <Banknote className="h-5 w-5 text-[#FF6B35]" />
                              )}
                              {(method.code === 'credit_card' || method.code === 'debit_card') && (
                                <CreditCard className="h-5 w-5 text-[#FF6B35]" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{method.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {method.description}
                                </p>
                              </div>
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>

                    {/* Formulário de Cartão de Crédito/Débito */}
                    {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                      <div className="mt-6 space-y-4 border-t pt-4">
                        <h3 className="font-semibold text-lg">Dados do Cartão</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número do Cartão *</Label>
                          <Input
                            id="cardNumber"
                            name="number"
                            value={cardData.number}
                            onChange={handleCardInputChange}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            required
                          />
                          {cardBrand && cardBrand !== 'Desconhecido' && (
                            <p className="text-xs text-muted-foreground">Bandeira: {cardBrand}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="holderName">Nome do Titular *</Label>
                          <Input
                            id="holderName"
                            name="holderName"
                            value={cardData.holderName}
                            onChange={handleCardInputChange}
                            placeholder="Nome como está no cartão"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Validade *</Label>
                            <Input
                              id="expiry"
                              name="expiry"
                              value={cardData.expiryMonth && cardData.expiryYear ? `${cardData.expiryMonth}/${cardData.expiryYear.slice(-2)}` : ''}
                              onChange={handleCardInputChange}
                              placeholder="MM/AA"
                              maxLength={5}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ccv">CVV *</Label>
                            <Input
                              id="ccv"
                              name="ccv"
                              value={cardData.ccv}
                              onChange={handleCardInputChange}
                              placeholder="123"
                              maxLength={4}
                              type="password"
                              required
                            />
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <p className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>🔒 Pagamento Seguro:</strong> Seus dados são criptografados e processados de forma segura.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Informação sobre PIX */}
                    {paymentMethod === 'pix' && (
                      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
                        <p className="text-sm text-green-900 dark:text-green-100">
                          <strong>PIX:</strong> Após finalizar o pedido, você receberá um QR Code para pagamento instantâneo.
                        </p>
                      </div>
                    )}

                    {/* Informação sobre Boleto */}
                    {paymentMethod === 'boleto' && (
                      <div className="bg-accent/30 border border-accent rounded-lg p-4 mt-4">
                        <p className="text-sm">
                          <strong>Boleto:</strong> O boleto será gerado após a finalização do pedido com vencimento em 3 dias úteis.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product?.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        R$ {((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Cupom de Desconto */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="coupon" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Cupom de Desconto
                  </Label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="font-medium text-green-900 dark:text-green-100">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            Desconto de R$ {appliedCoupon.discount_amount?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        placeholder="Digite o cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={isApplyingCoupon}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            applyCoupon();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                      >
                        {isApplyingCoupon ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Aplicando...
                          </>
                        ) : (
                          'Aplicar'
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto</span>
                      <span className="font-medium text-green-600">
                        - R$ {discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-[#FF6B35]">
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processando...' : 'Finalizar Pagamento'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Usar useEffect para redirecionamento
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [loading, user, navigate, location]);

  // Verificar se o carrinho está vazio
  if (!loading && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Carrinho vazio</h1>
        <p className="text-muted-foreground mb-6">
          Adicione produtos ao carrinho antes de finalizar a compra.
        </p>
        <Link to="/">
          <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">
            Ir para a loja
          </Button>
        </Link>
      </div>
    );
  }

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostrar mensagem enquanto redireciona
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
          <p className="text-muted-foreground">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return <CheckoutForm />;
}
