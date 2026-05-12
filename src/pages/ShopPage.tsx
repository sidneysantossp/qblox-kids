import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Grid3x3, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getProducts, getAllCategories } from '@/db/api';
import type { Product, Category } from '@/types';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [gridCols, setGridCols] = useState<'3' | '4'>('4');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getAllCategories(),
        ]);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...products];

    // Filtro por categoria
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories?.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Filtro por preço
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

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategories, priceRange, sortBy]);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange('all');
    setSortBy('newest');
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categorias */}
      <div>
        <h3 className="font-semibold text-base mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => toggleCategory(category.name)}
              />
              <Label
                htmlFor={`cat-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Faixa de Preço */}
      <div>
        <h3 className="font-semibold text-base mb-3">Faixa de Preço</h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'Todos os preços' },
            { value: '0-50', label: 'Até R$ 50' },
            { value: '50-100', label: 'R$ 50 - R$ 100' },
            { value: '100-200', label: 'R$ 100 - R$ 200' },
            { value: '200+', label: 'Acima de R$ 200' },
          ].map((range) => (
            <div key={range.value} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${range.value}`}
                checked={priceRange === range.value}
                onCheckedChange={() => setPriceRange(range.value)}
              />
              <Label
                htmlFor={`price-${range.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Limpar Filtros */}
      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        Limpar Filtros
      </Button>
    </div>
  );

  return (
    <>
      <SEO
        title="Loja - Todos os Produtos | QBLOX KIDS"
        description="Explore nossa coleção completa de bonecos de montar tipo LEGO. Encontre super-heróis, personagens de filmes, séries e muito mais!"
        keywords="loja, produtos, bonecos de montar, LEGO, minifiguras, blocos de montar"
      />

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Início</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Loja</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">
              Nossa Loja
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl text-pretty">
              Explore nossa coleção completa de bonecos de montar. Encontre seus personagens favoritos!
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <SlidersHorizontal className="w-5 h-5" />
                    <h2 className="font-bold text-lg">Filtros</h2>
                  </div>
                  <FilterContent />
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter */}
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
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Results Count */}
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-5 w-32 bg-muted" />
                    ) : (
                      <span>
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Grid Toggle */}
                  <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      variant={gridCols === '3' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setGridCols('3')}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={gridCols === '4' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setGridCols('4')}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                      <SelectItem value="price-asc">Menor Preço</SelectItem>
                      <SelectItem value="price-desc">Maior Preço</SelectItem>
                      <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 || priceRange !== 'all') && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                  {selectedCategories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="gap-1">
                      {cat}
                      <button
                        onClick={() => toggleCategory(cat)}
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
                      <button
                        onClick={() => setPriceRange('all')}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Products Grid */}
              {isLoading ? (
                <div className={`grid grid-cols-2 md:grid-cols-${gridCols} gap-4 md:gap-6`}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Card key={i} className="h-full">
                      <CardContent className="p-4">
                        <Skeleton className="aspect-square w-full mb-3 bg-muted" />
                        <Skeleton className="h-4 w-3/4 mb-2 bg-muted" />
                        <Skeleton className="h-4 w-1/2 bg-muted" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground text-lg mb-4">
                      Nenhum produto encontrado com os filtros selecionados.
                    </p>
                    <Button onClick={clearFilters}>Limpar Filtros</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className={`grid grid-cols-2 md:grid-cols-${gridCols} gap-4 md:gap-6`}>
                  {filteredProducts.map((product) => (
                    <Link key={product.id} to={`/produto/${product.slug || product.id}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow group">
                        <CardContent className="p-4 flex flex-col h-full">
                          {/* Image */}
                          <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.is_on_sale && (
                              <Badge className="absolute top-2 right-2 bg-destructive">
                                OFERTA
                              </Badge>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col">
                            <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 text-balance">
                              {product.name}
                            </h3>

                            {/* Price */}
                            <div className="mt-auto">
                              {product.original_price && product.original_price > product.price ? (
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground line-through">
                                    R$ {product.original_price.toFixed(2)}
                                  </p>
                                  <p className="text-lg font-bold text-primary">
                                    R$ {product.price.toFixed(2)}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-lg font-bold text-primary">
                                  R$ {product.price.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
