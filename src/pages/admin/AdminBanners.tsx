import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { getAllHeroBanners, createHeroBanner, updateHeroBanner, deleteHeroBanner, getAllMiniBanners, createMiniBanner, updateMiniBanner, deleteMiniBanner } from '@/db/admin-api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { HeroBanner, MiniBanner } from '@/types';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BannerFormData {
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  button_text: string;
  display_order: number;
  is_active: boolean;
}

interface MiniBannerFormData {
  title: string;
  image_url: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [miniBanners, setMiniBanners] = useState<MiniBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMiniDialogOpen, setIsMiniDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [editingMiniBanner, setEditingMiniBanner] = useState<MiniBanner | null>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    button_text: '',
    display_order: 1,
    is_active: true,
  });
  const [miniFormData, setMiniFormData] = useState<MiniBannerFormData>({
    title: '',
    image_url: '',
    link_url: '',
    display_order: 1,
    is_active: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadBanners();
    loadMiniBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setIsLoading(true);
      const data = await getAllHeroBanners();
      setBanners(data);
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
      toast.error('Erro ao carregar banners');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMiniBanners = async () => {
    try {
      const data = await getAllMiniBanners();
      setMiniBanners(data);
    } catch (error) {
      console.error('Erro ao carregar mini banners:', error);
      toast.error('Erro ao carregar mini banners');
    }
  };

  const handleOpenDialog = (banner?: HeroBanner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        image_url: banner.image_url,
        link_url: banner.link_url || '',
        button_text: banner.button_text || '',
        display_order: banner.display_order,
        is_active: banner.is_active,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        image_url: '',
        link_url: '',
        button_text: '',
        display_order: banners.length + 1,
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      button_text: '',
      display_order: 1,
      is_active: true,
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }
    if (!formData.image_url.trim()) {
      toast.error('A imagem é obrigatória');
      return;
    }

    try {
      setIsSaving(true);
      if (editingBanner) {
        await updateHeroBanner(editingBanner.id, formData);
        toast.success('Banner atualizado com sucesso');
      } else {
        await createHeroBanner(formData);
        toast.success('Banner criado com sucesso');
      }
      await loadBanners();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      toast.error('Erro ao salvar banner');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) {
      return;
    }

    try {
      await deleteHeroBanner(id);
      toast.success('Banner excluído com sucesso');
      await loadBanners();
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      toast.error('Erro ao excluir banner');
    }
  };

  const handleToggleActive = async (banner: HeroBanner) => {
    try {
      await updateHeroBanner(banner.id, {
        ...banner,
        is_active: !banner.is_active,
      });
      toast.success(banner.is_active ? 'Banner desativado' : 'Banner ativado');
      await loadBanners();
    } catch (error) {
      console.error('Erro ao alterar status do banner:', error);
      toast.error('Erro ao alterar status do banner');
    }
  };

  // Mini Banner Handlers
  const handleOpenMiniDialog = (banner?: MiniBanner) => {
    if (banner) {
      setEditingMiniBanner(banner);
      setMiniFormData({
        title: banner.title,
        image_url: banner.image_url,
        link_url: banner.link_url || '',
        display_order: banner.display_order,
        is_active: banner.is_active,
      });
    } else {
      setEditingMiniBanner(null);
      setMiniFormData({
        title: '',
        image_url: '',
        link_url: '',
        display_order: miniBanners.length + 1,
        is_active: true,
      });
    }
    setIsMiniDialogOpen(true);
  };

  const handleCloseMiniDialog = () => {
    setIsMiniDialogOpen(false);
    setEditingMiniBanner(null);
    setMiniFormData({
      title: '',
      image_url: '',
      link_url: '',
      display_order: 1,
      is_active: true,
    });
  };

  const handleSaveMini = async () => {
    if (!miniFormData.title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }
    if (!miniFormData.image_url.trim()) {
      toast.error('A imagem é obrigatória');
      return;
    }

    try {
      setIsSaving(true);
      if (editingMiniBanner) {
        await updateMiniBanner(editingMiniBanner.id, miniFormData);
        toast.success('Mini banner atualizado com sucesso');
      } else {
        await createMiniBanner(miniFormData);
        toast.success('Mini banner criado com sucesso');
      }
      await loadMiniBanners();
      handleCloseMiniDialog();
    } catch (error) {
      console.error('Erro ao salvar mini banner:', error);
      toast.error('Erro ao salvar mini banner');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMini = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este mini banner?')) {
      return;
    }

    try {
      await deleteMiniBanner(id);
      toast.success('Mini banner excluído com sucesso');
      await loadMiniBanners();
    } catch (error) {
      console.error('Erro ao excluir mini banner:', error);
      toast.error('Erro ao excluir mini banner');
    }
  };

  const handleToggleMiniBannerActive = async (banner: MiniBanner) => {
    try {
      await updateMiniBanner(banner.id, {
        ...banner,
        is_active: !banner.is_active,
      });
      toast.success(banner.is_active ? 'Mini banner desativado' : 'Mini banner ativado');
      await loadMiniBanners();
    } catch (error) {
      console.error('Erro ao alterar status do mini banner:', error);
      toast.error('Erro ao alterar status do mini banner');
    }
  };

  const miniColumns = [
    {
      key: 'image_url',
      label: 'Imagem',
      render: (banner: MiniBanner) => (
        <img src={banner.image_url} alt={banner.title} className="h-16 w-32 rounded object-cover" />
      ),
    },
    {
      key: 'title',
      label: 'Título',
      render: (banner: MiniBanner) => (
        <div className="font-medium">{banner.title}</div>
      ),
    },
    {
      key: 'display_order',
      label: 'Ordem',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (banner: MiniBanner) => (
        <Badge variant={banner.is_active ? 'default' : 'secondary'}>
          {banner.is_active ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (banner: MiniBanner) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenMiniDialog(banner);
            }}
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Editar mini banner"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMiniBannerActive(banner);
            }}
            className={`h-8 w-8 ${
              banner.is_active 
                ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={banner.is_active ? 'Desativar mini banner' : 'Ativar mini banner'}
          >
            {banner.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteMini(banner.id);
            }}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Excluir mini banner"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const columns = [
    {
      key: 'image_url',
      label: 'Imagem',
      render: (banner: HeroBanner) => (
        <img src={banner.image_url} alt={banner.title} className="h-16 w-32 rounded object-cover" />
      ),
    },
    {
      key: 'title',
      label: 'Título',
      render: (banner: HeroBanner) => (
        <div>
          <div className="font-medium">{banner.title}</div>
          {banner.subtitle && (
            <div className="text-sm text-muted-foreground">{banner.subtitle}</div>
          )}
        </div>
      ),
    },
    {
      key: 'button_text',
      label: 'CTA',
      render: (banner: HeroBanner) => (
        <div className="text-sm">
          {banner.button_text ? (
            <Badge variant="outline">{banner.button_text}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'display_order',
      label: 'Ordem',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (banner: HeroBanner) => (
        <Badge variant={banner.is_active ? 'default' : 'secondary'}>
          {banner.is_active ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (banner: HeroBanner) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDialog(banner);
            }}
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Editar banner"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActive(banner);
            }}
            className={`h-8 w-8 ${
              banner.is_active 
                ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={banner.is_active ? 'Desativar banner' : 'Ativar banner'}
          >
            {banner.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(banner.id);
            }}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Excluir banner"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Banners</h1>
        <p className="text-muted-foreground">Gerencie os banners da página inicial</p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="hero">Banners Hero (Full)</TabsTrigger>
          <TabsTrigger value="mini">Mini Banners</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Banners em largura total com títulos, subtítulos e botões CTA</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner Hero
            </Button>
          </div>

          <DataTable
            data={banners}
            columns={columns}
            searchKey="title"
            searchPlaceholder="Buscar banner..."
          />
        </TabsContent>

        <TabsContent value="mini" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Mini banners promocionais exibidos em 2 colunas (máximo 2 ativos)</p>
            <Button onClick={() => handleOpenMiniDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Mini Banner
            </Button>
          </div>

          <DataTable
            data={miniBanners}
            columns={miniColumns}
            searchKey="title"
            searchPlaceholder="Buscar mini banner..."
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Editar Banner' : 'Novo Banner'}
            </DialogTitle>
            <DialogDescription>
              Configure o banner com título, subtítulo, imagem e botão de ação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título (Headline) *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Novos Bonecos de Super Heróis!"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo (Subheadline)</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Ex: Descubra nossa coleção exclusiva com até 40% de desconto"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem do Banner *</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                bucket="banners"
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: 1920x500px para melhor visualização
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="button_text">Texto do Botão (CTA)</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  placeholder="Ex: Ver Produtos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_url">Link do Botão</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="Ex: /categoria/Super Heróis"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="1"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    {formData.is_active ? 'Ativo' : 'Inativo'}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mini Banner Dialog */}
      <Dialog open={isMiniDialogOpen} onOpenChange={setIsMiniDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMiniBanner ? 'Editar Mini Banner' : 'Novo Mini Banner'}
            </DialogTitle>
            <DialogDescription>
              Configure o mini banner promocional (recomendado: 800x200px)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mini-title">Título *</Label>
              <Input
                id="mini-title"
                value={miniFormData.title}
                onChange={(e) => setMiniFormData({ ...miniFormData, title: e.target.value })}
                placeholder="Ex: Promoção Especial"
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem do Mini Banner *</Label>
              <ImageUpload
                value={miniFormData.image_url}
                onChange={(url) => setMiniFormData({ ...miniFormData, image_url: url })}
                bucket="banners"
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: 800x200px para melhor visualização
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mini-link">Link (opcional)</Label>
              <Input
                id="mini-link"
                value={miniFormData.link_url}
                onChange={(e) => setMiniFormData({ ...miniFormData, link_url: e.target.value })}
                placeholder="Ex: /categoria/promocoes"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mini-order">Ordem de Exibição</Label>
                <Input
                  id="mini-order"
                  type="number"
                  min="1"
                  value={miniFormData.display_order}
                  onChange={(e) => setMiniFormData({ ...miniFormData, display_order: Number.parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mini-active">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="mini-active"
                    checked={miniFormData.is_active}
                    onCheckedChange={(checked) => setMiniFormData({ ...miniFormData, is_active: checked })}
                  />
                  <Label htmlFor="mini-active" className="cursor-pointer">
                    {miniFormData.is_active ? 'Ativo' : 'Inativo'}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseMiniDialog} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMini} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
