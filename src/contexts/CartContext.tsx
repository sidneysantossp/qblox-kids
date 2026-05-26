import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { addToCart as addToCartDB, clearCart as clearCartDB, getCartItems, removeFromCart as removeFromCartDB, updateCartItemQuantity } from '@/db/api';
import { trackAddToCart } from '@/lib/meta-pixel';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';
import type { CartItem, Product } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, options?: { silent?: boolean; skipRefresh?: boolean }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: (showLoader?: boolean) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_SESSION_KEY = 'cart_session_id';

const createAnonymousSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

const getStoredSessionId = () => localStorage.getItem(CART_SESSION_KEY);

const getOrCreateAnonymousSessionId = () => {
  const storedSessionId = getStoredSessionId();
  if (storedSessionId?.startsWith('session_')) {
    return storedSessionId;
  }

  const anonymousSessionId = createAnonymousSessionId();
  localStorage.setItem(CART_SESSION_KEY, anonymousSessionId);
  return anonymousSessionId;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState(() => getStoredSessionId() ?? getOrCreateAnonymousSessionId());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextSessionId = session?.user ? `user_${session.user.id}` : getOrCreateAnonymousSessionId();
      setSessionId((currentSessionId) => (currentSessionId === nextSessionId ? currentSessionId : nextSessionId));
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshCart = async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }
      const items = await getCartItems(sessionId);
      setCartItems(items);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o carrinho',
        variant: 'destructive',
      });
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    refreshCart();
  }, [sessionId]);

  useEffect(() => {
    const syncCartSessionWithUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const userSessionId = `user_${session.user.id}`;
        if (sessionId === userSessionId) return;

        const anonymousItems = await getCartItems(sessionId);
        await Promise.all(
          anonymousItems.map((item) => addToCartDB(userSessionId, item.product_id, item.quantity))
        );

        if (anonymousItems.length > 0) {
          await clearCartDB(sessionId);
        }

        localStorage.setItem('cart_session_id', userSessionId);
        setSessionId(userSessionId);
      } catch (error) {
        console.error('Erro ao sincronizar carrinho com usuário autenticado:', error);
      }
    };

    syncCartSessionWithUser();
  }, [sessionId]);

  const addToCart = async (
    product: Product,
    quantity = 1,
    options?: { silent?: boolean; skipRefresh?: boolean }
  ) => {
    try {
      const result = await addToCartDB(sessionId, product.id, quantity);
      trackAddToCart(product, quantity);

      if (!options?.skipRefresh) {
        await refreshCart();
      }

      if (!options?.silent) {
        toast({
          title: 'Produto adicionado!',
          description: `${product.name} foi adicionado ao carrinho`,
        });
      }

      return result;
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro ao adicionar produto',
        description: `Não foi possível adicionar o produto ao carrinho. ${errorMessage}`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const previousItems = cartItems;

    try {
      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
      await updateCartItemQuantity(itemId, quantity);
      await refreshCart(false);
    } catch (error) {
      setCartItems(previousItems);
      console.error('Erro ao atualizar quantidade:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a quantidade',
        variant: 'destructive',
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeFromCartDB(itemId);
      await refreshCart();
      toast({
        title: 'Produto removido',
        description: 'O produto foi removido do carrinho',
      });
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o produto',
        variant: 'destructive',
      });
    }
  };

  const clearCart = async () => {
    try {
      await clearCartDB(sessionId);
      await refreshCart();
      toast({
        title: 'Carrinho limpo',
        description: 'Todos os produtos foram removidos',
      });
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível limpar o carrinho',
        variant: 'destructive',
      });
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // During React Fast Refresh (HMR), context might be temporarily undefined
    // Check if we're in development and HMR is active
    if (import.meta.hot) {
      console.warn('CartContext is undefined during HMR, using fallback values');
      // Return safe fallback values during HMR
      return {
        cartItems: [],
        cartCount: 0,
        cartTotal: 0,
        isLoading: false,
        addToCart: async () => {},
        updateQuantity: async () => {},
        removeItem: async () => {},
        clearCart: async () => {},
        refreshCart: async () => {},
      };
    }
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
