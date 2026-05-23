import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/db/supabase';
import type { Product } from '@/types';

interface FavoritesContextType {
  favorites: Product[];
  favoriteIds: Set<string>;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => Promise<boolean>;
  removeFavorite: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const FAVORITES_STORAGE_KEY = 'favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoriteIds = useMemo(() => new Set(favorites.map((product) => product.id)), [favorites]);
  const isFavorite = (productId: string) => favoriteIds.has(productId);

  const toggleFavorite = async (product: Product) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return false;
    }

    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((item) => item.id === product.id);
      if (exists) {
        return currentFavorites.filter((item) => item.id !== product.id);
      }
      return [product, ...currentFavorites];
    });

    return true;
  };

  const removeFavorite = (productId: string) => {
    setFavorites((currentFavorites) => currentFavorites.filter((item) => item.id !== productId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteIds, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
