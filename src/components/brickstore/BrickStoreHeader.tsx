import { Link } from 'react-router-dom';
import { Search, User, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo } from 'react';
import { getAllCategories } from '@/db/admin-api';
import { searchProducts } from '@/db/api';
import type { Category, Product } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CartDropdown } from '@/components/cart/CartDropdown';
import { VerticalCartDrawer } from '@/components/cart/VerticalCartDrawer';
import { useCart } from '@/contexts/CartContext';
import { usePublicSettings } from '@/hooks/use-public-settings';
import { getCategoryPath, getProductPath } from '@/lib/urls';

export function BrickStoreHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cartTotal } = useCart();
  const { navbar_logo_url } = usePublicSettings();

  const menuItems = [
    { label: 'INÍCIO', path: '/', active: true },
    { label: 'LOJA', path: '/loja' },
    { label: 'LANÇAMENTOS', path: '/categoria/lancamentos' },
    { label: 'KITS COLECIONÁVEIS', path: '/categoria/monte-sua-colecao' },
    { label: 'OFERTAS', path: '/ofertas-especiais' },
    { label: 'BLOG', path: '/blog' },
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        const activeCategories = data
          .filter((cat) => cat.is_active)
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        setCategories(activeCategories);
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
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[72px] md:h-[82px] gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            {navbar_logo_url ? (
              <img src={navbar_logo_url} alt="QBLOX" className="h-10 md:h-12 w-auto object-contain" />
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
                <div className="text-[26px] md:text-[32px] font-bold leading-none">
                  <span className="text-[#061A33]">QBLOX</span>
                  <span className="text-[#E52421]"> KIDS</span>
                </div>
              </div>
            )}
          </Link>

          <div className="flex-1 hidden lg:block" />

          <div className="hidden md:flex items-center w-full max-w-[360px]">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Input
                type="search"
                placeholder="Buscar por SKU, nome ou categoria"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="h-11 pl-4 pr-10 bg-[#F9FAFB] border-[#D1D5DB] rounded-lg"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              {showSuggestions && (searchTerm.trim().length >= 2) && (
                <div className="absolute top-full mt-2 w-full rounded-xl border bg-white shadow-lg overflow-hidden z-50">
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">Buscando...</div>
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
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {item.sku ? <span className="font-mono uppercase">SKU: {item.sku}</span> : null}
                            <span>•</span>
                            <span>{item.category}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground">Nenhum resultado encontrado.</div>
                  )}
                </div>
              )}
            </form>
          </div>

          <Link to="/login" className="hidden lg:flex items-center gap-2 hover:text-primary transition-colors shrink-0">
            <User className="w-5 h-5" />
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-semibold">Minha conta</span>
              <span className="text-muted-foreground">Entrar / Cadastrar</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <CartDropdown />
            <div className="hidden lg:flex flex-col text-xs leading-tight">
              <span className="font-semibold">Carrinho</span>
              <span className="text-muted-foreground">{formattedCartTotal}</span>
            </div>
          </div>

          <div className="md:hidden shrink-0">
            <VerticalCartDrawer />
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
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
                  <p className="text-xs font-semibold text-muted-foreground mb-3">CATEGORIAS</p>
                  {loadingCategories ? (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/categoria/${category.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-sm font-medium text-foreground hover:text-[#E52421] transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" size="icon" className="md:hidden shrink-0">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Input
              type="search"
              placeholder="Buscar por SKU, nome ou categoria"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-4 pr-10 bg-[#F9FAFB] border-[#D1D5DB] rounded-lg"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </form>
        </div>

        <div className="hidden lg:flex items-center gap-6 h-[52px] border-t border-border">
          <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-bold text-[13px] h-10 px-5 rounded-lg shrink-0">
                <Menu className="w-4 h-4 mr-2" />
                CATEGORIAS
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[800px] p-6 bg-white" align="start" sideOffset={8}>
              {loadingCategories ? (
                <div className="text-center py-8 text-muted-foreground">Carregando categorias...</div>
              ) : (
                <div className="grid grid-cols-4 gap-6">
                  {categories.map((category) => (
                    <Link key={category.id} to={`/categoria/${category.slug}`} onClick={() => setIsCategoriesOpen(false)} className="group">
                      <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                        {category.image_url ? (
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                            <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0057D9] to-[#003A99] flex items-center justify-center">
                            <span className="text-2xl text-white font-bold">{category.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-sm font-semibold text-foreground group-hover:text-[#E52421] transition-colors">{category.name}</p>
                          {category.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{category.description}</p>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!loadingCategories && categories.length > 0 && (
                <div className="border-t mt-4 pt-4 text-center">
                  <Link to="/loja" onClick={() => setIsCategoriesOpen(false)} className="text-sm font-semibold text-[#E52421] hover:underline">
                    Ver todas as categorias →
                  </Link>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <nav className="flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[13px] font-semibold uppercase transition-colors relative ${
                  item.active ? 'text-[#E52421]' : 'text-foreground hover:text-[#E52421]'
                }`}
              >
                {item.label}
                {item.active && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E52421]" />}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
