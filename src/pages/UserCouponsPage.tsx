import UserDashboardLayout from '@/components/layouts/UserDashboardLayout';
import { CouponsPanel } from '@/components/account/CouponsPanel';
import { useAuth } from '@/contexts/AuthContext';

export default function UserCouponsPage() {
  const { user } = useAuth();

  return (
    <UserDashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Cupons</h1>
          <p className="text-muted-foreground">
            Veja cupons disponíveis para sua conta e o histórico dos cupons já utilizados.
          </p>
        </div>

        {user && <CouponsPanel userId={user.id} />}
      </div>
    </UserDashboardLayout>
  );
}
