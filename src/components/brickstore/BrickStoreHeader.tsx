import { Link } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function BrickStoreHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

          {/* Busca - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-[480px] mx-4">
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
          {/* Categorias Button */}
          <Button 
            className="bg-[#FFD200] hover:bg-[#F5C400] text-[#111827] font-bold text-[13px] h-10 px-5 rounded-lg shrink-0"
          >
            <Menu className="w-4 h-4 mr-2" />
            CATEGORIAS
          </Button>

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
