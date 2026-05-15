import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import { SEO } from '@/components/SEO';
import { ArticleShareButtons } from '@/components/content/ArticleShareButtons';
import { AuthorSignature } from '@/components/content/AuthorSignature';
import { GuideRelatedPostsCarousel } from '@/components/content/GuideRelatedPostsCarousel';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SchemaMarkup, generateArticleSchema, generateFAQSchema } from '@/lib/schema';
import { QBLOX_AUTHOR_NAME, QBLOX_AUTHOR_PAGE_PATH, QBLOX_AUTHOR_PAGE_URL } from '@/lib/authors';
import { getPillarPathByCategory, getProductPath } from '@/lib/urls';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getBlogPostBySlug, getBestsellerProducts, getFeaturedProducts, getRelatedBlogPosts, getTvSeriesProducts } from '@/db/api';
import type { BlogPost, FAQItem } from '@/types';

const BLOG_FAQ_BY_SLUG: Record<string, FAQItem[]> = {
  'bonecos-de-montar-como-escolher': [
    { question: 'Como escolher bonecos de montar sem errar na primeira compra?', answer: 'O melhor caminho é cruzar faixa etária, tema, intenção de presente e profundidade da categoria antes de abrir produtos específicos.' },
    { question: 'Tema importa mais do que idade?', answer: 'Depende do contexto. Idade ajuda a organizar a busca, mas tema costuma definir melhor a aderência do produto ao perfil de quem vai receber.' },
    { question: 'Como saber se um produto vale a pena para presentear?', answer: 'Vale observar clareza visual, força do personagem, categoria relacionada, apelo de presente e possibilidade de aprofundar a navegação.' },
    { question: 'Compatibilidade pesa muito nessa decisão?', answer: 'Sim. Compatibilidade amplia a sensação de continuidade e ajuda tanto na brincadeira quanto em coleções futuras.' },
    { question: 'Quais categorias costumam ser mais fáceis para começar?', answer: 'Super Heróis, Roblox e Séries da TV costumam funcionar muito bem como portas de entrada por causa do reconhecimento visual.' },
    { question: 'Vale ir direto para produtos ou começar por páginas pilar?', answer: 'Para quem ainda está em dúvida, começar pelas páginas pilar tende a reduzir ruído e melhorar muito a comparação.' },
    { question: 'Quando a qualidade do material entra como fator principal?', answer: 'Ela pesa mais quando o usuário já filtrou tema e intenção de compra e quer validar se o produto sustenta a expectativa criada pela navegação.' },
    { question: 'Esse tipo de artigo ajuda mais em SEO ou em compra?', answer: 'Ele precisa ajudar nos dois: responder a intenção de busca e conduzir o usuário para categorias, guias e produtos com mais contexto.' },
  ],
  'ninjago-sucesso-criancas-colecionadores': [
    { question: 'Por que Ninjago chama tanta atenção logo no primeiro olhar?', answer: 'Porque combina ação, identidade visual forte, acessórios marcantes e um universo que facilita tanto presente quanto coleção.' },
    { question: 'Ninjago funciona melhor para brincar ou colecionar?', answer: 'Funciona muito bem nos dois contextos, com mais força em brincadeira visual para crianças e coerência temática para colecionadores.' },
    { question: 'Esse tema é bom para presentear?', answer: 'Sim, principalmente quando a compra depende de impacto visual, energia temática e reconhecimento rápido do universo ninja.' },
    { question: 'O que observar antes de abrir um produto de Ninjago?', answer: 'Vale olhar variedade de personagem, qualidade dos acessórios, contexto da categoria e potencial de continuidade da coleção.' },
    { question: 'Ninjago tem boa profundidade de coleção?', answer: 'Sim. É um dos pontos fortes do tema, porque ele permite organizar personagens, grupos e variações com bastante consistência visual.' },
    { question: 'Vale comparar Ninjago com outros temas antes de decidir?', answer: 'Sim, especialmente se o usuário ainda não sabe se prefere heróis, universo gamer ou séries. O comparativo ajuda a refinar a escolha.' },
    { question: 'Quem tende a gostar mais desse tema?', answer: 'Perfis que valorizam ação, personagens marcantes, visual de combate e sensação de aventura contínua.' },
    { question: 'Popularidade do tema ajuda a compra?', answer: 'Ajuda porque reduz incerteza e aumenta a percepção de que aquele universo já se provou forte para presente e coleção.' },
  ],
  'beneficios-bonecos-de-montar-para-criancas': [
    { question: 'Bonecos de montar realmente ajudam no desenvolvimento infantil?', answer: 'Sim. Eles contribuem para criatividade, imaginação, coordenação motora, foco e construção de histórias.' },
    { question: 'Esses benefícios valem para qualquer tema?', answer: 'O benefício estrutural existe em vários temas, mas o engajamento tende a crescer quando o personagem conversa com o repertório da criança.' },
    { question: 'Brincar e colecionar podem coexistir?', answer: 'Podem, e isso costuma aumentar o valor percebido do produto com o tempo.' },
    { question: 'Coordenação motora é um benefício relevante nesse tipo de brinquedo?', answer: 'Sim, porque manipular peças, acessórios e combinações estimula controle fino e atenção aos detalhes.' },
    { question: 'Esses produtos funcionam bem para brincar em grupo?', answer: 'Sim. Em interações com irmãos, amigos e familiares, eles ajudam muito em cooperação e construção de histórias coletivas.' },
    { question: 'Como aproveitar melhor a experiência?', answer: 'Escolhendo um tema de alta aderência, incentivando histórias e conectando o produto com outros conteúdos da loja.' },
    { question: 'Vale cruzar esse artigo com guia por idade?', answer: 'Sim, porque idade ajuda a entender quando determinado benefício ou tipo de uso tende a aparecer com mais força.' },
    { question: 'Esse tipo de conteúdo deve levar a produto ou categoria?', answer: 'Idealmente aos dois: categoria para contexto e produto para validação prática da decisão.' },
  ],
  'bonecos-de-montar-ninjago-guia-para-comecar': [
    { question: 'Por onde começar uma coleção de Ninjago?', answer: 'O melhor caminho é começar por personagens fortes, depois organizar o tema e validar produtos com mais potencial de continuidade.' },
    { question: 'Vale escolher por personagem ou por grupo temático?', answer: 'Os dois caminhos funcionam, mas grupos temáticos ajudam mais quando a intenção é formar uma coleção coerente.' },
    { question: 'Exibição importa desde o início?', answer: 'Sim. Pensar visualmente na coleção desde o começo costuma melhorar a qualidade da escolha dos primeiros itens.' },
    { question: 'Compatibilidade pesa nessa decisão?', answer: 'Sim. Quanto maior a possibilidade de combinar cenários e acessórios, maior a sensação de continuidade do universo.' },
    { question: 'Ninjago é bom para quem está começando a colecionar?', answer: 'Sim, porque oferece identidade forte e produtos que se conectam visualmente com facilidade.' },
    { question: 'Quando vale abrir produtos específicos?', answer: 'Quando o tema já parece correto e o usuário quer validar apelo visual, variedade e potencial de combinação.' },
    { question: 'Vale usar também o comparativo de temas?', answer: 'Sim, porque ele ajuda a confirmar se Ninjago vence mesmo frente a outros universos antes da compra.' },
    { question: 'Coleção e presente mudam o filtro?', answer: 'Mudam. Em presente, o visual pesa mais. Em coleção, coerência e continuidade costumam pesar ainda mais.' },
  ],
  'ninjago-para-presente-o-que-considerar-antes-de-comprar': [
    { question: 'Ninjago é uma boa opção de presente?', answer: 'Sim, especialmente para perfis que gostam de aventura, ação e personagens com visual forte.' },
    { question: 'O que observar antes de comprar Ninjago para presente?', answer: 'Tema, idade, clareza visual do personagem, tipo de uso e aderência ao perfil de quem vai receber.' },
    { question: 'Vale escolher por impacto visual?', answer: 'Sim, principalmente em presente. Cores, máscaras, espadas e estilo do personagem pesam bastante.' },
    { question: 'Conjuntos pequenos funcionam bem como presente?', answer: 'Funcionam, porque ampliam a brincadeira e geram sensação de conjunto sem exigir uma decisão tão longa.' },
    { question: 'Qualidade do produto muda muito essa compra?', answer: 'Muda, porque a percepção de valor do presente depende muito de acabamento, encaixe e leitura visual.' },
    { question: 'Quando devo cruzar esse tema com faixa de preço?', answer: 'Quando o orçamento ainda não está claro ou quando você quer comparar o valor do presente com outras categorias.' },
    { question: 'Esse tipo de presente funciona melhor para brincar ou colecionar?', answer: 'Pode funcionar para os dois, dependendo do perfil de quem vai receber e do produto escolhido.' },
    { question: 'Vale navegar por produtos específicos antes de decidir?', answer: 'Sim, porque isso ajuda a validar rapidamente se o personagem e o conjunto visual sustentam a intenção de presente.' },
  ],
  'bonecos-de-montar-colecionaveis-como-organizar-e-conservar': [
    { question: 'Como organizar uma coleção sem perder coerência visual?', answer: 'O ideal é definir um critério claro, como tema, universo, categoria ou personagem, e manter consistência ao expandir.' },
    { question: 'Prateleiras e nichos fazem diferença real?', answer: 'Fazem bastante, porque influenciam leitura visual, destaque de personagem e sensação de valor da coleção.' },
    { question: 'Qual o maior risco para conservação?', answer: 'Poeira, umidade e manuseio descuidado costumam ser os fatores que mais prejudicam aparência e durabilidade.' },
    { question: 'Acessórios exigem cuidado específico?', answer: 'Sim. Itens pequenos se perdem com facilidade e precisam de organização coerente para preservar a experiência da coleção.' },
    { question: 'Vale organizar por tema ou por raridade?', answer: 'Depende do objetivo da coleção. Tema costuma gerar mais harmonia visual, enquanto raridade cria leitura de destaque.' },
    { question: 'Toda coleção precisa de peças de destaque?', answer: 'Idealmente sim, porque elas ajudam a organizar a hierarquia visual da exposição.' },
    { question: 'Esse artigo ajuda mais quem já coleciona ou quem vai começar?', answer: 'Ajuda os dois perfis, porque organiza tanto a lógica de montagem quanto a de conservação da coleção.' },
    { question: 'Faz sentido cruzar conservação com páginas de produto?', answer: 'Sim, porque isso ajuda a validar quais itens merecem maior destaque e como continuar a compra com coerência.' },
  ],
};

const BLOG_GUIDES_BY_CATEGORY: Record<string, { path: string; title: string; excerpt: string; label?: string }[]> = {
  'Bonecos de Montar': [
    { path: '/guia/como-escolher-bonecos-de-montar-por-idade', title: 'Como escolher bonecos de montar por idade', excerpt: 'Use faixa etária, tema e intenção de compra para navegar com mais contexto.' },
    { path: '/guia/melhores-bonecos-de-montar-para-iniciantes', title: 'Melhores bonecos de montar para iniciantes', excerpt: 'Descubra o melhor ponto de entrada para quem ainda está começando no universo dos bonecos de montar.' },
    { path: '/guia/bonecos-de-montar-por-faixa-de-preco', title: 'Bonecos de montar por faixa de preço', excerpt: 'Compare custo-benefício, tema e orçamento sem perder contexto de compra.' },
    { path: '/guia/bonecos-de-montar-para-presentear', title: 'Bonecos de montar para presentear: como escolher melhor', excerpt: 'Transforme temas fortes em presentes com mais chance de acerto.' },
  ],
  Ninjago: [
    { path: '/guia/bonecos-de-montar-para-presentear', title: 'Bonecos de montar para presentear: como escolher melhor', excerpt: 'Veja como transformar temas de forte apelo visual em presentes mais certeiros.' },
    { path: '/guia/melhores-bonecos-de-montar-para-iniciantes', title: 'Melhores bonecos de montar para iniciantes', excerpt: 'Entenda quando um universo forte como Ninjago pode funcionar como ponto de entrada.' },
    { path: '/guia/comparativo-super-herois-roblox-series-tv', title: 'Comparativo entre Super Heróis, Roblox e Séries da TV', excerpt: 'Use o comparativo entre grandes universos para refinar ainda mais a navegação.' },
  ],
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<any[]>([]);
  const [tvSeriesProducts, setTvSeriesProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const data = await getBlogPostBySlug(slug);
        setPost(data);

        if (data && data.category) {
          const [related, featured, bestseller, tvSeries] = await Promise.all([
            getRelatedBlogPosts(data.id, data.category),
            getFeaturedProducts(8),
            getBestsellerProducts(8),
            getTvSeriesProducts(8),
          ]);
          setRelatedPosts(related);
          setFeaturedProducts(Array.isArray(featured) ? featured : []);
          setBestsellerProducts(Array.isArray(bestseller) ? bestseller : []);
          setTvSeriesProducts(Array.isArray(tvSeries) ? tvSeries : []);
        }
      } catch (error) {
        console.error('Erro ao carregar post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const sanitizedContent = useMemo(
    () =>
      DOMPurify.sanitize(post?.content || '', {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'a', 'blockquote'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
      }),
    [post?.content]
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6 bg-muted" />
        <Skeleton className="h-12 w-3/4 mb-4 bg-muted" />
        <Skeleton className="h-6 w-1/2 mb-8 bg-muted" />
        <Skeleton className="aspect-video w-full mb-8 bg-muted" />
        <Skeleton className="h-4 w-full mb-2 bg-muted" />
        <Skeleton className="h-4 w-full mb-2 bg-muted" />
        <Skeleton className="h-4 w-3/4 bg-muted" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
        <Link to="/blog">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o blog
          </Button>
        </Link>
      </div>
    );
  }

  const articleSchema = generateArticleSchema({
    headline: post.title,
    description: post.meta_description || post.excerpt || post.title,
    image: post.featured_image || undefined,
    url: `https://qblox.com.br/blog/${post.slug}`,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at,
    author: post.author || QBLOX_AUTHOR_NAME,
    authorUrl: QBLOX_AUTHOR_PAGE_URL,
  });

  const editorialFaq = post.faq && post.faq.length > 0 ? post.faq : BLOG_FAQ_BY_SLUG[post.slug] || [];
  const faqSchema = editorialFaq.length > 0 ? generateFAQSchema(editorialFaq) : null;
  const recommendedProducts = [...featuredProducts, ...bestsellerProducts, ...tvSeriesProducts]
    .filter((product, index, self) => self.findIndex((item) => item.id === product.id) === index)
    .slice(0, 8);

  const complementaryGuides = [
    ...(BLOG_GUIDES_BY_CATEGORY[post.category || ''] || []),
    ...relatedPosts.map((relatedPost) => ({
      path: `/blog/${relatedPost.slug}`,
      title: relatedPost.title,
      excerpt: relatedPost.excerpt || 'Continue navegando por conteúdos complementares relacionados a este tema.',
      label: 'Artigo relacionado',
    })),
  ].filter((item, index, self) => self.findIndex((current) => current.path === item.path) === index).slice(0, 6);

  return (
    <>
      <SEO
        title={post.meta_title || `${post.title} | Blog QBLOX`}
        description={post.meta_description || post.excerpt || post.title}
        image={post.featured_image || undefined}
        url={`https://qblox.com.br/blog/${post.slug}`}
        canonical={`https://qblox.com.br/blog/${post.slug}`}
        type="article"
      />
      <SchemaMarkup schema={articleSchema} />
      {faqSchema && <SchemaMarkup schema={faqSchema} />}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o blog
        </Link>

        {/* Article Header */}
        <article>
          {post.category && (
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
          )}

          <h1 className="text-3xl xl:text-5xl font-bold mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <Link to={QBLOX_AUTHOR_PAGE_PATH} className="hover:text-primary transition-colors">
              Por {post.author || QBLOX_AUTHOR_NAME}
            </Link>
            {post.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            )}
            {post.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.reading_time} min de leitura</span>
              </div>
            )}
          </div>

          <ArticleShareButtons url={`https://qblox.com.br/blog/${post.slug}`} title={post.title} />

          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </article>

        {editorialFaq.length > 0 && (
          <Card className="mt-16">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-3">Perguntas frequentes sobre este artigo</h2>
              <p className="mb-6 text-muted-foreground">Use as perguntas abaixo para aprofundar a leitura e navegar com mais contexto pelos temas ligados a este conteúdo.</p>
              <Accordion type="single" collapsible className="w-full">
                {editorialFaq.map((item, index) => (
                  <AccordionItem key={item.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {complementaryGuides.length > 0 && (
          <GuideRelatedPostsCarousel
            posts={complementaryGuides}
            title="Conteúdos relacionados para continuar a leitura"
            description="Continue navegando por artigos complementares do mesmo tema antes de seguir para categorias e produtos."
          />
        )}

        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <ProductCarousel products={recommendedProducts} title="Produtos recomendados para esta leitura" />
          </div>
        )}

        <div className="mt-16">
          <AuthorSignature articleCountLabel="Conteúdo editorial publicado no blog da QBLOX" />
        </div>

        <Card className="mt-12 border">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3">Próximos passos para a sua busca</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <Link to={getPillarPathByCategory(post.category || '')} className="rounded-xl border p-4 hover:border-primary transition-colors">
                <h4 className="font-semibold mb-1">Guia do tema</h4>
                <p className="text-sm text-muted-foreground">Acesse a página pilar relacionada ao tema deste conteúdo para aprofundar sua busca.</p>
              </Link>
              <Link to="/blog" className="rounded-xl border p-4 hover:border-primary transition-colors">
                <h4 className="font-semibold mb-1">Voltar para o blog</h4>
                <p className="text-sm text-muted-foreground">Continue navegando por guias e conteúdos relacionados ao seu interesse.</p>
              </Link>
              <Link to="/loja" className="rounded-xl border p-4 hover:border-primary transition-colors">
                <h4 className="font-semibold mb-1">Ver todos os produtos</h4>
                <p className="text-sm text-muted-foreground">Compare diferentes categorias antes de escolher sua próxima compra.</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="mt-12 bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para começar sua coleção?
            </h3>
            <p className="mb-6">
              Explore nossa coleção completa de bonecos de montar compatíveis com LEGO
            </p>
            <Link to="/">
              <Button size="lg" variant="secondary">
                Ver Produtos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
