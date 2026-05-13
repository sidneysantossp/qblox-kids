import { ChevronRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { getProductPath } from '@/lib/urls';
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
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeItem, isLoading } = useCart();
  const [isCheckingOut] = useState(false);

  const handleCheckout = () => {
    // Redirecionar para página de checkout (Asaas - PIX e Boleto)
    window.location.href = '/checkout';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando carrinho...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-6">
              Adicione produtos ao carrinho para continuar comprando
            </p>
            <Link to="/">
              <Button>Continuar Comprando</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Carrinho de Compras | QBLOX"
        description="Revise seus produtos e finalize sua compra. Frete grátis acima de R$99."
      />
      
      <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Carrinho</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl xl:text-4xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="xl:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <Card key={item.id}>
                <CardContent className="p-4 xl:p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link to={getProductPath(product)} className="shrink-0">
                      <div className="w-24 h-24 xl:w-32 xl:h-32 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={getProductPath(product)}>
                        <h3 className="font-semibold text-base xl:text-lg mb-2 hover:text-[#FF6B35] line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">
                        Categoria: {product.category}
                      </p>
                      <div className="flex items-center gap-4">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Remove */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-white hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4 xl:mr-1" />
                          <span className="hidden xl:inline">Remover</span>
                        </Button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="text-lg xl:text-xl font-bold text-foreground">
                        R$ {(product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        R$ {product.price.toFixed(2)} cada
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium text-success">
                    {cartTotal >= 99 ? 'Grátis' : 'A calcular'}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-foreground">
                  R$ {cartTotal.toFixed(2)}
                </span>
              </div>

              {cartTotal < 99 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Faltam R$ {(99 - cartTotal).toFixed(2)} para frete grátis
                    </span>
                    <span className="text-xs font-bold text-[#FF6B35]">
                      {Math.round((cartTotal / 99) * 100)}%
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${(cartTotal / 99) * 100}%`,
                        background: `linear-gradient(to right, 
                          ${cartTotal < 49.5 ? '#FF6B35' : cartTotal < 74.25 ? '#FFA726' : '#66BB6A'}, 
                          ${cartTotal < 49.5 ? '#FFA726' : cartTotal < 74.25 ? '#66BB6A' : '#4CAF50'})`
                      }}
                    />
                  </div>
                </div>
              )}

              {cartTotal >= 99 && (
                <div className="mb-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-900 dark:text-green-100 text-center font-medium">
                    🎉 Você ganhou frete grátis!
                  </p>
                </div>
              )}

              <Button 
                size="lg" 
                className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white"
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItems.length === 0}
              >
                {isCheckingOut ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processando...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Finalizar Pedido
                  </>
                )}
              </Button>

              <Link to="/">
                <Button variant="outline" size="lg" className="w-full mt-3">
                  Continuar Comprando
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
