import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateFAQSchema, generateItemListSchema, generateOrganizationSchema, generateWebsiteSchema, type ProductListItem } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';
import { BrickStoreProductCard, mapProductToBrickStoreProductCardProps } from '@/components/brickstore/BrickStoreProductCard';
import { getFeaturedProducts } from '@/db/api';
import type { Product } from '@/types';
import { getProductCanonicalUrl } from '@/lib/urls';

const pillarFaq = [
  {
    question: 'Como escolher bonecos de montar para começar uma coleção?',
    answer: 'O ideal é começar por temas que tenham afinidade com o público, como super-heróis, Roblox ou séries da TV, e comparar variedade, preço e compatibilidade entre os modelos.'
  },
  {
    question: 'Bonecos de montar servem para presentear crianças e colecionadores?',
    answer: 'Sim. Eles funcionam bem tanto como presente infantil quanto para fãs e colecionadores, principalmente quando a página ajuda a navegar por temas, faixas de preço e lançamentos.'
  },
  {
    question: 'Quais categorias mais procuradas de bonecos de montar a QBLOX oferece?',
    answer: 'A loja trabalha com categorias como Super Heróis, Roblox, Séries da TV, Aventura, Temáticos e Lançamentos, além de coleções especiais e produtos em destaque.'
  },
];

export default function BuildingFiguresPillarPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getFeaturedProducts(8);
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos da página pilar:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const itemListSchema = generateItemListSchema(
    'Bonecos de Montar',
    'https://www.qblox.com.br/bonecos-de-montar',
    featuredProducts.slice(0, 8).map((product): ProductListItem => ({
      name: product.name,
      url: getProductCanonicalUrl(product),
      image: product.image_url,
      price: product.price,
      currency: 'BRL',
    })),
  );

  const faqSchema = generateFAQSchema(pillarFaq);

  return (
    <>
      <SEO
        title="Bonecos de Montar | Guia de Compra, Categorias e Produtos | QBLOX"
        description="Descubra como escolher bonecos de montar, explore categorias como Super Heróis, Roblox e Séries da TV e encontre produtos em destaque para presentear, colecionar e montar."
        canonical="https://www.qblox.com.br/bonecos-de-montar"
        url="https://www.qblox.com.br/bonecos-de-montar"
        type="website"
      />
      <SchemaMarkup schema={generateWebsiteSchema()} />
      <SchemaMarkup schema={generateOrganizationSchema()} />
      <SchemaMarkup schema={itemListSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Bonecos de Montar</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold mb-6">Bonecos de montar: guia para escolher categorias, personagens e coleções</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Se você está procurando bonecos de montar para presentear, começar uma coleção ou ampliar um tema específico, esta página reúne os principais caminhos da QBLOX para navegar entre categorias, ofertas, guias e produtos em destaque.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-3 mb-12">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-3">Explorar por categoria</h2>
                <p className="text-muted-foreground mb-4">Veja as categorias mais procuradas e encontre bonecos de montar por tema.</p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/bonecos-de-super-herois" className="rounded-full bg-muted px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Super Heróis</Link>
                  <Link to="/bonecos-de-roblox" className="rounded-full bg-muted px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Roblox</Link>
                  <Link to="/bonecos-de-series-da-tv" className="rounded-full bg-muted px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Séries da TV</Link>
                  <Link to="/categoria/lancamentos" className="rounded-full bg-muted px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Lançamentos</Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-3">Comparar vitrines</h2>
                <p className="text-muted-foreground mb-4">Use as vitrines da loja para avaliar ofertas, destaques e produtos com melhor saída.</p>
                <div className="flex flex-col gap-3 text-sm">
                  <Link to="/loja" className="font-medium hover:text-primary transition-colors">Ver todos os produtos</Link>
                  <Link to="/ofertas-especiais" className="font-medium hover:text-primary transition-colors">Ofertas especiais</Link>
                  <Link to="/categoria/monte-sua-colecao" className="font-medium hover:text-primary transition-colors">Monte sua coleção</Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-3">Aprender antes de comprar</h2>
                <p className="text-muted-foreground mb-4">Aprofunde sua busca com guias do blog e conteúdos de apoio para decidir melhor.</p>
                <div className="flex flex-col gap-3 text-sm">
                  <Link to="/blog" className="font-medium hover:text-primary transition-colors">Acessar o blog</Link>
                  <Link to="/guia/como-escolher-bonecos-de-montar-por-idade" className="font-medium hover:text-primary transition-colors">Guia por idade</Link>
                  <Link to="/guia/bonecos-de-montar-para-presentear" className="font-medium hover:text-primary transition-colors">Guia para presentear</Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="mb-12">
            <div className="max-w-4xl mx-auto space-y-5 text-muted-foreground leading-relaxed">
              <h2 className="text-2xl font-bold text-foreground">Como encontrar os melhores bonecos de montar</h2>
              <p>
                A melhor forma de escolher um boneco de montar é começar pela intenção da busca. Quem procura presentes costuma comparar temas populares, preço e disponibilidade. Já quem busca ampliar uma coleção tende a navegar por personagens, categorias específicas e lançamentos.
              </p>
              <p>
                Na QBLOX, a estrutura ideal de navegação passa por três frentes: categorias principais, páginas de produto com informações detalhadas e conteúdos editoriais para orientar a decisão. Isso ajuda tanto usuários iniciantes quanto colecionadores que já sabem o tema desejado.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Produtos em destaque para começar sua busca</h2>
              <Link to="/loja" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Ver catálogo completo
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <BrickStoreProductCard key={product.id} {...mapProductToBrickStoreProductCardProps(product)} />
                ))}
              </div>
            )}
          </section>

          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Perguntas frequentes sobre bonecos de montar</h2>
            <div className="space-y-4">
              {pillarFaq.map((item) => (
                <Card key={item.question}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </section>
      </div>
    </>
  );
}
