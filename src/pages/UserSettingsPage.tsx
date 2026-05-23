import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserDashboardLayout from '@/components/layouts/UserDashboardLayout';
import { Settings as SettingsIcon, Bell, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function UserSettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailUpdates: true,
    orderNotifications: true,
    marketingEmails: false,
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      localStorage.setItem('user_settings', JSON.stringify(settings));
      toast({
        title: 'Configurações salvas',
        description: 'Suas preferências foram atualizadas com sucesso.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UserDashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">Personalize notificações e preferências da sua conta.</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Atualizações por e-mail</Label>
                  <p className="text-sm text-muted-foreground">Receba comunicações gerais da sua conta.</p>
                </div>
                <Switch checked={settings.emailUpdates} onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailUpdates: checked }))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Status dos pedidos</Label>
                  <p className="text-sm text-muted-foreground">Receba avisos quando seus pedidos forem atualizados.</p>
                </div>
                <Switch checked={settings.orderNotifications} onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, orderNotifications: checked }))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Ofertas e campanhas</Label>
                  <p className="text-sm text-muted-foreground">Receba mensagens sobre promoções e novidades da loja.</p>
                </div>
                <Switch checked={settings.marketingEmails} onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, marketingEmails: checked }))} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Suas preferências ficam salvas localmente e servem para personalizar sua experiência dentro da área do cliente.</p>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar configurações
          </Button>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
