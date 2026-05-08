import { ChevronRight, Clock, Zap, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { SEO } from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { getFlashSaleProducts } from '@/db/api';
import type { Product } from '@/types';

export default function SpecialOffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // Buscar todos os produtos em oferta relâmpago (sem limite)
        const data = await getFlashSaleProducts(100);
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos em oferta:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // SEO Configuration
  const seoTitle = 'Ofertas Especiais - Bonecos de Montar LEGO | Kids Block Store';
  const seoDescription = 'Aproveite nossas ofertas relâmpago! Bonecos de montar tipo LEGO com descontos imperdíveis por tempo limitado. Frete grátis acima de R$99. Compre agora!';
  
  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Ofertas Especiais', url: '/ofertas-especiais' },
  ];

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        type="website"
      />


      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Ofertas Especiais</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full mb-4 md:mb-6">
                <Zap className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold mb-4">
                ⚡ Ofertas Relâmpago
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                Aproveite descontos imperdíveis por tempo limitado!
              </p>
              
              {/* Destaques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Tempo Limitado</p>
                  <p className="text-sm text-white/80">Ofertas por 3 horas</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <TrendingDown className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Até 50% OFF</p>
                  <p className="text-sm text-white/80">Descontos incríveis</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Zap className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Estoque Limitado</p>
                  <p className="text-sm text-white/80">Garanta o seu!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Produtos em Oferta
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
                <Zap className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma oferta disponível no momento
              </h3>
              <p className="text-muted-foreground mb-6">
                Fique atento! Novas ofertas relâmpago chegam em breve.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Voltar para a página inicial
              </Link>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {products.length > 0 && (
          <div className="bg-muted/30 py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Não perca essas ofertas!
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                As ofertas relâmpago são por tempo limitado. Adicione seus produtos favoritos ao carrinho agora!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Ver Todas as Categorias
                </Link>
                <Link
                  to="/carrinho"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  Ver Carrinho
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
