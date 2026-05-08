import { Check, CheckCircle2, ChevronLeft, ChevronRight, ShoppingCart, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  arms: Product[];
  legs: Product[];
  accessory: Product[];
}

const STEPS = [
  { 
    id: 'head', 
    name: 'Cabeça', 
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/de6003b3-9325-47cb-a125-54a27f31c89a.jpg', 
    description: 'Escolha a cabeça do seu boneco' 
  },
  { 
    id: 'helmet', 
    name: 'Capacete', 
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/4d137867-a71c-41bc-a5ae-12fef553cb13.jpg', 
    description: 'Adicione um capacete (opcional)' 
  },
  { 
    id: 'body', 
    name: 'Corpo', 
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/c69908c7-28f3-4450-a724-251cecef0736.jpg', 
    description: 'Selecione o corpo' 
  },
  { 
    id: 'arms', 
    name: 'Braços', 
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/c5f2ecdf-0dcc-44a7-a6b5-b80e2e9141f6.jpg', 
    description: 'Escolha os braços' 
  },
  { 
    id: 'legs', 
    name: 'Pernas', 
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/4a843706-8a52-4abd-8911-362a935c4e14.jpg', 
    description: 'Selecione as pernas' 
  },
  { 
    id: 'accessory', 
    name: 'Acessório', 
    icon: 'https://miaoda-site-img.s3cdn.medo.dev/images/a12f68ee-4dd8-469f-9dab-d22a31a70a49.jpg', 
    description: 'Adicione um acessório (opcional)' 
  },
];

const ITEMS_PER_PAGE = 16; // 4 colunas x 4 linhas

export default function CustomBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParts, setSelectedParts] = useState<SelectedParts>({
    head: [],
    helmet: [],
    body: [],
    arms: [],
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
  
  // Paginação
  const totalPages = Math.ceil(availableParts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedParts = availableParts.slice(startIndex, endIndex);

  // Carregar peças disponíveis para o step atual
  useEffect(() => {
    const loadParts = async () => {
      setLoading(true);
      setCurrentPage(1); // Reset pagination when changing step
      try {
        const parts = await getProductsByPartType(currentStepData.id);
        setAvailableParts(parts);
      } catch (error) {
        console.error('Erro ao carregar peças:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as peças disponíveis',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadParts();
  }, [currentStep, currentStepData.id, toast]);

  const handleSelectPart = (product: Product) => {
    const stepId = currentStepData.id as keyof SelectedParts;
    const currentSelection = selectedParts[stepId];
    
    // Verificar se o produto já está selecionado
    const isSelected = currentSelection.some(p => p.id === product.id);
    
    if (isSelected) {
      // Remover da seleção
      setSelectedParts((prev) => ({
        ...prev,
        [stepId]: prev[stepId].filter(p => p.id !== product.id),
      }));
    } else {
      // Adicionar à seleção
      setSelectedParts((prev) => ({
        ...prev,
        [stepId]: [...prev[stepId], product],
      }));
    }
  };

  const isPartSelected = (product: Product): boolean => {
    const stepId = currentStepData.id as keyof SelectedParts;
    return selectedParts[stepId].some(p => p.id === product.id);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    // Limpar a seleção do step atual
    setSelectedParts((prev) => ({
      ...prev,
      [currentStepData.id]: [],
    }));
    handleNext();
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedParts).reduce((total, partsArray) => {
      const arrayTotal = partsArray.reduce((sum, part) => sum + (part?.price || 0), 0);
      return total + arrayTotal;
    }, 0);
  };

  const getTotalItemsCount = () => {
    return Object.values(selectedParts).reduce((total, partsArray) => {
      return total + partsArray.length;
    }, 0);
  };

  const handleFinish = async () => {
    // Validar se há pelo menos um item selecionado
    if (getTotalItemsCount() === 0) {
      toast({
        title: 'Nenhum item selecionado',
        description: 'Selecione pelo menos uma peça para continuar',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();
      localStorage.setItem('session_id', sessionId);

      // Salvar a configuração personalizada (salvando apenas o primeiro item de cada categoria para compatibilidade)
      const buildData = {
        session_id: sessionId,
        name: 'Minha Coleção Personalizada',
        head_product_id: selectedParts.head[0]?.id || null,
        helmet_product_id: selectedParts.helmet[0]?.id || null,
        body_product_id: selectedParts.body[0]?.id || null,
        arms_product_id: selectedParts.arms[0]?.id || null,
        legs_product_id: selectedParts.legs[0]?.id || null,
        accessory_product_id: selectedParts.accessory[0]?.id || null,
        total_price: calculateTotalPrice(),
      };

      await saveCustomBuild(buildData);

      // Adicionar TODAS as peças selecionadas ao carrinho
      for (const partsArray of Object.values(selectedParts)) {
        for (const part of partsArray) {
          await addToCart(part, 1);
        }
      }

      toast({
        title: 'Sucesso! 🎉',
        description: `Sua coleção personalizada com ${getTotalItemsCount()} itens foi adicionada ao carrinho`,
      });

      // Redirecionar para o carrinho
      navigate('/carrinho');
    } catch (error) {
      console.error('Erro ao finalizar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar sua coleção personalizada',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Todos os steps são opcionais agora
  const currentStepHasSelection = selectedParts[currentStepData.id as keyof SelectedParts].length > 0;
  const canProceed = true; // Sempre pode prosseguir

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header with Background */}
      <div 
        className="relative bg-primary text-primary-foreground py-12 xl:py-16 px-4 overflow-hidden"
        style={{
          backgroundImage: 'url(https://miaoda-site-img.s3cdn.medo.dev/images/f76394a2-f262-4255-921d-589980e248a1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Overlay para melhor legibilidade - Transparência aumentada */}
        <div className="absolute inset-0 bg-primary/50" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 xl:h-10 xl:w-10" />
            <h1 className="text-3xl xl:text-5xl font-bold">Acessórios</h1>
          </div>
          <p className="text-primary-foreground/90 text-base xl:text-xl max-w-2xl">
            Crie seu boneco personalizado escolhendo cada peça!
          </p>
        </div>
      </div>

      {/* Horizontal Stepper */}
      <div className="bg-card border-b shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="space-y-4">
            {/* Progress info */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Passo {currentStep + 1} de {STEPS.length}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}% completo</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Horizontal Steps - Carousel */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {STEPS.map((step, index) => {
                const stepCount = selectedParts[step.id as keyof SelectedParts].length;
                const hasSelection = stepCount > 0;
                const isActive = index === currentStep;
                const isPast = index < currentStep;
                const isClickable = isPast || hasSelection;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => isClickable && setCurrentStep(index)}
                    disabled={!isClickable && !isActive}
                    className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all shrink-0 min-w-[140px]
                      ${isActive 
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                        : hasSelection
                          ? 'bg-success/10 border-success hover:bg-success/20 cursor-pointer'
                          : isPast
                            ? 'bg-muted border-border hover:bg-muted/80 cursor-pointer'
                            : 'bg-background border-border opacity-60 cursor-not-allowed'
                      }
                    `}
                  >
                    {/* Check/Count Badge */}
                    {(hasSelection || stepCount > 0) && (
                      <div className="relative shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            hasSelection
                              ? 'bg-success'
                              : 'bg-muted'
                          }`}
                        >
                          {hasSelection && (
                            <Check className="h-5 w-5 text-white" />
                          )}
                        </div>
                        {stepCount > 1 && (
                          <div className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-background">
                            {stepCount}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Step info */}
                    <div className="text-left flex-1">
                      <div className="font-semibold text-sm whitespace-nowrap">{step.name}</div>
                      <div className={`text-xs whitespace-nowrap ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {hasSelection 
                          ? `${stepCount} ${stepCount === 1 ? 'item' : 'itens'}`
                          : 'Nenhum'
                        }
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid xl:grid-cols-[1fr_400px] gap-8">
          {/* Parts Selection */}
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="w-full aspect-square rounded-lg mb-3 bg-muted" />
                      <Skeleton className="h-4 w-3/4 mb-2 bg-muted" />
                      <Skeleton className="h-4 w-1/2 bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : availableParts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhuma peça disponível no momento</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {paginatedParts.map((part) => {
                    const isSelected = isPartSelected(part);
                    return (
                      <Card
                        key={part.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                        }`}
                        onClick={() => handleSelectPart(part)}
                      >
                        <CardContent className="p-4">
                          <div className="relative">
                            <img
                              src={part.image_url}
                              alt={part.name}
                              className="w-full aspect-square object-cover rounded-lg mb-3"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{part.name}</h3>
                          <p className="text-primary font-bold">
                            R$ {part.price.toFixed(2).replace('.', ',')}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {/* Navigation Buttons - Below Products */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 pt-4">
              {currentStep > 0 && (
                <Button onClick={handlePrevious} variant="outline" size="lg" className="w-full xl:w-auto">
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Voltar
                </Button>
              )}
              
              <div className="flex-1 hidden xl:block" />
              
              {currentStep < STEPS.length - 1 && (
                <Button onClick={handleSkip} variant="outline" size="lg" className="w-full xl:w-auto text-muted-foreground">
                  Pular esta etapa →
                </Button>
              )}
              
              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="w-full xl:w-auto xl:min-w-[140px]"
                >
                  Próximo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={saving || getTotalItemsCount() === 0}
                  size="lg"
                  className="w-full xl:w-auto xl:min-w-[200px]"
                >
                  {saving ? (
                    'Salvando...'
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Resumo</h3>
                    {getTotalItemsCount() > 0 && (
                      <Badge variant="secondary" className="text-sm">
                        {getTotalItemsCount()} {getTotalItemsCount() === 1 ? 'item' : 'itens'}
                      </Badge>
                    )}
                  </div>
                  
                  {getTotalItemsCount() === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhum item selecionado ainda
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(selectedParts).map(([key, parts]) => {
                        if (parts.length === 0) return null;
                        const step = STEPS.find(s => s.id === key);
                        return (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {step?.name}: {parts.length} {parts.length === 1 ? 'item' : 'itens'}
                            </span>
                            <span className="font-semibold">
                              R$ {parts.reduce((sum, p) => sum + p.price, 0).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">
                      R$ {calculateTotalPrice().toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentStep < STEPS.length - 1 ? (
                      <Button
                        onClick={handleNext}
                        disabled={!canProceed}
                        className="w-full"
                        size="lg"
                      >
                        Próximo Passo
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFinish}
                        disabled={saving || !canProceed}
                        className="w-full"
                        size="lg"
                      >
                        {saving ? (
                          'Salvando...'
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Finalizar e Adicionar ao Carrinho
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
