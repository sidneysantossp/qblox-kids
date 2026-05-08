import { 
  ChevronRight,
  Facebook, 
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
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import ProductReviews from '@/components/products/ProductReviews';
import { ShippingCalculator } from '@/components/shipping/ShippingCalculator';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateProductSchema, generateBreadcrumbSchema, generateProductTitle, generateProductDescription } from '@/lib/schema';
import { Badge } from '@/components/ui/badge';
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
import { useCart } from '@/contexts/CartContext';
import { getProductById, getProductsByCategory } from '@/db/api';
import type { Product } from '@/types';

/**
 * Extrai ID do produto de uma URL SEO-friendly
 * Formato esperado: /produto/nome-do-produto-uuid
 */
function extractProductId(urlParam: string): string {
  // Se já é um UUID válido, retorna direto
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(urlParam)) {
    return urlParam;
  }
  
  // Tenta extrair UUID do final da string (formato: slug-uuid)
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
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);
        
        if (productData) {
          const related = await getProductsByCategory(productData.category, 8);
          setRelatedProducts(related.filter(p => p.id !== productData.id));
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
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
        // Você pode adicionar um toast aqui para confirmar que foi copiado
        break;
    }
  };

  const generateSeoDescription = (product: Product) => {
    return `${product.name} - Boneco de montar tipo LEGO da categoria ${product.category}. Produto de alta qualidade, ideal para crianças e colecionadores. Compre agora na QBlox Kids com frete grátis acima de R$ 99,00!`;
  };

  const discount = product?.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Criar array de imagens (usando a mesma imagem 4 vezes se houver apenas uma)
  const productImages = product?.image_url ? [product.image_url] : [];

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

  // SEO Configuration for Product
  const seoTitle = product.meta_title || generateProductTitle(product.name, product.price);
  const seoDescription = product.meta_description || generateProductDescription(
    product.name,
    product.price,
    product.description || undefined
  );
  const productUrl = `https://qblox.com.br/produto/${product.slug || 'produto'}-${product.id}`;
  
  // Breadcrumbs for structured data
  const breadcrumbItems = [
    { name: 'Início', url: 'https://qblox.com.br/' },
    { name: product.category, url: `https://qblox.com.br/categoria/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: product.name, url: productUrl },
  ];
  
  // Generate Schema.org markup for product
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
  
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

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
      
      <div className="container mx-auto px-4 py-6 xl:py-8">
      {/* Breadcrumb */}
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
              <Link to={`/categoria/${product.category}`}>{product.category}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product Details */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 mb-12">
        {/* Image Gallery */}
        <ProductImageGallery 
          images={productImages}
          productName={product.name}
          discount={discount}
          isOnSale={product.is_on_sale}
        />

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Badge variant="outline" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="text-2xl xl:text-4xl font-bold mb-3">{product.name}</h1>
            
            {/* SEO Mini Description */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {generateSeoDescription(product)}
            </p>

            {/* Social Share Icons */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground mr-2">Compartilhar:</span>
              <button
                onClick={() => handleShare('facebook')}
                className="w-9 h-9 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white flex items-center justify-center transition-colors"
                aria-label="Compartilhar no Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-9 h-9 rounded-full bg-[#1DA1F2] hover:bg-[#1A94DA] text-white flex items-center justify-center transition-colors"
                aria-label="Compartilhar no Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#22C55E] text-white flex items-center justify-center transition-colors"
                aria-label="Compartilhar no WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-colors"
                aria-label="Copiar link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-secondary text-secondary'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews_count} avaliações)
              </span>
            </div>

            {/* SKU */}
            {product.sku && (
              <div className="mb-4">
                <span className="text-sm text-muted-foreground">
                  SKU: <span className="font-medium text-foreground">{product.sku}</span>
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl xl:text-4xl font-bold text-[#FF6B35]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  R$ {product.original_price.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quantity and Add to Cart */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              {/* Controle de Quantidade */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Quantidade</label>
                <div className="flex items-center border border-border rounded-md overflow-hidden h-11">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Diminuir quantidade"
                    className="h-full w-11 flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <span className="h-full min-w-[50px] flex items-center justify-center text-sm font-medium text-foreground border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    disabled={quantity >= 99}
                    aria-label="Aumentar quantidade"
                    className="h-full w-11 flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Botão Comprar */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium invisible">Ação</label>
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-11 text-base font-bold bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-white"
                  aria-label={`Adicionar ${quantity} ${product.name} ao carrinho`}
                >
                  COMPRAR
                </Button>
              </div>
            </div>
          </div>

          {/* Shipping and Policies Info */}
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {/* Calculadora de Frete */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <p className="font-semibold">Calcular Frete e Prazo</p>
                </div>
                <ShippingCalculator
                  peso={product.weight || 500}
                  comprimento={product.length || 20}
                  altura={product.height || 10}
                  largura={product.width || 15}
                />
              </div>

              {/* Devoluções */}
              <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-success" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Devoluções grátis até 7 dias</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>

              {/* Segurança */}
              <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Segurança e privacidade</p>
                    <p className="text-xs text-muted-foreground">Pagamentos seguros. Dados protegidos.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mb-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="description">Descrição</TabsTrigger>
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
                    <div 
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: product.rich_description }}
                    />
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
                  
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>✓ Compatível com blocos de montar tipo LEGO</strong><br/>
                      Todas as peças são 100% compatíveis com outras marcas de blocos de construção, 
                      permitindo que você expanda sua coleção e crie construções ainda mais incríveis.
                    </p>
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
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Categoria</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Material</span>
                    <span className="font-medium">{product.material || 'Plástico ABS de alta qualidade'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Idade Recomendada</span>
                    <span className="font-medium">{product.age_recommendation || '6+'} anos</span>
                  </div>
                  {product.length && product.width && product.height && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Dimensões</span>
                      <span className="font-medium">{product.length}cm x {product.width}cm x {product.height}cm</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Peso</span>
                      <span className="font-medium">{product.weight}g</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">SKU</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Certificação</span>
                    <span className="font-medium">CE, INMETRO</span>
                  </div>
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
                    <p className="text-sm text-muted-foreground">
                      Este produto possui garantia de 90 dias contra defeitos de fabricação, 
                      conforme o Código de Defesa do Consumidor.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Política de Troca</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Você pode solicitar a troca do produto em até 7 dias após o recebimento, 
                      desde que:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• O produto esteja em sua embalagem original</li>
                      <li>• Não tenha sido usado ou danificado</li>
                      <li>• Acompanhe todos os acessórios e manuais</li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Como Acionar a Garantia</h4>
                    <p className="text-sm text-muted-foreground">
                      Entre em contato com nosso suporte através do e-mail 
                      suporte@kidsblockstore.com.br ou pelo WhatsApp (11) 99999-9999.
                    </p>
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <ProductCarousel products={relatedProducts} title="Produtos Relacionados" />
        </section>
      )}
    </div>
    </>
  );
}
