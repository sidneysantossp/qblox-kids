import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';
import { getAllUsers } from '@/db/admin-api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'full_name',
      label: 'Nome',
      render: (user: any) => user.full_name || user.username || 'N/A',
    },
    {
      key: 'username',
      label: 'Usuário',
    },
    {
      key: 'phone',
      label: 'Telefone',
      render: (user: any) => user.phone || '-',
    },
    {
      key: 'role',
      label: 'Função',
      render: (user: any) => (
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role === 'admin' ? 'Admin' : 'Usuário'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Cadastro',
      render: (user: any) => new Date(user.created_at).toLocaleDateString('pt-BR'),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Usuários</h1>
        <p className="text-muted-foreground">Gerencie os usuários da plataforma</p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchKey="full_name"
        searchPlaceholder="Buscar usuário..."
        onRowClick={(user) => navigate(`/admin/usuarios/${user.id}`)}
      />
    </div>
  );
}
