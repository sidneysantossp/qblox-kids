type ProductConversionInput = {
  name: string;
  category?: string | null;
  categories?: string[];
  price: number;
};

const COLLECTION_CATEGORY_KEY = 'colecionaveis';

function normalizeCategory(value?: string | null) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function isCollectionProduct(product: Pick<ProductConversionInput, 'category' | 'categories'>) {
  const categories = [product.category, ...(product.categories || [])];
  return categories.some((category) => normalizeCategory(category) === COLLECTION_CATEGORY_KEY);
}

export function getKitQuantity(name: string) {
  const match = name.match(/\b(?:kit|combo|colecao)?\s*(\d{2,3})\s*(?:bonecos?|pecas?|itens?|minifiguras?)\b/i);
  return match ? Number(match[1]) : null;
}

export function getProductCtaLabel(product: Pick<ProductConversionInput, 'name' | 'category'>) {
  const text = `${product.name} ${product.category || ''}`.toLowerCase();
  if (text.includes('kit') || text.includes('combo') || text.includes('colecao')) {
    return 'Comprar kit';
  }

  return 'Adicionar ao carrinho';
}

export function getKitValueMessage(product: ProductConversionInput) {
  if (isCollectionProduct(product)) {
    return {
      headline: 'Comprando a Coleção, cada Boneco sai por R$ 9,90',
      unitPrice: 'Melhor Custo Benefício',
      context: 'Frete Grátis',
    };
  }

  const quantity = getKitQuantity(product.name);
  if (!quantity || quantity < 2) return null;

  const unitPrice = product.price / quantity;
  return {
    quantity,
    headline: `Kit com ${quantity} bonecos`,
    unitPrice: `Sai por R$ ${unitPrice.toFixed(2).replace('.', ',')} cada`,
    context: 'Ideal para presente ou colecao',
  };
}
