import { Card, CardContent } from '@/components/ui/card';
import UserDashboardLayout from '@/components/layouts/UserDashboardLayout';
import { Settings as SettingsIcon, Construction } from 'lucide-react';

export default function UserSettingsPage() {
  return (
    <UserDashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize sua experiência
          </p>
        </div>

        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Construction className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Em Desenvolvimento</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  As configurações da conta estarão disponíveis em breve.
                  Você poderá personalizar notificações, privacidade e preferências.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}
