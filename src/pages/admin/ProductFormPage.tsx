import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import MultiSelect from '@/components/ui/multi-select';
import ReviewsManager from '@/components/admin/ReviewsManager';
import { toast } from 'sonner';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from '@/db/admin-api';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import { supabase } from '@/db/supabase';
import type { Product, Category } from '@/types';

const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  original_price: z.number().nullable().optional(),
  category: z.string().min(1, 'Selecione pelo menos uma categoria'),
  categories: z.array(z.string()).min(1, 'Selecione pelo menos uma categoria'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  image_url: z.string().min(1, 'Imagem principal é obrigatória').url('URL de imagem inválida'),
  images: z.array(z.string().url()).optional(),
  is_featured: z.boolean(),
  is_bestseller: z.boolean(),
  is_on_sale: z.boolean(),
  is_flash_sale: z.boolean(),
  is_weekly_deal: z.boolean(),
  is_build_collection: z.boolean(),
  is_tv_series: z.boolean(),
  flash_sale_end_time: z.string().nullable().optional(),
  availability_status: z.enum(['in_stock', 'made_to_order', 'unavailable']),
  rating: z.number(),
  reviews_count: z.number(),
  weight: z.number().int().min(1, 'Peso deve ser maior que zero').optional(),
  length: z.number().int().min(1, 'Comprimento deve ser maior que zero').optional(),
  height: z.number().int().min(1, 'Altura deve ser maior que zero').optional(),
  width: z.number().int().min(1, 'Largura deve ser maior que zero').optional(),
  meta_title: z.string().max(60, 'Título SEO deve ter no máximo 60 caracteres').optional(),
  meta_description: z.string().max(160, 'Descrição SEO deve ter no máximo 160 caracteres').optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const mainImageUploadPathRef = useRef(`product-main/${Date.now()}`);

  const mainImageUpload = useSupabaseUpload({
    bucketName: 'products',
    path: mainImageUploadPathRef.current,
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 1,
    upsert: false,
    supabase,
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      original_price: null,
      category: '',
      categories: [],
      stock: 0,
      image_url: '',
      images: [],
      is_featured: false,
      is_bestseller: false,
      is_on_sale: false,
      is_flash_sale: false,
      is_weekly_deal: false,
      is_build_collection: false,
      is_tv_series: false,
      flash_sale_end_time: null,
      availability_status: 'in_stock',
      rating: 0,
      reviews_count: 0,
      weight: 500,
      length: 20,
      height: 10,
      width: 15,
      meta_title: '',
      meta_description: '',
    },
  });

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    const fileToUpload = mainImageUpload.files[0];
    const alreadyUploaded = fileToUpload && mainImageUpload.successes.includes(fileToUpload.name);

    if (!fileToUpload || fileToUpload.errors.length > 0 || alreadyUploaded || mainImageUpload.loading) {
      return;
    }

    void mainImageUpload.onUpload();
  }, [mainImageUpload.files, mainImageUpload.successes, mainImageUpload.loading, mainImageUpload.onUpload]);

  useEffect(() => {
    const uploadedFile = mainImageUpload.files[0];
    const uploadedSuccessfully = uploadedFile && mainImageUpload.successes.includes(uploadedFile.name);

    if (!uploadedSuccessfully) {
      return;
    }

    const uploadPath = `${mainImageUploadPathRef.current}/${uploadedFile.name}`;
    const { data } = supabase.storage.from('products').getPublicUrl(uploadPath);
    form.setValue('image_url', data.publicUrl, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    mainImageUpload.setFiles([]);
    mainImageUpload.setErrors([]);
    toast.success('Imagem principal enviada com sucesso');
  }, [form, mainImageUpload.files, mainImageUpload.successes, mainImageUpload.setErrors, mainImageUpload.setFiles]);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    }
  };

  const loadProduct = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const products = await getAllProducts();
      const product = products.find((p) => p.id === id);
      
      if (!product) {
        toast.error('Produto não encontrado');
        navigate('/admin/produtos');
        return;
      }

      // Armazenar o produto no estado
      setCurrentProduct(product);

      // Convert <br> tags back to line breaks for editing
      const descriptionForEditing = product.description?.replace(/<br\s*\/?>/gi, '\n') || '';

      form.reset({
        name: product.name,
        description: descriptionForEditing,
        price: product.price,
        original_price: product.original_price,
        category: product.category,
        categories: product.categories || [product.category],
        stock: product.stock,
        image_url: product.image_url,
        images: product.images || [],
        is_featured: product.is_featured,
        is_bestseller: product.is_bestseller,
        is_on_sale: product.is_on_sale,
        is_flash_sale: product.is_flash_sale || false,
        is_weekly_deal: product.is_weekly_deal || false,
        is_build_collection: product.is_build_collection || false,
        is_tv_series: product.is_tv_series || false,
        flash_sale_end_time: product.flash_sale_end_time || null,
        availability_status: product.availability_status || 'in_stock',
        rating: product.rating || 0,
        reviews_count: product.reviews_count || 0,
        weight: product.weight || 500,
        length: product.length || 20,
        height: product.height || 10,
        width: product.width || 15,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
      });

      setAdditionalImages(product.images || []);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      toast.error('Erro ao carregar produto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMainImage: boolean = true) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem deve ter no máximo 5MB');
      input.value = '';
      return;
    }

    try {
      setUploadingImages(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      const imageUrl = data.publicUrl;

      if (isMainImage) {
        form.setValue('image_url', imageUrl, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      } else {
        const newImages = [...additionalImages, imageUrl];
        setAdditionalImages(newImages);
        form.setValue('images', newImages, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }

      toast.success('Imagem enviada com sucesso');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      input.value = '';
      setUploadingImages(false);
    }
  };

  const removeMainImage = () => {
    form.setValue('image_url', '', {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    mainImageUpload.setFiles([]);
    mainImageUpload.setErrors([]);
    toast.success('Imagem principal removida');
  };

  const removeAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    form.setValue('images', newImages);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);

      // Convert line breaks to <br> tags for HTML rendering
      const formattedDescription = data.description.replace(/\n/g, '<br>');

      const productData: Partial<Product> = {
        name: data.name,
        description: formattedDescription,
        price: data.price,
        original_price: data.original_price || null,
        category: data.categories[0] || data.category, // primeira categoria como principal
        categories: data.categories,
        stock: data.stock,
        image_url: data.image_url,
        images: additionalImages,
        is_featured: data.is_featured ?? false,
        is_bestseller: data.is_bestseller ?? false,
        is_on_sale: data.is_on_sale ?? false,
        is_flash_sale: data.is_flash_sale ?? false,
        is_weekly_deal: data.is_weekly_deal ?? false,
        is_build_collection: data.is_build_collection ?? false,
        is_tv_series: data.is_tv_series ?? false,
        flash_sale_end_time: data.flash_sale_end_time || null,
        availability_status: data.availability_status || 'in_stock',
        rating: data.rating || 0,
        reviews_count: data.reviews_count || 0,
        weight: data.weight,
        length: data.length,
        height: data.height,
        width: data.width,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
      };

      if (isEditing && id) {
        await updateProduct(id, productData);
        toast.success('Produto atualizado com sucesso');
      } else {
        await createProduct(productData as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Produto criado com sucesso');
      }

      navigate('/admin/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      setIsDeleting(true);
      await deleteProduct(id);
      toast.success('Produto excluído com sucesso');
      navigate('/admin/produtos');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    } finally {
      setIsDeleting(false);
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
            onClick={() => navigate('/admin/produtos')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Atualize as informações do produto' : 'Adicione um novo produto ao catálogo'}
            </p>
          </div>
        </div>
        {isEditing && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir Produto'
            )}
          </Button>
        )}
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Produto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: LEGO Super Heróis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SKU - Somente leitura, gerado automaticamente */}
                  {id && currentProduct ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Código SKU
                      </label>
                      <Input 
                        value={currentProduct.sku || 'Gerando...'}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">
                        Código único gerado automaticamente (não editável)
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">
                        ℹ️ O código SKU será gerado automaticamente ao criar o produto
                      </p>
                    </div>
                  )}

                  <FormField
                    control={form.control as any}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o produto... (Use quebras de linha para formatar o texto)"
                            rows={8}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          As quebras de linha serão preservadas na exibição do produto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categorias</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={categories.map((cat) => ({
                              label: cat.name,
                              value: cat.slug,
                            }))}
                            value={field.value || []}
                            onChange={(selected) => {
                              field.onChange(selected);
                              // Atualizar também a categoria principal
                              if (selected.length > 0) {
                                form.setValue('category', selected[0]);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Selecione todas as categorias onde este produto deve aparecer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Pricing & Stock */}
              <Card>
                <CardHeader>
                  <CardTitle>Preço e Estoque</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control as any}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="original_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço Original (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                          </FormControl>
                          <FormDescription>Preço antes do desconto (opcional)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control as any}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Image */}
                  <FormField
                    control={form.control as any}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagem Principal</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {field.value && (
                              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                <img
                                  src={field.value}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={removeMainImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            <Input
                              type="text"
                              placeholder="URL da imagem"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            <Dropzone {...mainImageUpload} className="bg-background">
                              <DropzoneEmptyState />
                              <DropzoneContent />
                            </Dropzone>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Tamanho máximo: 5MB. Formatos: JPG, PNG, WebP
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Images */}
                  <div className="space-y-2">
                    <Label>Imagens Adicionais</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {additionalImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Adicional ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeAdditionalImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {additionalImages.length < 8 && (
                        <button
                          type="button"
                          className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                          onClick={() => document.getElementById('additional-image-upload')?.click()}
                          disabled={uploadingImages}
                        >
                          {uploadingImages ? (
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          ) : (
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          )}
                        </button>
                      )}
                    </div>
                    <input
                      id="additional-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, false)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Adicione até 8 imagens adicionais
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO - Otimização para Buscadores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título SEO</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Boneco LEGO Super Herói - Kids Block Store"
                            maxLength={60}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Título que aparece nos resultados de busca (máx. 60 caracteres) - {field.value?.length || 0}/60
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição SEO</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Boneco de montar tipo LEGO do seu super herói favorito. Pronta entrega com frete grátis acima de R$99. Compre agora!"
                            rows={3}
                            maxLength={160}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Descrição que aparece nos resultados de busca (máx. 160 caracteres) - {field.value?.length || 0}/160
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                    <p className="font-medium mb-2">💡 Dicas de SEO:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Use palavras-chave relevantes no título e descrição</li>
                      <li>Seja descritivo e atraente para aumentar cliques</li>
                      <li>Inclua o nome da marca no título</li>
                      <li>Evite repetir o mesmo título em produtos diferentes</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              {isEditing && id && <ReviewsManager productId={id} />}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="availability_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponibilidade</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="in_stock">Pronta Entrega</SelectItem>
                            <SelectItem value="made_to_order">Sob Encomenda</SelectItem>
                            <SelectItem value="unavailable">Indisponível</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Status de disponibilidade do produto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Destaque</FormLabel>
                          <FormDescription>Exibir na seção de destaques</FormDescription>
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

                  <FormField
                    control={form.control as any}
                    name="is_bestseller"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Mais Vendido</FormLabel>
                          <FormDescription>Exibir em mais vendidos</FormDescription>
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

                  <FormField
                    control={form.control as any}
                    name="is_on_sale"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Em Promoção</FormLabel>
                          <FormDescription>Exibir em ofertas</FormDescription>
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

                  <FormField
                    control={form.control as any}
                    name="is_flash_sale"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Oferta Relâmpago ⚡</FormLabel>
                          <FormDescription>Exibir em ofertas relâmpago</FormDescription>
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

                  {form.watch('is_flash_sale') && (
                    <FormField
                      control={form.control as any}
                      name="flash_sale_end_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data/Hora de Término</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value ? new Date(value).toISOString() : null);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Quando a oferta relâmpago termina
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control as any}
                    name="is_weekly_deal"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Novidade da Semana 🌟</FormLabel>
                          <FormDescription>Exibir em novidades da semana</FormDescription>
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

                  <FormField
                    control={form.control as any}
                    name="is_build_collection"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Monte sua Coleção 🧩</FormLabel>
                          <FormDescription>Exibir em Monte sua Coleção</FormDescription>
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

                  <FormField
                    control={form.control as any}
                    name="is_tv_series"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Séries da TV 📺</FormLabel>
                          <FormDescription>Exibir em Séries da TV</FormDescription>
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

              {/* Shipping Dimensions */}
              <Card>
                <CardHeader>
                  <CardTitle>Dimensões para Frete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (gramas)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="500"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Peso do produto em gramas (ex: 500g)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control as any}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comprimento (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="20"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Largura (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="15"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormDescription>
                    Dimensões necessárias para cálculo de frete pelos Correios
                  </FormDescription>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6 space-y-2">
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
                      isEditing ? 'Atualizar Produto' : 'Criar Produto'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/admin/produtos')}
                  >
                    Cancelar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
