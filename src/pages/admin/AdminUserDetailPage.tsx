import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, User, Mail, Phone, Calendar, ShoppingBag, Loader2 } from 'lucide-react';
import { getUserById, updateUserRole, getAllOrders } from '@/db/admin-api';
import type { UserProfile } from '@/types';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser();
      loadUserOrders();
    }
  }, [id]);

  const loadUser = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await getUserById(id);
      setUser(data);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      toast.error('Erro ao carregar usuário');
      navigate('/admin/usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserOrders = async () => {
    if (!id) return;

    try {
      const allOrders = await getAllOrders();
      const filtered = allOrders.filter((order: any) => order.user_id === id);
      setUserOrders(filtered);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  };

  const handleRoleChange = async (newRole: 'user' | 'admin') => {
    if (!id) return;

    try {
      setIsUpdating(true);
      await updateUserRole(id, newRole);
      setUser({ ...user!, role: newRole });
      toast.success('Função atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar função:', error);
      toast.error('Erro ao atualizar função');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pendente', variant: 'secondary' },
      processing: { label: 'Processando', variant: 'default' },
      shipped: { label: 'Enviado', variant: 'outline' },
      delivered: { label: 'Entregue', variant: 'default' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
      refunded: { label: 'Reembolsado', variant: 'outline' },
    };
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-muted-foreground">Usuário não encontrado</p>
        <Button onClick={() => navigate('/admin/usuarios')}>
          Voltar para Usuários
        </Button>
      </div>
    );
  }

  const totalSpent = userOrders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/usuarios')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {user.full_name || user.username || 'Usuário'}
            </h1>
            <p className="text-muted-foreground">
              Cadastrado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
        </Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nome Completo
                  </p>
                  <p className="font-medium">{user.full_name || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nome de Usuário
                  </p>
                  <p className="font-medium">{user.username || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </p>
                  <p className="font-medium">{user.phone || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data de Cadastro
                  </p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">ID do Usuário</p>
                  <code className="text-xs break-all">{user.id}</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Histórico de Pedidos ({userOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/pedidos/${order.id}`)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="text-xs">#{order.id.slice(0, 8)}</code>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(order.total_amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.order_items?.length || 0} {order.order_items?.length === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhum pedido realizado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Role Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Função</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Função do Usuário</label>
                <Select
                  value={user.role}
                  onValueChange={handleRoleChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Administradores têm acesso total ao painel
                </p>
              </div>
              {isUpdating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Atualizando...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold">{userOrders.length}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  {userOrders.length > 0
                    ? formatCurrency(totalSpent / userOrders.length)
                    : formatCurrency(0)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/admin/usuarios')}
              >
                Voltar para Lista
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
