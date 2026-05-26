type ProductConversionInput = {
  name: string;
  category?: string | null;
  price: number;
};

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
