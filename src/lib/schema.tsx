/**
 * Utilitários para SEO e Schema.org markup
 */

export interface ProductSchema {
  name: string;
  description: string;
  image: string[];
  sku: string;
  brand: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
  rating?: {
    value: number;
    count: number;
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ProductListItem {
  name: string;
  url: string;
  image: string;
  price: number;
  currency: string;
}

/**
 * Gera JSON-LD para Schema.org - Produto
 */
export function generateProductSchema(product: ProductSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability: `https://schema.org/${product.availability}`,
      seller: {
        '@type': 'Organization',
        name: 'QBLOX',
      },
    },
  };

  if (product.rating) {
    Object.assign(schema, {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.value,
        reviewCount: product.rating.count,
      },
    });
  }

  return JSON.stringify(schema);
}

/**
 * Gera JSON-LD para Schema.org - Breadcrumb
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://qblox.com.br${item.url}`,
    })),
  };

  return JSON.stringify(schema);
}

/**
 * Gera JSON-LD para Schema.org - Organization
 */
export function generateOrganizationSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QBLOX',
    url: 'https://qblox.com.br',
    logo: 'https://qblox.com.br/logo.png',
    description: 'Loja especializada em bonecos de montar tipo LEGO para crianças',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
    },
    sameAs: [
      // Adicionar redes sociais quando disponíveis
    ],
  };

  return JSON.stringify(schema);
}

/**
 * Gera JSON-LD para Schema.org - WebSite
 */
export function generateWebsiteSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QBLOX',
    url: 'https://qblox.com.br',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://qblox.com.br/busca?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return JSON.stringify(schema);
}

/**
 * Componente para injetar JSON-LD no head
 */
export function SchemaMarkup({ schema }: { schema: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}

/**
 * Gera JSON-LD para Schema.org - ItemList (para páginas de categoria)
 */
export function generateItemListSchema(
  categoryName: string,
  categoryUrl: string,
  items: ProductListItem[]
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryName,
    url: categoryUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        url: item.url,
        image: item.image,
        offers: {
          '@type': 'Offer',
          price: item.price.toFixed(2),
          priceCurrency: item.currency,
        },
      },
    })),
  };

  return JSON.stringify(schema);
}

/**
 * Gera meta tags para compartilhamento social
 */
export function generateSocialMetaTags(data: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  return {
    'og:title': data.title,
    'og:description': data.description,
    'og:image': data.image,
    'og:url': data.url,
    'twitter:title': data.title,
    'twitter:description': data.description,
    'twitter:image': data.image,
  };
}

/**
 * Valida e sanitiza URL para SEO
 */
export function sanitizeUrl(url: string): string {
  return url
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Gera título otimizado para SEO seguindo padrões específicos
 */
export function generateSEOTitle(parts: string[]): string {
  return [...parts, 'QBLOX'].join(' | ');
}

/**
 * Gera título para produto com preço
 * Formato: "Nome do Produto | R$XX,XX | QBLOX"
 */
export function generateProductTitle(name: string, price: number): string {
  const formattedPrice = `R$${price.toFixed(2).replace('.', ',')}`;
  return `${name} | ${formattedPrice} | QBLOX`;
}

/**
 * Gera título para categoria
 * Formato: "Bonecos de Montar [Categoria] | Coleção [Nome] | QBLOX"
 */
export function generateCategoryTitle(categoryName: string): string {
  return `Bonecos de Montar ${categoryName} | Coleção ${categoryName} | QBLOX`;
}

/**
 * Gera título para homepage
 */
export function generateHomeTitle(): string {
  return 'Bonecos de Montar | Blocos Tipo LEGO com Frete Grátis | QBLOX';
}

/**
 * Trunca descrição para meta tag (máximo 160 caracteres)
 */
export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Gera meta description para produto
 * Formato: Descrição curta + preço + diferencial (150-160 chars)
 */
export function generateProductDescription(
  name: string,
  price: number,
  shortDescription?: string
): string {
  const formattedPrice = `R$${price.toFixed(2).replace('.', ',')}`;
  const base = shortDescription || `Boneco de montar ${name} compatível com LEGO`;
  const withPrice = `${base}. Por apenas ${formattedPrice}`;
  const full = `${withPrice}. Frete grátis acima de R$99. Compre agora!`;
  
  return truncateDescription(full, 160);
}

/**
 * Gera meta description para categoria
 */
export function generateCategoryDescription(categoryName: string, productCount: number): string {
  const desc = `Explore nossa coleção de bonecos de montar ${categoryName} compatíveis com LEGO. ${productCount}+ produtos disponíveis. Frete grátis acima de R$99. Compra segura!`;
  return truncateDescription(desc, 160);
}

/**
 * Gera keywords a partir de texto
 */
export function generateKeywords(text: string, additionalKeywords: string[] = []): string {
  const baseKeywords = [
    'bonecos de montar',
    'lego',
    'blocos de construção',
    'brinquedos infantis',
    'qblox',
  ];
  
  return [...baseKeywords, ...additionalKeywords].join(', ');
}
