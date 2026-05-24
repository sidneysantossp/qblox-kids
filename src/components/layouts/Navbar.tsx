import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Package, Shield, Zap, Gamepad2, Tv, Compass, Palette, Sparkles, Blocks, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { CartDropdown } from '@/components/cart/CartDropdown';
import { VerticalCartDrawer } from '@/components/cart/VerticalCartDrawer';
import { TopBar } from './TopBar';
import { getAllCategories } from '@/db/api';
import type { Category } from '@/types';
import type { LucideIcon } from 'lucide-react';
import { getCategoryPath } from '@/lib/urls';

// Mapeamento de ícones
const iconMap: Record<string, LucideIcon> = {
  'Zap': Zap,
  'Gamepad2': Gamepad2,
  'Tv': Tv,
  'Compass': Compass,
  'Palette': Palette,
  'Sparkles': Sparkles,
  'Blocks': Blocks,
  'Shield': Shield,
  'Heart': Heart,
  'Package': Package,
};

// Função para obter o ícone baseado no nome
const getIconComponent = (iconName?: string | null): LucideIcon => {
  if (!iconName) return Blocks; // Ícone padrão
  return iconMap[iconName] || Blocks;
};

export function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user, signOut, isAdmin } = useAuth();

  // Carregar categorias do banco de dados
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.filter((category) => category.show_in_navbar !== false));
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <TopBar />
      
      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-background">
        <div className="container mx-auto px-4">
          {/* Main Header - 3 Column Layout */}
          <div className="flex items-center justify-between gap-4 xl:gap-8 py-4 xl:py-5">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Blocks className="h-8 w-8 xl:h-10 xl:w-10 text-orange-500" />
              <div className="text-xl md:text-2xl xl:text-3xl font-bold leading-none">
                <span className="text-foreground">QBLOX KIDS</span>
              </div>
            </Link>

            {/* Center: Search Bar - Desktop Only */}
            <form onSubmit={handleSearch} className="hidden md:flex w-full max-w-2xl mx-auto">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Digite o que você procura"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 xl:h-12 pr-12 !rounded-sm border-2"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 xl:h-10 xl:w-10 !rounded-sm bg-orange-500 hover:bg-orange-600"
                >
                  <Search className="h-4 w-4 xl:h-5 xl:w-5" />
                </Button>
              </div>
            </form>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 xl:gap-3 ml-auto">
              {/* Special Offers Button - Desktop */}
              <Button
                asChild
                className="hidden xl:flex items-center gap-2 h-11 px-6 !rounded-md bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link to="/ofertas-especiais">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold">Ofertas Especiais</span>
                </Link>
              </Button>

              {/* Mobile Search */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Search className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="h-auto">
                  <form onSubmit={handleSearch} className="pt-6">
                    <Input
                      type="search"
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-12 !rounded-none"
                    />
                  </form>
                </SheetContent>
              </Sheet>

              {/* User Menu */}
            {user ? (
              <div
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
                className="hidden md:block"
              >
                <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto py-2 px-3 hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-muted-foreground leading-tight">Olá, Bem-vindo(a)</span>
                          <span className="text-sm font-semibold leading-tight">{user.email?.split('@')[0]}</span>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Minha Conta</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
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
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center cursor-pointer text-primary">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Painel Admin</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
                className="hidden md:block"
              >
                <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto py-2 px-3 hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-muted-foreground leading-tight">Olá, Bem-vindo(a)</span>
                          <span className="text-sm font-semibold leading-tight">Entre ou Cadastre-se</span>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Fazer Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/favoritos" className="flex items-center cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Meus Favoritos</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile User Icon */}
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link to={user ? "/minha-conta" : "/login"}>
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart Dropdown - Desktop */}
            <div className="hidden xl:block">
              <CartDropdown />
            </div>

            {/* Cart Drawer - Mobile */}
            <div className="xl:hidden">
              <VerticalCartDrawer />
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Minha Conta Section */}
                  {user && (
                    <>
                      <div>
                        <h3 className="font-bold text-lg mb-4 text-orange-500">Minha Conta</h3>
                        <div className="flex flex-col gap-3">
                          <Link
                            to="/minha-conta"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-base hover:text-orange-500 transition-colors py-2"
                          >
                            <User className="h-5 w-5" />
                            <span>Meu Perfil</span>
                          </Link>
                          <Link
                            to="/favoritos"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-base hover:text-orange-500 transition-colors py-2"
                          >
                            <Heart className="h-5 w-5" />
                            <span>Meus Favoritos</span>
                          </Link>
                          <Link
                            to="/meus-pedidos"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-base hover:text-orange-500 transition-colors py-2"
                          >
                            <Package className="h-5 w-5" />
                            <span>Meus Pedidos</span>
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 text-base hover:text-orange-500 transition-colors py-2"
                            >
                              <Shield className="h-5 w-5" />
                              <span>Painel Admin</span>
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              handleLogout();
                            }}
                            className="flex items-center gap-3 text-base hover:text-destructive transition-colors py-2 text-left"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Sair</span>
                          </button>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Login Button for non-authenticated users */}
                  {!user && (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-base hover:text-orange-500 transition-colors py-2"
                      >
                        <User className="h-5 w-5" />
                        <span>Entrar / Cadastrar</span>
                      </Link>
                      <Separator />
                    </>
                  )}

                  {/* Ofertas Especiais - Mobile */}
                  <Link
                    to="/ofertas-especiais"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-base font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors py-3 px-4 rounded-full"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Ofertas Especiais</span>
                  </Link>

                  <Separator />

                  {/* Categories Section */}
                  <div>
                    <h3 className="font-bold text-lg mb-4">Categorias</h3>
                    <div className="flex flex-col gap-3">
                      {categories
                        .filter((category) => category.slug !== 'acessorios')
                        .map((category) => {
                          const Icon = getIconComponent(category.icon);
                          return (
                            <Link
                              key={category.id || category.slug}
                              to={getCategoryPath(category.slug)}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 text-base hover:text-orange-500 transition-colors py-2"
                            >
                              <Icon className="h-5 w-5" />
                              <span>{category.name}</span>
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        </div>

        {/* Categories Navigation Bar - Desktop */}
        <div className="hidden xl:block bg-black w-full">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-8 py-3">
              {categories
                .filter((category) => category.slug !== 'acessorios')
                .map((category) => {
                  const Icon = getIconComponent(category.icon);
                  return (
                    <Link
                      key={category.id || category.slug}
                      to={getCategoryPath(category.slug)}
                      className="flex items-center gap-2 text-sm font-medium text-white hover:text-orange-500 transition-colors group"
                    >
                      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
