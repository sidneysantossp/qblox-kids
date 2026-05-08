import { Shield, Tag, Truck, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Newsletter from '@/components/common/Newsletter';
import { CategoryCard } from '@/components/products/CategoryCard';
import { CountdownTimer } from '@/components/products/CountdownTimer';
import { ProductCard } from '@/components/products/ProductCard';
import { WeeklyDeals } from '@/components/products/WeeklyDeals';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateWebsiteSchema, generateOrganizationSchema, generateHomeTitle } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getBestsellerProducts, getFeaturedProducts, getOnSaleProducts, getFlashSaleProducts, getWeeklyDealsProducts, getBuildCollectionProducts, getTvSeriesProducts, getProducts, getActiveHeroBanners, getActiveMiniBanners, getProductsByCategory } from '@/db/api';
import type { Product, HeroBanner, MiniBanner } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const categories = [
  { 
    name: 'Super Heróis', 
    slug: 'Super Heróis',
    path: '/categoria/Super Heróis',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/4f72eee3-20ec-429f-9b68-0379cbaf094c.jpg'
  },
  { 
    name: 'Roblox', 
    slug: 'Roblox',
    path: '/categoria/Roblox',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/3bbca025-0159-42fe-bc15-7118495f4086.jpg'
  },
  { 
    name: 'Séries da TV', 
    slug: 'Séries da TV',
    path: '/categoria/Séries da TV',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/993ab9c7-2e43-45e8-9e72-e288d46294a7.jpg'
  },
  { 
    name: 'Aventura', 
    slug: 'Aventura',
    path: '/categoria/Aventura',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/8afc7759-7387-4b1f-9a74-d81c481dee08.jpg'
  },
  { 
    name: 'Temáticos', 
    slug: 'Temáticos',
    path: '/categoria/Temáticos',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/c65b6f59-6696-4dd5-8ee8-a3c92a873bbb.jpg'
  },
  { 
    name: 'Lançamentos', 
    slug: 'Lançamentos',
    path: '/categoria/Lançamentos',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/eb98b00f-1424-46aa-99ea-f2d47274898d.jpg'
  },
  { 
    name: 'Monte sua Coleção', 
    slug: 'Monte sua Coleção',
    path: '/categoria/monte-sua-colecao',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/17240fdd-f30b-441b-ab9b-fa593ba8f761.jpg'
  },
];

const defaultHeroImages = [
  'https://miaoda-site-img.s3cdn.medo.dev/images/23375046-e6b0-49d5-a72f-00483a7c4527.jpg',
  'https://miaoda-site-img.s3cdn.medo.dev/images/329ba83e-9662-4042-907a-b7342355c6b1.jpg',
  'https://miaoda-site-img.s3cdn.medo.dev/images/cda4c35f-bc9a-4fd7-89cc-e68dbdd21484.jpg',
];

const promoCards = [
  {
    icon: Tag,
    title: 'Promoções Especiais',
    description: 'Descontos de até 40% em produtos selecionados',
    bgColor: 'bg-yellow-50',
    textColor: 'text-gray-800',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Truck,
    title: 'Frete Grátis',
    description: 'Em compras acima de R$ 199,00',
    bgColor: 'bg-orange-50',
    textColor: 'text-gray-800',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Ambiente 100% seguro e protegido',
    bgColor: 'bg-purple-50',
    textColor: 'text-gray-800',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [weeklyDealsProducts, setWeeklyDealsProducts] = useState<Product[]>([]);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [tvSeriesProducts, setTvSeriesProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [miniBanners, setMiniBanners] = useState<MiniBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroApi, setHeroApi] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Iniciando carregamento de produtos...');
        
        const [featured, bestsellers, onSale, flashSale, weeklyDeals, collection, tvSeries, all, banners, miniB] = await Promise.all([
          getFeaturedProducts(12),
          getBestsellerProducts(5),
          getOnSaleProducts(5),
          getFlashSaleProducts(5),
          getWeeklyDealsProducts(5),
          getBuildCollectionProducts(5),
          getTvSeriesProducts(5),
          getProducts(12),
          getActiveHeroBanners(),
          getActiveMiniBanners(),
        ]);
        
        console.log('✅ Produtos Monte Sua Coleção carregados:', {
          quantidade: collection.length,
          produtos: collection.map(p => ({ id: p.id, nome: p.name, categoria: p.category, categorias: p.categories, is_build_collection: p.is_build_collection }))
        });
        
        setFeaturedProducts(featured);
        setBestsellerProducts(bestsellers);
        setOnSaleProducts(onSale);
        setFlashSaleProducts(flashSale);
        setWeeklyDealsProducts(weeklyDeals);
        setCollectionProducts(collection);
        setTvSeriesProducts(tvSeries);
        setAllProducts(all);
        setHeroBanners(banners);
        setMiniBanners(miniB);
      } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Track carousel slide changes
  useEffect(() => {
    if (!heroApi) return;

    const onSelect = () => {
      setCurrentSlide(heroApi.selectedScrollSnap());
    };

    heroApi.on('select', onSelect);
    onSelect();

    return () => {
      heroApi.off('select', onSelect);
    };
  }, [heroApi]);

  // SEO Configuration
  const seoTitle = 'Kids Block Store - Bonecos de Montar LEGO - Super Heróis, Roblox e Mais';
  const seoDescription = 'Loja especializada em bonecos de montar tipo LEGO para crianças. Encontre Super Heróis, Roblox, Séries da TV, Aventura e muito mais! Frete grátis acima de R$99. Compra segura e produtos de qualidade.';

  // Use database banners or fallback to default images
  const displayBanners = heroBanners.length > 0 
    ? heroBanners 
    : defaultHeroImages.map((img, idx) => ({
        id: `default-${idx}`,
        image_url: img,
        title: '',
        subtitle: null,
        button_text: null,
        link_url: null,
        display_order: idx,
        is_active: true,
        created_at: '',
        updated_at: ''
      }));

  return (
    <>
      <SEO
        title={generateHomeTitle()}
        description="Loja especializada em bonecos de montar tipo LEGO para crianças. Encontre Super Heróis, Roblox, Séries da TV, Aventura e muito mais! Frete grátis acima de R$99. Compra segura."
        image={displayBanners[0]?.image_url || defaultHeroImages[0]}
        type="website"
        keywords="bonecos de montar, lego, blocos de construção, super heróis, roblox, brinquedos infantis, minifiguras, qblox"
      />
      
      <SchemaMarkup schema={generateWebsiteSchema()} />
      <SchemaMarkup schema={generateOrganizationSchema()} />
      
      <div className="min-h-screen bg-background">
      {/* Mobile Search Bar - Above Hero Banner */}
      <div className="md:hidden w-full bg-background px-4 py-3 border-b">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Digite o que você procura"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 pr-12 rounded-full border-2"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-orange-500 hover:bg-orange-600"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Hero Carousel */}
      <div className="w-full bg-muted/20 relative">
        <Carousel 
          className="w-full" 
          opts={{ loop: true }}
          setApi={setHeroApi}
          plugins={[
            Autoplay({
              delay: 5000,
            }) as any,
          ]}
        >
          <CarouselContent>
            {displayBanners.map((banner, index) => (
              <CarouselItem key={banner.id}>
                <div className="relative w-full h-[500px] md:h-[450px] xl:h-[550px] overflow-hidden">
                  {/* Full Width Background Image */}
                  <img
                    src={banner.image_url}
                    alt={banner.title || `Banner ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                  
                  {/* Text Content Overlay */}
                  <div className="relative h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-12 w-full">
                      <div className="max-w-2xl space-y-4 xl:space-y-6">
                        {/* Script/Cursive Label */}
                        <p className="text-sm xl:text-base text-white/90 italic">
                          Diversas coleções incríveis
                        </p>
                        
                        {/* Main Headline - Dynamic from Admin */}
                        {banner.title && (
                          <div className="text-3xl md:text-4xl xl:text-5xl font-black text-white leading-none tracking-tight">
                            {banner.title}
                          </div>
                        )}
                        
                        {/* Subtitle */}
                        {banner.subtitle && (
                          <p className="text-base xl:text-lg text-white/90">
                            {banner.subtitle}
                          </p>
                        )}
                        
                        {/* CTA Button */}
                        {banner.button_text && banner.link_url && (
                          <div className="pt-4">
                            <Button 
                              asChild
                              size="lg"
                              className="bg-orange-500 hover:bg-orange-600 text-white text-base xl:text-lg px-8 py-6 rounded-full shadow-lg font-semibold"
                            >
                              <Link to={banner.link_url}>
                                {banner.button_text}
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
            </CarouselContent>
            {/* Setas de navegação - ocultas no mobile */}
            <CarouselPrevious className="hidden md:flex left-4 h-10 w-10 xl:h-12 xl:w-12 bg-black/60 hover:bg-black/80 backdrop-blur-md border-none text-white" />
            <CarouselNext className="hidden md:flex right-4 h-10 w-10 xl:h-12 xl:w-12 bg-black/60 hover:bg-black/80 backdrop-blur-md border-none text-white" />
          </Carousel>
          
          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => heroApi?.scrollTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  currentSlide === index 
                    ? "w-8 bg-white" 
                    : "w-2 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
      </div>

      {/* Promo Cards - Carousel com navegação */}
      <div className="bg-muted/30 py-6 xl:py-8 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <Carousel
            opts={{
              align: 'center',
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }) as any,
            ]}
            className="w-full"
          >
            <CarouselContent>
              {promoCards.map((card, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="flex items-center justify-center gap-4 px-4 py-2">
                    <div className="shrink-0">
                      <card.icon className="w-10 h-10 xl:w-12 xl:h-12 text-foreground" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-base xl:text-lg text-foreground">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex left-2 xl:left-4 h-8 w-8 xl:h-10 xl:w-10" />
            <CarouselNext className="hidden md:flex right-2 xl:right-4 h-8 w-8 xl:h-10 xl:w-10" />
          </Carousel>
        </div>
      </div>

      {/* Categories Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-8 xl:py-12">
        <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-center mb-8 xl:mb-12">
          <span className="text-black">Explore por</span>{' '}
          <span className="text-black">Categorias</span>
        </h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }) as any,
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {categories.map((category, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/3 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <CategoryCard 
                  name={category.name} 
                  slug={category.slug} 
                  image={category.image}
                  path={category.path}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden xl:flex" />
          <CarouselNext className="hidden xl:flex" />
        </Carousel>
      </div>

      {/* Novidades da Semana */}
      <WeeklyDeals products={weeklyDealsProducts} loading={loading} />

      {/* Produtos em Oferta Relâmpago */}
      {(flashSaleProducts.length > 0 || loading) && (
        <div className="max-w-7xl mx-auto px-4 py-8 xl:py-12">
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#F44336] rounded-2xl p-6 xl:p-8">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-white mb-2">
                  Ofertas Relâmpago ⚡
                </h2>
                <p className="text-white/90 text-lg">Aproveite antes que acabe!</p>
              </div>
              {flashSaleProducts.length > 0 && flashSaleProducts[0].flash_sale_end_time && (
                <CountdownTimer endTime={flashSaleProducts[0].flash_sale_end_time} />
              )}
            </div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm h-[350px] animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Mobile: Carrossel - 1 card */}
                <div className="xl:hidden">
                  <Carousel
                    opts={{
                      align: 'start',
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 3000,
                      }) as any,
                    ]}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {flashSaleProducts.slice(0, 5).map((product) => (
                        <CarouselItem key={product.id} className="pl-4 basis-full">
                          <ProductCard product={product} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
                {/* Desktop: Grid */}
                <div className="hidden xl:grid grid-cols-5 gap-4">
                  {flashSaleProducts.slice(0, 5).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Os Mais Vendidos */}
      <div className="max-w-7xl mx-auto px-4 py-8 xl:py-12">
        <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-center mb-8 xl:mb-12">
          <span className="text-black">Os Mais</span>{' '}
          <span className="text-black">Vendidos</span>
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm h-[400px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
            {bestsellerProducts.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Mini Banners Promocionais */}
      {(miniBanners.length > 0 || loading) && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-muted rounded-2xl h-[200px] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
              {miniBanners.slice(0, 2).map((banner) => (
                <Link
                  key={banner.id}
                  to={banner.link_url || '#'}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Monte Sua Coleção */}
      {collectionProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8 xl:py-12">
          <div className="flex items-center justify-between mb-8 xl:mb-12">
            <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-black">
              Monte Sua Coleção
            </h2>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link to="/categoria/Monte sua Coleção">
                Ver Todos
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm h-[400px] animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
                {collectionProducts.slice(0, 5).map((product) => {
                  console.log('🎨 Renderizando produto Monte Sua Coleção:', product.name, product.category);
                  return <ProductCard key={product.id} product={product} />;
                })}
              </div>
              <div className="flex justify-center mt-8 md:hidden">
                <Button asChild variant="outline" className="w-full max-w-xs">
                  <Link to="/categoria/Monte sua Coleção">
                    Ver Todos
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Séries da TV */}
      {tvSeriesProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8 xl:py-12">
          <div className="flex items-center justify-between mb-8 xl:mb-12">
            <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-black">
              Séries da TV
            </h2>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link to="/categoria/Séries da TV">
                Ver Todos
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm h-[400px] animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
                {tvSeriesProducts.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="flex justify-center mt-8 md:hidden">
                <Button asChild variant="outline" className="w-full max-w-xs">
                  <Link to="/categoria/Séries da TV">
                    Ver Todos
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Produtos em Destaque */}
      <div className="max-w-7xl mx-auto px-4 py-8 xl:py-12">
        <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-center mb-8 xl:mb-12">
          <span className="text-black">Produtos em</span>{' '}
          <span className="text-black">Destaque</span>
        </h2>
        {loading ? (
          <div className="relative">
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm w-[260px] xl:w-[300px] h-[400px] flex-shrink-0 animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-[260px] xl:basis-[300px]">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden xl:flex" />
            <CarouselNext className="hidden xl:flex" />
          </Carousel>
        )}
      </div>

      {/* Coleção 2026 */}
      <div 
        className="relative max-w-7xl mx-auto px-4 py-8 xl:py-12 overflow-hidden"
        style={{
          backgroundImage: 'url(https://stackfood-react.6amtech.com/static/paidAdds.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay para melhor legibilidade */}
        <div className="absolute inset-0 bg-background/90" />
        
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-center mb-8 xl:mb-12">
            <span className="text-[#9C27B0]">Coleção</span>{' '}
            <span className="text-[#00BCD4]">2026</span>
          </h2>
        {loading ? (
          <div className="relative">
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm w-[260px] xl:w-[300px] h-[400px] flex-shrink-0 animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {allProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-[260px] xl:basis-[300px]">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden xl:flex" />
            <CarouselNext className="hidden xl:flex" />
          </Carousel>
        )}
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
    </>
  );
}
