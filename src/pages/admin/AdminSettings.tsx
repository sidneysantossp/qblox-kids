import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Package, TestTube, AlertCircle, Plug, Bug } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Setting {
  key: string;
  value: string;
  description: string;
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [correiosApiKey, setCorreiosApiKey] = useState('');
  const [correiosCepOrigem, setCorreiosCepOrigem] = useState('');
  const [userInfo, setUserInfo] = useState<{ email: string; role: string } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const { profile, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserInfo({
        email: user.email || '',
        role: profile?.role || 'user'
      });
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('settings')
        .select('key, value, description')
        .in('key', ['correios_api_key', 'correios_cep_origem']);

      if (error) {
        console.error('Erro ao buscar settings:', error);
        throw error;
      }

      console.log('Settings carregadas:', data);

      if (data) {
        const apiKeySetting = data.find((s: Setting) => s.key === 'correios_api_key');
        const cepOrigemSetting = data.find((s: Setting) => s.key === 'correios_cep_origem');

        setCorreiosApiKey(apiKeySetting?.value || '');
        setCorreiosCepOrigem(cepOrigemSetting?.value || '');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Check current user and session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Erro ao obter usuário:', userError);
        toast({
          title: 'Erro de Autenticação',
          description: 'Não foi possível verificar sua sessão. Faça login novamente.',
          variant: 'destructive',
        });
        return;
      }

      if (!user) {
        console.error('Usuário não autenticado');
        toast({
          title: 'Não Autenticado',
          description: 'Você precisa estar logado para salvar configurações.',
          variant: 'destructive',
        });
        return;
      }

      if (!isAdmin) {
        toast({
          title: 'Sem Permissão',
          description: 'Você precisa ser administrador para salvar configurações.',
          variant: 'destructive',
        });
        return;
      }

      // Validate CEP format
      const cepLimpo = correiosCepOrigem.replace(/\D/g, '');
      if (correiosCepOrigem && cepLimpo.length !== 8) {
        toast({
          title: 'CEP Inválido',
          description: 'O CEP deve ter 8 dígitos. Use o formato 00000-000',
          variant: 'destructive',
        });
        return;
      }

      // Upsert Correios API Key
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from('settings')
        .upsert(
          { 
            key: 'correios_api_key', 
            value: correiosApiKey || '',
            description: 'Chave de API dos Correios para cálculo de frete'
          },
          { 
            onConflict: 'key',
            ignoreDuplicates: false 
          }
        )
        .select();

      if (apiKeyError) {
        console.error('Erro ao salvar API key:', apiKeyError);
        toast({
          title: 'Erro ao Salvar API Key',
          description: `${apiKeyError.message}${apiKeyError.hint ? ' - ' + apiKeyError.hint : ''}`,
          variant: 'destructive',
        });
        return;
      }
      // Upsert CEP Origem
      const { data: cepData, error: cepError } = await supabase
        .from('settings')
        .upsert(
          { 
            key: 'correios_cep_origem', 
            value: correiosCepOrigem || '',
            description: 'CEP de origem para cálculo de frete (localização do estoque)'
          },
          { 
            onConflict: 'key',
            ignoreDuplicates: false 
          }
        )
        .select();

      if (cepError) {
        console.error('Erro ao salvar CEP origem:', cepError);
        toast({
          title: 'Erro ao Salvar CEP',
          description: `${cepError.message}${cepError.hint ? ' - ' + cepError.hint : ''}`,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso',
      });

      // Reload settings to confirm
      await loadSettings();
      
    } catch (error: any) {
      console.error('❌ ERRO GERAL ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: error?.message || 'Não foi possível salvar as configurações',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCorreiosCepOrigem(formatted);
  };

  const debugUserInfo = async () => {
    try {
      console.log('=== DEBUG: INFORMAÇÕES DO USUÁRIO ===');
      
      // Get user from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ Erro ao obter usuário:', userError);
        return;
      }

      console.log('📧 Email:', user.email);
      console.log('🆔 User ID:', user.id);
      console.log('👤 User Metadata:', user.user_metadata);
      console.log('📱 App Metadata:', user.app_metadata);
      console.log('🎭 Role (user_metadata):', user.user_metadata?.role);
      
      // Call debug function
      const { data: debugData, error: debugError } = await supabase
        .rpc('debug_user_info');

      if (debugError) {
        console.error('❌ Erro ao chamar debug_user_info:', debugError);
      } else {
        console.log('🔍 Debug Info do Banco:', debugData);
      }

      // Try to call is_admin directly
      const { data: isAdminData, error: isAdminError } = await supabase
        .rpc('is_admin');

      if (isAdminError) {
        console.error('❌ Erro ao chamar is_admin:', isAdminError);
      } else {
        console.log('✅ is_admin() retornou:', isAdminData);
      }

      console.log('=== FIM DEBUG ===');
      
      toast({
        title: 'Debug Info',
        description: 'Verifique o console (F12) para ver as informações',
      });

    } catch (error: any) {
      console.error('❌ Erro no debug:', error);
    }
  };

  const testConnection = async () => {
    try {
      setTesting(true);
      setConnectionStatus('idle');
      setErrorDetails('');

      console.log('=== TESTANDO CONEXÃO ===');

      // Check authentication using auth.getUser() - this is safe and doesn't query auth.users table
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('✓ Usuário autenticado:', user.email);
      console.log('✓ User ID:', user.id);
      console.log('✓ Role (user_metadata):', user.user_metadata?.role);
      console.log('✓ User Metadata completo:', user.user_metadata);

      // Verify user is admin
      if (user.user_metadata?.role !== 'admin') {
        throw new Error('Você precisa ser administrador para salvar configurações');
      }

      console.log('✓ Permissão de admin confirmada no frontend');

      // Call is_admin function to verify backend
      const { data: isAdminResult, error: isAdminError } = await supabase
        .rpc('is_admin');

      if (isAdminError) {
        console.error('❌ Erro ao verificar is_admin:', isAdminError);
        throw new Error(`Erro ao verificar permissões: ${isAdminError.message}`);
      }

      console.log('✓ is_admin() retornou:', isAdminResult);

      if (!isAdminResult) {
        throw new Error('A função is_admin() retornou false. Faça logout e login novamente.');
      }

      console.log('✓ Permissão de admin confirmada no backend');

      // Try to read from settings table
      const { data: readData, error: readError } = await supabase
        .from('settings')
        .select('key, value, description')
        .limit(1);

      if (readError) {
        console.error('❌ Erro ao ler settings:', readError);
        throw new Error(`Erro de leitura: ${readError.message}`);
      }

      console.log('✓ Leitura bem-sucedida');

      // Try to write a test value
      const testKey = `test_connection_${Date.now()}`;
      const { data: writeData, error: writeError } = await supabase
        .from('settings')
        .upsert(
          { 
            key: testKey, 
            value: 'test_value',
            description: 'Teste de conexão - pode deletar'
          },
          { 
            onConflict: 'key',
            ignoreDuplicates: false 
          }
        )
        .select();

      if (writeError) {
        console.error('❌ Erro ao escrever settings:', writeError);
        console.error('❌ Detalhes do erro:', {
          message: writeError.message,
          details: writeError.details,
          hint: writeError.hint,
          code: writeError.code
        });
        throw new Error(`Erro de escrita: ${writeError.message}${writeError.hint ? ' - ' + writeError.hint : ''}`);
      }

      console.log('✓ Escrita bem-sucedida');

      // Clean up test data
      const { error: deleteError } = await supabase
        .from('settings')
        .delete()
        .eq('key', testKey);

      if (deleteError) {
        console.warn('⚠️ Aviso: Não foi possível deletar dados de teste:', deleteError.message);
        // Don't throw error here, the main test passed
      } else {
        console.log('✓ Limpeza bem-sucedida');
      }

      console.log('=== TESTE CONCLUÍDO COM SUCESSO ===');
      setConnectionStatus('success');
      toast({
        title: 'Conexão OK',
        description: 'Você tem permissão para salvar configurações!',
      });

    } catch (error: any) {
      console.error('❌ Teste de conexão falhou:', error);
      setConnectionStatus('error');
      setErrorDetails(error.message || 'Erro desconhecido');
      toast({
        title: 'Erro no Teste',
        description: error.message || 'Falha ao testar conexão',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações do sistema
        </p>
      </div>

      {/* Debug Info Card */}
      {userInfo && (
        <Card className={userInfo.role === 'admin' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900'}>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="text-sm space-y-1">
                <p><strong>Usuário:</strong> {userInfo.email}</p>
                <p><strong>Função:</strong> <span className={userInfo.role === 'admin' ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-yellow-600 dark:text-yellow-400'}>{userInfo.role}</span></p>
                <p className="text-xs text-muted-foreground mt-2">
                  {userInfo.role === 'admin' 
                    ? '✓ Você tem permissão de administrador' 
                    : '⚠️ Você precisa ser administrador para salvar configurações'}
                </p>
              </div>
              
              {userInfo.role === 'admin' && (
                <div className="pt-2 border-t">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={testConnection}
                      disabled={testing}
                    >
                      {testing ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <Plug className="mr-2 h-3 w-3" />
                          Testar Conexão
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={debugUserInfo}
                      title="Ver informações de debug no console (F12)"
                    >
                      <Bug className="mr-2 h-3 w-3" />
                      Debug
                    </Button>
                  </div>
                  
                  {connectionStatus === 'success' && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      ✓ Conexão testada com sucesso! Você pode salvar configurações.
                    </p>
                  )}
                  
                  {connectionStatus === 'error' && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      ✗ Erro: {errorDetails}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {userInfo && userInfo.role !== 'admin' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sem Permissão</AlertTitle>
          <AlertDescription>
            Você precisa ser administrador para gerenciar configurações. 
            Entre em contato com um administrador do sistema ou consulte o arquivo SETUP_ADMIN.md para instruções.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>Integração Correios</CardTitle>
          </div>
          <CardDescription>
            Configure a integração com os Correios para cálculo de frete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="correios-api-key">
              Chave de API dos Correios
            </Label>
            <Input
              id="correios-api-key"
              type="password"
              placeholder="Digite a chave de API dos Correios"
              value={correiosApiKey}
              onChange={(e) => setCorreiosApiKey(e.target.value)}
              className="max-w-xl"
            />
            <p className="text-sm text-muted-foreground">
              Obtenha sua chave de API no portal dos Correios ou através de serviços como Melhor Envio
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correios-cep-origem">
              CEP de Origem
            </Label>
            <Input
              id="correios-cep-origem"
              type="text"
              placeholder="00000-000"
              value={correiosCepOrigem}
              onChange={handleCepChange}
              maxLength={9}
              className="max-w-xl"
            />
            <p className="text-sm text-muted-foreground">
              CEP do local de onde os produtos serão enviados (seu estoque/loja)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={saving || userInfo?.role !== 'admin'}>
              {saving ? (
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
              variant="outline" 
              onClick={() => {
                console.log('=== INFORMAÇÕES DE DEBUG ===');
                console.log('Usuário:', userInfo);
                console.log('API Key:', correiosApiKey ? `${correiosApiKey.substring(0, 5)}***` : '(vazio)');
                console.log('CEP Origem:', correiosCepOrigem);
                toast({
                  title: 'Console Aberto',
                  description: 'Pressione F12 para ver as informações de debug no console',
                });
              }}
            >
              Ver Debug (F12)
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg mt-6">
            <h4 className="font-semibold mb-2">ℹ️ Informações Importantes</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>A chave de API é necessária para calcular fretes em tempo real</li>
              <li>O CEP de origem deve ser o local de onde os produtos são enviados</li>
              <li>Certifique-se de que a chave de API está ativa e válida</li>
              <li>Os valores de frete serão calculados automaticamente no checkout</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
