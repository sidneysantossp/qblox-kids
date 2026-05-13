import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getAllHomepageSections, updateHomepageSection } from '@/db/admin-api';
import { ArrowDown, ArrowUp, Check, Pencil, Settings, Sparkles, X } from 'lucide-react';
import type { HomepageSection } from '@/types';

export default function AdminSections() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    void loadSections();
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
      setSections((prev) => prev.map((section) => (
        section.id === id ? { ...section, title: editTitle.trim() } : section
      )));
      handleCancelEdit();
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

  const handleToggleActive = async (section: HomepageSection) => {
    try {
      const nextValue = !section.is_active;
      await updateHomepageSection(section.id, { is_active: nextValue });
      setSections((prev) => prev.map((item) => (
        item.id === section.id ? { ...item, is_active: nextValue } : item
      )));
      toast({
        title: 'Sucesso',
        description: `Seção ${nextValue ? 'ativada' : 'desativada'} com sucesso`,
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

    const previousSection = sections[index - 1];

    try {
      await Promise.all([
        updateHomepageSection(section.id, { display_order: previousSection.display_order }),
        updateHomepageSection(previousSection.id, { display_order: section.display_order }),
      ]);

      setSections((prev) => {
        const next = [...prev];
        next[index] = { ...section, display_order: previousSection.display_order };
        next[index - 1] = { ...previousSection, display_order: section.display_order };
        return next.sort((a, b) => a.display_order - b.display_order);
      });

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

    try {
      await Promise.all([
        updateHomepageSection(section.id, { display_order: nextSection.display_order }),
        updateHomepageSection(nextSection.id, { display_order: section.display_order }),
      ]);

      setSections((prev) => {
        const next = [...prev];
        next[index] = { ...section, display_order: nextSection.display_order };
        next[index + 1] = { ...nextSection, display_order: section.display_order };
        return next.sort((a, b) => a.display_order - b.display_order);
      });

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Seções da Home</h1>
          <p className="text-muted-foreground">Gerencie a ordem e ativação das seções da página inicial.</p>
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
        <p className="text-muted-foreground">Gerencie a ordem, ativação e atalhos de edição das seções da página inicial.</p>
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
                <tr key={section.id} className="border-b last:border-0 hover:bg-muted/30">
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
                              void handleSaveTitle(section.id);
                            }
                            if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => void handleSaveTitle(section.id)}
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
                    <code className="text-xs bg-muted px-2 py-1 rounded">{section.section_type}</code>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-mono text-sm">{section.display_order}</span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch checked={section.is_active} onCheckedChange={() => void handleToggleActive(section)} />
                      <Badge variant={section.is_active ? 'default' : 'secondary'}>
                        {section.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {section.section_type === 'special_highlight' && (
                        <Button asChild size="sm" variant="outline">
                          <Link to="/admin/destaque-especial">
                            <Sparkles className="h-4 w-4" />
                            Editar destaque
                          </Link>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void handleMoveUp(section, index)}
                        disabled={index === 0}
                        title="Mover para cima"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void handleMoveDown(section, index)}
                        disabled={index === sections.length - 1}
                        title="Mover para baixo"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground flex items-start gap-3">
        <Settings className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          O conteúdo visual completo do <strong>Destaque Especial</strong> agora é gerenciado em uma tela dedicada.
          Use esta página para controlar ordem, título rápido e ativação geral das seções.
        </p>
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Nenhuma seção encontrada</p>
        </div>
      )}
    </div>
  );
}
