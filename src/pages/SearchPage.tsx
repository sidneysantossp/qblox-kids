import { ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { SEO } from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { searchProducts } from '@/db/api';
import type { Product } from '@/types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await searchProducts(query);
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [query]);

  // SEO Configuration for Search
  const seoTitle = query ? `Busca: ${query} | Kids Block Store` : 'Buscar Produtos | Kids Block Store';
  const seoDescription = query 
    ? `Resultados da busca por "${query}". Encontre bonecos de montar tipo LEGO de qualidade.`
    : 'Busque por bonecos de montar tipo LEGO. Super Heróis, Roblox, Séries da TV e muito mais!';

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
      />
      
      <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
          Início
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">Busca</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-3xl xl:text-4xl font-bold">
            Resultados para "{query}"
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isLoading ? 'Buscando...' : `${products.length} produtos encontrados`}
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] bg-muted" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            Nenhum produto encontrado para "{query}".
          </p>
          <Link to="/" className="text-primary hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      )}
    </div>
    </>
  );
}
