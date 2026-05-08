import { Card, CardContent } from '@/components/ui/card';
import UserDashboardLayout from '@/components/layouts/UserDashboardLayout';
import { MapPin, Construction } from 'lucide-react';

export default function UserAddressesPage() {
  return (
    <UserDashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Endereços</h1>
          <p className="text-muted-foreground">
            Gerencie seus endereços de entrega
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
                  A funcionalidade de gerenciamento de endereços estará disponível em breve.
                  Por enquanto, você pode adicionar o endereço durante o checkout.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}
