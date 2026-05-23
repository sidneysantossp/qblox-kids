import { useMemo, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useFavorites } from '@/contexts/FavoritesContext';
import { getProductPath } from '@/lib/urls';

export function FavoritesDropdown() {
  const { favorites, removeFavorite } = useFavorites();
  const [open, setOpen] = useState(false);

  const recentFavorites = useMemo(() => favorites.slice(0, 3), [favorites]);

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-11 w-11">
            <Heart className="h-6 w-6" />
            {favorites.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500 text-white border-2 border-background">
                {favorites.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="p-4">
            <h3 className="font-bold text-base mb-1">Meus Favoritos</h3>
            <p className="text-sm text-muted-foreground">
              {favorites.length === 0 ? 'Você ainda não tem favoritos.' : `Itens (${favorites.length})`}
            </p>
          </div>

          <Separator />

          {favorites.length > 0 ? (
            <>
              <div className="max-h-[300px] overflow-y-auto">
                {recentFavorites.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex gap-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={getProductPath(product)} className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </Link>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-primary">R$ {product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="p-4">
                <Button asChild className="w-full" size="sm" variant="outline">
                  <Link to="/favoritos">Ver todos</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">Salve produtos para revisar depois.</p>
              <Button asChild size="sm">
                <Link to="/loja">Explorar Produtos</Link>
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
