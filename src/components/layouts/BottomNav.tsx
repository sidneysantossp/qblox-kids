import { Home, Grid3x3, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getCategoryPath } from '@/lib/urls';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { CartItem } from '@/types';

const categories = [
  { name: 'Super Heróis', slug: 'super-herois' },
  { name: 'Roblox', slug: 'roblox' },
  { name: 'Séries da TV', slug: 'series-tv' },
  { name: 'Aventura', slug: 'aventura' },
  { name: 'Temáticos', slug: 'tematicos' },
  { name: 'Lançamentos', slug: 'lancamentos' },
];

export function BottomNav() {
  const location = useLocation();
  const { cartItems } = useCart();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  
  const cartItemsCount = (cartItems as CartItem[] || []).reduce((total: number, item: CartItem) => total + item.quantity, 0);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems: Array<{
    name: string;
    path: string;
    icon: any;
    badge?: number;
    isLink: boolean;
  }> = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      isLink: true,
    },
    {
      name: 'Categorias',
      path: '#',
      icon: Grid3x3,
      isLink: false,
    },
    {
      name: 'Carrinho',
      path: '/carrinho',
      icon: ShoppingCart,
      badge: cartItemsCount,
      isLink: true,
    },
    {
      name: 'Conta',
      path: '/minha-conta',
      icon: User,
      isLink: true,
    },
  ];

  return (
    <>
      {/* Barra de navegação inferior fixa - apenas mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border xl:hidden">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isLink && isActive(item.path);

            if (!item.isLink) {
              // Item de Categorias com Sheet
              return (
                <Sheet key={item.name} open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                  <SheetTrigger asChild>
                    <button
                      className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <div className="relative">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium">{item.name}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh]">
                    <SheetHeader>
                      <SheetTitle>Categorias</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          to={getCategoryPath(category.slug)}
                          onClick={() => setCategoriesOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full h-auto py-4 text-left justify-start"
                          >
                            {category.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              );
            }

            // Itens com link normal
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
