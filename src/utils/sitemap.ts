// Utilitário para gerar sitemap.xml dinamicamente

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Gera XML do sitemap
 */
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlEntries = urls.map(url => {
    return `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Escapa caracteres especiais XML
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Gera URLs do sitemap para páginas estáticas
 */
export function getStaticSitemapUrls(baseUrl: string): SitemapUrl[] {
  const now = new Date().toISOString().split('T')[0];
  
  return [
    {
      loc: baseUrl,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/busca`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    }
  ];
}

/**
 * Gera URLs do sitemap para categorias
 */
export function getCategorySitemapUrls(
  baseUrl: string,
  categories: Array<{ id: string; slug: string; updated_at?: string }>
): SitemapUrl[] {
  return categories.map(category => ({
    loc: `${baseUrl}/categoria/${category.slug}`,
    lastmod: category.updated_at ? new Date(category.updated_at).toISOString().split('T')[0] : undefined,
    changefreq: 'weekly' as const,
    priority: 0.9
  }));
}

/**
 * Gera URLs do sitemap para produtos
 */
export function getProductSitemapUrls(
  baseUrl: string,
  products: Array<{ id: string; slug: string; updated_at?: string }>
): SitemapUrl[] {
  return products.map(product => ({
    loc: `${baseUrl}/produto/${product.slug}`,
    lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : undefined,
    changefreq: 'weekly' as const,
    priority: 0.8
  }));
}

/**
 * Gera sitemap completo
 */
export async function generateCompleteSitemap(
  baseUrl: string,
  categories: Array<{ id: string; slug: string; updated_at?: string }>,
  products: Array<{ id: string; slug: string; updated_at?: string }>
): Promise<string> {
  const staticUrls = getStaticSitemapUrls(baseUrl);
  const categoryUrls = getCategorySitemapUrls(baseUrl, categories);
  const productUrls = getProductSitemapUrls(baseUrl, products);
  
  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];
  
  return generateSitemapXML(allUrls);
}

/**
 * Hook para baixar sitemap
 */
export function downloadSitemap(xml: string, filename = 'sitemap.xml') {
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
