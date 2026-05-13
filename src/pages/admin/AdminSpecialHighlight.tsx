import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import { getAllHomepageSections, updateHomepageSection } from '@/db/admin-api';
import { FeaturedSection } from '@/components/brickstore/FeaturedSection';
import type { HomepageSection, SpecialHighlightConfig, SpecialHighlightBackgroundType } from '@/types';

const getDefaultSpecialHighlightConfig = (): SpecialHighlightConfig => ({
  badge_text: 'EDIÇÃO LIMITADA',
  headline: 'Coleção Guardiões Galácticos',
  description: 'Uma seleção exclusiva de minifiguras inspiradas em aventuras espaciais, perfeita para colecionadores que buscam peças únicas.',
  features: ['6 personagens exclusivos', 'Acessórios especiais inclusos', 'Embalagem colecionável'],
  image_url: '',
  price_prefix: 'A partir de',
  price_value: 'R$ 149,90',
  primary_cta_text: 'Comprar agora',
  primary_cta_url: '/produto/colecao-guardioes-galacticos',
  secondary_cta_text: 'Ver detalhes',
  secondary_cta_url: '/produto/colecao-guardioes-galacticos',
  background_type: 'gradient',
  background_gradient_from: '#061A33',
  background_gradient_via: '#0057D9',
  background_gradient_to: '#003A99',
  background_overlay: 'rgba(0, 0, 0, 0)',
  background_image_position_y: 50,
});

const normalizeFeatures = (features?: string[]) => {
  const next = Array.from({ length: 3 }, (_, index) => features?.[index] || '');
  return next;
};

export default function AdminSpecialHighlight() {
  const { toast } = useToast();
  const [section, setSection] = useState<HomepageSection | null>(null);
  const [config, setConfig] = useState<SpecialHighlightConfig>(getDefaultSpecialHighlightConfig());
  const [sectionTitle, setSectionTitle] = useState('Destaque Especial');
  const [sectionSubtitle, setSectionSubtitle] = useState('Os bonecos mais desejados pelos colecionadores esta semana');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const highlightImageUpload = useSupabaseUpload({
    bucketName: 'images',
    path: 'sections/highlight',
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 1,
    upsert: false,
    supabase,
  });

  const backgroundImageUpload = useSupabaseUpload({
    bucketName: 'images',
    path: 'sections/highlight/backgrounds',
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 1,
    upsert: false,
    supabase,
  });

  useEffect(() => {
    void loadSection();
  }, []);

  useEffect(() => {
    const file = highlightImageUpload.files[0];
    const alreadyUploaded = file && highlightImageUpload.successes.includes(file.name);

    if (!file || file.errors.length > 0 || alreadyUploaded || highlightImageUpload.loading) {
      return;
    }

    void highlightImageUpload.onUpload();
  }, [highlightImageUpload.files, highlightImageUpload.successes, highlightImageUpload.loading, highlightImageUpload.onUpload]);

  useEffect(() => {
    const file = backgroundImageUpload.files[0];
    const alreadyUploaded = file && backgroundImageUpload.successes.includes(file.name);

    if (!file || file.errors.length > 0 || alreadyUploaded || backgroundImageUpload.loading) {
      return;
    }

    void backgroundImageUpload.onUpload();
  }, [backgroundImageUpload.files, backgroundImageUpload.successes, backgroundImageUpload.loading, backgroundImageUpload.onUpload]);

  useEffect(() => {
    const uploadedFile = highlightImageUpload.files[0];
    const uploadedSuccessfully = uploadedFile && highlightImageUpload.successes.includes(uploadedFile.name);

    if (!uploadedSuccessfully) {
      return;
    }

    const filePath = `sections/highlight/${uploadedFile.name}`;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    setConfig((prev) => ({ ...prev, image_url: data.publicUrl }));
    toast({ title: 'Sucesso', description: 'Imagem principal enviada com sucesso' });
  }, [highlightImageUpload.files, highlightImageUpload.successes, toast]);

  useEffect(() => {
    const uploadedFile = backgroundImageUpload.files[0];
    const uploadedSuccessfully = uploadedFile && backgroundImageUpload.successes.includes(uploadedFile.name);

    if (!uploadedSuccessfully) {
      return;
    }

    const filePath = `sections/highlight/backgrounds/${uploadedFile.name}`;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    setConfig((prev) => ({ ...prev, background_image_url: data.publicUrl, background_type: 'image' }));
    toast({ title: 'Sucesso', description: 'Imagem de fundo enviada com sucesso' });
  }, [backgroundImageUpload.files, backgroundImageUpload.successes, toast]);

  const loadSection = async () => {
    try {
      setIsLoading(true);
      const sections = await getAllHomepageSections();
      const specialHighlight = sections.find((item) => item.section_type === 'special_highlight');

      if (!specialHighlight) {
        toast({ title: 'Erro', description: 'A seção Destaque Especial não foi encontrada', variant: 'destructive' });
        return;
      }

      const resolvedConfig = {
        ...getDefaultSpecialHighlightConfig(),
        ...(specialHighlight.config || {}),
      };

      setSection(specialHighlight);
      setSectionTitle(specialHighlight.title);
      setSectionSubtitle(specialHighlight.subtitle || '');
      setIsActive(specialHighlight.is_active);
      setConfig({
        ...resolvedConfig,
        features: normalizeFeatures(resolvedConfig.features),
      });
    } catch (error) {
      console.error('Erro ao carregar destaque especial:', error);
      toast({ title: 'Erro', description: 'Não foi possível carregar o Destaque Especial', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    setConfig((prev) => {
      const nextFeatures = normalizeFeatures(prev.features);
      nextFeatures[index] = value;
      return {
        ...prev,
        features: nextFeatures,
      };
    });
  };

  const handleBackgroundTypeChange = (backgroundType: SpecialHighlightBackgroundType) => {
    setConfig((prev) => ({
      ...prev,
      background_type: backgroundType,
    }));
  };

  const handleSave = async () => {
    if (!section) {
      return;
    }

    if (!sectionTitle.trim()) {
      toast({ title: 'Erro', description: 'O título da seção é obrigatório', variant: 'destructive' });
      return;
    }

    if (!config.headline?.trim()) {
      toast({ title: 'Erro', description: 'O título principal do destaque é obrigatório', variant: 'destructive' });
      return;
    }

    if (!config.description?.trim()) {
      toast({ title: 'Erro', description: 'A descrição do destaque é obrigatória', variant: 'destructive' });
      return;
    }

    if (config.background_type === 'image' && !config.background_image_url?.trim()) {
      toast({ title: 'Erro', description: 'Envie uma imagem de fundo para usar esse tipo de background', variant: 'destructive' });
      return;
    }

    if (config.background_type === 'solid' && !config.background_color?.trim()) {
      toast({ title: 'Erro', description: 'Informe a cor sólida do fundo', variant: 'destructive' });
      return;
    }

    if (config.background_type === 'gradient' && (!config.background_gradient_from?.trim() || !config.background_gradient_to?.trim())) {
      toast({ title: 'Erro', description: 'Informe as cores principais do gradiente', variant: 'destructive' });
      return;
    }

    try {
      setIsSaving(true);
      const payloadConfig: SpecialHighlightConfig = {
        ...config,
        features: normalizeFeatures(config.features).filter((feature) => feature.trim()),
      };

      const updatedSection = await updateHomepageSection(section.id, {
        title: sectionTitle.trim(),
        subtitle: sectionSubtitle.trim(),
        is_active: isActive,
        config: payloadConfig as Record<string, any>,
      });

      setSection(updatedSection);
      setConfig({
        ...getDefaultSpecialHighlightConfig(),
        ...(updatedSection.config || payloadConfig),
        features: normalizeFeatures((updatedSection.config as SpecialHighlightConfig | undefined)?.features || payloadConfig.features),
      });

      toast({ title: 'Sucesso', description: 'Destaque Especial atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao salvar Destaque Especial:', error);
      toast({ title: 'Erro', description: 'Não foi possível salvar o Destaque Especial', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const previewConfig = useMemo<SpecialHighlightConfig>(() => ({
    ...config,
    features: normalizeFeatures(config.features).filter((feature) => feature.trim()),
  }), [config]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Destaque Especial</h1>
          <p className="text-muted-foreground">Carregando configurações da seção...</p>
        </div>
        <div className="flex items-center justify-center py-20 text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Destaque Especial</h1>
          <p className="text-muted-foreground">Gerencie a seção promocional exibida abaixo de Coleções Temáticas na home.</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin/secoes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Seções Home
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo e configuração visual</CardTitle>
            <CardDescription>Edite texto, vantagens, preço, botões e o background do bloco.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="section-title">Título da seção</Label>
                <Input id="section-title" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-subtitle">Subtítulo da seção</Label>
                <Input id="section-subtitle" value={sectionSubtitle} onChange={(e) => setSectionSubtitle(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Seção ativa</p>
                <p className="text-sm text-muted-foreground">Controla a exibição do Destaque Especial na home.</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input id="badge" value={config.badge_text || ''} onChange={(e) => setConfig((prev) => ({ ...prev, badge_text: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headline">Título principal</Label>
                <Input id="headline" value={config.headline || ''} onChange={(e) => setConfig((prev) => ({ ...prev, headline: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" rows={4} value={config.description || ''} onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))} />
            </div>

            <div className="space-y-3">
              <div>
                <Label>Vantagens</Label>
                <p className="text-sm text-muted-foreground">Até 3 itens destacados ao lado do preço.</p>
              </div>
              <div className="grid gap-3">
                {[0, 1, 2].map((index) => (
                  <Input
                    key={index}
                    value={normalizeFeatures(config.features)[index]}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Vantagem ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price-prefix">Prefixo do preço</Label>
                <Input id="price-prefix" value={config.price_prefix || ''} onChange={(e) => setConfig((prev) => ({ ...prev, price_prefix: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input id="price" value={config.price_value || ''} onChange={(e) => setConfig((prev) => ({ ...prev, price_value: e.target.value }))} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary-cta-text">CTA principal</Label>
                <Input id="primary-cta-text" value={config.primary_cta_text || ''} onChange={(e) => setConfig((prev) => ({ ...prev, primary_cta_text: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-cta-url">URL CTA principal</Label>
                <Input id="primary-cta-url" value={config.primary_cta_url || ''} onChange={(e) => setConfig((prev) => ({ ...prev, primary_cta_url: e.target.value }))} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="secondary-cta-text">CTA secundário</Label>
                <Input id="secondary-cta-text" value={config.secondary_cta_text || ''} onChange={(e) => setConfig((prev) => ({ ...prev, secondary_cta_text: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-cta-url">URL CTA secundário</Label>
                <Input id="secondary-cta-url" value={config.secondary_cta_url || ''} onChange={(e) => setConfig((prev) => ({ ...prev, secondary_cta_url: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                  <h2 className="font-semibold">Imagem principal do destaque</h2>
                  <p className="text-sm text-muted-foreground">Usada no bloco central do card promocional.</p>
                </div>
              </div>

              {config.image_url ? (
                <div className="relative overflow-hidden rounded-lg border bg-muted">
                  <img src={config.image_url} alt="Imagem principal" className="h-48 w-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setConfig((prev) => ({ ...prev, image_url: '' }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}

              <Dropzone {...highlightImageUpload} className="bg-background">
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>
            </div>

            <div className="space-y-4 rounded-xl border p-4">
              <div>
                <h2 className="font-semibold">Background da seção</h2>
                <p className="text-sm text-muted-foreground">Escolha entre imagem, cor sólida ou gradiente para o fundo.</p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { value: 'gradient', label: 'Gradiente' },
                  { value: 'solid', label: 'Cor sólida' },
                  { value: 'image', label: 'Imagem' },
                ].map((option) => {
                  const checked = config.background_type === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleBackgroundTypeChange(option.value as SpecialHighlightBackgroundType)}
                      className={`rounded-lg border p-3 text-left transition ${checked ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'}`}
                    >
                      <p className="font-medium">{option.label}</p>
                    </button>
                  );
                })}
              </div>

              {config.background_type === 'gradient' && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="gradient-from">Cor inicial</Label>
                    <Input id="gradient-from" type="color" value={config.background_gradient_from || '#061A33'} onChange={(e) => setConfig((prev) => ({ ...prev, background_gradient_from: e.target.value }))} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradient-via">Cor intermediária</Label>
                    <Input id="gradient-via" type="color" value={config.background_gradient_via || '#0057D9'} onChange={(e) => setConfig((prev) => ({ ...prev, background_gradient_via: e.target.value }))} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradient-to">Cor final</Label>
                    <Input id="gradient-to" type="color" value={config.background_gradient_to || '#003A99'} onChange={(e) => setConfig((prev) => ({ ...prev, background_gradient_to: e.target.value }))} className="h-12" />
                  </div>
                </div>
              )}

              {config.background_type === 'solid' && (
                <div className="space-y-2">
                  <Label htmlFor="solid-color">Cor do fundo</Label>
                  <Input id="solid-color" type="color" value={config.background_color || '#061A33'} onChange={(e) => setConfig((prev) => ({ ...prev, background_color: e.target.value }))} className="h-12 max-w-xs" />
                </div>
              )}

              {config.background_type === 'image' && (
                <div className="space-y-4">
                  {config.background_image_url ? (
                    <div className="relative overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={config.background_image_url}
                        alt="Imagem de fundo"
                        className="h-48 w-full object-cover"
                        style={{ objectPosition: `center ${config.background_image_position_y ?? 50}%` }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setConfig((prev) => ({ ...prev, background_image_url: '' }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}

                  <Dropzone {...backgroundImageUpload} className="bg-background">
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>

                  <div className="space-y-2">
                    <Label htmlFor="background-position">Posição vertical da imagem</Label>
                    <Input
                      id="background-position"
                      type="range"
                      min="0"
                      max="100"
                      value={config.background_image_position_y ?? 50}
                      onChange={(e) => setConfig((prev) => ({ ...prev, background_image_position_y: Number(e.target.value) }))}
                    />
                    <p className="text-sm text-muted-foreground">Valor atual: {config.background_image_position_y ?? 50}%</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="background-overlay">Overlay do fundo</Label>
                <Input
                  id="background-overlay"
                  value={config.background_overlay || ''}
                  onChange={(e) => setConfig((prev) => ({ ...prev, background_overlay: e.target.value }))}
                  placeholder="rgba(0, 0, 0, 0.15)"
                />
                <p className="text-sm text-muted-foreground">Use RGBA para escurecer ou suavizar fundos com imagem.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => void loadSection()} disabled={isSaving}>
                Restaurar dados salvos
              </Button>
              <Button onClick={() => void handleSave()} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Salvar Destaque Especial
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview em tempo real</CardTitle>
              <CardDescription>Simulação do bloco como ele aparecerá na home.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-[#F7F8FA] rounded-b-lg py-6">
                <FeaturedSection title={sectionTitle} subtitle={sectionSubtitle} config={previewConfig} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
