import {
  ChevronRight,
  Facebook,
  Heart,
  MessageSquare,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Twitter
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import ProductReviews from '@/components/products/ProductReviews';
import { ShippingCalculator } from '@/components/shipping/ShippingCalculator';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateProductSchema, generateBreadcrumbSchema, generateProductTitle, generateProductDescription, generateFAQSchema } from '@/lib/schema';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { getProductById, getProductsByCategory } from '@/db/api';
import { trackViewContent } from '@/lib/meta-pixel';
import type { Product } from '@/types';
import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress';
import { TrustBadges } from '@/components/TrustBadges';
import { getKitValueMessage, getProductCtaLabel } from '@/lib/product-conversion';
import { isCollectionProduct } from '@/lib/collection-products';
import { getCategoryCanonicalUrl, getCategoryPath, getPillarPathByCategory, getProductCanonicalUrl, getProductPath, getSatelliteGuidePathsByCategory } from '@/lib/urls';
import { useToast } from '@/hooks/use-toast';

function extractProductId(urlParam: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(urlParam)) {
    return urlParam;
  }

  const match = urlParam.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
  return match ? match[1] : urlParam;
}

export default function ProductDetailPage() {
  const { id: urlParam } = useParams<{ id: string }>();
  const productId = urlParam ? extractProductId(urlParam) : '';
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedBundleProductIds, setSelectedBundleProductIds] = useState<string[]>([]);
  const [isAddingBundle, setIsAddingBundle] = useState(false);
  const { addToCart, cartTotal, hasCollectionItem, refreshCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      try {
        setIsLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);

        if (productData) {
          const related = await getProductsByCategory(productData.category, 8);
          const filteredRelated = related.filter((p) => p.id !== productData.id);
          setRelatedProducts(filteredRelated);
          setSelectedBundleProductIds(filteredRelated.slice(0, 2).map((item) => item.id));
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [productId]);

  useEffect(() => {
    if (product) {
      trackViewContent(product);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) {
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product, quantity);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBundleSelectionChange = (bundleProductId: string, checked: boolean) => {
    setSelectedBundleProductIds((prev) => {
      if (checked) {
        return prev.includes(bundleProductId) ? prev : [...prev, bundleProductId];
      }
      return prev.filter((id) => id !== bundleProductId);
    });
  };

  const handleAddBundleToCart = async () => {
    if (!product || isAddingBundle) {
      return;
    }

    try {
      setIsAddingBundle(true);
      const selectedProducts = relatedProducts.filter((item) => selectedBundleProductIds.includes(item.id));
      await Promise.all([
        addToCart(product, quantity, { silent: true, skipRefresh: true }),
        ...selectedProducts.map((bundleProduct) => addToCart(bundleProduct, 1, { silent: true, skipRefresh: true })),
      ]);
      await refreshCart(false);
      toast({
        title: 'Produtos adicionados!',
        description: 'Os itens selecionados foram adicionados ao carrinho.',
      });
    } finally {
      setIsAddingBundle(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Confira ${product?.name} na QBlox Kids!`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  const generateSeoDescription = (product: Product) => {
    return `${product.name} - Boneco de montar tipo LEGO da categoria ${product.category}. Produto de alta qualidade, ideal para crianças e colecionadores. Compre agora na QBlox Kids com frete grátis acima de R$ 99,00!`;
  };

  const discount = product?.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const productImages = Array.from(new Set([product?.image_url, ...(product?.images || [])].filter(Boolean) as string[]));

  const bundleSuggestions = useMemo(() => relatedProducts.slice(0, 4), [relatedProducts]);
  const selectedBundleProducts = useMemo(
    () => bundleSuggestions.filter((item) => selectedBundleProductIds.includes(item.id)),
    [bundleSuggestions, selectedBundleProductIds],
  );
  const [primaryGuidePath, secondaryGuidePath] = getSatelliteGuidePathsByCategory(product?.category || '');
  const bundleExtrasTotal = useMemo(
    () => selectedBundleProducts.reduce((sum, item) => sum + item.price, 0),
    [selectedBundleProducts],
  );
  const selectedBundleTotal = useMemo(() => {
    const mainProductTotal = product ? product.price * quantity : 0;
    return mainProductTotal + bundleExtrasTotal;
  }, [bundleExtrasTotal, product, quantity]);
  const projectedFreeShippingTotal = cartTotal + selectedBundleTotal;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6 bg-muted" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Skeleton className="aspect-square bg-muted" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4 bg-muted" />
            <Skeleton className="h-6 w-32 bg-muted" />
            <Skeleton className="h-8 w-48 bg-muted" />
            <Skeleton className="h-24 w-full bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Link to="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    );
  }

  const kitValue = getKitValueMessage(product);
  const productHasCollectionFreeShipping = isCollectionProduct(product);
  const ctaLabel = getProductCtaLabel(product);
  const productCharacteristics = [
    { label: 'Marca', value: 'QBlox Kids' },
    { label: 'Linha', value: 'Bonecos de Montar' },
    { label: 'Modelo', value: 'Mini Boneco Colecionável' },
    { label: 'Categoria', value: 'Boneco de Montar' },
    { label: 'Tema', value: product.category || 'Ninja / Heróis / Guerreiros / Aventura' },
    { label: 'Material', value: product.material || 'Plástico ABS' },
    { label: 'Compatibilidade', value: 'Compatível com blocos de montar' },
    { label: 'Quantidade de peças', value: product.whats_included || '1 mini boneco + acessórios conforme o modelo' },
    { label: 'Personagem', value: 'Personagem colecionável QBlox' },
    { label: 'Acessórios inclusos', value: product.whats_included || 'Espada, escudo, lança, arco, asas ou acessórios conforme o modelo' },
    { label: 'Indicação', value: 'Brincar, montar e colecionar' },
    { label: 'Idade recomendada', value: product.age_recommendation ? `A partir de ${product.age_recommendation}` : 'A partir de 4 anos' },
    { label: 'Produto colecionável', value: 'Sim' },
  ];
  const seoTitle = product.meta_title || generateProductTitle(product.name, product.price);
  const seoDescription = product.meta_description || generateProductDescription(
    product.name,
    product.price,
    product.description || undefined
  );
  const productUrl = getProductCanonicalUrl(product);

  const breadcrumbItems = [
    { name: 'Início', url: 'https://www.qblox.com.br/' },
    { name: product.category, url: getCategoryCanonicalUrl(product.category) },
    { name: product.name, url: productUrl },
  ];

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.rich_description || product.description || seoDescription,
    image: product.images || [product.image_url],
    sku: product.sku || product.id,
    brand: 'QBLOX',
    price: product.price,
    currency: 'BRL',
    availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
    url: productUrl,
    rating: product.reviews_count > 0 ? {
      value: product.rating,
      count: product.reviews_count,
    } : undefined,
  });

  const productFaqItems = [
    {
      question: `${product.name} é compatível com blocos de montar tipo LEGO?`,
      answer: `${product.name} foi cadastrado na QBLOX como um boneco de montar compatível com blocos tipo LEGO, o que ajuda quem quer ampliar a coleção e combinar peças com outros temas.`,
    },
    {
      question: `${product.name} é indicado para qual idade?`,
      answer: `${product.name} é mais indicado para quem busca um produto da categoria ${product.category} com faixa recomendada de ${product.age_recommendation || '6+'} anos, sempre considerando supervisão adequada quando necessário.`,
    },
    {
      question: `O que vem incluído em ${product.name}?`,
      answer: product.whats_included
        ? `${product.name} inclui ${product.whats_included}. Isso ajuda o cliente a entender melhor o conteúdo do kit antes da compra.`
        : `${product.name} é apresentado como um item da categoria ${product.category} e, quando o conteúdo do kit não está detalhado no cadastro, a recomendação é considerar as imagens e a descrição principal do produto na página.`,
    },
    {
      question: `${product.name} é um bom produto para presentear?`,
      answer: `${product.name} pode funcionar muito bem como presente para quem gosta de ${product.category.toLowerCase()} e procura um boneco de montar com apelo visual, compatibilidade e navegação fácil para combinar com outros itens da coleção.`,
    },
    {
      question: `Qual o material de ${product.name}?`,
      answer: `${product.name} utiliza ${product.material || 'plástico ABS de alta qualidade'} no cadastro atual, o que ajuda a comunicar resistência e melhor experiência de uso para montar, colecionar e presentear.`,
    },
    {
      question: `${product.name} tem garantia e política de troca?`,
      answer: `${product.name} segue a política padrão da loja, com garantia contra defeitos de fabricação e possibilidade de solicitação de troca dentro do prazo exibido na própria página do produto.`,
    },
    {
      question: `Como saber se ${product.name} combina com outros produtos da coleção?`,
      answer: `A melhor forma de validar isso em ${product.name} é usar a própria página para explorar a categoria ${product.category}, a seção compre junto, os produtos relacionados e os guias temáticos ligados a esse universo.`,
    },
    {
      question: `${product.name} ajuda a aumentar a coleção sem errar a compra?`,
      answer: `${product.name} foi estruturado na plataforma com imagens, descrição, especificações, FAQ e links para categoria e guias satélite, o que reduz objeções e ajuda o cliente a decidir com mais contexto antes de comprar.`,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const productFaqSchema = generateFAQSchema(productFaqItems);

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={product.image_url}
        url={productUrl}
        type="product"
        price={product.price.toString()}
        currency="BRL"
        availability={product.stock > 0 ? 'in stock' : 'out of stock'}
      />

      <SchemaMarkup schema={productSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={productFaqSchema} />

      <div className="container mx-auto px-4 py-6 xl:py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Início</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={getCategoryPath(product.category)}>{product.category}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 mb-12 items-start">
          <div className="space-y-6">
            <ProductImageGallery
              images={productImages}
              productName={product.name}
              discount={discount}
              isOnSale={product.is_on_sale}
            />

            <Card className="border">
              <CardContent className="p-4">
                <h2 className="text-base font-bold mb-3">Explore conteúdos relacionados antes de comprar</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <Link to={getCategoryPath(product.category)} className="rounded-xl border p-3 hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-1">Ver categoria</h3>
                    <p className="text-sm text-muted-foreground">Explore mais produtos da categoria {product.category}.</p>
                  </Link>
                  <Link to={getPillarPathByCategory(product.category)} className="rounded-xl border p-3 hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-1">Guia temático</h3>
                    <p className="text-sm text-muted-foreground">Aprofunde sua busca com a página pilar relacionada a esse tema.</p>
                  </Link>
                  <Link to={primaryGuidePath} className="rounded-xl border p-3 hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-1">Guia satélite</h3>
                    <p className="text-sm text-muted-foreground">Acesse um conteúdo complementar ligado à intenção de busca desse tema.</p>
                  </Link>
                  <Link to={secondaryGuidePath} className="rounded-xl border p-3 hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-1">Conteúdo complementar</h3>
                    <p className="text-sm text-muted-foreground">Amplie a pesquisa com um segundo guia relacionado ao contexto deste produto.</p>
                  </Link>
                  <Link to="/blog" className="rounded-xl border p-3 hover:border-primary transition-colors md:col-span-2">
                    <h3 className="font-semibold mb-1">Guias do blog</h3>
                    <p className="text-sm text-muted-foreground">Veja dicas e conteúdos para escolher melhor seu próximo boneco de montar.</p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col">
            <div className="mb-4">
              <Badge variant="outline" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-2xl xl:text-4xl font-bold mb-3">{product.name}</h1>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {generateSeoDescription(product)}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    void toggleFavorite(product);
                  }}
                  className="w-9 h-9 rounded-full bg-white border hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label={isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                <span className="text-sm text-muted-foreground mr-2">Compartilhar:</span>
                <button onClick={() => handleShare('facebook')} className="w-9 h-9 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white flex items-center justify-center transition-colors" aria-label="Compartilhar no Facebook"><Facebook className="w-4 h-4" /></button>
                <button onClick={() => handleShare('twitter')} className="w-9 h-9 rounded-full bg-[#1DA1F2] hover:bg-[#1A94DA] text-white flex items-center justify-center transition-colors" aria-label="Compartilhar no Twitter"><Twitter className="w-4 h-4" /></button>
                <button onClick={() => handleShare('whatsapp')} className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#22C55E] text-white flex items-center justify-center transition-colors" aria-label="Compartilhar no WhatsApp"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></button>
                <button onClick={() => handleShare('copy')} className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-colors" aria-label="Copiar link"><Share2 className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-secondary text-secondary' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product.reviews_count} avaliações)</span>
              </div>

              {product.sku && (
                <div className="mb-4">
                  <span className="text-sm text-muted-foreground">SKU: <span className="font-medium text-foreground">{product.sku}</span></span>
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl xl:text-4xl font-bold text-[#FF6B35]">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-muted-foreground line-through">R$ {product.original_price.toFixed(2).replace('.', ',')}</span>
                )}
              </div>

              {kitValue ? (
                <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-[#5C4200]">
                  <p className="font-extrabold text-base">{kitValue.headline}</p>
                  <p>{kitValue.unitPrice}</p>
                  <p>{kitValue.context}</p>
                </div>
              ) : (
                <p className="mb-6 text-sm font-semibold text-emerald-700">
                  Frete gratis acima de R$99
                </p>
              )}
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Quantidade</label>
              <div className="flex items-stretch gap-3">
                <div className="flex items-center border border-border rounded-md overflow-hidden h-11 shrink-0 bg-background">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1 || isAddingToCart} aria-label="Diminuir quantidade" className="h-full w-11 flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><Minus className="h-4 w-4 text-muted-foreground" /></button>
                  <span className="h-full min-w-[52px] px-3 flex items-center justify-center text-sm font-medium text-foreground border-x border-border">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(Math.min(99, quantity + 1))} disabled={quantity >= 99 || isAddingToCart} aria-label="Aumentar quantidade" className="h-full w-11 flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><Plus className="h-4 w-4 text-muted-foreground" /></button>
                </div>

                <Button type="button" onClick={() => void handleAddToCart()} disabled={isAddingToCart} className="flex-1 h-12 text-base font-extrabold bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] shadow-sm shadow-yellow-300/50" aria-label={`Adicionar ${quantity} ${product.name} ao carrinho`}>
                  {isAddingToCart ? 'ADICIONANDO...' : ctaLabel.toUpperCase()}
                </Button>
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <FreeShippingProgress
                cartTotal={projectedFreeShippingTotal}
                hasCollectionItem={hasCollectionItem || productHasCollectionFreeShipping}
              />
              <p className="text-xs text-muted-foreground">
                Simulação considerando este produto e os itens selecionados em compre junto.
              </p>
            </div>

            {bundleSuggestions.length > 0 && (
              <Card className="mb-6 border">
                <CardContent className="p-4">
                  <h2 className="text-base font-bold mb-3">Compre junto</h2>
                  <div className="space-y-3">
                    <div className="rounded-xl border p-3 bg-muted/20">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Produto principal • Quantidade {quantity}</p>
                        </div>
                        <span className="font-bold text-primary">R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>

                    {bundleSuggestions.map((bundleProduct) => {
                      const checked = selectedBundleProductIds.includes(bundleProduct.id);
                      return (
                        <div key={bundleProduct.id} className="rounded-xl border p-3">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => handleBundleSelectionChange(bundleProduct.id, Boolean(value))}
                              className="mt-1"
                            />
                            <img src={bundleProduct.image_url} alt={bundleProduct.name} className="h-16 w-16 rounded-lg object-cover bg-muted" />
                            <div className="flex-1 min-w-0">
                              <Link to={getProductPath(bundleProduct)} className="font-medium line-clamp-2 hover:text-primary transition-colors">
                                {bundleProduct.name}
                              </Link>
                              <p className="text-sm text-muted-foreground mt-1">{bundleProduct.category}</p>
                            </div>
                            <span className="font-bold text-primary">R$ {bundleProduct.price.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="rounded-xl border bg-muted/20 p-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Produto principal</span>
                        <span>R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
                      </div>
                      {selectedBundleProducts.map((bundleProduct) => (
                        <div key={bundleProduct.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground line-clamp-1">{bundleProduct.name}</span>
                          <span>R$ {bundleProduct.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex items-center justify-between font-bold">
                        <span>Total do pacote</span>
                        <span className="text-primary">R$ {selectedBundleTotal.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>

                    <Button type="button" onClick={() => void handleAddBundleToCart()} disabled={isAddingBundle} className="w-full h-11 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                      {isAddingBundle ? 'ADICIONANDO ITENS...' : 'ADICIONAR TUDO AO CARRINHO'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-0 divide-y divide-border">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="w-5 h-5 text-primary" />
                    <p className="font-semibold">Calcular Frete e Prazo</p>
                  </div>
                  <ShippingCalculator peso={product.weight || 500} comprimento={product.length || 20} altura={product.height || 10} largura={product.width || 15} />
                </div>

                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center"><RotateCcw className="w-5 h-5 text-success" /></div>
                    <div className="text-left"><p className="font-medium text-sm">Devoluções grátis até 7 dias</p></div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center"><Shield className="w-5 h-5 text-success" /></div>
                    <div className="text-left">
                      <p className="font-medium text-sm">Segurança e privacidade</p>
                      <p className="text-xs text-muted-foreground">Pagamentos seguros. Dados protegidos.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                <div className="p-4">
                  <TrustBadges />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="characteristics">Características</TabsTrigger>
              <TabsTrigger value="specifications">Especificações</TabsTrigger>
              <TabsTrigger value="warranty">Garantia</TabsTrigger>
              <TabsTrigger value="reviews">
                <MessageSquare className="w-4 h-4 mr-1.5" />
                Comentários
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Sobre o Produto</h2>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    {product.rich_description ? (
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: product.rich_description }} />
                    ) : product.description ? (
                      <p>{product.description}</p>
                    ) : (
                      <p>
                        Boneco de montar {product.name} compatível com blocos tipo LEGO.
                        Produto de alta qualidade, fabricado em plástico ABS resistente e durável.
                        Perfeito para crianças e colecionadores que adoram montar e criar suas próprias histórias.
                        Desenvolve criatividade, coordenação motora e raciocínio lógico.
                      </p>
                    )}

                    {product.whats_included && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">O que está incluído:</h3>
                        <p className="text-sm">{product.whats_included}</p>
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-3 mt-4">
                      <div className="rounded-xl border p-4">
                        <h3 className="font-semibold mb-2">Para quem é este produto?</h3>
                        <p className="text-sm text-muted-foreground">Indicado para quem procura um boneco de montar com tema {product.category.toLowerCase()}, boa apresentação visual e potencial para presentear ou colecionar.</p>
                      </div>
                      <div className="rounded-xl border p-4">
                        <h3 className="font-semibold mb-2">O que comparar antes de comprar</h3>
                        <p className="text-sm text-muted-foreground">Compare categoria, tema, imagens, preço, material, idade recomendada e vitrines relacionadas para escolher melhor.</p>
                      </div>
                      <div className="rounded-xl border p-4">
                        <h3 className="font-semibold mb-2">Como ampliar sua coleção</h3>
                        <p className="text-sm text-muted-foreground">Visite a categoria, a página pilar do tema e os conteúdos satélite para descobrir combinações e produtos complementares.</p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm">
                        <strong>✓ Compatível com blocos de montar tipo LEGO</strong><br />
                        Todas as peças são 100% compatíveis com outras marcas de blocos de construção,
                        permitindo que você expanda sua coleção e crie construções ainda mais incríveis.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="characteristics" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Características do Produto</h2>
                  <div className="overflow-hidden rounded-xl border">
                    <div className="grid grid-cols-[minmax(130px,0.8fr)_1fr] bg-muted px-4 py-3 text-sm font-bold text-foreground">
                      <span>Característica</span>
                      <span>Informação</span>
                    </div>
                    <div className="divide-y">
                      {productCharacteristics.map((item) => (
                        <div key={item.label} className="grid grid-cols-1 gap-1 px-4 py-3 text-sm md:grid-cols-[minmax(130px,0.8fr)_1fr] md:gap-4">
                          <span className="font-medium text-muted-foreground">{item.label}</span>
                          <span className="text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Especificações Técnicas</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Categoria</span><span className="font-medium">{product.category}</span></div>
                    <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Material</span><span className="font-medium">{product.material || 'Plástico ABS de alta qualidade'}</span></div>
                    <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Idade Recomendada</span><span className="font-medium">{product.age_recommendation || '6+'} anos</span></div>
                    {product.length && product.width && product.height && (
                      <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Dimensões</span><span className="font-medium">{product.length}cm x {product.width}cm x {product.height}cm</span></div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Peso</span><span className="font-medium">{product.weight}g</span></div>
                    )}
                    {product.sku && (
                      <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">SKU</span><span className="font-medium">{product.sku}</span></div>
                    )}
                    <div className="flex justify-between py-2"><span className="text-muted-foreground">Certificação</span><span className="font-medium">CE, INMETRO</span></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warranty" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Informações de Garantia</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Garantia do Fabricante</h4>
                      <p className="text-sm text-muted-foreground">Este produto possui garantia de 90 dias contra defeitos de fabricação, conforme o Código de Defesa do Consumidor.</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Política de Troca</h4>
                      <p className="text-sm text-muted-foreground mb-2">Você pode solicitar a troca do produto em até 7 dias após o recebimento, desde que esteja em perfeitas condições e na embalagem original.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={product.id} />
            </TabsContent>
          </Tabs>
        </div>

        <Card className="mb-16">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Perguntas frequentes sobre {product.name}</h2>
            <Accordion type="single" collapsible className="w-full">
              {productFaqItems.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <ProductCarousel products={relatedProducts} title="Produtos Relacionados" />
      </div>
    </>
  );
}
