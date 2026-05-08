import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';
import { Plus } from 'lucide-react';
import { getAllBlogPosts } from '@/db/admin-api';

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Título',
    },
    {
      key: 'category',
      label: 'Categoria',
      render: (post: any) => post.category || '-',
    },
    {
      key: 'views',
      label: 'Visualizações',
    },
    {
      key: 'is_published',
      label: 'Status',
      render: (post: any) => (
        <Badge variant={post.is_published ? 'default' : 'secondary'}>
          {post.is_published ? 'Publicado' : 'Rascunho'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Data',
      render: (post: any) => new Date(post.created_at).toLocaleDateString('pt-BR'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">Gerencie os posts do blog</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Post
        </Button>
      </div>

      <DataTable
        data={posts}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Buscar post..."
      />
    </div>
  );
}
