import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';
import { getAllMiniBanners, createMiniBanner, updateMiniBanner, deleteMiniBanner } from '@/db/admin-api';
import type { MiniBanner } from '@/types';
import { Loader2, Trash2, X } from 'lucide-react';

interface MiniBannerFormData {
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  button_text: string;
  display_order: number;
  is_active: boolean;
  placement: string;
}

const placement = 'thematic_collection';

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export default function AdminThematicCollections() {
  const { toast } = useToast();
  const [items, setItems] = useState<MiniBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState<MiniBannerFormData>({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    button_text: '',
    display_order: 1,
    is_active: true,
    placement,
  });

  const upload = useSupabaseUpload({
    bucketName: 'images',
    path: 'thematic-collections',
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 1,
    upsert: false,
    supabase,
  });

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const fileToUpload = upload.files[0];
    const alreadyUploaded = fileToUpload && upload.successes.includes(fileToUpload.name);

    if (!fileToUpload || fileToUpload.errors.length > 0 || alreadyUploaded || upload.loading) {
      return;
    }

    void upload.onUpload();
  }, [upload.files, upload.successes, upload.loading, upload.onUpload]);

  useEffect(() => {
    const uploadedFile = upload.files[0];
    const uploadedSuccessfully = uploadedFile && upload.successes.includes(uploadedFile.name);

    if (!uploadedSuccessfully) {
      return;
    }

    const filePath = `thematic-collections/${uploadedFile.name}`;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));
    setImagePreview(data.publicUrl);
    toast({ title: 'Sucesso', description: 'Imagem enviada com sucesso' });
  }, [upload.files, upload.successes, toast]);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const data = await getAllMiniBanners(placement);
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar coleções temáticas:', error);
      toast({ title: 'Erro', description: 'Não foi possível carregar as coleções temáticas', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setImagePreview('');
    upload.setFiles([]);
    upload.setErrors([]);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      button_text: '',
      display_order: items.length + 1,
      is_active: true,
      placement,
    });
  };

  const handleEdit = (item: MiniBanner) => {
    setEditingId(item.id);
    setImagePreview(item.image_url || '');
    upload.setFiles([]);
    upload.setErrors([]);
    setFormData({
      title: item.title,
      subtitle: item.subtitle || '',
      image_url: item.image_url,
      link_url: item.link_url || '',
      button_text: item.button_text || '',
      display_order: item.display_order,
      is_active: item.is_active,
      placement: item.placement || placement,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta coleção temática?')) {
      return;
    }

    try {
      await deleteMiniBanner(id);
      toast({ title: 'Sucesso', description: 'Coleção temática excluída com sucesso' });
      await loadItems();
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao excluir coleção temática:', error);
      toast({ title: 'Erro', description: 'Não foi possível excluir a coleção temática', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Erro', description: 'O título é obrigatório', variant: 'destructive' });
      return;
    }
    if (!formData.image_url.trim()) {
      toast({ title: 'Erro', description: 'A imagem é obrigatória', variant: 'destructive' });
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        placement,
      };

      if (editingId) {
        await updateMiniBanner(editingId, payload);
        toast({ title: 'Sucesso', description: 'Coleção temática atualizada com sucesso' });
      } else {
        await createMiniBanner(payload as Omit<MiniBanner, 'id' | 'created_at' | 'updated_at'>);
        toast({ title: 'Sucesso', description: 'Coleção temática criada com sucesso' });
      }

      await loadItems();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar coleção temática:', error);
      toast({ title: 'Erro', description: 'Não foi possível salvar a coleção temática', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Coleções Temáticas</h1>
        <p className="text-muted-foreground">Gerencie os 6 cards da seção Coleções Temáticas da home.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar coleção temática' : 'Nova coleção temática'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título com HTML simples</label>
              <Textarea
                rows={4}
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="<p>Aventura<br>na <strong>Selva</strong></p>"
              />
              <p className="text-xs text-muted-foreground mt-1">Aceita apenas &lt;strong&gt;, &lt;br&gt; e &lt;p&gt;.</p>
            </div>

            <div>
              <label className="text-sm font-medium">Subtítulo</label>
              <Textarea
                rows={3}
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Exploradores, mapas, tesouros e animais"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Texto do CTA</label>
                <Input
                  value={formData.button_text}
                  onChange={(e) => setFormData((prev) => ({ ...prev, button_text: e.target.value }))}
                  placeholder="Explorar"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Link do CTA</label>
                <Input
                  value={formData.link_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, link_url: e.target.value }))}
                  placeholder="/categoria/aventura"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ordem</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 mt-6">
                <span className="text-sm font-medium">Ativo</span>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Imagem de destaque</label>
              {imagePreview && (
                <div className="relative mt-2 w-full h-56 rounded-lg overflow-hidden border bg-muted">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview('');
                      setFormData((prev) => ({ ...prev, image_url: '' }));
                      upload.setFiles([]);
                      upload.setErrors([]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="mt-3">
                <Dropzone {...upload} className="bg-background">
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar coleção temática'
                )}
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={isSaving}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itens cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma coleção temática cadastrada.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{stripHtml(item.title)}</p>
                      <p className="text-xs text-muted-foreground">Ordem: {item.display_order}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {item.image_url && (
                    <img src={item.image_url} alt={stripHtml(item.title)} className="w-full h-32 rounded-lg object-cover" />
                  )}
                  {item.subtitle && <p className="text-sm text-muted-foreground">{item.subtitle}</p>}
                  {item.button_text && <p className="text-sm font-medium">CTA: {item.button_text}</p>}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
