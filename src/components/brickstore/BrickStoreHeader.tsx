import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, ChevronDown, LogOut, Heart, Package, TicketPercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo } from 'react';
import { getAllCategories } from '@/db/admin-api';
import { searchProducts } from '@/db/api';
import type { Category, Product } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CartDropdown } from '@/components/cart/CartDropdown';
import { FavoritesDropdown } from '@/components/products/FavoritesDropdown';
import { VerticalCartDrawer } from '@/components/cart/VerticalCartDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { usePublicSettings } from '@/hooks/use-public-settings';
import { getCategoryPath, getProductPath } from '@/lib/urls';

export function BrickStoreHeader() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cartTotal } = useCart();
  const { navbar_logo_url } = usePublicSettings();

  const menuItems = [
    { label: 'Início', path: '/' },
  ].map((item) => ({
    ...item,
    active: item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path),
  }));

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        const activeCategories = data
          .filter((cat) => cat.is_active)
          .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

        const kitsCategory = activeCategories.find((cat) => cat.slug === 'monte-sua-colecao');
        const categoriesWithoutKits = activeCategories.filter((cat) => cat.slug !== 'monte-sua-colecao');
        const jogosIndex = categoriesWithoutKits.findIndex((cat) => cat.slug === 'jogos');

        if (kitsCategory) {
          if (jogosIndex >= 0) {
            categoriesWithoutKits.splice(jogosIndex + 1, 0, kitsCategory);
          } else {
            categoriesWithoutKits.push(kitsCategory);
          }
        }

        setCategories(categoriesWithoutKits);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (trimmed.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      setIsSearching(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchProducts(trimmed);
        setSearchResults(results.slice(0, 6));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  const formattedCartTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cartTotal);

  const suggestionItems = useMemo(() => {
    return searchResults.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      sku: product.sku,
      image: product.image_url,
      path: getProductPath(product),
    }));
  }, [searchResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    window.location.href = `/busca?q=${encodeURIComponent(trimmed)}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 text-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[72px] md:h-[82px] gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            {navbar_logo_url ? (
              <img src={navbar_logo_url} alt="QBLOX" className="h-12 md:h-16 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-1">
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-0.5">
                    <div className="w-3 h-3 bg-[#FFD200] rounded-sm" />
                    <div className="w-3 h-3 bg-[#E52421] rounded-sm" />
                  </div>
                  <div className="flex gap-0.5">
                    <div className="w-3 h-3 bg-[#E52421] rounded-sm" />
                    <div className="w-3 h-3 bg-[#FFD200] rounded-sm" />
                  </div>
                </div>
                <div className="text-[30px] md:text-[38px] font-bold leading-none">
                  <span className="text-black">QBLOX</span>
                  <span className="text-black"> KIDS</span>
                </div>
              </div>
            )}
          </Link>

          <div className="flex-1 hidden lg:block" />

          <div className="hidden md:flex items-center w-full max-w-[460px] xl:max-w-[560px]">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Input
                type="search"
                placeholder="Busque por Tema ou Herói favorito"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="h-11 pl-4 pr-10 bg-white border-gray-300 rounded-lg text-[#111827] placeholder:text-[#6B7280]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/80" />

              {showSuggestions && (searchTerm.trim().length >= 2) && (
                <div className="absolute top-full mt-2 w-full rounded-xl border bg-white shadow-lg overflow-hidden z-50">
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-black/80">Buscando...</div>
                  ) : suggestionItems.length > 0 ? (
                    suggestionItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => {
                          setSearchTerm('');
                          setShowSuggestions(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b last:border-b-0"
                      >
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover bg-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                          <div className="flex items-center gap-2 text-xs text-black/80">
                            {item.sku ? <span className="font-mono uppercase">SKU: {item.sku}</span> : null}
                            <span>•</span>
                            <span>{item.category}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-black/80">Nenhum resultado encontrado.</div>
                  )}
                </div>
              )}
            </form>
          </div>

          {user ? (
            <div
              className="hidden lg:flex items-center gap-3 shrink-0"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11 hover:bg-transparent">
                    <User className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Minha Conta</p>
                      <p className="text-xs text-black/80 truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/minha-conta" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Minha Conta</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favoritos" className="flex items-center cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Meus Favoritos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/meus-pedidos" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Meus Pedidos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      window.location.href = '/';
                    }}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:flex items-center hover:text-primary transition-colors shrink-0">
              <Button variant="ghost" size="icon" className="h-11 w-11">
                <User className="w-6 h-6" />
              </Button>
            </Link>
          )}

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <FavoritesDropdown />
            <CartDropdown />
          </div>

          <div className="md:hidden ml-auto flex items-center justify-end gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="h-11 w-11" asChild>
              <Link to={user ? '/favoritos' : '/login'}>
                <Heart className="w-8 h-8" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-11 w-11" asChild>
              <Link to={user ? '/meus-cupons' : '/login'}>
                <TicketPercent className="w-8 h-8" />
              </Link>
            </Button>
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-12 w-12">
                <Menu className="w-8 h-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex h-full flex-col">
                <SheetDescription className="sr-only">Use este menu para acessar atalhos principais da loja, categorias e ofertas especiais.</SheetDescription>
                <div className="border-b border-border p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Minha Conta</p>
                      <p className="text-sm text-black/80">
                        {user ? (user.email?.split('@')[0] || 'Conta ativa') : 'Entrar / Cadastrar'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                  <nav className="flex flex-col gap-4">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-sm font-semibold uppercase transition-colors ${
                          item.active ? 'text-[#E52421]' : 'text-foreground hover:text-[#E52421]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}

                    <div className="border-t pt-4 mt-2">
                      <p className="text-xs font-semibold text-black/80 mb-3">CATEGORIAS</p>
                      {loadingCategories ? (
                        <p className="text-sm text-black/80">Carregando...</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {categories.map((category) => {
                            const categoryPath = `/categoria/${category.slug}`;
                            const isActive = location.pathname === categoryPath;

                            return (
                              <Link
                                key={category.id || category.slug}
                                to={categoryPath}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-2 rounded-lg p-1.5 transition-colors ${isActive ? 'bg-primary/5 text-primary' : 'hover:bg-muted/40'}`}
                              >
                                {category.mini_thumb_url || category.image_url ? (
                                  <img
                                    src={category.mini_thumb_url || category.image_url || ''}
                                    alt={category.name}
                                    className="h-10 w-10 rounded-lg object-cover bg-muted"
                                    width="40"
                                    height="40"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                                    {category.name.charAt(0)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-base font-semibold line-clamp-1 leading-tight">{category.name}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </nav>
                </div>

                <div className="border-t border-border p-5">
                  <Link
                    to="/ofertas-especiais"
                    onClick={() => setIsMenuOpen(false)}
                    className={`inline-flex h-11 w-full items-center justify-center rounded-md px-4 text-sm font-semibold uppercase transition-colors ${location.pathname.startsWith('/ofertas-especiais') ? 'bg-[#FF5722] text-white' : 'bg-[#FF6B35] text-white hover:bg-[#FF5722]'}`}
                  >
                    Ofertas
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>

        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Input
              type="search"
              placeholder="Busque por Tema ou Herói favorito"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-4 pr-10 bg-[#F9FAFB] border-[#D1D5DB] rounded-lg"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/80" />
          </form>
        </div>

        <div className="hidden lg:flex items-center justify-end gap-6 min-h-[52px] border-t border-gray-200/80 pt-2 pb-2">
          <nav className="flex items-center justify-end gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide min-w-0">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[13px] font-semibold uppercase transition-colors relative ${
                  item.active ? 'text-black' : 'text-black hover:text-[#E52421]'
                }`}
              >
                {item.label}
                {item.active && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E52421]" />}
              </Link>
            ))}

            {!loadingCategories && categories.map((category) => {
              const categoryPath = getCategoryPath(category.slug || category.name);
              const isActive = location.pathname === categoryPath;
              const isOffersCategory = (category.name || '').toLowerCase() === 'ofertas';
              const isCtaCategory = category.slug === 'monte-sua-colecao' || category.slug === 'acessorios';

              if (isOffersCategory || isCtaCategory) {
                return null;
              }

              return (
                <>
                  <Link
                    key={category.id || category.slug}
                    to={categoryPath}
                    className={`text-[13px] font-semibold uppercase transition-colors relative ${
                      isActive ? 'text-black' : 'text-black hover:text-[#E52421]'
                    }`}
                  >
                    {category.name}
                    {isActive && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E52421]" />}
                  </Link>
                  {category.slug === 'viloes' && (
                    <Link
                      key="ofertas-link"
                      to="/ofertas-especiais"
                      className={`text-[13px] font-semibold uppercase transition-colors relative ${
                        location.pathname.startsWith('/ofertas-especiais') ? 'text-black' : 'text-black hover:text-[#E52421]'
                      }`}
                    >
                      Ofertas
                      {location.pathname.startsWith('/ofertas-especiais') && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E52421]" />}
                    </Link>
                  )}
                </>
              );
            })}
          </nav>

          <Link
            to="/categoria/acessorios"
            className={`ml-6 inline-flex h-9 items-center rounded-md px-4 text-[13px] font-semibold uppercase transition-colors shrink-0 ${
              location.pathname.startsWith('/categoria/acessorios') ? 'bg-[#FF5722] text-white' : 'bg-[#FF6B35] text-white hover:bg-[#FF5722]'
            }`}
          >
            Monte sua Coleção
          </Link>
        </div>
      </div>
    </header>
  );
}
