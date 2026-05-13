import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateFAQSchema, generateItemListSchema, type ProductListItem } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/products/ProductCard';
import { getProductsByCategory } from '@/db/api';
import type { Product } from '@/types';
import { getProductCanonicalUrl } from '@/lib/urls';

const faq = [
  {
    question: 'Quais bonecos de montar de super-heróis são mais procurados?',
    answer: 'Os temas mais buscados costumam envolver personagens clássicos e coleções inspiradas em universos de ação, principalmente quando há variedade de modelos para presentear e colecionar.'
  },
  {
    question: 'Vale a pena criar uma coleção temática de super-heróis?',
    answer: 'Sim. É uma forma eficiente de organizar a busca por personagens, comparar estilos e reunir kits com maior afinidade entre si.'
  },
  {
    question: 'Como escolher um boneco de montar de super-herói para presente?',
    answer: 'Priorize personagens populares, faixa de preço adequada, acabamento visual e páginas com imagens, descrição detalhada e produtos relacionados.'
  },
];

export default function SuperHeroesPillarPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProductsByCategory('super-herois', 8);
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos de super-heróis:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const schema = generateItemListSchema(
    'Bonecos de Super Heróis',
    'https://qblox.com.br/bonecos-de-super-herois',
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
      <SEO
        title="Bonecos de Super Heróis | Guia, Categorias e Produtos | QBLOX"
        description="Explore bonecos de super-heróis para colecionar, presentear e montar. Compare categorias, produtos em destaque e conteúdos relacionados ao universo de ação da QBLOX."
        canonical="https://qblox.com.br/bonecos-de-super-herois"
        url="https://qblox.com.br/bonecos-de-super-herois"
        type="website"
      />
      <SchemaMarkup schema={schema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />

      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Bonecos de Super Heróis</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold mb-6">Bonecos de super-heróis: como escolher personagens, coleções e kits</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Esta página pilar reúne os principais caminhos para quem procura bonecos de super-heróis, seja para presentear, montar uma coleção temática ou comparar os personagens mais populares dentro da loja.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-3 mb-12">
            <Card><CardContent className="p-6"><h2 className="text-xl font-bold mb-3">Explorar a categoria</h2><p className="text-muted-foreground mb-4">Acesse a categoria completa e filtre por modelos do seu tema favorito.</p><Link to="/categoria/super-herois" className="font-medium hover:text-primary transition-colors">Ir para Super Heróis</Link></CardContent></Card>
            <Card><CardContent className="p-6"><h2 className="text-xl font-bold mb-3">Ver ofertas e vitrines</h2><p className="text-muted-foreground mb-4">Compare promoções, destaques e produtos com melhor saída.</p><div className="flex flex-col gap-3 text-sm"><Link to="/ofertas-especiais" className="font-medium hover:text-primary transition-colors">Ofertas especiais</Link><Link to="/loja" className="font-medium hover:text-primary transition-colors">Todos os produtos</Link></div></CardContent></Card>
            <Card><CardContent className="p-6"><h2 className="text-xl font-bold mb-3">Aprofundar a busca</h2><p className="text-muted-foreground mb-4">Veja guias e conteúdos relacionados antes de decidir sua compra.</p><div className="flex flex-col gap-3 text-sm"><Link to="/blog" className="font-medium hover:text-primary transition-colors">Acessar o blog</Link><Link to="/bonecos-de-montar" className="font-medium hover:text-primary transition-colors">Guia principal</Link></div></CardContent></Card>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Produtos em destaque do universo de super-heróis</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">{[...Array(4)].map((_, index) => <div key={index} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />)}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            )}
          </section>
        </section>
      </div>
    </>
  );
}
