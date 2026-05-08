import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/db/supabase';
import { getOrderById } from '@/db/admin-api';

export default function AdminDebugPage() {
  const { user, profile, isAdmin } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    const results: any = {};

    try {
      // Test 1: Check current user
      results.currentUser = {
        id: user?.id,
        email: user?.email,
      };

      // Test 2: Check profile
      results.profile = {
        id: profile?.id,
        full_name: profile?.full_name,
        role: profile?.role,
        isAdmin: isAdmin,
      };

      // Test 3: Test is_admin() function
      const { data: isAdminData, error: isAdminError } = await supabase
        .rpc('is_admin');
      
      results.isAdminFunction = {
        result: isAdminData,
        error: isAdminError?.message,
      };

      // Test 4: Try to fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .limit(5);

      results.ordersQuery = {
        count: orders?.length || 0,
        error: ordersError?.message,
        data: orders,
      };

      // Test 5: Check RLS policies
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'orders');

      results.rlsPolicies = {
        error: policiesError?.message,
        note: 'Policies can only be viewed with service_role',
      };

      // Test 6: Try to get profile with role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user?.id)
        .maybeSingle();

      results.profileQuery = {
        data: profileData,
        error: profileError?.message,
      };

      // Test 7: Test getOrderById function
      if (orders && orders.length > 0) {
        const firstOrderId = orders[0].id;
        try {
          const orderDetail = await getOrderById(firstOrderId);
          results.getOrderByIdTest = {
            orderId: firstOrderId,
            success: !!orderDetail,
            data: orderDetail,
            error: null,
          };
        } catch (error: any) {
          results.getOrderByIdTest = {
            orderId: firstOrderId,
            success: false,
            data: null,
            error: error.message,
          };
        }
      } else {
        results.getOrderByIdTest = {
          note: 'Nenhum pedido disponível para testar',
        };
      }

    } catch (error: any) {
      results.error = error.message;
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      runTests();
    }
  }, [user]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Debug do Admin</h1>
        <p className="text-muted-foreground">Diagnóstico de permissões e acesso</p>
      </div>

      <Button onClick={runTests} disabled={isLoading}>
        {isLoading ? 'Executando testes...' : 'Executar Testes Novamente'}
      </Button>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Usuário Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(testResults.currentUser, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil (AuthContext)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(testResults.profile, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Função is_admin()</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(testResults.isAdminFunction, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(testResults.ordersQuery, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query de Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(testResults.profileQuery, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Políticas RLS</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(testResults.rlsPolicies, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
