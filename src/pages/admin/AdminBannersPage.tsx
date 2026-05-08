import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
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

interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  button_text?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminBannersPage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
      toast.error('Erro ao carregar banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_banners')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Banner ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
      loadBanners();
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
      toast.error('Erro ao atualizar banner');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('hero_banners')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      toast.success('Banner excluído com sucesso');
      loadBanners();
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      toast.error('Erro ao excluir banner');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Banners</h1>
        <Button onClick={() => navigate('/admin/banners/novo')}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Banner
        </Button>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{banner.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(banner.id, banner.is_active)}
                  >
                    {banner.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/banners/${banner.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(banner.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Subtítulo:</p>
                  <p className="text-sm">{banner.subtitle || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Botão:</p>
                  <p className="text-sm">{banner.button_text || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Link:</p>
                  <p className="text-sm truncate">{banner.link_url || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status:</p>
                  <p className="text-sm">
                    {banner.is_active ? (
                      <span className="text-green-600 font-semibold">Ativo</span>
                    ) : (
                      <span className="text-gray-500">Inativo</span>
                    )}
                  </p>
                </div>
                {banner.image_url && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">Imagem:</p>
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full max-w-md h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {banners.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum banner cadastrado. Clique em "Novo Banner" para começar.
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este banner? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
