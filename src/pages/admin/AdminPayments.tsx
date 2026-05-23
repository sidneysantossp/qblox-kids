import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/admin/DataTable';
import { getAllPaymentMethods, updatePaymentMethod } from '@/db/admin-api';
import { getSiteSettings, updateSiteSetting } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Eye, EyeOff } from 'lucide-react';
import type { SiteSetting } from '@/types';

export default function AdminPayments() {
  const [methods, setMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [stripeApiKey, setStripeApiKey] = useState('');
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [asaasApiKey, setAsaasApiKey] = useState('');
  const [asaasEnvironment, setAsaasEnvironment] = useState('sandbox');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAsaasKey, setShowAsaasKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [methodsData, settingsData] = await Promise.all([
        getAllPaymentMethods(),
        getSiteSettings()
      ]);
      
      setMethods(methodsData);
      setSettings(settingsData);
      
      // Carregar valores das configurações do Stripe
      const apiKeySetting = settingsData.find(s => s.setting_key === 'stripe_api_key');
      const publishableKeySetting = settingsData.find(s => s.setting_key === 'stripe_publishable_key');
      
      setStripeApiKey(apiKeySetting?.setting_value || '');
      setStripePublishableKey(publishableKeySetting?.setting_value || '');
      
      // Carregar valores das configurações do Asaas
      const asaasApiKeySetting = settingsData.find(s => s.setting_key === 'asaas_api_key');
      const asaasEnvironmentSetting = settingsData.find(s => s.setting_key === 'asaas_environment');
      
      setAsaasApiKey(asaasApiKeySetting?.setting_value || '');
      setAsaasEnvironment(asaasEnvironmentSetting?.setting_value || 'sandbox');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!asaasApiKey.trim()) {
      toast({
        title: 'Erro',
        description: 'Informe a chave de API do Asaas antes de salvar.',
        variant: 'destructive',
      });
      return;
    }

    if (!['sandbox', 'production'].includes(asaasEnvironment)) {
      toast({
        title: 'Erro',
        description: 'Selecione um ambiente válido do Asaas.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);

      await Promise.all([
        updateSiteSetting('stripe_api_key', stripeApiKey),
        updateSiteSetting('stripe_publishable_key', stripePublishableKey),
        updateSiteSetting('asaas_api_key', asaasApiKey),
        updateSiteSetting('asaas_environment', asaasEnvironment)
      ]);
      
      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso',
      });
      
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePaymentMethod = async (methodId: string, currentStatus: boolean) => {
    try {
      await updatePaymentMethod(methodId, { is_active: !currentStatus });
      
      toast({
        title: 'Sucesso',
        description: `Método de pagamento ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`,
      });
      
      await loadData();
    } catch (error) {
      console.error('Erro ao atualizar método de pagamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o método de pagamento',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
    },
    {
      key: 'code',
      label: 'Código',
      render: (method: any) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">{method.code}</code>
      ),
    },
    {
      key: 'description',
      label: 'Descrição',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (method: any) => (
        <div className="flex items-center gap-3">
          <Badge variant={method.is_active ? 'default' : 'secondary'}>
            {method.is_active ? 'Ativo' : 'Inativo'}
          </Badge>
          <div className="flex items-center gap-2">
            <Switch
              checked={method.is_active}
              onCheckedChange={() => handleTogglePaymentMethod(method.id, method.is_active)}
              aria-label={`Alternar status de ${method.name}`}
            />
            <span className="text-xs text-muted-foreground">
              {method.is_active ? 'Desativar' : 'Ativar'}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações de Pagamento</h1>
        <p className="text-muted-foreground">Gerencie métodos de pagamento e integrações</p>
      </div>

      {/* Configurações do Stripe */}
      <Card>
        <CardHeader>
          <CardTitle>Integração Stripe</CardTitle>
          <CardDescription>
            Configure suas chaves de API do Stripe para processar pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe_api_key">Chave Secreta (Secret Key)</Label>
            <div className="relative">
              <Input
                id="stripe_api_key"
                type={showApiKey ? 'text' : 'password'}
                value={stripeApiKey}
                onChange={(e) => setStripeApiKey(e.target.value)}
                placeholder="sk_test_..."
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sua chave secreta do Stripe (começa com sk_)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe_publishable_key">Chave Pública (Publishable Key)</Label>
            <Input
              id="stripe_publishable_key"
              type="text"
              value={stripePublishableKey}
              onChange={(e) => setStripePublishableKey(e.target.value)}
              placeholder="pk_test_..."
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Sua chave pública do Stripe (começa com pk_)
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving || isLoading}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Asaas */}
      <Card>
        <CardHeader>
          <CardTitle>Integração Asaas</CardTitle>
          <CardDescription>
            Configure suas chaves de API do Asaas para processar pagamentos via PIX, Boleto e Cartão de Crédito
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asaas_api_key">Chave de API (API Key)</Label>
            <div className="relative">
              <Input
                id="asaas_api_key"
                type={showAsaasKey ? 'text' : 'password'}
                value={asaasApiKey}
                onChange={(e) => setAsaasApiKey(e.target.value)}
                placeholder="$aact_..."
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowAsaasKey(!showAsaasKey)}
              >
                {showAsaasKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sua chave de API do Asaas (encontrada em Configurações → Integrações)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asaas_environment">Ambiente</Label>
            <select
              id="asaas_environment"
              value={asaasEnvironment}
              onChange={(e) => setAsaasEnvironment(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="sandbox">Sandbox (Testes)</option>
              <option value="production">Produção</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Use "Sandbox" para testes e "Produção" para pagamentos reais
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving || isLoading}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métodos de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pagamento</CardTitle>
          <CardDescription>
            Métodos de pagamento disponíveis na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={methods}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Buscar método..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
