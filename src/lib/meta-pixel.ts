import type { CartItem, Product } from '@/types';

// Extend Window to include the Meta Pixel fbq function
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Safely call fbq, guarding against SSR and missing pixel script.
 */
function safeFbq(...args: unknown[]): void {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args);
  }
}

function getMetaContentId(product: Pick<Product, 'id' | 'sku'>): string {
  return product.sku || product.id;
}

/**
 * Track when a user views a product page.
 * Meta Pixel event: ViewContent
 */
export function trackViewContent(product: Product): void {
  const contentId = getMetaContentId(product);

  safeFbq('track', 'ViewContent', {
    content_ids: [contentId],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category,
    value: product.price,
    currency: 'BRL',
    availability: product.availability_status === 'in_stock' ? 'in stock' : 'out of stock',
    contents: [
      {
        id: contentId,
        quantity: 1,
        item_price: product.price,
      },
    ],
  });
}

/**
 * Track when a user adds an item to the cart.
 * Meta Pixel event: AddToCart
 */
export function trackAddToCart(product: Product, quantity: number): void {
  const contentId = getMetaContentId(product);

  safeFbq('track', 'AddToCart', {
    content_ids: [contentId],
    content_name: product.name,
    content_type: 'product',
    value: product.price * quantity,
    currency: 'BRL',
    contents: [
      {
        id: contentId,
        quantity,
        item_price: product.price,
      },
    ],
  });
}

/**
 * Track when a user begins the checkout process.
 * Meta Pixel event: InitiateCheckout
 */
export function trackInitiateCheckout(items: CartItem[], totalValue: number): void {
  const contentIds = items.map((item) => item.product ? getMetaContentId(item.product) : item.product_id);
  const contents = items.map((item) => ({
    id: item.product ? getMetaContentId(item.product) : item.product_id,
    quantity: item.quantity,
    item_price: item.product?.price ?? 0,
  }));

  safeFbq('track', 'InitiateCheckout', {
    content_ids: contentIds,
    content_type: 'product',
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    value: totalValue,
    currency: 'BRL',
    contents,
  });
}

/**
 * Track when a purchase completes successfully.
 * Meta Pixel event: Purchase
 */
export function trackPurchase(
  orderId: string,
  totalValue: number,
  items: Array<{ product_id?: string; id?: string; sku?: string | null; quantity: number; price?: number }>
): void {
  const contentIds = items.map((item) => item.sku || item.product_id || item.id || '');
  const contents = items.map((item) => ({
    id: item.sku || item.product_id || item.id || '',
    quantity: item.quantity,
    item_price: item.price ?? 0,
  }));

  safeFbq('track', 'Purchase', {
    content_ids: contentIds,
    content_type: 'product',
    value: totalValue,
    currency: 'BRL',
    order_id: orderId,
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    contents,
  });
}

/**
 * Track when a user performs a search.
 * Meta Pixel event: Search
 */
export function trackSearch(searchQuery: string): void {
  safeFbq('track', 'Search', {
    search_string: searchQuery,
    content_type: 'product',
  });
}

/**
 * Track when a user adds a product to their wishlist/favorites.
 * Meta Pixel event: AddToWishlist
 */
export function trackAddToWishlist(product: Product): void {
  const contentId = getMetaContentId(product);

  safeFbq('track', 'AddToWishlist', {
    content_ids: [contentId],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category,
    value: product.price,
    currency: 'BRL',
  });
}
