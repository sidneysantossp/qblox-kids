import { ChevronRight, Puzzle, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrickStoreProductCard, mapProductToBrickStoreProductCardProps } from '@/components/brickstore/BrickStoreProductCard';
import { SEO } from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/db/supabase';
import type { Product } from '@/types';

export default function BuildCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .contains('categories', ['monte-sua-colecao'])
          .order('part_type', { ascending: true })
          .order('name', { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const partTypeSummary = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      const key = product.part_type || 'outras';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).slice(0, 4);
  }, [products]);

  return (
    <>
      <SEO
        title="Peças avulsas para montar seu boneco | QBLOX"
        description="Compre peças avulsas para montar ou complementar seu boneco: cabeças, corpos, pernas, acessórios e itens especiais em um só lugar."
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="relative bg-primary text-primary-foreground py-12 xl:py-16 px-4 overflow-hidden" style={{ backgroundImage: 'url(https://miaoda-site-img.s3cdn.medo.dev/images/f76394a2-f262-4255-921d-589980e248a1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}>
          <div className="absolute inset-0 bg-primary/50" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <nav className="flex items-center gap-2 text-sm mb-6 text-white/90">
              <Link to="/" className="hover:text-white transition-colors">Início</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium">Peças avulsas</span>
            </nav>

            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Puzzle className="h-8 w-8 xl:h-10 xl:w-10" />
                <h1 className="text-3xl xl:text-5xl font-bold">Peças avulsas</h1>
              </div>
              <p className="text-lg xl:text-xl text-white/95 mb-6">
                Compre apenas as peças que você precisa para completar personagens, testar combinações novas ou expandir o universo do seu boneco com mais liberdade.
              </p>
              <div className="flex flex-wrap gap-4 text-sm xl:text-base">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="font-semibold">✓</span>
                  <span>Compra flexível</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="font-semibold">✓</span>
                  <span>Peças para reposição</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="font-semibold">✓</span>
                  <span>Combinações personalizadas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 xl:py-12 space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-2">Quando esse modo faz sentido</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">Ideal para quem já sabe quais peças precisa, quer completar um personagem específico ou prefere comprar partes separadas antes de montar um boneco inteiro.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-2">Como comprar melhor</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">Comece pelas peças principais, depois refine com acessórios ou itens complementares. Isso ajuda a evitar compras soltas sem direção visual.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-2">Quer montar um personagem completo?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">Se a sua ideia é escolher tudo em sequência, use o fluxo guiado de Monte seu Boneco para uma experiência mais divertida e simples.</p>
                <Link to="/categoria/acessorios" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
                  Ir para Monte seu Boneco
                </Link>
              </CardContent>
            </Card>
          </div>

          {!isLoading && partTypeSummary.length > 0 && (
            <div className="grid gap-3 md:grid-cols-4">
              {partTypeSummary.map(([partType, count]) => (
                <Card key={partType}>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-semibold capitalize">{partType}</p>
                    <p className="text-xs text-muted-foreground mt-1">{count} peça(s)</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-6">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] bg-muted" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-6">
              {products.map((product) => (
                <BrickStoreProductCard key={product.id} {...mapProductToBrickStoreProductCardProps(product)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">Nenhuma peça disponível no momento.</p>
              <Link to="/" className="text-primary hover:underline">Voltar para a página inicial</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
