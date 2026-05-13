import { ChevronRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { SEO } from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
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

  // SEO Configuration
  const seoTitle = 'Monte sua Coleção - Crie seu Próprio Boneco LEGO | QBLOX';
  const seoDescription = 'Monte seu próprio boneco LEGO! Escolha cabeças, corpos, braços, pernas e acessórios. Milhares de combinações possíveis. Peças originais e de qualidade.';
  
  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Monte sua Coleção', url: '/categoria/monte-sua-colecao' },
  ];

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
          <div className="container mx-auto px-4 py-12 xl:py-16">
            <nav className="flex items-center gap-2 text-sm mb-6 text-white/90">
              <Link to="/" className="hover:text-white transition-colors">
                Início
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium">Monte sua Coleção</span>
            </nav>

            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 xl:h-10 xl:w-10" />
                <h1 className="text-3xl xl:text-5xl font-bold">
                  Monte sua Coleção
                </h1>
              </div>
              <p className="text-lg xl:text-xl text-white/95 mb-6">
                Crie seu próprio boneco único! Escolha entre centenas de cabeças, corpos, braços, pernas e acessórios. 
                Milhares de combinações possíveis para dar vida à sua imaginação!
              </p>
              <div className="flex flex-wrap gap-4 text-sm xl:text-base">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="font-semibold">✓</span>
                  <span>Peças Originais</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="font-semibold">✓</span>
                  <span>Alta Qualidade</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="font-semibold">✓</span>
                  <span>Combinações Infinitas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8 xl:py-12">
          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-6">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] bg-muted" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                Nenhum produto encontrado nesta categoria.
              </p>
              <Link to="/" className="text-primary hover:underline">
                Voltar para a página inicial
              </Link>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white py-12 xl:py-16 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl xl:text-4xl font-bold mb-4">
              Pronto para criar seu personagem único?
            </h2>
            <p className="text-lg xl:text-xl text-white/95 mb-6 max-w-2xl mx-auto">
              Adicione as peças que você gosta ao carrinho e monte o boneco dos seus sonhos!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="#" 
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-full transition-colors inline-block"
              >
                Ver Todas as Peças
              </Link>
              <Link 
                to="/" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-full transition-colors inline-block"
              >
                Voltar para Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
