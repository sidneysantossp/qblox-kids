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
  { question: 'Como escolher bonecos de Roblox para presentear?', answer: 'Os melhores resultados costumam vir quando você compara personagens, faixa de preço, lançamentos e afinidade com o universo que a criança ou colecionador mais gosta.' },
  { question: 'Vale criar uma coleção temática de Roblox?', answer: 'Sim. A navegação por tema ajuda a reunir personagens com estética parecida e a montar kits mais coerentes para brincar ou colecionar.' },
  { question: 'Onde encontrar novidades de bonecos de Roblox?', answer: 'A combinação entre categoria, blog e páginas pilar facilita acompanhar lançamentos, produtos em destaque e ofertas da loja.' },
];

export default function RobloxPillarPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProductsByCategory('roblox', 8);
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos de Roblox:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const schema = generateItemListSchema(
    'Bonecos de Roblox',
    'https://www.qblox.com.br/bonecos-de-roblox',
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
      <SEO title="Bonecos de Roblox | Guia, Coleções e Produtos | QBLOX" description="Explore bonecos de Roblox para presentear, montar coleções e comparar produtos em destaque. Descubra caminhos de compra, vitrines e conteúdos relacionados na QBLOX." canonical="https://www.qblox.com.br/bonecos-de-roblox" url="https://www.qblox.com.br/bonecos-de-roblox" type="website" />
      <SchemaMarkup schema={schema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b"><div className="container mx-auto px-4 py-4"><nav className="flex items-center gap-2 text-sm"><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><span className="text-foreground font-medium">Bonecos de Roblox</span></nav></div></div>
        <section className="container mx-auto px-4 py-12 xl:py-16">
          <div className="max-w-4xl mx-auto text-center mb-12"><h1 className="text-4xl xl:text-5xl font-bold mb-6">Bonecos de Roblox: guia para escolher personagens e coleções</h1><p className="text-lg text-muted-foreground leading-relaxed">Esta página pilar reúne os principais caminhos para quem busca bonecos de Roblox, com links para categoria, vitrines, produtos em destaque e conteúdos que ajudam a decidir melhor.</p></div>
          <div className="grid gap-6 xl:grid-cols-3 mb-12">
            <Card><CardContent className="p-6"><h2 className="text-xl font-bold mb-3">Explorar a categoria</h2><p className="text-muted-foreground mb-4">Veja personagens e coleções ligadas ao universo Roblox.</p><Link to="/categoria/roblox" className="font-medium hover:text-primary transition-colors">Ir para Roblox</Link></CardContent></Card>
            <Card><CardContent className="p-6"><h2 className="text-xl font-bold mb-3">Comparar vitrines</h2><p className="text-muted-foreground mb-4">Use as vitrines para comparar lançamentos, ofertas e destaques.</p><div className="flex flex-col gap-3 text-sm"><Link to="/ofertas-especiais" className="font-medium hover:text-primary transition-colors">Ofertas especiais</Link><Link to="/loja" className="font-medium hover:text-primary transition-colors">Todos os produtos</Link></div></CardContent></Card>
            <Card><CardContent className="p-6"><h2 className="text-xl font-bold mb-3">Aprender antes de comprar</h2><p className="text-muted-foreground mb-4">Veja guias e conteúdos editoriais relacionados ao tema.</p><div className="flex flex-col gap-3 text-sm"><Link to="/blog" className="font-medium hover:text-primary transition-colors">Acessar o blog</Link><Link to="/bonecos-de-montar" className="font-medium hover:text-primary transition-colors">Guia principal</Link></div></CardContent></Card>
          </div>
          <section className="mb-12"><h2 className="text-2xl font-bold mb-6">Produtos em destaque do universo Roblox</h2>{isLoading ? <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">{[...Array(4)].map((_, index) => <div key={index} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />)}</div> : <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">{products.map((product) => <BrickStoreProductCard key={product.id} {...mapProductToBrickStoreProductCardProps(product)} />)}</div>}</section>
        </section>
      </div>
    </>
  );
}
