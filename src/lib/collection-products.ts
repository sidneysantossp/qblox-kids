import type { CartItem, Product } from '@/types';

const COLLECTION_CATEGORY_KEY = 'colecionaveis';

function normalizeCategory(value?: string | null) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function isCollectionProduct(product?: Pick<Product, 'category' | 'categories'> | null) {
  if (!product) return false;

  const categories = [product.category, ...(product.categories || [])];
  return categories.some((category) => normalizeCategory(category) === COLLECTION_CATEGORY_KEY);
}

export function hasCollectionItem(cartItems: CartItem[]) {
  return cartItems.some((item) => isCollectionProduct(item.product));
}
