import { Check, CheckCircle2, ChevronLeft, ChevronRight, ShoppingCart, Sparkles, Blocks, Package2, Puzzle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { getProductsByPartType, saveCustomBuild } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types';

interface SelectedParts {
  head: Product[];
  helmet: Product[];
  body: Product[];
  legs: Product[];
  accessory: Product[];
}

type PurchaseMode = 'chooser' | 'build';

const STEPS = [
  {
    id: 'head',
    name: 'Cabeça',
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/de6003b3-9325-47cb-a125-54a27f31c89a.jpg',
    description: 'Escolha o rosto ou cabeça base do seu personagem',
  },
  {
    id: 'helmet',
    name: 'Cabelo / Capacete',
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/4d137867-a71c-41bc-a5ae-12fef553cb13.jpg',
    description: 'Selecione cabelo, capacete, chapéu, máscara ou elmo',
  },
  {
    id: 'body',
    name: 'Corpo',
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/c69908c7-28f3-4450-a724-251cecef0736.jpg',
    description: 'Defina o estilo do torso e da roupa principal',
  },
  {
    id: 'legs',
    name: 'Pernas',
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/4a843706-8a52-4abd-8911-362a935c4e14.jpg',
    description: 'Escolha a base visual final do personagem',
  },
  {
    id: 'accessory',
    name: 'Acessório',
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/a12f68ee-4dd8-469f-9dab-d22a31a70a49.jpg',
    description: 'Complete a aventura com um acessório extra',
  },
] as const;

const ITEMS_PER_PAGE = 16;

export default function CustomBuilderPage() {
  const [mode, setMode] = useState<PurchaseMode>('chooser');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParts, setSelectedParts] = useState<SelectedParts>({
    head: [],
    helmet: [],
    body: [],
    legs: [],
    accessory: [],
  });
  const [availableParts, setAvailableParts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const totalPages = Math.ceil(availableParts.length / ITEMS_PER_PAGE);
  const paginatedParts = availableParts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    if (mode !== 'build') return;

    const loadParts = async () => {
      setLoading(true);
      setCurrentPage(1);
      try {
        const parts = await getProductsByPartType(currentStepData.id);
        setAvailableParts(parts);
      } catch (error) {
        console.error('Erro ao carregar peças:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as peças disponíveis.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    void loadParts();
  }, [mode, currentStep, currentStepData.id, toast]);

  const handleSelectPart = (product: Product) => {
    const stepId = currentStepData.id as keyof SelectedParts;
    const isSelected = selectedParts[stepId].some((item) => item.id === product.id);

    setSelectedParts((prev) => ({
      ...prev,
      [stepId]: isSelected ? prev[stepId].filter((item) => item.id !== product.id) : [...prev[stepId], product],
    }));
  };

  const isPartSelected = (product: Product) => {
    const stepId = currentStepData.id as keyof SelectedParts;
    return selectedParts[stepId].some((item) => item.id === product.id);
  };

  const calculateTotalPrice = () => Object.values(selectedParts).reduce((total, partsArray) => total + partsArray.reduce((sum, part) => sum + (part?.price || 0), 0), 0);
  const getTotalItemsCount = () => Object.values(selectedParts).reduce((total, partsArray) => total + partsArray.length, 0);

  const handleFinish = async () => {
    if (getTotalItemsCount() === 0) {
      toast({
        title: 'Nenhum item selecionado',
        description: 'Selecione pelo menos uma peça para continuar.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();
      localStorage.setItem('session_id', sessionId);

      await saveCustomBuild({
        session_id: sessionId,
        name: 'Meu Boneco Personalizado',
        head_product_id: selectedParts.head[0]?.id || null,
        helmet_product_id: selectedParts.helmet[0]?.id || null,
        body_product_id: selectedParts.body[0]?.id || null,
        arms_product_id: null,
        legs_product_id: selectedParts.legs[0]?.id || null,
        accessory_product_id: selectedParts.accessory[0]?.id || null,
        total_price: calculateTotalPrice(),
      });

      for (const partsArray of Object.values(selectedParts)) {
        for (const part of partsArray) {
          await addToCart(part, 1);
        }
      }

      toast({
        title: 'Seu boneco foi montado!',
        description: `${getTotalItemsCount()} item(ns) foram adicionados ao carrinho.`,
      });

      navigate('/carrinho');
    } catch (error) {
      console.error('Erro ao finalizar montagem:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o seu boneco personalizado.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedSummary = useMemo(() => Object.entries(selectedParts).filter(([, parts]) => parts.length > 0), [selectedParts]);

  if (mode === 'chooser') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div
          className="relative bg-primary text-primary-foreground py-12 xl:py-16 px-4 overflow-hidden"
          style={{
            backgroundImage: 'url(https://miaoda-site-img.s3cdn.medo.dev/images/f76394a2-f262-4255-921d-589980e248a1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="absolute inset-0 bg-primary/50" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 xl:h-10 xl:w-10" />
              <h1 className="text-3xl xl:text-5xl font-bold">Monte seu Boneco</h1>
            </div>
            <p className="text-primary-foreground/90 text-base xl:text-xl max-w-3xl">
              Escolha como você quer montar a sua coleção. A ideia aqui é deixar a experiência divertida, guiada e simples — sem parecer uma compra técnica de peças soltas.
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
          <div>
            <h2 className="text-2xl xl:text-3xl font-bold mb-3">Como você quer montar sua coleção?</h2>
            <p className="text-muted-foreground max-w-3xl">Escolha um dos caminhos abaixo para comprar um personagem pronto, montar o seu próprio boneco ou comprar apenas as peças avulsas que você precisa.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="h-full border hover:border-primary transition-colors">
              <CardContent className="p-6 flex flex-col h-full">
                <Package2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Boneco pronto</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">Escolha personagens completos, compare temas com mais rapidez e receba tudo pronto para montar e presentear.</p>
                <Button className="mt-6" onClick={() => navigate('/loja')}>Explorar bonecos prontos</Button>
              </CardContent>
            </Card>

            <Card className="h-full border border-primary shadow-lg">
              <CardContent className="p-6 flex flex-col h-full">
                <Blocks className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Montar meu boneco</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">Escolha cabeça, cabelo ou capacete, corpo, pernas e acessório em uma jornada simples de 5 passos.</p>
                <Button className="mt-6" onClick={() => setMode('build')}>Começar montagem</Button>
              </CardContent>
            </Card>

            <Card className="h-full border hover:border-primary transition-colors">
              <CardContent className="p-6 flex flex-col h-full">
                <Puzzle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Peças avulsas</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">Compre apenas as peças que precisa para complementar coleções, substituir partes ou expandir montagens existentes.</p>
                <Button className="mt-6" variant="outline" onClick={() => navigate('/categoria/monte-sua-colecao')}>Ver peças avulsas</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="relative bg-primary text-primary-foreground py-12 xl:py-16 px-4 overflow-hidden" style={{ backgroundImage: 'url(https://miaoda-site-img.s3cdn.medo.dev/images/f76394a2-f262-4255-921d-589980e248a1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}>
        <div className="absolute inset-0 bg-primary/50" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 xl:h-10 xl:w-10" />
            <h1 className="text-3xl xl:text-5xl font-bold">Monte seu Boneco</h1>
          </div>
          <p className="text-primary-foreground/90 text-base xl:text-xl max-w-3xl">Monte seu personagem em 5 passos simples e escolha apenas as peças que fazem sentido para o seu estilo.</p>
          <Button variant="secondary" className="mt-6" onClick={() => setMode('chooser')}>Voltar para os tipos de compra</Button>
        </div>
      </div>

      <div className="bg-card border-b shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Passo {currentStep + 1} de {STEPS.length}</span>
              <span className="text-muted-foreground">{Math.round(progress)}% completo</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {STEPS.map((step, index) => {
                const stepCount = selectedParts[step.id as keyof SelectedParts].length;
                const isActive = index === currentStep;
                const hasSelection = stepCount > 0;
                const isClickable = index <= currentStep || hasSelection;

                return (
                  <button
                    key={step.id}
                    onClick={() => isClickable && setCurrentStep(index)}
                    disabled={!isClickable}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all shrink-0 min-w-[150px] ${isActive ? 'bg-primary text-primary-foreground border-primary shadow-lg' : hasSelection ? 'bg-success/10 border-success hover:bg-success/20 cursor-pointer' : 'bg-background border-border hover:bg-muted/80 cursor-pointer'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasSelection ? 'bg-success' : 'bg-muted'}`}>
                      {hasSelection ? <Check className="h-5 w-5 text-white" /> : <span className="font-semibold text-sm">{index + 1}</span>}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-sm whitespace-nowrap">{step.name}</div>
                      <div className={`text-xs whitespace-nowrap ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{hasSelection ? `${stepCount} item(ns)` : 'Nenhum'}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid xl:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentStepData.name}</h2>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i}><CardContent className="p-4"><Skeleton className="w-full aspect-square rounded-lg mb-3 bg-muted" /><Skeleton className="h-4 w-3/4 mb-2 bg-muted" /><Skeleton className="h-4 w-1/2 bg-muted" /></CardContent></Card>
                ))}
              </div>
            ) : availableParts.length === 0 ? (
              <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">Nenhuma peça disponível nesta etapa no momento.</p></CardContent></Card>
            ) : (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {paginatedParts.map((part) => {
                    const selected = isPartSelected(part);
                    return (
                      <Card key={part.id} className={`cursor-pointer transition-all hover:shadow-lg ${selected ? 'ring-2 ring-primary shadow-lg' : ''}`} onClick={() => handleSelectPart(part)}>
                        <CardContent className="p-4">
                          <div className="relative">
                            <img src={part.image_url} alt={part.name} className="w-full aspect-square object-cover rounded-lg mb-3" />
                            {selected && (
                              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{part.name}</h3>
                          <p className="text-primary font-bold mb-3">R$ {part.price.toFixed(2).replace('.', ',')}</p>
                          <Button variant={selected ? 'secondary' : 'outline'} className="w-full" size="sm">
                            {selected ? 'Selecionado' : 'Selecionar'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)} className="min-w-[40px]">
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 pt-4">
              {currentStep > 0 ? (
                <Button onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))} variant="outline" size="lg" className="w-full xl:w-auto">
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Voltar
                </Button>
              ) : <div />}

              {currentStep < STEPS.length - 1 ? (
                <Button onClick={() => setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1))} size="lg" className="w-full xl:w-auto xl:min-w-[140px]">
                  Próximo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button onClick={handleFinish} disabled={saving || getTotalItemsCount() === 0} size="lg" className="w-full xl:w-auto xl:min-w-[200px]">
                  {saving ? 'Salvando...' : (<><ShoppingCart className="mr-2 h-5 w-5" />Adicionar ao Carrinho</>)}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Resumo</h3>
                    {getTotalItemsCount() > 0 && <Badge variant="secondary">{getTotalItemsCount()} item(ns)</Badge>}
                  </div>

                  {selectedSummary.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhuma peça selecionada ainda.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedSummary.map(([key, parts]) => {
                        const step = STEPS.find((item) => item.id === key);
                        return (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{step?.name}: {parts.length} item(ns)</span>
                            <span className="font-semibold">R$ {parts.reduce((sum, part) => sum + part.price, 0).toFixed(2).replace('.', ',')}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">R$ {calculateTotalPrice().toFixed(2).replace('.', ',')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Modo simples: cabeça, cabelo/capacete, corpo, pernas e acessório. Braços e mãos ficam integrados ao corpo nesta primeira versão.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
