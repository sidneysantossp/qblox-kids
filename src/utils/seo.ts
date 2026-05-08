// Utilitários para SEO e geração de meta tags

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: 'website' | 'product' | 'article';
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'product';
  noindex?: boolean;
  nofollow?: boolean;
}

export interface ProductSEO {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  sku?: string;
  gtin?: string;
  rating?: {
    value: number;
    count: number;
  };
  reviews?: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Gera título otimizado para SEO
export function generateTitle(pageTitle: string, includeStore = true): string {
  const storeName = 'QBLOX';
  if (includeStore) {
    return `${pageTitle} | ${storeName} - Bonecos de Montar LEGO`;
  }
  return pageTitle;
}

// Gera descrição otimizada
export function generateDescription(content: string, maxLength = 160): string {
  if (content.length <= maxLength) {
    return content;
  }
  return `${content.substring(0, maxLength - 3)}...`;
}

// Gera keywords baseadas no conteúdo
export function generateKeywords(items: string[]): string {
  return items.join(', ');
}

// Gera URL canônica
export function generateCanonicalUrl(path: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}${path}`;
}

// Gera structured data para organização
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QBLOX',
    description: 'Loja especializada em bonecos de montar tipo LEGO para crianças',
    url: window.location.origin,
    logo: `${window.location.origin}/favicon.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Portuguese']
    },
    sameAs: []
  };
}

// Gera structured data para website com search action
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QBLOX',
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${window.location.origin}/busca?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// Gera structured data para produto
export function generateProductSchema(product: ProductSEO) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'QBLOX'
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: window.location.href,
      seller: {
        '@type': 'Organization',
        name: 'QBLOX'
      }
    }
  };

  if (product.sku) {
    schema.sku = product.sku;
  }

  if (product.gtin) {
    schema.gtin = product.gtin;
  }

  if (product.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count
    };
  }

  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished
    }));
  }

  return schema;
}

// Gera structured data para breadcrumb
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// Gera structured data para lista de produtos
export function generateItemListSchema(products: Array<{ name: string; url: string; image: string; price: number }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        url: product.url,
        image: product.image,
        offers: {
          '@type': 'Offer',
          price: product.price.toFixed(2),
          priceCurrency: 'BRL'
        }
      }
    }))
  };
}

// Gera meta tags para Open Graph
export function generateOpenGraphTags(config: SEOConfig) {
  return {
    'og:title': config.title,
    'og:description': config.description,
    'og:type': config.ogType || 'website',
    'og:url': config.ogUrl || window.location.href,
    'og:site_name': 'QBLOX',
    'og:locale': 'pt_BR',
    ...(config.ogImage && { 'og:image': config.ogImage })
  };
}

// Gera meta tags para Twitter Card
export function generateTwitterCardTags(config: SEOConfig) {
  return {
    'twitter:card': config.twitterCard || 'summary_large_image',
    'twitter:title': config.title,
    'twitter:description': config.description,
    ...(config.ogImage && { 'twitter:image': config.ogImage })
  };
}

// Gera robots meta tag
export function generateRobotsTag(noindex = false, nofollow = false): string {
  const directives: string[] = [];
  
  if (noindex) {
    directives.push('noindex');
  } else {
    directives.push('index');
  }
  
  if (nofollow) {
    directives.push('nofollow');
  } else {
    directives.push('follow');
  }
  
  return directives.join(', ');
}

// Formata preço para exibição
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

// Gera slug amigável para URL
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
