import { Fragment, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  getAllHomepageSections,
  updateHomepageSection
} from '@/db/admin-api';
import {
  ArrowUp,
  ArrowDown,
  Pencil,
  Check,
  X,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { HomepageSection } from '@/types';

interface SpecialHighlightConfig {
  badge_text?: string;
  headline?: string;
  description?: string;
  features?: string[];
  image_url?: string;
  price_prefix?: string;
  price_value?: string;
  primary_cta_text?: string;
  primary_cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
}

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
});

export default function AdminSections() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [expandedConfigId, setExpandedConfigId] = useState<string | null>(null);
  const [specialHighlightConfig, setSpecialHighlightConfig] = useState<SpecialHighlightConfig>(getDefaultSpecialHighlightConfig());
  const { toast } = useToast();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setIsLoading(true);
      const data = await getAllHomepageSections();
      setSections(data);
    } catch (error) {
      console.error('Erro ao carregar seções:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as seções',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (section: HomepageSection) => {
    setEditingId(section.id);
    setEditTitle(section.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleSaveTitle = async (id: string) => {
    if (!editTitle.trim()) {
      toast({
        title: 'Erro',
        description: 'O título não pode estar vazio',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateHomepageSection(id, { title: editTitle.trim() });
      setSections(sections.map(s => 
        s.id === id ? { ...s, title: editTitle.trim() } : s
      ));
      setEditingId(null);
      setEditTitle('');
      toast({
        title: 'Sucesso',
        description: 'Título atualizado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o título',
        variant: 'destructive',
      });
    }
  };

  const specialHighlightImageUpload = useSupabaseUpload({
    bucketName: 'images',
    path: 'sections',
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 1,
    upsert: false,
    supabase,
  });

  useEffect(() => {
    const fileToUpload = specialHighlightImageUpload.files[0];
    const alreadyUploaded = fileToUpload && specialHighlightImageUpload.successes.includes(fileToUpload.name);

    if (!fileToUpload || fileToUpload.errors.length > 0 || alreadyUploaded || specialHighlightImageUpload.loading) {
      return;
    }

    void specialHighlightImageUpload.onUpload();
  }, [specialHighlightImageUpload.files, specialHighlightImageUpload.successes, specialHighlightImageUpload.loading, specialHighlightImageUpload.onUpload]);

  useEffect(() => {
    const uploadedFile = specialHighlightImageUpload.files[0];
    const uploadedSuccessfully = uploadedFile && specialHighlightImageUpload.successes.includes(uploadedFile.name);

    if (!uploadedSuccessfully) {
      return;
    }

    const filePath = `sections/${uploadedFile.name}`;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    setSpecialHighlightConfig((prev) => ({ ...prev, image_url: data.publicUrl }));
    toast({
      title: 'Sucesso',
      description: 'Imagem enviada com sucesso',
    });
  }, [specialHighlightImageUpload.files, specialHighlightImageUpload.successes, toast]);

  const handleToggleActive = async (section: HomepageSection) => {
    try {
      const newStatus = !section.is_active;
      await updateHomepageSection(section.id, { is_active: newStatus });
      setSections(sections.map(s => 
        s.id === section.id ? { ...s, is_active: newStatus } : s
      ));
      toast({
        title: 'Sucesso',
        description: `Seção ${newStatus ? 'ativada' : 'desativada'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status',
        variant: 'destructive',
      });
    }
  };

  const handleMoveUp = async (section: HomepageSection, index: number) => {
    if (index === 0) return;

    const prevSection = sections[index - 1];
    const currentOrder = section.display_order;
    const prevOrder = prevSection.display_order;

    try {
      // Troca as ordens
      await updateHomepageSection(section.id, { display_order: prevOrder });
      await updateHomepageSection(prevSection.id, { display_order: currentOrder });

      // Atualiza o estado local
      const newSections = [...sections];
      newSections[index] = { ...section, display_order: prevOrder };
      newSections[index - 1] = { ...prevSection, display_order: currentOrder };
      newSections.sort((a, b) => a.display_order - b.display_order);
      setSections(newSections);

      toast({
        title: 'Sucesso',
        description: 'Ordem atualizada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao mover seção:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar a ordem',
        variant: 'destructive',
      });
    }
  };

  const handleMoveDown = async (section: HomepageSection, index: number) => {
    if (index === sections.length - 1) return;

    const nextSection = sections[index + 1];
    const currentOrder = section.display_order;
    const nextOrder = nextSection.display_order;

    try {
      await updateHomepageSection(section.id, { display_order: nextOrder });
      await updateHomepageSection(nextSection.id, { display_order: currentOrder });

      const newSections = [...sections];
      newSections[index] = { ...section, display_order: nextOrder };
      newSections[index + 1] = { ...nextSection, display_order: currentOrder };
      newSections.sort((a, b) => a.display_order - b.display_order);
      setSections(newSections);

      toast({
        title: 'Sucesso',
        description: 'Ordem atualizada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao mover seção:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar a ordem',
        variant: 'destructive',
      });
    }
  };

  const handleToggleConfig = (section: HomepageSection) => {
    if (expandedConfigId === section.id) {
      setExpandedConfigId(null);
      setSpecialHighlightConfig(getDefaultSpecialHighlightConfig());
      specialHighlightImageUpload.setFiles([]);
      specialHighlightImageUpload.setErrors([]);
      return;
    }

    setExpandedConfigId(section.id);
    setSpecialHighlightConfig({
      ...getDefaultSpecialHighlightConfig(),
      ...(section.config || {}),
    });
    specialHighlightImageUpload.setFiles([]);
    specialHighlightImageUpload.setErrors([]);
  };

  const handleFeatureChange = (index: number, value: string) => {
    setSpecialHighlightConfig((prev) => {
      const features = [...(prev.features || [])];
      features[index] = value;
      return { ...prev, features };
    });
  };

  const handleSaveSpecialHighlightConfig = async (sectionId: string) => {
    try {
      await updateHomepageSection(sectionId, { config: specialHighlightConfig as Record<string, any> });
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId ? { ...section, config: specialHighlightConfig as Record<string, any> } : section
        )
      );
      toast({
        title: 'Sucesso',
        description: 'Configuração do Destaque Especial atualizada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a configuração do Destaque Especial',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Seções da Home</h1>
          <p className="text-muted-foreground">Gerencie as seções da página inicial</p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seções da Home</h1>
        <p className="text-muted-foreground">Gerencie as seções da página inicial</p>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Título</th>
                <th className="text-left p-4 font-medium">Tipo</th>
                <th className="text-center p-4 font-medium">Ordem</th>
                <th className="text-center p-4 font-medium">Status</th>
                <th className="text-center p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, index) => (
                <Fragment key={section.id}>
                <tr className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4">
                    {editingId === section.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="max-w-md"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveTitle(section.id);
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveTitle(section.id)}
                          className="hover:bg-muted [&_svg]:!text-green-600 hover:[&_svg]:!text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="hover:bg-muted [&_svg]:!text-red-600 hover:[&_svg]:!text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{section.title}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(section)}
                          className="hover:bg-muted [&_svg]:!text-muted-foreground hover:[&_svg]:!text-foreground"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {section.section_type}
                    </code>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-mono text-sm">{section.display_order}</span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={section.is_active}
                        onCheckedChange={() => handleToggleActive(section)}
                      />
                      <Badge variant={section.is_active ? 'default' : 'secondary'}>
                        {section.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      {section.section_type === 'special_highlight' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleConfig(section)}
                          title="Configurar Destaque Especial"
                          className="hover:bg-muted [&_svg]:!text-muted-foreground hover:[&_svg]:!text-foreground"
                        >
                          {expandedConfigId === section.id ? <ChevronUp className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveUp(section, index)}
                        disabled={index === 0}
                        title="Mover para cima"
                        className="hover:bg-muted [&_svg]:!text-muted-foreground hover:[&_svg]:!text-foreground"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveDown(section, index)}
                        disabled={index === sections.length - 1}
                        title="Mover para baixo"
                        className="hover:bg-muted [&_svg]:!text-muted-foreground hover:[&_svg]:!text-foreground"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                {section.section_type === 'special_highlight' && expandedConfigId === section.id && (
                  <tr className="border-b last:border-0 bg-muted/20">
                    <td colSpan={5} className="p-6">
                      <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Badge</label>
                            <Input
                              value={specialHighlightConfig.badge_text || ''}
                              onChange={(e) => setSpecialHighlightConfig((prev) => ({ ...prev, badge_text: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Headline</label>
                            <Input
                              value={specialHighlightConfig.headline || ''}
                              onChange={(e) => setSpecialHighlightConfig((prev) => ({ ...prev, headline: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Descrição</label>
                            <Textarea
                              rows={4}
                              value={specialHighlightConfig.description || ''}
                              onChange={(e) => setSpecialHighlightConfig((prev) => ({ ...prev, description: e.target.value }))}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Prefixo do preço</label>
                              <Input
                                value={specialHighlightConfig.price_prefix || ''}
                                onChange={(e) => setSpecialHighlightConfig((prev) => ({ ...prev, price_prefix: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Preço</label>
                              <Input
                                value={specialHighlightConfig.price_value || ''}
                                onChange={(e) => setSpecialHighlightConfig((prev) => ({ ...prev, price_value: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">CTA principal</label>
                              <Input
                                value={specialHighlightConfig.primary_cta_text || ''}
                                onChange={(e) => setSpecialHighlightConfig((prev) => ({ ...prev, primary_cta_text: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">URL CTA principal</label>
                              <Input
                                value={specialHighlightConfig.primary_cta_url || ''}
                                onChange={(e) => setSpecialHighlightConfig((prev) => ({ ...prev, primary_cta_url: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">CTA secundário</label>
                              <Input
                                value={specialHighlightConfig.secondary_cta_text || ''}
                                onChange={(e) => setSpecialHighlightConfig((prev) => ({ ...prev, secondary_cta_text: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">URL CTA secundário</label>
                              <Input
                                value={specialHighlightConfig.secondary_cta_url || ''}
                                onChange={(e) => setSpecialHighlightConfig((prev) => ({ ...prev, secondary_cta_url: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Imagem</label>
                            {specialHighlightConfig.image_url && (
                              <div className="relative mt-2 w-full h-48 rounded-lg overflow-hidden border bg-muted">
                                <img src={specialHighlightConfig.image_url} alt="Preview" className="w-full h-full object-cover" />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={() => setSpecialHighlightConfig((prev) => ({ ...prev, image_url: '' }))}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            <div className="mt-3">
                              <Dropzone {...specialHighlightImageUpload} className="bg-background">
                                <DropzoneEmptyState />
                                <DropzoneContent />
                              </Dropzone>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-sm font-medium">Benefícios</label>
                            {[0, 1, 2].map((featureIndex) => (
                              <Input
                                key={featureIndex}
                                value={specialHighlightConfig.features?.[featureIndex] || ''}
                                onChange={(e) => handleFeatureChange(featureIndex, e.target.value)}
                                placeholder={`Benefício ${featureIndex + 1}`}
                              />
                            ))}
                          </div>

                          <div className="pt-2">
                            <Button onClick={() => handleSaveSpecialHighlightConfig(section.id)}>
                              Salvar configuração do Destaque Especial
                            </Button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Nenhuma seção encontrada</p>
        </div>
      )}
    </div>
  );
}
