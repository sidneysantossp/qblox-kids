import { useEffect, useState } from 'react';
import { getActivePaymentMethods } from '@/db/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPaymentMethods() {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMethods = async () => {
      try {
        console.log('[Test] Iniciando carregamento...');
        setLoading(true);
        const data = await getActivePaymentMethods();
        console.log('[Test] Dados recebidos:', data);
        setMethods(data);
      } catch (err: any) {
        console.error('[Test] Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMethods();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Métodos de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Carregando...</p>}
          {error && <p className="text-red-500">Erro: {error}</p>}
          {!loading && !error && (
            <div>
              <p className="mb-4">Total de métodos: {methods.length}</p>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(methods, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
