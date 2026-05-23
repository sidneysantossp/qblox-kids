import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import { supabase } from '@/db/supabase';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { ArrowLeft, X, Loader2, Trash2 } from 'lucide-react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/db/admin-api';
import type { Category } from '@/types';
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

const categorySchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  icon: z.string().optional(),
  image_url: z.string().optional(),
  mini_thumb_url: z.string().optional(),
  display_order: z.number().int().min(0, 'Ordem não pode ser negativa'),
  is_active: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [miniThumbPreview, setMiniThumbPreview] = useState<string>('');

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      icon: '',
      image_url: '',
      mini_thumb_url: '',
      display_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      void loadCategory(id);
    }
  }, [id, isEditing]);

  const loadCategory = async (categoryId: string) => {
    try {
      setIsLoading(true);
      const categories = await getAllCategories();
      const category = categories.find((c) => c.id === categoryId);

      if (category) {
        form.reset({
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          icon: category.icon || '',
          image_url: category.image_url || '',
          mini_thumb_url: category.mini_thumb_url || '',
          display_order: category.display_order,
          is_active: category.is_active,
        });
        if (category.image_url) {
          setImagePreview(category.image_url);
        }
        if (category.mini_thumb_url) {
          setMiniThumbPreview(category.mini_thumb_url);
        }
      } else {
        toast.error('Categoria não encontrada');
        navigate('/admin/categorias');
      }
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      toast.error('Erro ao carregar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const categoryImageUpload = useSupabaseUpload({
    bucketName: 'images',
    path: 'categories',
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 1,
    upsert: false,
    supabase,
  });

  const categoryMiniThumbUpload = useSupabaseUpload({
    bucketName: 'images',
    path: 'categories/thumbs',
    allowedMimeTypes: ['image/*'],
    maxFileSize: 2 * 1024 * 1024,
    maxFiles: 1,
    upsert: false,
    supabase,
  });

  useEffect(() => {
    const fileToUpload = categoryImageUpload.files[0];
    const alreadyUploaded = fileToUpload && categoryImageUpload.successes.includes(fileToUpload.name);

    if (!fileToUpload || fileToUpload.errors.length > 0 || alreadyUploaded || categoryImageUpload.loading) {
      return;
    }

    void categoryImageUpload.onUpload();
  }, [categoryImageUpload.files, categoryImageUpload.successes, categoryImageUpload.loading, categoryImageUpload.onUpload]);

  useEffect(() => {
    const fileToUpload = categoryMiniThumbUpload.files[0];
    const alreadyUploaded = fileToUpload && categoryMiniThumbUpload.successes.includes(fileToUpload.name);

    if (!fileToUpload || fileToUpload.errors.length > 0 || alreadyUploaded || categoryMiniThumbUpload.loading) {
      return;
    }

    void categoryMiniThumbUpload.onUpload();
  }, [categoryMiniThumbUpload.files, categoryMiniThumbUpload.successes, categoryMiniThumbUpload.loading, categoryMiniThumbUpload.onUpload]);

  useEffect(() => {
    const uploadedFile = categoryImageUpload.files[0];
    const uploadedSuccessfully = uploadedFile && categoryImageUpload.successes.includes(uploadedFile.name);

    if (!uploadedSuccessfully) {
      return;
    }

    const filePath = `categories/${uploadedFile.name}`;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    form.setValue('image_url', data.publicUrl, { shouldDirty: true });
    setImagePreview(data.publicUrl);
    toast.success('Imagem enviada com sucesso');
  }, [categoryImageUpload.files, categoryImageUpload.successes, form]);

  useEffect(() => {
    const uploadedFile = categoryMiniThumbUpload.files[0];
    const uploadedSuccessfully = uploadedFile && categoryMiniThumbUpload.successes.includes(uploadedFile.name);

    if (!uploadedSuccessfully) {
      return;
    }

    const filePath = `categories/thumbs/${uploadedFile.name}`;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    form.setValue('mini_thumb_url', data.publicUrl, { shouldDirty: true });
    setMiniThumbPreview(data.publicUrl);
    toast.success('Mini thumb enviada com sucesso');
  }, [categoryMiniThumbUpload.files, categoryMiniThumbUpload.successes, form]);

  const handleRemoveImage = () => {
    form.setValue('image_url', '');
    setImagePreview('');
    categoryImageUpload.setFiles([]);
    categoryImageUpload.setErrors([]);
  };

  const handleRemoveMiniThumb = () => {
    form.setValue('mini_thumb_url', '');
    setMiniThumbPreview('');
    categoryMiniThumbUpload.setFiles([]);
    categoryMiniThumbUpload.setErrors([]);
  };

  const handleNameChange = (value: string) => {
    form.setValue('name', value);
    if (!isEditing) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsLoading(true);

      if (isEditing && id) {
        await updateCategory(id, data);
        toast.success('Categoria atualizada com sucesso');
      } else {
        await createCategory(data as Omit<Category, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Categoria criada com sucesso');
      }

      navigate('/admin/categorias');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error('Erro ao salvar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      await deleteCategory(id);
      toast.success('Categoria excluída com sucesso');
      navigate('/admin/categorias');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir categoria');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/categorias')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</h1>
            <p className="text-muted-foreground">{isEditing ? 'Atualize os dados da categoria' : 'Preencha os dados da nova categoria'}</p>
          </div>
        </div>

        {isEditing && (
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} disabled={isDeleting}>
            {isDeleting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Excluindo...</> : <><Trash2 className="h-4 w-4 mr-2" />Excluir</>}
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Super Heróis" onChange={(e) => handleNameChange(e.target.value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="slug" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="super-herois" />
                        </FormControl>
                        <FormDescription>URL amigável (gerado automaticamente)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Descrição da categoria" rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="icon" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ícone (emoji)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="🦸" maxLength={2} />
                        </FormControl>
                        <FormDescription>Emoji para representar a categoria</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="display_order" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordem de Exibição *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                        </FormControl>
                        <FormDescription>Ordem de exibição no site</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imagem da Categoria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="image_url" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem Principal</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {imagePreview && (
                            <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveImage}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          <Dropzone {...categoryImageUpload} className="bg-background">
                            <DropzoneEmptyState />
                            <DropzoneContent />
                          </Dropzone>

                          <div className="space-y-2">
                            <FormLabel>Ou insira a URL da imagem</FormLabel>
                            <Input {...field} placeholder="https://exemplo.com/imagem.jpg" onChange={(e) => { field.onChange(e); setImagePreview(e.target.value); }} />
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>Imagem principal da categoria</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="mini_thumb_url" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mini thumb da categoria</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {miniThumbPreview && (
                            <div className="relative w-24 h-24 border rounded-lg overflow-hidden bg-muted">
                              <img src={miniThumbPreview} alt="Mini thumb" className="w-full h-full object-cover" />
                              <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={handleRemoveMiniThumb}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}

                          <Dropzone {...categoryMiniThumbUpload} className="bg-background">
                            <DropzoneEmptyState />
                            <DropzoneContent />
                          </Dropzone>

                          <div className="space-y-2">
                            <FormLabel>Ou insira a URL da mini thumb</FormLabel>
                            <Input {...field} placeholder="https://exemplo.com/thumb-40x40.jpg" onChange={(e) => { field.onChange(e); setMiniThumbPreview(e.target.value); }} />
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>Sugestão: imagem quadrada em 40x40 px para uso no menu mobile e em miniaturas de navegação.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="is_active" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ativo</FormLabel>
                        <FormDescription>Categoria visível no site</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</> : 'Salvar Categoria'}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/admin/categorias')} disabled={isLoading}>
                    Cancelar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
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
