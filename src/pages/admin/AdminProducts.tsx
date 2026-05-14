import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';
import { Plus, Copy } from 'lucide-react';
import { getAllProducts, duplicateProduct } from '@/db/admin-api';
import { toast } from 'sonner';
import type { Product } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      setDuplicatingId(product.id);
      const duplicated = await duplicateProduct(product.id);
      toast.success('Produto duplicado com sucesso!');
      await loadProducts();
      navigate(`/admin/produtos/${duplicated.id}`);
    } catch (error) {
      console.error('Erro ao duplicar produto:', error);
      toast.error('Erro ao duplicar produto');
    } finally {
      setDuplicatingId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const columns = [
    {
      key: 'image_url',
      label: 'Imagem',
      render: (product: Product) => (
        <img src={product.image_url} alt={product.name} className="h-12 w-12 rounded object-cover" />
      ),
    },
    {
      key: 'name',
      label: 'Nome',
      render: (product: Product) => (
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.category}</p>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Preço',
      render: (product: Product) => formatCurrency(product.price),
    },
    {
      key: 'stock',
      label: 'Estoque',
      render: (product: Product) => (
        <Badge variant={product.stock === 0 ? 'destructive' : product.stock <= 10 ? 'secondary' : 'default'}>
          {product.stock} un.
        </Badge>
      ),
    },
    {
      key: 'is_featured',
      label: 'Destaque',
      render: (product: Product) => (
        product.is_featured ? <Badge>Sim</Badge> : <span className="text-muted-foreground">Não</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 md:shrink-0">
          <Button onClick={() => navigate('/admin/produtos/novo')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar produto..."
        onRowClick={(product) => navigate(`/admin/produtos/${product.id}`)}
        actions={(product) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDuplicate(product)}
            disabled={duplicatingId === product.id}
            title="Duplicar produto"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      />
    </div>
  );
}
