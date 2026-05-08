import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminAccessDebugPage() {
  const { user, profile, isAdmin, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleRefresh = async () => {
    await refreshProfile();
    window.location.reload();
  };

  const handleGoToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Diagnóstico de Acesso Admin
            </CardTitle>
            <CardDescription>
              Verifique o status da sua conta e permissões de administrador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status de Carregamento */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status de Carregamento:</span>
              </div>
              <Badge variant={loading ? 'secondary' : 'default'}>
                {loading ? 'Carregando...' : 'Pronto'}
              </Badge>
            </div>

            {/* Status de Autenticação */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">Autenticado:</span>
              </div>
              {user ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <Badge variant="default">Sim</Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <Badge variant="destructive">Não</Badge>
                </div>
              )}
            </div>

            {/* Informações do Usuário */}
            {user && (
              <div className="p-4 border rounded-lg space-y-2">
                <h3 className="font-semibold">Informações do Usuário</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">ID:</span> {user.id}</p>
                  <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
                </div>
              </div>
            )}

            {/* Status do Profile */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">Profile Carregado:</span>
              </div>
              {profile ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <Badge variant="default">Sim</Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <Badge variant="destructive">Não</Badge>
                </div>
              )}
            </div>

            {/* Informações do Profile */}
            {profile && (
              <div className="p-4 border rounded-lg space-y-2">
                <h3 className="font-semibold">Informações do Profile</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Nome:</span> {profile.full_name || 'Não informado'}</p>
                  <p><span className="text-muted-foreground">Username:</span> {profile.username || 'Não informado'}</p>
                  <p><span className="text-muted-foreground">Role:</span> <Badge>{profile.role || 'Não definido'}</Badge></p>
                </div>
              </div>
            )}

            {/* Status de Admin */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">É Administrador:</span>
              </div>
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <Badge variant="default" className="bg-green-500">SIM</Badge>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <Badge variant="destructive">NÃO</Badge>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={handleRefresh} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar Informações
              </Button>

              {isAdmin && (
                <Button onClick={handleGoToAdmin} className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Ir para Painel Admin
                </Button>
              )}
            </div>

            {/* Instruções */}
            <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
              <h3 className="font-semibold">Instruções:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Se você não está autenticado, faça login primeiro</li>
                <li>Se o profile não está carregado, clique em "Recarregar Informações"</li>
                <li>Se o role não é "admin", você não tem permissão de administrador</li>
                <li>O primeiro usuário registrado automaticamente recebe permissão de admin</li>
                <li>Outros usuários precisam ter suas permissões alteradas por um admin existente</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
