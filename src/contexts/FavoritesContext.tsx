import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Product } from '@/types';

interface FavoritesContextType {
  favorites: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  removeFavorite: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const FAVORITES_STORAGE_KEY = 'favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!savedFavorites) {
      return;
    }

    try {
      const parsedFavorites = JSON.parse(savedFavorites);
      if (Array.isArray(parsedFavorites)) {
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoriteIds = useMemo(() => new Set(favorites.map((product) => product.id)), [favorites]);
  const isFavorite = useCallback((productId: string) => favoriteIds.has(productId), [favoriteIds]);

  const redirectToLogin = useCallback(() => {
    const returnUrl = `${location.pathname}${location.search}${location.hash}`;
    navigate('/login', { state: { returnUrl }, replace: true });
  }, [location.hash, location.pathname, location.search, navigate]);

  const toggleFavorite = useCallback(async (product: Product) => {
    if (!user) {
      redirectToLogin();
      return;
    }

    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((item) => item.id === product.id);
      if (exists) {
        return currentFavorites.filter((item) => item.id !== product.id);
      }
      return [product, ...currentFavorites];
    });
  }, [redirectToLogin, user]);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((currentFavorites) => currentFavorites.filter((item) => item.id !== productId));
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, isFavorite, toggleFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
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
