import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { getAllOrders, deleteOrder } from '@/db/admin-api';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, Trash2, Filter } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      console.log('[AdminOrders] Carregando pedidos...', { statusFilter });
      const data = await getAllOrders(statusFilter === 'all' ? undefined : statusFilter);
      console.log('[AdminOrders] Pedidos carregados:', data?.length || 0, data);
      setOrders(data);
    } catch (error) {
      console.error('[AdminOrders] Erro ao carregar pedidos:', error);
      toast({
        title: 'Erro ao carregar pedidos',
        description: 'Não foi possível carregar a lista de pedidos. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingOrderId) return;

    try {
      await deleteOrder(deletingOrderId);
      toast({
        title: 'Pedido excluído',
        description: 'O pedido foi excluído com sucesso.',
      });
      setDeletingOrderId(null);
      loadOrders();
    } catch (error) {
      console.error('[AdminOrders] Erro ao excluir pedido:', error);
      toast({
        title: 'Erro ao excluir pedido',
        description: 'Não foi possível excluir o pedido.',
        variant: 'destructive',
      });
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
      completed: { label: 'Concluído', variant: 'default' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
      refunded: { label: 'Reembolsado', variant: 'outline' },
      processing: { label: 'Processando', variant: 'default' },
      shipped: { label: 'Enviado', variant: 'outline' },
      delivered: { label: 'Entregue', variant: 'default' },
    };
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const columns = [
    {
      key: 'id',
      label: 'Pedido',
      render: (order: any) => <code className="text-xs">#{order.id.slice(0, 8)}</code>,
    },
    {
      key: 'created_at',
      label: 'Data',
      render: (order: any) => new Date(order.created_at).toLocaleDateString('pt-BR'),
    },
    {
      key: 'user',
      label: 'Cliente',
      render: (order: any) => (
        <div className="flex flex-col">
          <span>{order.profiles?.full_name || order.profiles?.username || order.customer_email || 'Cliente Anônimo'}</span>
          {order.customer_email && (
            <span className="text-xs text-muted-foreground">{order.customer_email}</span>
          )}
        </div>
      ),
    },
    {
      key: 'payment',
      label: 'Pagamento',
      render: (order: any) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{order.payment_method || 'N/A'}</span>
          {order.stripe_payment_intent_id && (
            <code className="text-muted-foreground">
              {order.stripe_payment_intent_id.slice(0, 15)}...
            </code>
          )}
        </div>
      ),
    },
    {
      key: 'total_amount',
      label: 'Total',
      render: (order: any) => formatCurrency(order.total_amount),
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: any) => getStatusBadge(order.status),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (order: any) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/pedidos/${order.id}`);
            }}
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingOrderId(order.id);
            }}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Excluir pedido"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="processing">Processando</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregue</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="refunded">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Carregando pedidos...</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={orders}
          columns={columns}
          searchKey="id"
          searchPlaceholder="Buscar pedido..."
          onRowClick={(order) => navigate(`/admin/pedidos/${order.id}`)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingOrderId} onOpenChange={(open) => !open && setDeletingOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
