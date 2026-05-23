import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import { cpfMask, phoneMask, cepMask, BRAZILIAN_STATES } from '@/lib/masks';

interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
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
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, signInWithGoogle, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const numberInputRef = useRef<HTMLInputElement>(null);

  const returnUrl = (location.state as any)?.returnUrl || (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (user && profile) {
      navigate(returnUrl, { replace: true });
    }
  }, [user, profile, returnUrl, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let maskedValue = value;

    if (name === 'cpf') {
      maskedValue = cpfMask(value);
    } else if (name === 'phone') {
      maskedValue = phoneMask(value);
    } else if (name === 'zipCode') {
      maskedValue = cepMask(value);
    }

    setFormData(prev => ({ ...prev, [name]: maskedValue }));
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
    if (formData.zipCode) {
      fetchAddressByCep(formData.zipCode);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter no mínimo 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password);

    if (error) {
      toast({
        title: 'Erro ao criar conta',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: formData.name,
            phone: formData.phone,
            cpf: formData.cpf,
            zip_code: formData.zipCode,
            address: formData.address,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
          });

        if (profileError) {
          console.error('Erro ao salvar perfil:', profileError);
        }
      }

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo à QBlox Kids!',
        variant: 'success',
      });

      navigate(returnUrl, { replace: true });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: 'Conta criada',
        description: 'Mas houve um erro ao salvar seus dados. Por favor, atualize seu perfil.',
        variant: 'destructive',
      });
      navigate(returnUrl, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading || isGoogleLoading}
              onClick={async () => {
                setIsGoogleLoading(true);
                const { error } = await signInWithGoogle(returnUrl);
                if (error) {
                  toast({
                    title: 'Erro ao entrar com Google',
                    description: error.message || 'Tente novamente mais tarde',
                    variant: 'destructive',
                  });
                  setIsGoogleLoading(false);
                }
              }}
            >
              {isGoogleLoading ? 'Redirecionando para o Google...' : 'Continuar com Google'}
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou crie conta com e-mail</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados de Acesso</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isGoogleLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repita a senha"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isGoogleLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} required disabled={isLoading} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP *</Label>
                  <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} onBlur={handleCepBlur} required disabled={isLoading || isLoadingCep} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required disabled={isLoading || isLoadingCep} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input ref={numberInputRef} id="number" name="number" value={formData.number} onChange={handleInputChange} required disabled={isLoading} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" name="complement" value={formData.complement} onChange={handleInputChange} disabled={isLoading} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} required disabled={isLoading || isLoadingCep} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required disabled={isLoading || isLoadingCep} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))} disabled={isLoading || isLoadingCep}>
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
            </div>

            <Button type="submit" className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link to="/login" className="text-[#FF6B35] hover:underline font-medium">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
