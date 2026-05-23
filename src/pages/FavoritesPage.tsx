import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { Product } from '@/types/index';
import { getProductPath } from '@/lib/urls';
import UserDashboardLayout from '@/components/layouts/UserDashboardLayout';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = async (product: Product) => {
    await addToCart(product, 1);
  };

  return (
    <UserDashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Favoritos</h1>
          <p className="text-muted-foreground">Gerencie os produtos que você salvou para comparar ou comprar depois.</p>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground mb-4">Você ainda não tem produtos favoritos</p>
              <Link to="/">
                <Button>Explorar Produtos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
            {favorites.map((product) => (
              <Card key={product.id} className="group overflow-hidden">
                <CardContent className="p-0">
                  <Link to={getProductPath(product)}>
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={getProductPath(product)}>
                      <h3 className="font-semibold text-sm xl:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg xl:text-xl font-bold text-primary">
                        R$ {product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleAddToCart(product)} className="flex-1" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                      <Button onClick={() => removeFavorite(product.id)} variant="outline" size="sm">
                        <Heart className="h-4 w-4 fill-current text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}
