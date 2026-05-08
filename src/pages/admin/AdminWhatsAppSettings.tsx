import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Save, Loader2, Shield, RefreshCw } from 'lucide-react';
import { getWhatsAppSettings, updateWhatsAppSettings, createWhatsAppSettings } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import type { WhatsAppSettings } from '@/types';

export default function AdminWhatsAppSettings() {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showButton, setShowButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userInfo, setUserInfo] = useState<{ email: string; role: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User info loaded:', user);
      if (user) {
        // Check role in multiple locations
        const role = user.user_metadata?.role || user.app_metadata?.role || 'Não definido';
        console.log('User role:', role);
        console.log('User metadata:', user.user_metadata);
        console.log('App metadata:', user.app_metadata);
        
        setUserInfo({
          email: user.email || 'Não disponível',
          role: role as string
        });
      } else {
        console.log('Nenhum usuário autenticado');
      }
    } catch (error) {
      console.error('Erro ao carregar informações do usuário:', error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando configurações do WhatsApp...');
      const data = await getWhatsAppSettings();
      console.log('Configurações carregadas:', data);
      
      if (data) {
        setSettings(data);
        setPhoneNumber(data.phone_number);
        setWelcomeMessage(data.welcome_message);
        setShowButton(data.show_button ?? true);
        console.log('Configurações carregadas - show_button:', data.show_button);
      } else {
        console.warn('Nenhuma configuração encontrada - usando valores padrão');
        // Definir valores padrão
        setSettings(null);
        setPhoneNumber('55 (11) 99999-9999');
        setWelcomeMessage('Olá! Bem-vindo à QBLOX KIDS! Como posso ajudar você hoje? 😊');
        setShowButton(true);
        
        toast({
          title: 'Configuração Inicial',
          description: 'Configure o WhatsApp pela primeira vez. Preencha os campos e clique em Salvar.',
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: 'Erro ao Carregar',
        description: error.message || 'Não foi possível carregar as configurações do WhatsApp.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validação
    if (!phoneNumber.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um número de telefone.',
        variant: 'destructive',
      });
      return;
    }

    if (!welcomeMessage.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira uma mensagem de boas-vindas.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      console.log('Salvando configurações:', { settings, phoneNumber, welcomeMessage, showButton });
      
      let result;
      
      // Se não existir configuração, criar nova
      if (!settings) {
        console.log('Criando nova configuração...');
        result = await createWhatsAppSettings({
          phone_number: phoneNumber,
          welcome_message: welcomeMessage,
          show_button: showButton,
        });
      } else {
        console.log('Atualizando configuração existente...');
        result = await updateWhatsAppSettings(settings.id, {
          phone_number: phoneNumber,
          welcome_message: welcomeMessage,
          show_button: showButton,
        });
      }

      console.log('Configurações salvas com sucesso:', result);
      console.log('show_button salvo como:', result.show_button);

      toast({
        title: 'Sucesso! ✅',
        description: 'Configurações do WhatsApp atualizadas com sucesso!',
        className: 'bg-green-50 border-green-200',
      });

      // Recarregar configurações
      await loadSettings();
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      
      let errorMessage = 'Não foi possível salvar as configurações. Tente novamente.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 'PGRST301') {
        errorMessage = 'Você não tem permissão para modificar estas configurações. Faça login como administrador.';
      } else if (error.code === '42501') {
        errorMessage = 'Acesso negado. Você precisa ser um administrador para modificar estas configurações.';
      }
      
      toast({
        title: 'Erro ao Salvar',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formata: 55 (11) 99999-9999
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)} (${numbers.slice(2)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const testWhatsApp = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um número de telefone primeiro.',
        variant: 'destructive',
      });
      return;
    }

    let phone = phoneNumber.replace(/\D/g, '');
    
    // Garantir que o número tenha o código do país (55 para Brasil)
    if (!phone.startsWith('55')) {
      phone = '55' + phone;
    }
    
    const message = encodeURIComponent(welcomeMessage || 'Olá!');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Configurações de Botão do WhatsApp</h1>
        <p className="text-muted-foreground">
          Configure o botão flutuante do WhatsApp que aparece no site
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Card de Status do Usuário */}
        {!userInfo && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-red-700">
                <Shield className="h-4 w-4" />
                Autenticação Necessária
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-red-600">
                Você precisa estar logado como administrador para acessar esta página.
              </p>
              <Button
                onClick={() => window.location.href = '/login'}
                className="w-full"
              >
                Ir para Login
              </Button>
            </CardContent>
          </Card>
        )}
        
        {userInfo && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Status de Autenticação
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadUserInfo}
                  className="h-8"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Atualizar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Função:</strong> <span className={userInfo.role === 'admin' ? 'text-green-600 font-semibold' : 'text-red-600'}>{userInfo.role}</span></p>
              {userInfo.role !== 'admin' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
                  <p className="text-red-600 text-xs font-medium">⚠️ Você precisa ser administrador para salvar configurações</p>
                  <p className="text-red-500 text-xs mt-1">Faça login com uma conta de administrador ou entre em contato com o suporte.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              Configurações do WhatsApp
            </CardTitle>
            <CardDescription>
              Configure o número de telefone e a mensagem padrão que será enviada quando os clientes clicarem no botão do WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Número de Telefone</Label>
              <Input
                id="phone"
                type="text"
                placeholder="55 (11) 99999-9999"
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength={20}
              />
              <p className="text-sm text-muted-foreground">
                Formato: Código do país + DDD + Número (ex: 5511999999999)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem de Boas-Vindas</Label>
              <Textarea
                id="message"
                placeholder="Olá! Bem-vindo à QBLOX KIDS! Como posso ajudar você hoje? 😊"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-sm text-muted-foreground">
                Esta mensagem será pré-preenchida quando o cliente abrir o WhatsApp ({welcomeMessage.length}/500 caracteres)
              </p>
            </div>

            {/* Toggle para mostrar/ocultar botão */}
            <div className="flex items-center justify-between space-x-4 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="show-button" className="text-base font-medium">
                  Exibir Botão do WhatsApp
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ative ou desative o botão flutuante do WhatsApp no site
                </p>
              </div>
              <Switch
                id="show-button"
                checked={showButton}
                onCheckedChange={setShowButton}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving || userInfo?.role !== 'admin'}
                className="flex-1"
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

              <Button
                onClick={testWhatsApp}
                variant="outline"
                disabled={!phoneNumber.trim()}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Testar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
            <CardDescription>
              Veja como o botão do WhatsApp aparecerá no site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted rounded-lg p-8 min-h-[200px]">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  O botão flutuante aparecerá no canto inferior direito do site após o usuário rolar a página
                </p>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${showButton ? 'bg-green-500' : 'bg-red-500'}`} />
                  <p className="text-sm font-medium">
                    Status: {showButton ? 'Ativo' : 'Desativado'}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <button
                  className={`bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-all duration-300 ${
                    !showButton ? 'opacity-30' : ''
                  }`}
                  style={{
                    animation: showButton ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                  }}
                  disabled={!showButton}
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
