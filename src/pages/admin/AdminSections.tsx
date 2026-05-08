import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
  X 
} from 'lucide-react';
import type { HomepageSection } from '@/types';

export default function AdminSections() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
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
      // Troca as ordens
      await updateHomepageSection(section.id, { display_order: nextOrder });
      await updateHomepageSection(nextSection.id, { display_order: currentOrder });

      // Atualiza o estado local
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
