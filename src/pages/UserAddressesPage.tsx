import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserDashboardLayout from '@/components/layouts/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import { MapPin, Loader2 } from 'lucide-react';
import { BRAZILIAN_STATES, cepMask, fetchAddressByCEP } from '@/lib/masks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UserAddressesPage() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const numberInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [formData, setFormData] = useState({
    zip_code: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    setFormData({
      zip_code: profile?.zip_code || '',
      address: profile?.address || '',
      number: profile?.number || '',
      complement: profile?.complement || '',
      neighborhood: profile?.neighborhood || '',
      city: profile?.city || '',
      state: profile?.state || '',
    });
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'zip_code' ? cepMask(value) : value,
    }));
  };

  const handleCepBlur = async () => {
    const cleanCep = formData.zip_code.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const data = await fetchAddressByCEP(cleanCep);
      if (!data) {
        toast({
          title: 'CEP não encontrado',
          description: 'Verifique o CEP digitado e tente novamente.',
          variant: 'destructive',
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        address: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      }));
      window.setTimeout(() => numberInputRef.current?.focus(), 100);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          zip_code: formData.zip_code || null,
          address: formData.address || null,
          number: formData.number || null,
          complement: formData.complement || null,
          neighborhood: formData.neighborhood || null,
          city: formData.city || null,
          state: formData.state || null,
        })
        .eq('id', profile.id);

      if (error) throw error;
      await refreshProfile();
      toast({
        title: 'Endereço atualizado',
        description: 'Seu endereço foi salvo com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar endereço',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserDashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Endereços</h1>
          <p className="text-muted-foreground">Gerencie o endereço principal de entrega da sua conta.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleInputChange} onBlur={handleCepBlur} disabled={isLoading || isLoadingCep} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} disabled={isLoading || isLoadingCep} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input ref={numberInputRef} id="number" name="number" value={formData.number} onChange={handleInputChange} disabled={isLoading} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" name="complement" value={formData.complement} onChange={handleInputChange} disabled={isLoading} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} disabled={isLoading || isLoadingCep} />
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} disabled={isLoading || isLoadingCep} />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))} disabled={isLoading || isLoadingCep}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAZILIAN_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar endereço
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}
