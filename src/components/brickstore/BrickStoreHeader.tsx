import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { getAllCategories } from '@/db/admin-api';
import type { Category } from '@/types';
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

export function BrickStoreHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const cartItemsCount = 3;
  const cartTotal = 239.70;

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
          .filter(cat => cat.is_active)
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        setCategories(activeCategories);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Linha Superior - Logo, Busca, Minha Conta, Carrinho */}
        <div className="flex items-center justify-between h-[72px] md:h-[82px] gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              {/* Icon - Blocos empilhados */}
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
              {/* Text */}
              <div className="text-[26px] md:text-[32px] font-bold leading-none">
                <span className="text-[#061A33]">QBLOX</span>
                <span className="text-[#E52421]"> KIDS</span>
              </div>
            </div>
          </Link>

          {/* Spacer para empurrar elementos para direita */}
          <div className="flex-1 hidden lg:block" />

          {/* Busca - Desktop (alinhada à direita) */}
          <div className="hidden md:flex items-center w-full max-w-[360px]">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="h-11 pl-4 pr-10 bg-[#F9FAFB] border-[#D1D5DB] rounded-lg"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Minha Conta - Desktop */}
          <Link 
            to="/login" 
            className="hidden lg:flex items-center gap-2 hover:text-primary transition-colors shrink-0"
          >
            <User className="w-5 h-5" />
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-semibold">Minha conta</span>
              <span className="text-muted-foreground">Entrar / Cadastrar</span>
            </div>
          </Link>

          {/* Carrinho */}
          <Link 
            to="/carrinho" 
            className="flex items-center gap-2 hover:text-primary transition-colors shrink-0"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#E52421] text-white text-[10px] font-bold"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </div>
            <div className="hidden md:flex flex-col text-xs leading-tight">
              <span className="font-semibold">Carrinho</span>
              <span className="text-muted-foreground">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
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
                      item.active
                        ? 'text-[#E52421]'
                        : 'text-foreground hover:text-[#E52421]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Categorias no mobile */}
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

          {/* Mobile Search Icon */}
          <Button variant="ghost" size="icon" className="md:hidden shrink-0">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="h-10 pl-4 pr-10 bg-[#F9FAFB] border-[#D1D5DB] rounded-lg"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Linha Inferior - Botão Categorias + Menu Principal - Desktop Only */}
        <div className="hidden lg:flex items-center gap-6 h-[52px] border-t border-border">
          {/* Categorias Mega Menu */}
          <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                className="bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-bold text-[13px] h-10 px-5 rounded-lg shrink-0"
              >
                <Menu className="w-4 h-4 mr-2" />
                CATEGORIAS
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-[800px] p-6 bg-white"
              align="start"
              sideOffset={8}
            >
              {loadingCategories ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando categorias...
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-6">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/categoria/${category.slug}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="group"
                    >
                      <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                        {category.image_url ? (
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0057D9] to-[#003A99] flex items-center justify-center">
                            <span className="text-2xl text-white font-bold">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-sm font-semibold text-foreground group-hover:text-[#E52421] transition-colors">
                            {category.name}
                          </p>
                          {category.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Link para ver todas */}
              {!loadingCategories && categories.length > 0 && (
                <div className="border-t mt-4 pt-4 text-center">
                  <Link
                    to="/loja"
                    onClick={() => setIsCategoriesOpen(false)}
                    className="text-sm font-semibold text-[#E52421] hover:underline"
                  >
                    Ver todas as categorias →
                  </Link>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu Principal */}
          <nav className="flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[13px] font-semibold uppercase transition-colors relative ${
                  item.active
                    ? 'text-[#E52421]'
                    : 'text-foreground hover:text-[#E52421]'
                }`}
              >
                {item.label}
                {item.active && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E52421]" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
