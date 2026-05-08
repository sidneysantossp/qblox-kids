import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Truck, Clock } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';

interface ShippingOption {
  servico: string;
  nome: string;
  valor: number;
  prazo: number;
  erro?: string;
}

interface ShippingCalculatorProps {
  peso: number; // em gramas
  comprimento: number; // em cm
  altura: number; // em cm
  largura: number; // em cm
  onSelectShipping?: (option: ShippingOption) => void;
}

export function ShippingCalculator({
  peso,
  comprimento,
  altura,
  largura,
  onSelectShipping
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { toast } = useToast();

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
  };

  const calculateShipping = async () => {
    if (!cep) {
      toast({
        title: 'CEP Obrigatório',
        description: 'Por favor, informe o CEP de entrega',
        variant: 'destructive',
      });
      return;
    }

    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      toast({
        title: 'CEP Inválido',
        description: 'O CEP deve ter 8 dígitos',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setShippingOptions([]);
      setSelectedOption(null);

      console.log('Calculando frete para CEP:', cep, 'Peso:', peso, 'Dimensões:', { comprimento, altura, largura });

      const { data, error } = await supabase.functions.invoke('calculate-shipping', {
        body: {
          cep_destino: cep,
          peso,
          comprimento,
          altura,
          largura,
        },
      });

      console.log('Resposta da API:', { data, error });

      if (error) {
        console.error('Erro na chamada da função:', error);
        throw error;
      }

      if (data?.opcoes && data.opcoes.length > 0) {
        console.log('Opções de frete encontradas:', data.opcoes);
        setShippingOptions(data.opcoes);
        toast({
          title: 'Frete Calculado',
          description: `${data.opcoes.length} opção(ões) de entrega disponível(is)`,
        });
      } else {
        console.warn('Nenhuma opção de frete encontrada');
        toast({
          title: 'Nenhuma Opção Encontrada',
          description: 'Não foi possível calcular o frete para este CEP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível calcular o frete. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: ShippingOption) => {
    setSelectedOption(option.servico);
    if (onSelectShipping) {
      onSelectShipping(option);
    }
  };

  const getShippingNote = (servico: string, nome: string) => {
    if (servico === 'motoboy' || nome.toLowerCase().includes('moto boy')) {
      return 'Disponível apenas para Grande São Paulo';
    }
    if (servico === '04014' || nome.toUpperCase() === 'SEDEX') {
      return 'Entrega para todo Brasil';
    }
    if (servico === '04510' || nome.toUpperCase() === 'PAC') {
      return 'Entrega para todo Brasil';
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="cep" className="sr-only">
            CEP
          </Label>
          <Input
            id="cep"
            type="text"
            placeholder="00000-000"
            value={cep}
            onChange={handleCepChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                calculateShipping();
              }
            }}
            maxLength={9}
            disabled={loading}
            className="bg-background"
          />
        </div>
        <Button 
          onClick={calculateShipping} 
          disabled={loading || !cep}
          className="bg-black hover:bg-black/90 text-white shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando...
            </>
          ) : (
            'Calcular Frete'
          )}
        </Button>
      </div>

      {shippingOptions.length > 0 && (
        <div className="space-y-1.5">
          {shippingOptions.map((option) => (
            <Card
              key={option.servico}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedOption === option.servico ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleSelectOption(option)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Truck className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{option.nome}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>
                          {option.prazo === 0 
                            ? 'Entrega no mesmo dia' 
                            : `Entrega em até ${option.prazo} dias úteis`}
                        </span>
                      </div>
                      {getShippingNote(option.servico, option.nome) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ℹ️ {getShippingNote(option.servico, option.nome)}
                        </p>
                      )}
                      {option.erro && (
                        <p className="text-xs text-amber-600 mt-0.5">
                          ⚠️ {option.erro}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold">
                      R$ {option.valor.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
