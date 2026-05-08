# Arquitetura SEO - Kids Block Store

## 📐 Estrutura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                      index.html                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ • Base Meta Tags                                       │  │
│  │ • Open Graph Base                                      │  │
│  │ • Twitter Card Base                                    │  │
│  │ • Mobile Optimization                                  │  │
│  │ • Theme Color                                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SEO Components Layer                       │ │
│  │                                                         │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │     SEO      │  │ Structured   │  │ Breadcrumb  │ │ │
│  │  │  Component   │  │    Data      │  │  Component  │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  │         │                  │                  │        │ │
│  │         └──────────────────┴──────────────────┘        │ │
│  │                            │                            │ │
│  │                            ▼                            │ │
│  │                  react-helmet-async                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 Utils Layer                             │ │
│  │                                                         │ │
│  │  ┌──────────────────────┐  ┌──────────────────────┐  │ │
│  │  │    seo.ts            │  │    sitemap.ts        │  │ │
│  │  │                      │  │                      │  │ │
│  │  │ • generateTitle()    │  │ • generateSitemap()  │  │ │
│  │  │ • generateDesc()     │  │ • downloadSitemap()  │  │ │
│  │  │ • generateKeywords() │  │ • getUrls()          │  │ │
│  │  │ • generateSchemas()  │  │                      │  │ │
│  │  │ • formatPrice()      │  │                      │  │ │
│  │  │ • generateSlug()     │  │                      │  │ │
│  │  └──────────────────────┘  └──────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Pages Layer                           │ │
│  │                                                         │ │
│  │  HomePage          ProductDetailPage    CategoryPage   │ │
│  │  • Organization    • Product Schema     • ItemList     │ │
│  │  • WebSite         • Breadcrumb         • SEO Tags     │ │
│  │  • ItemList        • SEO Tags           • Canonical    │ │
│  │                                                         │ │
│  │  SearchPage        CartPage             CheckoutPage   │ │
│  │  • ItemList        • noindex            • noindex      │ │
│  │  • noindex         • nofollow           • nofollow     │ │
│  │  • SEO Tags        • SEO Tags           • SEO Tags     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Technical SEO                             │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  robots.txt  │  │ sitemap.xml  │  │  Canonical   │     │
│  │              │  │              │  │     URLs     │     │
│  │ • Allow /    │  │ • Static     │  │              │     │
│  │ • Disallow   │  │ • Categories │  │ • All pages  │     │
│  │   /admin/    │  │ • Products   │  │ • Unique     │     │
│  │ • Sitemap    │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados SEO

```
┌─────────────┐
│   Página    │
│   Carrega   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Componente da Página               │
│  (HomePage, ProductDetailPage, etc) │
└──────┬──────────────────────────────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌─────────────────┐            ┌──────────────────┐
│  Gera Config    │            │  Gera Schemas    │
│  SEO            │            │  (JSON-LD)       │
│                 │            │                  │
│ • title         │            │ • Organization   │
│ • description   │            │ • Product        │
│ • keywords      │            │ • ItemList       │
│ • canonical     │            │ • Breadcrumb     │
│ • ogTags        │            │                  │
└────────┬────────┘            └────────┬─────────┘
         │                              │
         ▼                              ▼
    ┌────────────────────────────────────────┐
    │      SEO Component                     │
    │      StructuredData Component          │
    └────────┬───────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │      react-helmet-async                │
    │      (Gerencia <head>)                 │
    └────────┬───────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │      HTML <head> Atualizado            │
    │                                         │
    │  <title>...</title>                    │
    │  <meta name="description" ...>         │
    │  <meta property="og:..." ...>          │
    │  <script type="application/ld+json">   │
    │    { "@context": "schema.org", ... }   │
    │  </script>                             │
    └────────────────────────────────────────┘
```

## 📊 Schema.org Hierarchy

```
Organization Schema (Global)
    │
    ├─── WebSite Schema (HomePage)
    │       │
    │       └─── SearchAction (Busca do Google)
    │
    ├─── Product Schema (ProductDetailPage)
    │       │
    │       ├─── Offer
    │       │     ├─── price
    │       │     ├─── priceCurrency
    │       │     └─── availability
    │       │
    │       ├─── AggregateRating (se disponível)
    │       │     ├─── ratingValue
    │       │     └─── reviewCount
    │       │
    │       └─── Review[] (se disponível)
    │             ├─── author
    │             ├─── reviewRating
    │             └─── reviewBody
    │
    ├─── ItemList Schema (Listagens)
    │       │
    │       └─── ListItem[]
    │             ├─── position
    │             └─── item (Product)
    │                   ├─── name
    │                   ├─── url
    │                   ├─── image
    │                   └─── offers
    │
    └─── BreadcrumbList Schema (Navegação)
            │
            └─── ListItem[]
                  ├─── position
                  ├─── name
                  └─── item (URL)
```

## 🎯 SEO por Tipo de Página

```
┌──────────────────────────────────────────────────────────────┐
│                        HomePage                               │
├──────────────────────────────────────────────────────────────┤
│ Meta Tags:                                                    │
│ • Title: "Kids Block Store - Bonecos de Montar LEGO..."     │
│ • Description: Completa com call-to-action                   │
│ • Keywords: 14 termos relevantes                             │
│ • Canonical: https://site.com/                               │
│                                                               │
│ Structured Data:                                             │
│ • Organization Schema                                        │
│ • WebSite Schema (com SearchAction)                         │
│ • ItemList Schema (produtos em destaque)                    │
│                                                               │
│ Social:                                                       │
│ • Open Graph: type="website"                                 │
│ • Twitter Card: summary_large_image                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   ProductDetailPage                           │
├──────────────────────────────────────────────────────────────┤
│ Meta Tags:                                                    │
│ • Title: "[Nome do Produto] | Kids Block Store"             │
│ • Description: Gerada do produto                             │
│ • Keywords: Produto + categoria + termos gerais              │
│ • Canonical: https://site.com/produto/[id]                   │
│                                                               │
│ Structured Data:                                             │
│ • Product Schema (completo)                                  │
│   - Nome, descrição, imagem                                  │
│   - Preço, moeda, disponibilidade                           │
│   - Brand, SKU                                               │
│   - Rating (se disponível)                                   │
│                                                               │
│ Social:                                                       │
│ • Open Graph: type="product"                                 │
│ • OG Image: Imagem do produto                                │
│ • Twitter Card: summary_large_image                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     CategoryPage                              │
├──────────────────────────────────────────────────────────────┤
│ Meta Tags:                                                    │
│ • Title: "[Categoria] - Bonecos de Montar LEGO"            │
│ • Description: Personalizada por categoria                   │
│ • Keywords: Categoria + termos gerais                        │
│ • Canonical: https://site.com/categoria/[slug]               │
│                                                               │
│ Structured Data:                                             │
│ • ItemList Schema (produtos da categoria)                   │
│                                                               │
│ Social:                                                       │
│ • Open Graph: type="website"                                 │
│ • Twitter Card: summary_large_image                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      SearchPage                               │
├──────────────────────────────────────────────────────────────┤
│ Meta Tags:                                                    │
│ • Title: "Busca: [query] | Kids Block Store"                │
│ • Description: Dinâmica com termo de busca                   │
│ • Keywords: Query + termos gerais                            │
│ • Canonical: https://site.com/busca?q=[query]                │
│ • Robots: noindex (não indexar páginas de busca)            │
│                                                               │
│ Structured Data:                                             │
│ • ItemList Schema (resultados da busca)                     │
│                                                               │
│ Social:                                                       │
│ • Open Graph: type="website"                                 │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    CartPage / CheckoutPage                    │
├──────────────────────────────────────────────────────────────┤
│ Meta Tags:                                                    │
│ • Title: "Carrinho de Compras | Kids Block Store"           │
│ • Description: Básica                                        │
│ • Canonical: https://site.com/carrinho                       │
│ • Robots: noindex, nofollow (não indexar)                   │
│                                                               │
│ Structured Data:                                             │
│ • Nenhum (páginas privadas)                                  │
│                                                               │
│ Social:                                                       │
│ • Mínimo necessário                                          │
└──────────────────────────────────────────────────────────────┘
```

## 🔍 Validação e Testes

```
┌─────────────────────────────────────────────────────────────┐
│                   Ferramentas de Validação                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Google Rich Results Test                                │
│     https://search.google.com/test/rich-results             │
│     ✓ Testa structured data                                 │
│     ✓ Visualiza rich snippets                               │
│                                                              │
│  2. Schema.org Validator                                    │
│     https://validator.schema.org/                           │
│     ✓ Valida JSON-LD                                        │
│     ✓ Verifica conformidade                                 │
│                                                              │
│  3. Facebook Sharing Debugger                               │
│     https://developers.facebook.com/tools/debug/            │
│     ✓ Testa Open Graph                                      │
│     ✓ Limpa cache                                           │
│                                                              │
│  4. Twitter Card Validator                                  │
│     https://cards-dev.twitter.com/validator                 │
│     ✓ Testa Twitter Cards                                   │
│     ✓ Visualiza preview                                     │
│                                                              │
│  5. Lighthouse (Chrome DevTools)                            │
│     ✓ Auditoria de SEO                                      │
│     ✓ Performance                                           │
│     ✓ Acessibilidade                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📈 Benefícios Esperados

```
┌─────────────────────────────────────────────────────────────┐
│                    Melhorias de SEO                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Indexação                                                   │
│  ├─ ✓ Melhor compreensão do conteúdo pelos buscadores       │
│  ├─ ✓ Indexação mais rápida de novas páginas                │
│  └─ ✓ Evita conteúdo duplicado (canonical URLs)             │
│                                                              │
│  Rich Snippets                                               │
│  ├─ ✓ Produtos aparecem com preço e disponibilidade         │
│  ├─ ✓ Breadcrumbs nos resultados de busca                   │
│  ├─ ✓ Rating de produtos (quando disponível)                │
│  └─ ✓ Search box direto no Google                           │
│                                                              │
│  Social Media                                                │
│  ├─ ✓ Cards bonitos ao compartilhar                         │
│  ├─ ✓ Imagens otimizadas                                    │
│  └─ ✓ Descrições atraentes                                  │
│                                                              │
│  Mobile                                                      │
│  ├─ ✓ Otimizado para dispositivos móveis                    │
│  ├─ ✓ Theme color personalizado                             │
│  └─ ✓ Apple mobile web app support                          │
│                                                              │
│  E-commerce                                                  │
│  ├─ ✓ Produtos aparecem em Google Shopping                  │
│  ├─ ✓ Informações de preço e estoque                        │
│  └─ ✓ Melhor conversão de busca orgânica                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🎓 Recursos e Documentação

```
Documentação Oficial:
├─ Google Search Central: https://developers.google.com/search
├─ Schema.org: https://schema.org/
├─ Open Graph Protocol: https://ogp.me/
└─ Twitter Cards: https://developer.twitter.com/cards

Guias do Projeto:
├─ SEO_GUIDE.md: Documentação completa
├─ SEO_SUMMARY.md: Resumo da implementação
├─ SEO_QUICK_GUIDE.md: Guia rápido de uso
└─ SEO_ARCHITECTURE.md: Este arquivo

Ferramentas:
├─ Google Search Console
├─ Google Analytics
├─ Screaming Frog SEO Spider
└─ Ahrefs / SEMrush
```

---

**Última atualização:** 2025-12-22
**Versão:** 1.0.0
