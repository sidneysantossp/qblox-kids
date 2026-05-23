import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress';

export function VerticalCartDrawer() {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeItem, isLoading } = useCart();
  const [open, setOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleUpdateQuantity = async (itemId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10"
        >
          <ShoppingCart className="h-5 w-5 text-[#FF6B35]" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#FF6B35] text-white border-2 border-background">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[440px] p-0 flex flex-col">
        <SheetHeader className="sr-only">
          <SheetTitle>Meu carrinho</SheetTitle>
          <SheetDescription>Visualize os itens adicionados ao carrinho, atualize quantidades e siga para o checkout.</SheetDescription>
        </SheetHeader>
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[#FF6B35]" />
            <h2 className="text-lg font-bold">
              <span className="text-[#FF6B35]">{cartCount}</span> {cartCount === 1 ? 'Item' : 'Itens'} no carrinho
            </h2>
          </div>
        </div>

        {/* Cart Items */}
        <ScrollArea className="flex-1 px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Seu carrinho está vazio</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione produtos para começar suas compras
              </p>
              <Button asChild onClick={() => setOpen(false)}>
                <Link to="/">Continuar Comprando</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">
                      {item.product?.name || 'Produto'}
                    </h3>
                    <p className="text-lg font-bold text-foreground mb-2">
                      {formatPrice(item.product?.price || 0)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <div className="flex items-center gap-2 border rounded-full px-3 py-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <FreeShippingProgress cartTotal={cartTotal} />

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Preço Total</span>
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <Button
              asChild
              className="w-full h-12 text-base font-semibold bg-[#4CAF50] hover:bg-[#45a049] text-white"
              onClick={() => setOpen(false)}
            >
              <Link to="/checkout">Finalizar Compra</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
