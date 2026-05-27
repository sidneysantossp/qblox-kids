import { ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BrickStoreProductCard, mapProductToBrickStoreProductCardProps } from '@/components/brickstore/BrickStoreProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateItemListSchema, generateCategoryTitle, generateCategoryDescription, generateFAQSchema, type ProductListItem } from '@/lib/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getAllCategories, getProductsByCategory, getCategoryBySlug } from '@/db/api';
import type { Product, Category } from '@/types';
import { getCategoryCanonicalUrl, getCategoryPath, getPillarPathByCategory, getProductCanonicalUrl, getSatelliteGuidePathsByCategory } from '@/lib/urls';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      if (!category) return;
      
      try {
        setIsLoading(true);
        const [productsData, catData, categoriesData] = await Promise.all([
          getProductsByCategory(category),
          getCategoryBySlug(category),
          getAllCategories(),
        ]);
        setProducts(productsData);
        setCategoryData(catData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [category]);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((item) => item !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange('all');
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        const productCategories = product.categories?.length ? product.categories : [product.category];
        return productCategories.some((productCategory) => selectedCategories.includes(productCategory));
      });
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter((product) => {
        const price = product.price;
        switch (priceRange) {
          case '0-50':
            return price <= 50;
          case '50-100':
            return price > 50 && price <= 100;
          case '100-200':
            return price > 100 && price <= 200;
          case '200+':
            return price > 200;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [products, selectedCategories, priceRange]);

  // SEO Configuration for Category
  const categoryName = category || 'Categoria';
  const seoTitle = generateCategoryTitle(categoryName);
  const seoDescription = generateCategoryDescription(categoryName, filteredProducts.length);
  const categoryUrl = getCategoryCanonicalUrl(categoryName);
  
  // Generate ItemList schema for category
  const productListItems: ProductListItem[] = products.slice(0, 20).map(product => ({
    name: product.name,
    url: getProductCanonicalUrl(product),
    image: product.image_url,
    price: product.price,
    currency: 'BRL',
  }));
  
  const itemListSchema = generateItemListSchema(
    `Bonecos de Montar ${categoryName}`,
    categoryUrl,
    productListItems
  );

  const faqSchema = categoryData?.faq?.length ? generateFAQSchema(categoryData.faq) : null;
  const [primaryGuidePath, secondaryGuidePath] = getSatelliteGuidePathsByCategory(categoryData?.slug || category || '');

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        url={categoryUrl}
        type="website"
      />
      
      <SchemaMarkup schema={itemListSchema} />
      {faqSchema ? <SchemaMarkup schema={faqSchema} /> : null}
      
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
      </div>


      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-5 h-5" />
                <h2 className="font-bold text-lg">Filtros</h2>
              </div>
              <ProductFilters
                categories={categories}
                selectedCategories={selectedCategories}
                priceRange={priceRange}
                onToggleCategory={toggleCategory}
                onChangePriceRange={setPriceRange}
                onClearFilters={clearFilters}
              />
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters
                      categories={categories}
                      selectedCategories={selectedCategories}
                      priceRange={priceRange}
                      onToggleCategory={toggleCategory}
                      onChangePriceRange={setPriceRange}
                      onClearFilters={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Carregando...' : `${filteredProducts.length} produtos encontrados`}
              </p>
            </div>
          </div>

          {(selectedCategories.length > 0 || priceRange !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {selectedCategories.map((selectedCategory) => (
                <Badge key={selectedCategory} variant="secondary" className="gap-1">
                  {selectedCategory}
                  <button
                    onClick={() => toggleCategory(selectedCategory)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {priceRange !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {priceRange === '0-50' && 'Até R$ 50'}
                  {priceRange === '50-100' && 'R$ 50 - R$ 100'}
                  {priceRange === '100-200' && 'R$ 100 - R$ 200'}
                  {priceRange === '200+' && 'Acima de R$ 200'}
                  <button onClick={() => setPriceRange('all')} className="ml-1 hover:text-destructive">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] bg-muted" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6">
              {filteredProducts.map((product) => (
                <BrickStoreProductCard
                  key={product.id}
                  {...mapProductToBrickStoreProductCardProps(product)}
                  showCartControls={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
              <Link to="/" className="text-primary hover:underline">
                Voltar para a página inicial
              </Link>
            </div>
          )}
        </div>
      </div>

      {category !== 'roblox' && category !== 'jogos' && categoryData?.slug !== 'roblox' && categoryData?.slug !== 'jogos' && (
        <Card className="mt-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Continue explorando {categoryData?.name || category}</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Link to="/blog" className="rounded-xl border p-4 hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Guias e dicas</h3>
                <p className="text-sm text-muted-foreground">Veja conteúdos do blog para escolher melhor seus bonecos de montar.</p>
              </Link>
              <Link to={getPillarPathByCategory(categoryData?.slug || category || '')} className="rounded-xl border p-4 hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Guia principal do tema</h3>
                <p className="text-sm text-muted-foreground">Acesse a página pilar para ampliar sua busca com contexto editorial e links estratégicos.</p>
              </Link>
              <Link to={primaryGuidePath} className="rounded-xl border p-4 hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Guia satélite</h3>
                <p className="text-sm text-muted-foreground">Acesse um conteúdo complementar com intenção de busca ligada a este tema.</p>
              </Link>
              <Link to={secondaryGuidePath} className="rounded-xl border p-4 hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Conteúdo complementar</h3>
                <p className="text-sm text-muted-foreground">Amplie a pesquisa com um segundo guia informacional conectado à categoria.</p>
              </Link>
              <Link to="/ofertas-especiais" className="rounded-xl border p-4 hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Ofertas especiais</h3>
                <p className="text-sm text-muted-foreground">Descubra promoções e kits com melhor custo-benefício.</p>
              </Link>
              <Link to="/loja" className="rounded-xl border p-4 hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Todos os produtos</h3>
                <p className="text-sm text-muted-foreground">Amplie sua busca e compare diferentes categorias da coleção.</p>
              </Link>
            </div>
          </CardContent>
        </Card>
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
