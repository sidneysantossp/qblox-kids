import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  rich_description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  categories: string[];
  image_url: string;
  images: string[];
  stock: number;
  availability_status: 'in_stock' | 'made_to_order' | 'unavailable';
  is_on_sale: boolean;
  sku: string | null;
  age_recommendation: string | null;
  material: string | null;
  weight: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Gera slug SEO-friendly a partir de texto
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Mapeia availability_status para o formato da Meta
 * @see https://developers.facebook.com/docs/commerce-platform/catalog/fields
 */
function mapAvailability(status: string, stock: number): string {
  if (stock <= 0 && status !== 'made_to_order') return 'out of stock';
  switch (status) {
    case 'in_stock': return 'in stock';
    case 'made_to_order': return 'available for order';
    case 'unavailable': return 'out of stock';
    default: return 'in stock';
  }
}

/**
 * Mapeia condition para o formato da Meta
 */
function mapCondition(): string {
  return 'new';
}

/**
 * Limpa texto para uso em campos CSV (remove quebras de linha e aspas extras)
 */
function cleanText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

/**
 * Escapa campo CSV (envolve com aspas e escapa aspas internas)
 */
function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Gera a URL do produto no site
 */
function getProductUrl(product: Product): string {
  const baseUrl = 'https://www.qblox.com.br';
  const slug = product.slug || generateSlug(product.name);
  return `${baseUrl}/produto/${slug}-${product.id}`;
}

/**
 * Gera o feed CSV no formato exigido pela Meta/Facebook
 * @see https://developers.facebook.com/docs/commerce-platform/catalog/fields
 * 
 * Campos obrigatórios:
 * - id, title, description, availability, condition, price, link, image_link, brand
 * 
 * Campos opcionais relevantes:
 * - sale_price, additional_image_link, product_type, google_product_category, age_group
 */
function generateCSVFeed(products: Product[]): string {
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'sale_price',
    'link',
    'image_link',
    'additional_image_link',
    'brand',
    'product_type',
    'google_product_category',
    'age_group',
    'material',
    'item_group_id',
    'custom_label_0',
    'custom_label_1',
    'custom_label_2',
    'inventory',
  ];

  const rows = products.map((product) => {
    const availability = mapAvailability(product.availability_status, product.stock);
    const condition = mapCondition();
    const price = `${product.price.toFixed(2)} BRL`;
    const salePrice = product.is_on_sale && product.original_price && product.original_price > product.price
      ? `${product.price.toFixed(2)} BRL`
      : '';
    const displayPrice = product.is_on_sale && product.original_price && product.original_price > product.price
      ? `${product.original_price.toFixed(2)} BRL`
      : price;
    const link = getProductUrl(product);
    const imageLink = product.image_url;
    const additionalImages = (product.images || [])
      .filter((img) => img && img !== product.image_url)
      .slice(0, 10)
      .join(',');

    const description = cleanText(product.description || product.rich_description || product.name);
    const productType = product.categories?.length > 0
      ? product.categories.join(' > ')
      : product.category;

    // Google Product Category para brinquedos de construção
    const googleCategory = '3793'; // Toys & Games > Building Toys

    const ageGroup = product.age_recommendation || 'kids';

    // Custom labels para segmentação de anúncios
    const customLabel0 = product.category; // Categoria principal
    const customLabel1 = product.is_on_sale ? 'em_promocao' : 'preco_normal';
    const customLabel2 = product.stock > 10 ? 'estoque_alto' : product.stock > 0 ? 'estoque_baixo' : 'sem_estoque';

    return [
      csvEscape(product.sku || product.id),
      csvEscape(product.name),
      csvEscape(description.slice(0, 5000)),
      csvEscape(availability),
      csvEscape(condition),
      csvEscape(salePrice ? displayPrice : price),
      csvEscape(salePrice),
      csvEscape(link),
      csvEscape(imageLink),
      csvEscape(additionalImages),
      csvEscape('QBLOX'),
      csvEscape(productType),
      csvEscape(googleCategory),
      csvEscape(ageGroup),
      csvEscape(cleanText(product.material) || 'Plástico ABS'),
      csvEscape(product.category),
      csvEscape(customLabel0),
      csvEscape(customLabel1),
      csvEscape(customLabel2),
      csvEscape(String(product.stock)),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Gera o feed XML (RSS/Atom) no formato exigido pela Meta/Facebook
 */
function generateXMLFeed(products: Product[]): string {
  const items = products.map((product) => {
    const availability = mapAvailability(product.availability_status, product.stock);
    const price = `${product.price.toFixed(2)} BRL`;
    const link = getProductUrl(product);
    const description = cleanText(product.description || product.rich_description || product.name);

    const salePrice = product.is_on_sale && product.original_price && product.original_price > product.price
      ? `<g:sale_price>${product.price.toFixed(2)} BRL</g:sale_price>\n      <g:price>${product.original_price.toFixed(2)} BRL</g:price>`
      : `<g:price>${price}</g:price>`;

    const additionalImages = (product.images || [])
      .filter((img) => img && img !== product.image_url)
      .slice(0, 10)
      .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
      .join('\n');

    return `    <item>
      <g:id>${escapeXml(product.sku || product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(description.slice(0, 5000))}</g:description>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      ${salePrice}
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(product.image_url)}</g:image_link>
${additionalImages}
      <g:brand>QBLOX</g:brand>
      <g:product_type>${escapeXml(product.category)}</g:product_type>
      <g:google_product_category>3793</g:google_product_category>
      <g:age_group>${escapeXml(product.age_recommendation || 'kids')}</g:age_group>
      <g:material>${escapeXml(cleanText(product.material) || 'Plástico ABS')}</g:material>
      <g:inventory>${product.stock}</g:inventory>
      <g:custom_label_0>${escapeXml(product.category)}</g:custom_label_0>
      <g:custom_label_1>${product.is_on_sale ? 'em_promocao' : 'preco_normal'}</g:custom_label_1>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>QBLOX KIDS - Catálogo de Produtos</title>
    <link>https://www.qblox.com.br</link>
    <description>Bonecos de montar tipo LEGO para crianças - Super Heróis, Roblox, Séries da TV e muito mais!</description>
${items}
  </channel>
</rss>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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

    // Determinar formato do feed (csv ou xml) via query parameter
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'csv';

    // Buscar todos os produtos ativos
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        rich_description,
        price,
        original_price,
        category,
        categories,
        image_url,
        images,
        stock,
        availability_status,
        is_on_sale,
        sku,
        age_recommendation,
        material,
        weight,
        created_at,
        updated_at
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar produtos', details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nenhum produto encontrado' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Gerar feed no formato solicitado
    if (format === 'xml') {
      const xmlFeed = generateXMLFeed(products as Product[]);
      return new Response(xmlFeed, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
          'Content-Disposition': 'inline; filename="facebook-product-feed.xml"',
        },
      });
    }

    // Formato padrão: CSV
    const csvFeed = generateCSVFeed(products as Product[]);
    return new Response(csvFeed, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
        'Content-Disposition': 'inline; filename="facebook-product-feed.csv"',
      },
    });

  } catch (error) {
    console.error('Erro ao gerar feed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
