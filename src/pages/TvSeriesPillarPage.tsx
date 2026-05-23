import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateFAQSchema, generateItemListSchema, type ProductListItem } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';
import { BrickStoreProductCard, mapProductToBrickStoreProductCardProps } from '@/components/brickstore/BrickStoreProductCard';
import { getProductsByCategory } from '@/db/api';
import type { Product } from '@/types';
import { getProductCanonicalUrl } from '@/lib/urls';

const faq = [
  { question: 'Quais bonecos de séries da TV costumam ter mais saída?', answer: 'Os mais procurados normalmente são os que representam personagens reconhecíveis, temas em alta e coleções ligadas a lançamentos ou franquias já consolidadas.' },
  { question: 'Como navegar por personagens de séries sem perder tempo?', answer: 'A melhor estratégia é começar pelo hub temático, visitar a categoria correspondente e depois comparar os produtos em destaque e os conteúdos do blog.' },
  { question: 'Vale acompanhar lançamentos e categorias ao mesmo tempo?', answer: 'Sim. Para esse tipo de tema, os lançamentos e as vitrines especiais ajudam bastante a descobrir novidades e produtos com melhor potencial de compra.' },
];

export default function TvSeriesPillarPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProductsByCategory('series-tv', 8);
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos de séries da TV:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const schema = generateItemListSchema(
    'Bonecos de Séries da TV',
    'https://qblox.com.br/bonecos-de-series-da-tv',
    products.map((product): ProductListItem => ({
      name: product.name,
      url: getProductCanonicalUrl(product),
      image: product.image_url,
      price: product.price,
      currency: 'BRL',
    })),
  );

  return (
    <>
      <SEO title="Bonecos de Séries da TV | Guia, Personagens e Produtos | QBLOX" description="Descubra bonecos de séries da TV para colecionar, presentear e comparar por tema. Explore personagens, vitrines e conteúdos de apoio na QBLOX." canonical="https://qblox.com.br/bonecos-de-series-da-tv" url="https://qblox.com.br/bonecos-de-series-da-tv" type="website" />
      <SchemaMarkup schema={schema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b"><div className="container mx-auto px-4 py-4"><nav className="flex items-center gap-2 text-sm"><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><span className="text-foreground font-medium">Bonecos de Séries da TV</span></nav></div></div>
        <section className="container mx-auto px-4 py-12 xl:py-16">
          <div className="max-w-4xl mx-auto text-center mb-12"><h1 className="text-4xl xl:text-5xl font-bold mb-6">Bonecos de séries da TV: guia para comparar personagens e coleções</h1><p className="text-lg text-muted-foreground leading-relaxed">Esta página pilar organiza a navegação para quem busca bonecos de séries da TV, conectando categoria, vitrines e produtos em destaque com uma estrutura mais clara de descoberta.</p></div>
          <div className="grid gap-6 xl:grid-cols-3 mb-12">
            <Card><CardContent className="p-6"><h2 className="text-xl font-bold mb-3">Explorar a categoria</h2><p className="text-muted-foreground mb-4">Veja personagens e coleções relacionadas às séries mais buscadas.</p><Link to="/categoria/series-tv" className="font-medium hover:text-primary transition-colors">Ir para Séries da TV</Link></CardContent></Card>
            <Card><CardContent className="p-6"><h2 className="text-xl font-bold mb-3">Comparar vitrines</h2><p className="text-muted-foreground mb-4">Acesse produtos em destaque, lançamentos e ofertas especiais.</p><div className="flex flex-col gap-3 text-sm"><Link to="/ofertas-especiais" className="font-medium hover:text-primary transition-colors">Ofertas especiais</Link><Link to="/categoria/lancamentos" className="font-medium hover:text-primary transition-colors">Lançamentos</Link></div></CardContent></Card>
            <Card><CardContent className="p-6"><h2 className="text-xl font-bold mb-3">Aprofundar a busca</h2><p className="text-muted-foreground mb-4">Veja conteúdos editoriais para filtrar melhor a sua decisão de compra.</p><div className="flex flex-col gap-3 text-sm"><Link to="/blog" className="font-medium hover:text-primary transition-colors">Acessar o blog</Link><Link to="/bonecos-de-montar" className="font-medium hover:text-primary transition-colors">Guia principal</Link></div></CardContent></Card>
          </div>
          <section className="mb-12"><h2 className="text-2xl font-bold mb-6">Produtos em destaque de séries da TV</h2>{isLoading ? <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">{[...Array(4)].map((_, index) => <div key={index} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />)}</div> : <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">{products.map((product) => <BrickStoreProductCard key={product.id} {...mapProductToBrickStoreProductCardProps(product)} />)}</div>}</section>
        </section>
      </div>
    </>
  );
}
