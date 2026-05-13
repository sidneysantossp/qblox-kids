import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { addToCart as addToCartDB, clearCart as clearCartDB, getCartItems, removeFromCart as removeFromCartDB, updateCartItemQuantity } from '@/db/api';
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
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Gerar ou recuperar session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const sessionId = getSessionId();

  const refreshCart = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (
    product: Product,
    quantity = 1,
    options?: { silent?: boolean; skipRefresh?: boolean }
  ) => {
    try {
      const result = await addToCartDB(sessionId, product.id, quantity);

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
    try {
      await updateCartItemQuantity(itemId, quantity);
      await refreshCart();
    } catch (error) {
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
      };
    }
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
