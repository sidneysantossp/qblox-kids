import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';
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
import { Plus, Copy, Trash2 } from 'lucide-react';
import { deleteProduct, deleteProducts, getAllProducts, duplicateProduct } from '@/db/admin-api';
import { toast } from 'sonner';
import type { Product } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    void loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setSelectedProductIds((current) => current.filter((id) => data.some((product) => product.id === id)));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
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

  const handleDeleteSingle = async () => {
    if (!productToDelete) return;

    try {
      setDeletingProductId(productToDelete.id);
      await deleteProduct(productToDelete.id);
      toast.success('Produto excluído com sucesso!');
      setProductToDelete(null);
      await loadProducts();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;

    try {
      setIsBulkDeleting(true);
      await deleteProducts(selectedProductIds);
      toast.success(`${selectedProductIds.length} produto(s) excluído(s) com sucesso!`);
      setSelectedProductIds([]);
      setBulkDeleteOpen(false);
      await loadProducts();
    } catch (error) {
      console.error('Erro ao excluir produtos em massa:', error);
      toast.error('Erro ao excluir produtos selecionados');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const selectedProductsCount = selectedProductIds.length;
  const selectedProductsLabel = useMemo(() => {
    if (selectedProductsCount === 1) return '1 produto selecionado';
    return `${selectedProductsCount} produtos selecionados`;
  }, [selectedProductsCount]);

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

      {selectedProductsCount > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-medium text-foreground">{selectedProductsLabel}</p>
          <Button
            variant="destructive"
            onClick={() => setBulkDeleteOpen(true)}
            disabled={isBulkDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir selecionados
          </Button>
        </div>
      )}

      <DataTable
        data={products}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar produto..."
        getRowId={(product) => product.id}
        selectable
        selectedRowIds={selectedProductIds}
        onSelectedRowIdsChange={setSelectedProductIds}
        onRowClick={(product) => navigate(`/admin/produtos/${product.id}`)}
        actions={(product) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDuplicate(product)}
              disabled={duplicatingId === product.id || deletingProductId === product.id || isBulkDeleting}
              title="Duplicar produto"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setProductToDelete(product)}
              disabled={duplicatingId === product.id || deletingProductId === product.id || isBulkDeleting}
              title="Excluir produto"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingProductId !== null}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSingle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingProductId !== null}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedProductsCount} produto(s) selecionado(s)? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isBulkDeleting}
            >
              Excluir selecionados
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
