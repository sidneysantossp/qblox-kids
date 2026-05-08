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
import { ArrowLeft, Upload, X, Loader2, Trash2 } from 'lucide-react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      icon: '',
      image_url: '',
      display_order: 0,
      is_active: true,
    },
  });

  // Carregar dados da categoria se estiver editando
  useEffect(() => {
    if (isEditing && id) {
      loadCategory(id);
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
          display_order: category.display_order,
          is_active: category.is_active,
        });
        if (category.image_url) {
          setImagePreview(category.image_url);
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

  // Upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máx 1MB)
    if (file.size > 1024 * 1024) {
      toast.error('Imagem muito grande. Tamanho máximo: 1MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo deve ser uma imagem');
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await uploadImage(file, 'images');
      form.setValue('image_url', imageUrl);
      setImagePreview(imageUrl);
      toast.success('Imagem enviada com sucesso');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploadingImage(false);
    }
  };

  // Remover imagem
  const handleRemoveImage = () => {
    form.setValue('image_url', '');
    setImagePreview('');
  };

  // Gerar slug automaticamente a partir do nome
  const handleNameChange = (value: string) => {
    form.setValue('name', value);
    if (!isEditing) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  };

  // Salvar categoria
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

  // Excluir categoria
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/categorias')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Atualize os dados da categoria' : 'Preencha os dados da nova categoria'}
            </p>
          </div>
        </div>

        {isEditing && (
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </>
            )}
          </Button>
        )}
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Informações Básicas */}
            <div className="xl:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Super Heróis"
                              onChange={(e) => handleNameChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="super-herois" />
                          </FormControl>
                          <FormDescription>
                            URL amigável (gerado automaticamente)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Descrição da categoria"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ícone (emoji)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="🦸" maxLength={2} />
                          </FormControl>
                          <FormDescription>
                            Emoji para representar a categoria
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="display_order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ordem de Exibição *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Ordem de exibição no site
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Imagem da Categoria */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagem da Categoria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagem Principal</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Preview da imagem */}
                            {imagePreview && (
                              <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={handleRemoveImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}

                            {/* Upload button */}
                            <div className="flex items-center gap-4">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="hidden"
                                id="image-upload"
                              />
                              <label htmlFor="image-upload">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={uploadingImage}
                                  asChild
                                >
                                  <span>
                                    {uploadingImage ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Enviando...
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Escolher Imagem
                                      </>
                                    )}
                                  </span>
                                </Button>
                              </label>
                              <span className="text-sm text-muted-foreground">
                                Tamanho máximo: 1MB
                              </span>
                            </div>

                            {/* URL manual */}
                            <div className="space-y-2">
                              <FormLabel>Ou insira a URL da imagem</FormLabel>
                              <Input
                                {...field}
                                placeholder="https://exemplo.com/imagem.jpg"
                                onChange={(e) => {
                                  field.onChange(e);
                                  setImagePreview(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Imagem circular exibida na seção "Explore por Categorias"
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Configurações */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Ativo</FormLabel>
                          <FormDescription>
                            Categoria visível no site
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Ações */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Categoria'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/admin/categorias')}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      {/* Delete Confirmation Dialog */}
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
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
