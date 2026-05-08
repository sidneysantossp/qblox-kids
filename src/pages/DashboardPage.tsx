import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, LogOut, Save, Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';

interface Order {
  id: string;
  total_amount: number;
  shipping_cost: number;
  discount: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

type Section = 'dados' | 'compras';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const numberInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState<Section>('dados');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    zip_code: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Carregar dados do perfil
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
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
            full_name: data.full_name || '',
            phone: data.phone || '',
            zip_code: data.zip_code || '',
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

    loadProfile();
  }, [user]);

  // Carregar pedidos
  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar pedidos:', error);
          return;
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: AddressData = await response.json();

      if (data && !('erro' in data)) {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));

        setTimeout(() => {
          numberInputRef.current?.focus();
        }, 100);

        toast({
          title: 'Endereço encontrado!',
          description: 'Os campos foram preenchidos automaticamente',
          variant: 'success',
        });
      } else {
        toast({
          title: 'CEP não encontrado',
          description: 'Verifique o CEP digitado',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: 'Erro ao buscar CEP',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleCepBlur = () => {
    if (formData.zip_code) {
      fetchAddressByCep(formData.zip_code);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: formData.full_name,
          phone: formData.phone,
          zip_code: formData.zip_code,
          address: formData.address,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        });

      if (error) throw error;

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso',
        variant: 'success',
      });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar seu perfil',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Aguardando Pagamento', variant: 'secondary' },
      processing: { label: 'Em Processamento', variant: 'default' },
      shipped: { label: 'Enviado', variant: 'outline' },
      delivered: { label: 'Entregue', variant: 'default' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      cash: 'Dinheiro na Entrega',
      card: 'Cartão de Crédito',
      pix: 'PIX',
      boleto: 'Boleto',
    };
    return methodMap[method] || method;
  };

  // Componente Sidebar
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-foreground">Minha Conta</h2>
        <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => {
            setActiveSection('dados');
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeSection === 'dados'
              ? 'bg-[#FF6B35] text-white'
              : 'hover:bg-accent text-foreground'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="font-medium">Meus Dados</span>
        </button>

        <button
          onClick={() => {
            setActiveSection('compras');
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeSection === 'compras'
              ? 'bg-[#FF6B35] text-white'
              : 'hover:bg-accent text-foreground'
          }`}
        >
          <Package className="h-5 w-5" />
          <span className="font-medium">Minhas Compras</span>
        </button>
      </nav>

      <Separator />

      <div className="p-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card className="sticky top-24">
              <SidebarContent />
            </Card>
          </aside>

          {/* Mobile Menu */}
          <div className="lg:hidden fixed top-20 left-4 z-50">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Meus Dados Section */}
            {activeSection === 'dados' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Meus Dados</h1>
                  <p className="text-muted-foreground mt-2">
                    Gerencie suas informações pessoais e endereço
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Atualize seus dados cadastrais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Nome Completo</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            placeholder="Seu nome completo"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="(00) 00000-0000"
                            required
                          />
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <h3 className="text-lg font-semibold">Endereço</h3>

                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zip_code">CEP</Label>
                          <Input
                            id="zip_code"
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleInputChange}
                            onBlur={handleCepBlur}
                            placeholder="00000-000"
                            maxLength={9}
                            disabled={isLoadingCep}
                          />
                          {isLoadingCep && (
                            <p className="text-sm text-muted-foreground">
                              Buscando endereço...
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 xl:col-span-2">
                          <Label htmlFor="address">Rua</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Nome da rua"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="number">Número</Label>
                          <Input
                            id="number"
                            name="number"
                            ref={numberInputRef}
                            value={formData.number}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                          />
                        </div>

                        <div className="space-y-2 xl:col-span-2">
                          <Label htmlFor="complement">Complemento</Label>
                          <Input
                            id="complement"
                            name="complement"
                            value={formData.complement}
                            onChange={handleInputChange}
                            placeholder="Apto, bloco, etc (opcional)"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="neighborhood">Bairro</Label>
                          <Input
                            id="neighborhood"
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                            placeholder="Bairro"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Cidade"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">Estado</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="UF"
                            required
                            maxLength={2}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Minhas Compras Section */}
            {activeSection === 'compras' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Minhas Compras</h1>
                  <p className="text-muted-foreground mt-2">
                    Acompanhe seus pedidos e histórico de compras
                  </p>
                </div>

                {loadingOrders ? (
                  <Card>
                    <CardContent className="py-12">
                      <p className="text-center text-muted-foreground">
                        Carregando pedidos...
                      </p>
                    </CardContent>
                  </Card>
                ) : orders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <div className="text-center space-y-4">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-semibold">Nenhum pedido ainda</h3>
                          <p className="text-muted-foreground">
                            Quando você fizer uma compra, ela aparecerá aqui
                          </p>
                        </div>
                        <Button asChild className="bg-[#FF6B35] hover:bg-[#FF5722]">
                          <Link to="/">Começar a Comprar</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="font-semibold text-lg">
                                  Pedido #{order.id.slice(0, 8)}
                                </h3>
                                {getStatusBadge(order.status)}
                              </div>
                              
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>
                                  Data: {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </p>
                                <p>
                                  Pagamento: {getPaymentMethodLabel(order.payment_method || 'card')}
                                </p>
                                <p>
                                  {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'itens'}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold text-[#FF6B35]">
                                  R$ {order.total_amount.toFixed(2)}
                                </p>
                              </div>

                              <Button
                                asChild
                                variant="outline"
                                className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                              >
                                <Link to={`/minha-conta/pedido/${order.id}`}>
                                  Ver Detalhes
                                  <ChevronRight className="h-4 w-4 ml-2" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
