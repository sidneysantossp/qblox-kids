import type { Product } from '@/types';

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCategoryPath(categoryOrSlug: string) {
  return `/categoria/${generateSlug(categoryOrSlug)}`;
}

export function getProductPath(product: Pick<Product, 'id' | 'name' | 'slug'>) {
  const slug = product.slug?.trim() || generateSlug(product.name);
  return `/produto/${slug}-${product.id}`;
}

export function getProductCanonicalUrl(product: Pick<Product, 'id' | 'name' | 'slug'>, baseUrl = 'https://www.qblox.com.br') {
  return `${baseUrl}${getProductPath(product)}`;
}

export function getCategoryCanonicalUrl(categoryOrSlug: string, baseUrl = 'https://www.qblox.com.br') {
  return `${baseUrl}${getCategoryPath(categoryOrSlug)}`;
}

export function getPillarPathByCategory(categoryOrSlug: string) {
  const slug = generateSlug(categoryOrSlug);

  if (slug === 'super-herois') return '/bonecos-de-super-herois';
  if (slug === 'roblox') return '/bonecos-de-roblox';
  if (slug === 'series-tv') return '/bonecos-de-series-da-tv';

  return '/bonecos-de-montar';
}

export function getSatelliteGuidePathsByCategory(categoryOrSlug: string) {
  const slug = generateSlug(categoryOrSlug);

  if (slug === 'super-herois') {
    return [
      '/guia/bonecos-de-super-herois-mais-procurados',
      '/guia/bonecos-de-montar-para-presentear',
    ];
  }

  if (slug === 'roblox') {
    return [
      '/guia/como-comecar-uma-colecao-de-roblox',
      '/guia/melhores-bonecos-de-montar-para-iniciantes',
    ];
  }

  if (slug === 'series-tv') {
    return [
      '/guia/como-escolher-bonecos-de-montar-por-idade',
      '/guia/bonecos-de-montar-para-presentear',
    ];
  }

  return [
    '/guia/como-escolher-bonecos-de-montar-por-idade',
    '/guia/melhores-bonecos-de-montar-para-iniciantes',
  ];
}
