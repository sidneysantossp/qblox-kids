import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateItemListSchema, generateCategoryTitle, generateCategoryDescription, type ProductListItem } from '@/lib/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { getProductsByCategory, getCategoryBySlug } from '@/db/api';
import type { Product, Category } from '@/types';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!category) return;
      
      try {
        setIsLoading(true);
        const [productsData, catData] = await Promise.all([
          getProductsByCategory(category),
          getCategoryBySlug(category)
        ]);
        setProducts(productsData);
        setCategoryData(catData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [category]);

  // SEO Configuration for Category
  const categoryName = category || 'Categoria';
  const seoTitle = generateCategoryTitle(categoryName);
  const seoDescription = generateCategoryDescription(categoryName, products.length);
  const categoryUrl = `https://qblox.com.br/categoria/${category}`;
  
  // Generate ItemList schema for category
  const productListItems: ProductListItem[] = products.slice(0, 20).map(product => ({
    name: product.name,
    url: `https://qblox.com.br/produto/${product.slug || 'produto'}-${product.id}`,
    image: product.image_url,
    price: product.price,
    currency: 'BRL',
  }));
  
  const itemListSchema = generateItemListSchema(
    `Bonecos de Montar ${categoryName}`,
    categoryUrl,
    productListItems
  );

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        url={categoryUrl}
        type="website"
      />
      
      <SchemaMarkup schema={itemListSchema} />
      
      <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
          Início
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">{category}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl xl:text-4xl font-bold mb-2">
          Bonecos de Montar {categoryData?.name || category}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isLoading ? 'Carregando...' : `${products.length} produtos encontrados na coleção ${categoryData?.name || category}`}
        </p>
        {categoryData?.description && (
          <p className="text-muted-foreground mt-2">
            {categoryData.description}
          </p>
        )}
      </div>

      {/* Long Description - SEO Content */}
      {categoryData?.long_description && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {categoryData.long_description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
            Nenhum produto encontrado nesta categoria.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      )}

      {/* FAQ Section */}
      {categoryData?.faq && categoryData.faq.length > 0 && (
        <Card className="mt-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
              {categoryData.faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
    </>
  );
}
