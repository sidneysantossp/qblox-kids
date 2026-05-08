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
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { uploadImage } from '@/db/admin-api';

const bannerSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  subtitle: z.string().optional(),
  button_text: z.string().optional(),
  link_url: z.string().optional(),
  image_url: z.string().optional(),
  display_order: z.number().int().min(0, 'Ordem não pode ser negativa'),
  is_active: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

export default function BannerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      button_text: 'VER LANÇAMENTOS',
      link_url: '/categoria/lancamentos',
      image_url: '',
      display_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (id && id !== 'novo') {
      loadBanner();
    }
  }, [id]);

  const loadBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        form.reset({
          title: data.title,
          subtitle: data.subtitle || '',
          button_text: data.button_text || 'VER LANÇAMENTOS',
          link_url: data.link_url || '/categoria/lancamentos',
          image_url: data.image_url || '',
          display_order: data.display_order || 0,
          is_active: data.is_active,
        });
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar banner:', error);
      toast.error('Erro ao carregar banner');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    form.setValue('image_url', '');
  };

  const onSubmit = async (data: BannerFormData) => {
    setLoading(true);
    try {
      let imageUrl = data.image_url;

      // Upload image if new file selected
      if (imageFile) {
        setUploading(true);
        const uploadedUrl = await uploadImage(imageFile, 'banners');
        imageUrl = uploadedUrl;
        setUploading(false);
      }

      const bannerData = {
        ...data,
        image_url: imageUrl || null,
      };

      if (id && id !== 'novo') {
        // Update existing banner
        const { error } = await supabase
          .from('hero_banners')
          .update(bannerData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Banner atualizado com sucesso');
      } else {
        // Create new banner
        const { error } = await supabase
          .from('hero_banners')
          .insert([bannerData]);

        if (error) throw error;
        toast.success('Banner criado com sucesso');
      }

      navigate('/admin/banners');
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      toast.error('Erro ao salvar banner');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/banners')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {id && id !== 'novo' ? 'Editar Banner' : 'Novo Banner'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="COLECIONE. MONTE. AVENTURE-SE!" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use pontos (.) para separar partes do título
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo</FormLabel>
                    <FormControl>
                      <Input placeholder="MINIFIGURAS ÚNICAS PARA HISTÓRIAS INCRÍVEIS!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="button_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do Botão</FormLabel>
                    <FormControl>
                      <Input placeholder="VER LANÇAMENTOS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do Botão</FormLabel>
                    <FormControl>
                      <Input placeholder="/categoria/lancamentos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="space-y-2">
                <FormLabel>Imagem de Fundo</FormLabel>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-primary hover:underline">
                        Clique para fazer upload
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem de Exibição</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Ordem em que o banner aparece no carrossel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Banner Ativo</FormLabel>
                      <FormDescription>
                        Banner será exibido na homepage
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

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/banners')}
                  disabled={loading || uploading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || uploading}>
                  {(loading || uploading) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {uploading ? 'Enviando imagem...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
