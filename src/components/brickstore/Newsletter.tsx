import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

export function Newsletter() {
  return (
    <section className="bg-gradient-to-br from-[#061A33] to-[#0057D9] py-16 my-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <Mail className="w-12 h-12 mx-auto mb-4 text-[#FFD200]" />
          <h2 className="text-[28px] md:text-[32px] font-bold mb-3">
            Receba novidades e ofertas exclusivas
          </h2>
          <p className="text-white/90 mb-8">
            Cadastre seu e-mail e seja o primeiro a saber sobre novos lançamentos, 
            promoções e coleções limitadas.
          </p>

          {/* Form */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              className="h-12 bg-white text-foreground border-0"
            />
            <Button 
              size="lg"
              className="bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-extrabold whitespace-nowrap"
            >
              Cadastrar
            </Button>
          </div>

          <p className="text-xs text-white/70">
            Sem spam. Apenas novidades para colecionadores.
          </p>
        </div>
      </div>
    </section>
  );
}
