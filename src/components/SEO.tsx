import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BRAND_DEFAULT_TITLE, BRAND_NAME, BRAND_BASE_URL } from '@/lib/brand';
import { usePublicSettings } from '@/hooks/use-public-settings';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: string;
  currency?: string;
  availability?: 'in stock' | 'out of stock' | 'preorder';
  canonical?: string;
  noindex?: boolean;
}

/**
 * Componente SEO para gerenciar meta tags dinâmicas
 * Atualiza title, description, Open Graph, Twitter Cards e canonical URLs
 */
export function SEO({
  title,
  description,
  keywords,
  image = 'https://www.qblox.com.br/og-image.jpg',
  url,
  type = 'website',
  price,
  currency = 'BRL',
  availability,
  canonical,
  noindex = false,
}: SEOProps) {
  const location = useLocation();
  const { site_meta_title, site_meta_description } = usePublicSettings();
  const baseUrl = BRAND_BASE_URL;
  const fullUrl = url || `${baseUrl}${location.pathname}`;
  const canonicalUrl = canonical || fullUrl;

  useEffect(() => {
    // Update title
    document.title = title || site_meta_title || BRAND_DEFAULT_TITLE;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description || site_meta_description);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('googlebot', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', BRAND_NAME, true);
    updateMetaTag('og:locale', 'pt_BR', true);

    // Product-specific Open Graph
    if (type === 'product' && price) {
      updateMetaTag('product:price:amount', price, true);
      updateMetaTag('product:price:currency', currency, true);
      if (availability) {
        updateMetaTag('product:availability', availability, true);
      }
    }

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Cleanup function
    return () => {
      // Reset to default title when component unmounts
      document.title = BRAND_DEFAULT_TITLE;
    };
  }, [title, description, keywords, image, fullUrl, canonicalUrl, type, price, currency, availability, noindex]);

  return null;
}

/**
 * Hook para gerar título SEO-friendly
 */
export function useSEOTitle(pageTitle: string): string {
  const siteName = BRAND_NAME;
  return `${pageTitle} | ${siteName}`;
}

/**
 * Gera slug SEO-friendly a partir de texto
 */
export function generateSlug(text: string): string {
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
 * Gera URL de produto SEO-friendly
 */
export function generateProductUrl(productName: string, productId: string): string {
  const slug = generateSlug(productName);
  return `/produto/${slug}-${productId}`;
}

/**
 * Gera URL de categoria SEO-friendly
 */
export function generateCategoryUrl(categoryName: string): string {
  const slug = generateSlug(categoryName);
  return `/categoria/${slug}`;
}

/**
 * Extrai ID do produto de uma URL SEO-friendly
 */
export function extractProductId(url: string): string {
  const match = url.match(/-([a-f0-9-]{36})$/);
  return match ? match[1] : url;
}
