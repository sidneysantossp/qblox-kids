import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Package, AlertCircle, Plug, Bug, Image as ImageIcon, Globe, X } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import { getSiteSettings, updateSiteSetting } from '@/db/api';

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
  const [navbarLogoUrl, setNavbarLogoUrl] = useState('');
  const [footerLogoUrl, setFooterLogoUrl] = useState('');
  const [siteMetaTitle, setSiteMetaTitle] = useState('');
  const [siteMetaDescription, setSiteMetaDescription] = useState('');
  const [storefrontHeaderBgColor, setStorefrontHeaderBgColor] = useState('#4B1599');
  const [storefrontHeaderTextColor, setStorefrontHeaderTextColor] = useState('#FFFFFF');
  const [storefrontHeaderSearchBgColor, setStorefrontHeaderSearchBgColor] = useState('#4B1599');
  const [storefrontHeaderSearchTextColor, setStorefrontHeaderSearchTextColor] = useState('#FFFFFF');
  const [storefrontHeaderSearchPlaceholderColor, setStorefrontHeaderSearchPlaceholderColor] = useState('rgba(255,255,255,0.75)');
  const [storefrontHeaderSearchIconColor, setStorefrontHeaderSearchIconColor] = useState('#FFFFFF');
  const [storefrontTopbarBgColor, setStorefrontTopbarBgColor] = useState('#4B1599');
  const [storefrontTopbarTextColor, setStorefrontTopbarTextColor] = useState('#FFFFFF');
  const [globalMarginType, setGlobalMarginType] = useState('');
  const [globalMarginValue, setGlobalMarginValue] = useState('');
  const [userInfo, setUserInfo] = useState<{ email: string; role: string } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState('');
  const { profile, isAdmin } = useAuth();
  const { toast } = useToast();

  const navbarLogoUpload = useSupabaseUpload({
    bucketName: 'images',
    path: 'branding/navbar',
    allowedMimeTypes: ['image/*'],
    maxFileSize: 3 * 1024 * 1024,
    maxFiles: 1,
    upsert: false,
    supabase,
  });

  const footerLogoUpload = useSupabaseUpload({
    bucketName: 'images',
    path: 'branding/footer',
    allowedMimeTypes: ['image/*'],
    maxFileSize: 3 * 1024 * 1024,
    maxFiles: 1,
    upsert: false,
    supabase,
  });

  useEffect(() => {
    void loadSettings();
    void loadUserInfo();
  }, []);

  useEffect(() => {
    const fileToUpload = navbarLogoUpload.files[0];
    const alreadyUploaded = fileToUpload && navbarLogoUpload.successes.includes(fileToUpload.name);

    if (!fileToUpload || fileToUpload.errors.length > 0 || alreadyUploaded || navbarLogoUpload.loading) {
      return;
    }

    void navbarLogoUpload.onUpload();
  }, [navbarLogoUpload.files, navbarLogoUpload.successes, navbarLogoUpload.loading, navbarLogoUpload.onUpload]);

  useEffect(() => {
    const fileToUpload = footerLogoUpload.files[0];
    const alreadyUploaded = fileToUpload && footerLogoUpload.successes.includes(fileToUpload.name);

    if (!fileToUpload || fileToUpload.errors.length > 0 || alreadyUploaded || footerLogoUpload.loading) {
      return;
    }

    void footerLogoUpload.onUpload();
  }, [footerLogoUpload.files, footerLogoUpload.successes, footerLogoUpload.loading, footerLogoUpload.onUpload]);

  useEffect(() => {
    const uploadedFile = navbarLogoUpload.files[0];
    const uploadedSuccessfully = uploadedFile && navbarLogoUpload.successes.includes(uploadedFile.name);

    if (!uploadedSuccessfully) {
      return;
    }

    const filePath = `branding/navbar/${uploadedFile.name}`;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    setNavbarLogoUrl(data.publicUrl);
    toast({ title: 'Sucesso', description: 'Logo da navbar enviada com sucesso' });
  }, [navbarLogoUpload.files, navbarLogoUpload.successes, toast]);

  useEffect(() => {
    const uploadedFile = footerLogoUpload.files[0];
    const uploadedSuccessfully = uploadedFile && footerLogoUpload.successes.includes(uploadedFile.name);

    if (!uploadedSuccessfully) {
      return;
    }

    const filePath = `branding/footer/${uploadedFile.name}`;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    setFooterLogoUrl(data.publicUrl);
    toast({ title: 'Sucesso', description: 'Logo do footer enviada com sucesso' });
  }, [footerLogoUpload.files, footerLogoUpload.successes, toast]);

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

      const [settingsData, siteSettingsData] = await Promise.all([
        supabase.from('settings').select('key, value, description').in('key', ['correios_api_key', 'correios_cep_origem']),
        getSiteSettings(),
      ]);

      if (settingsData.error) throw settingsData.error;

      const findSettingValue = (key: string) => settingsData.data?.find((s: Setting) => s.key === key)?.value || '';
      const findSiteSettingValue = (key: string) => siteSettingsData.find((s) => s.setting_key === key)?.setting_value || '';

      setCorreiosApiKey(findSettingValue('correios_api_key'));
      setCorreiosCepOrigem(findSettingValue('correios_cep_origem'));
      setNavbarLogoUrl(findSiteSettingValue('navbar_logo_url'));
      setFooterLogoUrl(findSiteSettingValue('footer_logo_url'));
      setSiteMetaTitle(findSiteSettingValue('site_meta_title'));
      setSiteMetaDescription(findSiteSettingValue('site_meta_description'));
      setStorefrontHeaderBgColor(findSiteSettingValue('storefront_header_bg_color') || '#4B1599');
      setStorefrontHeaderTextColor(findSiteSettingValue('storefront_header_text_color') || '#FFFFFF');
      setStorefrontHeaderSearchBgColor(findSiteSettingValue('storefront_header_search_bg_color') || '#4B1599');
      setStorefrontHeaderSearchTextColor(findSiteSettingValue('storefront_header_search_text_color') || '#FFFFFF');
      setStorefrontHeaderSearchPlaceholderColor(findSiteSettingValue('storefront_header_search_placeholder_color') || 'rgba(255,255,255,0.75)');
      setStorefrontHeaderSearchIconColor(findSiteSettingValue('storefront_header_search_icon_color') || '#FFFFFF');
      setStorefrontTopbarBgColor(findSiteSettingValue('storefront_topbar_bg_color') || '#4B1599');
      setStorefrontTopbarTextColor(findSiteSettingValue('storefront_topbar_text_color') || '#FFFFFF');
      setGlobalMarginType(findSiteSettingValue('global_margin_type'));
      setGlobalMarginValue(findSiteSettingValue('global_margin_value'));
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({ title: 'Erro', description: 'Não foi possível carregar as configurações', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({ title: 'Não autenticado', description: 'Faça login novamente para salvar.', variant: 'destructive' });
        return;
      }

      if (!isAdmin) {
        toast({ title: 'Sem permissão', description: 'Apenas administradores podem salvar configurações.', variant: 'destructive' });
        return;
      }

      const cepLimpo = correiosCepOrigem.replace(/\D/g, '');
      if (correiosCepOrigem && cepLimpo.length !== 8) {
        toast({ title: 'CEP inválido', description: 'O CEP deve ter 8 dígitos.', variant: 'destructive' });
        return;
      }

      await Promise.all([
        supabase.from('settings').upsert({ key: 'correios_api_key', value: correiosApiKey || '', description: 'Chave de API dos Correios para cálculo de frete' }, { onConflict: 'key', ignoreDuplicates: false }),
        supabase.from('settings').upsert({ key: 'correios_cep_origem', value: correiosCepOrigem || '', description: 'CEP de origem para cálculo de frete (localização do estoque)' }, { onConflict: 'key', ignoreDuplicates: false }),
        updateSiteSetting('navbar_logo_url', navbarLogoUrl || ''),
        updateSiteSetting('footer_logo_url', footerLogoUrl || ''),
        updateSiteSetting('site_meta_title', siteMetaTitle || ''),
        updateSiteSetting('site_meta_description', siteMetaDescription || ''),
        updateSiteSetting('storefront_header_bg_color', storefrontHeaderBgColor || ''),
        updateSiteSetting('storefront_header_text_color', storefrontHeaderTextColor || ''),
        updateSiteSetting('storefront_header_search_bg_color', storefrontHeaderSearchBgColor || ''),
        updateSiteSetting('storefront_header_search_text_color', storefrontHeaderSearchTextColor || ''),
        updateSiteSetting('storefront_header_search_placeholder_color', storefrontHeaderSearchPlaceholderColor || ''),
        updateSiteSetting('storefront_header_search_icon_color', storefrontHeaderSearchIconColor || ''),
        updateSiteSetting('storefront_topbar_bg_color', storefrontTopbarBgColor || ''),
        updateSiteSetting('storefront_topbar_text_color', storefrontTopbarTextColor || ''),
      ]);

      toast({ title: 'Sucesso', description: 'Configurações salvas com sucesso' });
      await loadSettings();
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast({ title: 'Erro', description: error?.message || 'Não foi possível salvar as configurações', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorreiosCepOrigem(formatCep(e.target.value));
  };

  const debugUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Debug user', user);
      toast({ title: 'Debug', description: 'Verifique o console (F12).' });
    } catch (error: any) {
      console.error('Erro no debug:', error);
    }
  };

  const testConnection = async () => {
    try {
      setTesting(true);
      setConnectionStatus('idle');
      setErrorDetails('');

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Usuário não autenticado');
      if (user.user_metadata?.role !== 'admin') throw new Error('Você precisa ser administrador para salvar configurações');

      const { data: isAdminResult, error: isAdminError } = await supabase.rpc('is_admin');
      if (isAdminError) throw new Error(`Erro ao verificar permissões: ${isAdminError.message}`);
      if (!isAdminResult) throw new Error('A função is_admin() retornou false. Faça logout e login novamente.');

      setConnectionStatus('success');
      toast({ title: 'Conexão OK', description: 'Você tem permissão para salvar configurações!' });
    } catch (error: any) {
      console.error('Teste de conexão falhou:', error);
      setConnectionStatus('error');
      setErrorDetails(error.message || 'Erro desconhecido');
      toast({ title: 'Erro no Teste', description: error.message || 'Falha ao testar conexão', variant: 'destructive' });
    } finally {
      setTesting(false);
    }
  };

  const handleRemoveNavbarLogo = () => {
    setNavbarLogoUrl('');
    navbarLogoUpload.setFiles([]);
  };

  const handleRemoveFooterLogo = () => {
    setFooterLogoUrl('');
    footerLogoUpload.setFiles([]);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">Gerencie as configurações do sistema</p>
      </div>

      {userInfo && (
        <Card className={userInfo.role === 'admin' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900'}>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="text-sm space-y-1">
                <p><strong>Usuário:</strong> {userInfo.email}</p>
                <p><strong>Função:</strong> <span className={userInfo.role === 'admin' ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-yellow-600 dark:text-yellow-400'}>{userInfo.role}</span></p>
              </div>
              {userInfo.role === 'admin' && (
                <div className="pt-2 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={testConnection} disabled={testing}>{testing ? <><Loader2 className="mr-2 h-3 w-3 animate-spin" />Testando...</> : <><Plug className="mr-2 h-3 w-3" />Testar Conexão</>}</Button>
                    <Button variant="ghost" size="sm" onClick={debugUserInfo} title="Ver informações de debug no console (F12)"><Bug className="mr-2 h-3 w-3" />Debug</Button>
                  </div>
                  {connectionStatus === 'success' && <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Conexão testada com sucesso! Você pode salvar configurações.</p>}
                  {connectionStatus === 'error' && <p className="text-xs text-red-600 dark:text-red-400 mt-2">✗ Erro: {errorDetails}</p>}
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
          <AlertDescription>Você precisa ser administrador para gerenciar configurações.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary" /><CardTitle>Branding e SEO Básico</CardTitle></div>
          <CardDescription>Gerencie logos públicas da navbar/footer e meta tags básicas do site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Logo da Navbar</Label>
                {navbarLogoUrl ? (
                  <div className="relative flex min-h-32 items-center justify-center rounded-lg border bg-white p-4">
                    <img src={navbarLogoUrl} alt="Preview navbar logo" className="max-h-16 w-auto object-contain" />
                    <Button type="button" variant="destructive" size="icon" className="absolute right-2 top-2" onClick={handleRemoveNavbarLogo}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
                <Dropzone {...navbarLogoUpload} className="bg-background">
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
                <p className="text-sm text-muted-foreground">Arraste a logo da navbar ou clique para selecionar um arquivo.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Logo do Footer</Label>
                {footerLogoUrl ? (
                  <div className="relative flex min-h-32 items-center justify-center rounded-lg border bg-white p-4">
                    <img src={footerLogoUrl} alt="Preview footer logo" className="max-h-16 w-auto object-contain" />
                    <Button type="button" variant="destructive" size="icon" className="absolute right-2 top-2" onClick={handleRemoveFooterLogo}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
                <Dropzone {...footerLogoUpload} className="bg-background">
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
                <p className="text-sm text-muted-foreground">Arraste a logo do footer ou clique para selecionar um arquivo.</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-meta-title">Meta Title padrão</Label>
            <Input id="site-meta-title" value={siteMetaTitle} onChange={(e) => setSiteMetaTitle(e.target.value)} placeholder="QBLOX - Bonecos de Montar LEGO | Super Heróis, Roblox e Mais" maxLength={70} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-meta-description">Meta Description padrão</Label>
            <Textarea id="site-meta-description" value={siteMetaDescription} onChange={(e) => setSiteMetaDescription(e.target.value)} placeholder="Loja especializada em bonecos de montar tipo LEGO para crianças e colecionadores..." maxLength={180} rows={4} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /><CardTitle>Tema da Storefront</CardTitle></div>
          <CardDescription>Defina as cores da home, header, topbar, busca e ícones públicos da loja.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="storefront-header-bg-color">Fundo do Header</Label>
              <Input id="storefront-header-bg-color" type="color" value={storefrontHeaderBgColor} onChange={(e) => setStorefrontHeaderBgColor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storefront-header-text-color">Texto do Header</Label>
              <Input id="storefront-header-text-color" type="color" value={storefrontHeaderTextColor} onChange={(e) => setStorefrontHeaderTextColor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storefront-search-bg-color">Fundo da Busca</Label>
              <Input id="storefront-search-bg-color" type="color" value={storefrontHeaderSearchBgColor} onChange={(e) => setStorefrontHeaderSearchBgColor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storefront-search-text-color">Texto da Busca</Label>
              <Input id="storefront-search-text-color" type="color" value={storefrontHeaderSearchTextColor} onChange={(e) => setStorefrontHeaderSearchTextColor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storefront-search-icon-color">Ícone da Busca</Label>
              <Input id="storefront-search-icon-color" type="color" value={storefrontHeaderSearchIconColor} onChange={(e) => setStorefrontHeaderSearchIconColor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storefront-search-placeholder-color">Placeholder da Busca</Label>
              <Input id="storefront-search-placeholder-color" type="text" value={storefrontHeaderSearchPlaceholderColor} onChange={(e) => setStorefrontHeaderSearchPlaceholderColor(e.target.value)} placeholder="rgba(255,255,255,0.75)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storefront-topbar-bg-color">Fundo da Topbar</Label>
              <Input id="storefront-topbar-bg-color" type="color" value={storefrontTopbarBgColor} onChange={(e) => setStorefrontTopbarBgColor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storefront-topbar-text-color">Texto da Topbar</Label>
              <Input id="storefront-topbar-text-color" type="color" value={storefrontTopbarTextColor} onChange={(e) => setStorefrontTopbarTextColor(e.target.value)} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Use as cores desejadas para controlar o visual do header, topbar, busca e ícones públicos. O placeholder aceita HEX ou RGBA.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /><CardTitle>Integração Correios</CardTitle></div>
          <CardDescription>Configure a integração com os Correios para cálculo de frete</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="correios-api-key">Chave de API dos Correios</Label>
            <Input id="correios-api-key" type="password" placeholder="Digite a chave de API dos Correios" value={correiosApiKey} onChange={(e) => setCorreiosApiKey(e.target.value)} className="max-w-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="correios-cep-origem">CEP de Origem</Label>
            <Input id="correios-cep-origem" type="text" placeholder="00000-000" value={correiosCepOrigem} onChange={handleCepChange} maxLength={9} className="max-w-xl" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={saving || userInfo?.role !== 'admin'}>{saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : <><Save className="mr-2 h-4 w-4" />Salvar Configurações</>}</Button>
            <Button variant="outline" onClick={() => toast({ title: 'Console Aberto', description: 'Pressione F12 para ver as informações de debug no console' })}><Globe className="mr-2 h-4 w-4" />Ver Debug (F12)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
