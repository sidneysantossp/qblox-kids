import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  name: string;
  slug: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  updated_at: string;
}

/**
 * Gera slug SEO-friendly a partir de texto
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
}

/**
 * Formata data para formato W3C (ISO 8601)
 */
function formatDate(date: string): string {
  return new Date(date).toISOString();
}

/**
 * Gera XML do sitemap
 */
function generateSitemapXML(urls: Array<{
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}>): string {
  const urlEntries = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = 'https://qblox.com.br';
    const urls: Array<{
      loc: string;
      lastmod?: string;
      changefreq?: string;
      priority?: string;
    }> = [];

    // Página inicial
    urls.push({
      loc: baseUrl,
      changefreq: 'daily',
      priority: '1.0',
    });

    // Páginas estáticas
    const staticPages = [
      { path: '/ofertas-especiais', priority: '0.9', changefreq: 'daily' },
      { path: '/blog', priority: '0.8', changefreq: 'weekly' },
      { path: '/loja', priority: '0.8', changefreq: 'weekly' },
      { path: '/quem-somos', priority: '0.6', changefreq: 'monthly' },
      { path: '/central-de-ajuda', priority: '0.6', changefreq: 'monthly' },
      { path: '/politica-de-troca', priority: '0.5', changefreq: 'monthly' },
      { path: '/politica-de-privacidade', priority: '0.5', changefreq: 'monthly' },
      { path: '/termos-de-uso', priority: '0.5', changefreq: 'monthly' },
    ];

    staticPages.forEach(page => {
      urls.push({
        loc: `${baseUrl}${page.path}`,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    // Buscar categorias ativas
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug, updated_at')
      .eq('is_active', true)
      .order('name');

    if (categoriesError) {
      console.error('Erro ao buscar categorias:', categoriesError);
    } else if (categories) {
      categories.forEach((category: Category) => {
        const slug = category.slug || generateSlug(category.name);
        urls.push({
          loc: `${baseUrl}/categoria/${slug}`,
          lastmod: formatDate(category.updated_at),
          changefreq: 'weekly',
          priority: '0.8',
        });
      });
    }

    // Buscar produtos ativos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (productsError) {
      console.error('Erro ao buscar produtos:', productsError);
    } else if (products) {
      products.forEach((product: Product) => {
        const slug = product.slug || generateSlug(product.name);
        urls.push({
          loc: `${baseUrl}/produto/${slug}-${product.id}`,
          lastmod: formatDate(product.updated_at),
          changefreq: 'weekly',
          priority: '0.7',
        });
      });
    }

    // Gerar XML do sitemap
    const sitemapXML = generateSitemapXML(urls);

    // Retornar sitemap com headers corretos
    return new Response(sitemapXML, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
      },
    });

  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
