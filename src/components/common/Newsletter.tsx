import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Gift, Sparkles, Bell } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um endereço de email válido.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simular envio (substituir por integração real)
    setTimeout(() => {
      toast({
        title: '🎉 Inscrição realizada!',
        description: 'Você receberá nossas novidades e ofertas exclusivas.',
      });
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="w-full bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 py-12 xl:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-8 xl:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 xl:w-20 xl:h-20 bg-white/20 rounded-full mb-4 xl:mb-6">
              <Mail className="w-8 h-8 xl:w-10 xl:h-10 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-white mb-3 xl:mb-4">
              Fique por dentro das novidades!
            </h2>
            <p className="text-base xl:text-lg text-white/90 max-w-2xl mx-auto">
              Cadastre-se e receba em primeira mão lançamentos, promoções exclusivas e dicas incríveis para sua coleção.
            </p>
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6 mb-8 xl:mb-10">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm xl:text-base">Ofertas Exclusivas</h3>
                <p className="text-white/80 text-xs xl:text-sm">Descontos especiais para assinantes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm xl:text-base">Lançamentos</h3>
                <p className="text-white/80 text-xs xl:text-sm">Seja o primeiro a saber das novidades</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm xl:text-base">Dicas e Novidades</h3>
                <p className="text-white/80 text-xs xl:text-sm">Conteúdo exclusivo sobre coleções</p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col xl:flex-row gap-3 xl:gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Digite seu melhor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 xl:h-14 bg-white border-0 text-base xl:text-lg placeholder:text-muted-foreground/60"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 xl:h-14 px-8 xl:px-10 bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold text-base xl:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? 'Cadastrando...' : 'Quero Receber!'}
              </Button>
            </div>
            <p className="text-white/70 text-xs xl:text-sm text-center mt-4">
              Ao se cadastrar, você concorda em receber emails promocionais. Você pode cancelar a qualquer momento.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
