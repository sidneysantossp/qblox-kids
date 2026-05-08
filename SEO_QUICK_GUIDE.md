# Guia Rápido de Uso - Componentes SEO

## 🚀 Como Adicionar SEO em Novas Páginas

### 1. Importar Componentes

```tsx
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { 
  generateTitle, 
  generateDescription, 
  generateKeywords,
  generateCanonicalUrl
} from '@/utils/seo';
```

### 2. Configurar SEO Básico

```tsx
export default function MinhaPage() {
  return (
    <>
      <SEO
        title={generateTitle('Título da Página')}
        description={generateDescription('Descrição da página com até 160 caracteres')}
        keywords={generateKeywords(['palavra1', 'palavra2', 'palavra3'])}
        canonical={generateCanonicalUrl('/minha-pagina')}
      />
      
      <div>
        {/* Conteúdo da página */}
      </div>
    </>
  );
}
```

### 3. Adicionar Dados Estruturados

#### Para Produtos

```tsx
import { generateProductSchema, type ProductSEO } from '@/utils/seo';

const productSEO: ProductSEO = {
  name: product.name,
  description: product.description,
  image: product.image_url,
  price: product.price,
  currency: 'BRL',
  availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
  brand: 'Kids Block Store',
  sku: product.id,
  rating: product.rating ? {
    value: product.rating,
    count: product.reviews_count
  } : undefined
};

const productSchema = generateProductSchema(productSEO);

<SEO {...seoConfig}>
  <StructuredData data={productSchema} />
</SEO>
```

#### Para Listas de Produtos

```tsx
import { generateItemListSchema } from '@/utils/seo';

const itemListSchema = generateItemListSchema(
  products.map(product => ({
    name: product.name,
    url: `${window.location.origin}/produto/${product.id}`,
    image: product.image_url,
    price: product.price
  }))
);

<SEO {...seoConfig}>
  <StructuredData data={itemListSchema} />
</SEO>
```

#### Para Breadcrumbs

```tsx
import Breadcrumb from '@/components/Breadcrumb';

<Breadcrumb 
  items={[
    { name: 'Categoria', url: '/categoria/super-herois' },
    { name: 'Produto', url: '/produto/123' }
  ]} 
/>
```

### 4. Configurações Especiais

#### Página que NÃO deve ser indexada

```tsx
<SEO
  title={generateTitle('Carrinho')}
  description={generateDescription('Seu carrinho de compras')}
  canonical={generateCanonicalUrl('/carrinho')}
  noindex={true}
  nofollow={true}
/>
```

#### Página de Produto (Open Graph)

```tsx
<SEO
  title={generateTitle(product.name)}
  description={generateDescription(product.description)}
  canonical={generateCanonicalUrl(`/produto/${product.id}`)}
  ogType="product"
  ogImage={product.image_url}
  twitterCard="summary_large_image"
>
  <StructuredData data={productSchema} />
</SEO>
```

#### Múltiplos Schemas

```tsx
const organizationSchema = generateOrganizationSchema();
const websiteSchema = generateWebSiteSchema();
const productSchema = generateProductSchema(productSEO);

<SEO {...seoConfig}>
  <StructuredData data={[organizationSchema, websiteSchema, productSchema]} />
</SEO>
```

## 📋 Checklist para Nova Página

- [ ] Importar componentes SEO
- [ ] Definir title único (50-60 caracteres)
- [ ] Definir description única (150-160 caracteres)
- [ ] Definir keywords relevantes (5-10 palavras)
- [ ] Definir canonical URL
- [ ] Adicionar Open Graph tags (se necessário)
- [ ] Adicionar structured data (se aplicável)
- [ ] Configurar noindex/nofollow (se necessário)
- [ ] Testar com Google Rich Results Test
- [ ] Validar com Schema.org Validator

## 🎯 Exemplos por Tipo de Página

### Página Institucional (Sobre, Contato)

```tsx
<SEO
  title={generateTitle('Sobre Nós')}
  description={generateDescription('Conheça a Kids Block Store, especializada em bonecos de montar tipo LEGO')}
  keywords={generateKeywords(['sobre', 'kids block store', 'empresa', 'história'])}
  canonical={generateCanonicalUrl('/sobre')}
/>
```

### Página de Blog

```tsx
<SEO
  title={generateTitle(post.title)}
  description={generateDescription(post.excerpt)}
  keywords={generateKeywords(post.tags)}
  canonical={generateCanonicalUrl(`/blog/${post.slug}`)}
  ogType="article"
  ogImage={post.featured_image}
/>
```

### Página de Categoria

```tsx
<SEO
  title={generateTitle(`${category.name} - Bonecos de Montar`)}
  description={generateDescription(category.description)}
  keywords={generateKeywords([category.name, 'bonecos', 'lego', 'kids block store'])}
  canonical={generateCanonicalUrl(`/categoria/${category.slug}`)}
>
  {products.length > 0 && (
    <StructuredData data={generateItemListSchema(products)} />
  )}
</SEO>
```

### Página de Busca

```tsx
<SEO
  title={generateTitle(`Busca: ${query}`)}
  description={generateDescription(`Resultados da busca por "${query}"`)}
  keywords={generateKeywords([query, 'busca', 'produtos'])}
  canonical={generateCanonicalUrl(`/busca?q=${query}`)}
  noindex={true}
>
  {results.length > 0 && (
    <StructuredData data={generateItemListSchema(results)} />
  )}
</SEO>
```

## 🔧 Funções Utilitárias

### generateTitle(title, includeStore?)
Gera título otimizado com nome da loja.

```tsx
generateTitle('Produtos') 
// → "Produtos | Kids Block Store - Bonecos de Montar LEGO"

generateTitle('Produtos', false) 
// → "Produtos"
```

### generateDescription(content, maxLength?)
Gera descrição com limite de caracteres.

```tsx
generateDescription('Texto muito longo...', 160)
// → "Texto muito longo... (truncado em 160 caracteres)"
```

### generateKeywords(items)
Gera string de keywords separadas por vírgula.

```tsx
generateKeywords(['lego', 'bonecos', 'super heróis'])
// → "lego, bonecos, super heróis"
```

### generateCanonicalUrl(path)
Gera URL canônica completa.

```tsx
generateCanonicalUrl('/produto/123')
// → "https://seusite.com/produto/123"
```

### generateSlug(text)
Gera slug amigável para URL.

```tsx
generateSlug('Super Heróis da Marvel')
// → "super-herois-da-marvel"
```

### formatPrice(price)
Formata preço em BRL.

```tsx
formatPrice(99.90)
// → "R$ 99,90"
```

## 🎨 Schemas Disponíveis

### Organization
```tsx
const schema = generateOrganizationSchema();
```

### WebSite (com SearchAction)
```tsx
const schema = generateWebSiteSchema();
```

### Product
```tsx
const schema = generateProductSchema(productSEO);
```

### BreadcrumbList
```tsx
const schema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Categoria', url: '/categoria' }
]);
```

### ItemList
```tsx
const schema = generateItemListSchema(products);
```

## 🧪 Validação

### 1. Google Rich Results Test
```
https://search.google.com/test/rich-results
```
Cole a URL da página para testar.

### 2. Schema.org Validator
```
https://validator.schema.org/
```
Cole o JSON-LD para validar.

### 3. Facebook Debugger
```
https://developers.facebook.com/tools/debug/
```
Teste Open Graph tags.

### 4. Twitter Card Validator
```
https://cards-dev.twitter.com/validator
```
Teste Twitter Cards.

## ⚠️ Boas Práticas

### DO ✅
- Use títulos únicos para cada página
- Mantenha descriptions entre 150-160 caracteres
- Use keywords relevantes (5-10 por página)
- Sempre defina canonical URL
- Adicione structured data quando aplicável
- Use noindex em páginas privadas/temporárias

### DON'T ❌
- Não repita o mesmo title em múltiplas páginas
- Não use descriptions muito curtas (<50 caracteres)
- Não abuse de keywords (keyword stuffing)
- Não esqueça de testar com ferramentas de validação
- Não indexe páginas de checkout/carrinho
- Não use structured data incorreto

## 📚 Recursos

- [SEO_GUIDE.md](./SEO_GUIDE.md) - Guia completo
- [SEO_SUMMARY.md](./SEO_SUMMARY.md) - Resumo da implementação
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)

---

**Última atualização:** 2025-12-22
