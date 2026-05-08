import { useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

export function CartDropdown() {
  const { cartItems, cartCount, cartTotal, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-10 w-10">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500 text-white border-2 border-background">
                {cartCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="p-4">
            <h3 className="font-bold text-base mb-1">Seu carrinho</h3>
            <p className="text-sm text-muted-foreground">
              {cartCount === 0 ? 'Seu carrinho está vazio.' : `Itens (${cartCount})`}
            </p>
          </div>
          
          <Separator />

          {cartItems.length > 0 ? (
            <>
              <div className="max-h-[300px] overflow-y-auto">
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex gap-3">
                      <img
                        src={item.product?.image_url || ''}
                        alt={item.product?.name || ''}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2 mb-1">
                          {item.product?.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Qtd: {item.quantity}
                          </span>
                          <span className="text-sm font-bold text-primary">
                            {formatPrice((item.product?.price || 0) * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="p-4 space-y-3">
                {/* Free Shipping Progress Bar */}
                {cartTotal < 99 && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Faltam {formatPrice(99 - cartTotal)} para frete grátis
                      </span>
                      <span className="text-xs font-bold text-[#FF6B35]">
                        {Math.min(100, Math.round((cartTotal / 99) * 100))}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(100, (cartTotal / 99) * 100)}%`,
                          background: `linear-gradient(to right, 
                            ${cartTotal < 49.5 ? '#FF6B35' : cartTotal < 74.25 ? '#FFA726' : '#66BB6A'}, 
                            ${cartTotal < 49.5 ? '#FFA726' : cartTotal < 74.25 ? '#66BB6A' : '#4CAF50'})`
                        }}
                      />
                    </div>
                  </div>
                )}

                {cartTotal >= 99 && (
                  <div className="mb-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-2">
                    <p className="text-xs text-green-900 dark:text-green-100 text-center font-medium">
                      🎉 Você ganhou frete grátis!
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-bold text-lg">{formatPrice(cartTotal)}</span>
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1" size="sm">
                    <Link to="/carrinho">Ver carrinho</Link>
                  </Button>
                  <Button asChild className="flex-1" size="sm">
                    <Link to="/checkout">Finalizar Compra</Link>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Adicione produtos para começar suas compras
              </p>
              <Button asChild size="sm">
                <Link to="/">Explorar Produtos</Link>
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
