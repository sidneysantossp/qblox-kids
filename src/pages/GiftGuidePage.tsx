import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { ArticleShareButtons } from '@/components/content/ArticleShareButtons';
import { AuthorSignature } from '@/components/content/AuthorSignature';
import { GuideRelatedPostsCarousel } from '@/components/content/GuideRelatedPostsCarousel';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { SchemaMarkup, generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema, generateItemListSchema } from '@/lib/schema';
import { QBLOX_AUTHOR_NAME, QBLOX_AUTHOR_PAGE_PATH, QBLOX_AUTHOR_PAGE_URL } from '@/lib/authors';
import { getProductPath } from '@/lib/urls';
import { getBestsellerProducts, getFeaturedProducts, getTvSeriesProducts } from '@/db/api';
import type { FAQItem, Product } from '@/types';

const pageUrl = 'https://www.qblox.com.br/guia/bonecos-de-montar-para-presentear';
const pageTitle = 'Bonecos de montar para presentear: como escolher melhor';
const pageDescription = 'Guia completo para escolher bonecos de montar para presente com base em tema, contexto da compra, faixa de preço e identificação com personagens.';
const pageKeywords = 'bonecos de montar para presentear, presente de bonecos de montar, bonecos de montar para crianças, bonecos de montar por tema, melhor presente de bonecos';

const faq: FAQItem[] = [
  { question: 'Bonecos de montar são bons para presentear?', answer: 'Sim. Funcionam especialmente bem quando o presente é guiado por personagens conhecidos, temas fortes e uma categoria que facilite a comparação.' },
  { question: 'Como escolher um presente sem errar o tema?', answer: 'O melhor caminho é começar pelos pilares temáticos e depois comparar categorias com maior afinidade visual, como Super Heróis, Roblox e Séries da TV.' },
  { question: 'Vale olhar ofertas e lançamentos antes de decidir?', answer: 'Sim. Essas vitrines ajudam a encontrar oportunidades mais atraentes e produtos com maior apelo recente.' },
  { question: 'Qual categoria costuma funcionar melhor para presente rápido?', answer: 'Super Heróis costuma facilitar bastante quando a pessoa gosta de personagens populares e reconhecimento visual imediato.' },
  { question: 'Roblox é uma boa opção de presente?', answer: 'Sim, especialmente para perfis conectados ao universo gamer e a personagens com forte identidade visual.' },
  { question: 'Como saber se o produto tem bom apelo para presente?', answer: 'Vale observar tema, força do personagem, clareza visual, possibilidade de navegação complementar e contexto da categoria dentro da loja.' },
  { question: 'Faixa de preço pesa muito nessa decisão?', answer: 'Pesa, principalmente quando o comprador está buscando equilíbrio entre impacto visual e orçamento disponível.' },
  { question: 'Quando faz sentido usar um guia complementar?', answer: 'Quando a intenção ainda está indefinida e você quer cruzar presente com idade, orçamento ou comparação de temas antes de escolher o produto final.' }
];

const relatedGuides = [
  {
    path: '/guia/como-escolher-bonecos-de-montar-por-idade',
    title: 'Como escolher bonecos de montar por idade',
    excerpt: 'Use faixa etária, contexto de compra e afinidade por personagens para reduzir o risco do presente.'
  },
  {
    path: '/guia/bonecos-de-montar-por-faixa-de-preco',
    title: 'Bonecos de montar por faixa de preço',
    excerpt: 'Veja como usar orçamento como filtro sem perder contexto de tema e apelo visual.'
  },
  {
    path: '/guia/comparativo-super-herois-roblox-series-tv',
    title: 'Comparativo entre Super Heróis, Roblox e Séries da TV',
    excerpt: 'Compare os universos mais fortes da loja antes de escolher o melhor presente.'
  },
  {
    path: '/guia/melhores-bonecos-de-montar-para-iniciantes',
    title: 'Melhores bonecos de montar para iniciantes',
    excerpt: 'Bom apoio para quando o presente é para alguém que ainda está começando a explorar esse universo.'
  }
];

export default function GiftGuidePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [tvSeriesProducts, setTvSeriesProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, bestseller, tvSeries] = await Promise.all([
          getFeaturedProducts(8),
          getBestsellerProducts(8),
          getTvSeriesProducts(8),
        ]);

        setFeaturedProducts(Array.isArray(featured) ? featured : []);
        setBestsellerProducts(Array.isArray(bestseller) ? bestseller : []);
        setTvSeriesProducts(Array.isArray(tvSeries) ? tvSeries : []);
      } catch (error) {
        console.error('Erro ao carregar dados do guia para presentear:', error);
      }
    };

    loadData();
  }, []);

  const recommendedProducts = useMemo(() => {
    const all = [...featuredProducts, ...bestsellerProducts, ...tvSeriesProducts];
    const unique = all.filter((product, index, self) => self.findIndex((item) => item.id === product.id) === index);
    return unique.slice(0, 8);
  }, [featuredProducts, bestsellerProducts, tvSeriesProducts]);

  const featuredProductLinks = useMemo(() => recommendedProducts.slice(0, 3), [recommendedProducts]);

  const articleSchema = generateArticleSchema({
    headline: pageTitle,
    description: pageDescription,
    url: pageUrl,
    datePublished: '2026-05-15T00:00:00.000Z',
    dateModified: '2026-05-15T00:00:00.000Z',
    author: QBLOX_AUTHOR_NAME,
    authorUrl: QBLOX_AUTHOR_PAGE_URL,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Início', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: pageTitle, url: '/guia/bonecos-de-montar-para-presentear' },
  ]);

  const itemListSchema = useMemo(() => {
    if (featuredProductLinks.length === 0) return null;

    return generateItemListSchema(
      'Produtos recomendados para presentear',
      pageUrl,
      featuredProductLinks.map((product) => ({
        name: product.name,
        url: `https://www.qblox.com.br${getProductPath(product)}`,
        image: product.image_url,
        price: product.price,
        currency: 'BRL',
      }))
    );
  }, [featuredProductLinks]);

  return (
    <>
      <SEO
        title="Bonecos de montar para presentear | Guia completo QBLOX"
        description={pageDescription}
        keywords={pageKeywords}
        canonical={pageUrl}
        url={pageUrl}
        type="article"
      />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />
      {itemListSchema && <SchemaMarkup schema={itemListSchema} />}

      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Guia para presentear</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-5xl">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Guia editorial QBLOX</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">{pageTitle}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Se a sua busca é por <strong>bonecos de montar para presentear</strong>, este guia ajuda a transformar dúvida em decisão usando tema, contexto da compra, faixa de preço e potencial de identificação com o personagem.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link to={QBLOX_AUTHOR_PAGE_PATH} className="font-medium text-foreground transition-colors hover:text-primary">Por {QBLOX_AUTHOR_NAME}</Link>
              <span>•</span>
              <span>Atualizado em 15 de maio de 2026</span>
              <span>•</span>
              <span>Leitura de 8 min</span>
            </div>

            <ArticleShareButtons url={pageUrl} title={pageTitle} />

            <article className="prose prose-lg max-w-none mt-12">
              <h2>Por que escolher um presente por tema costuma ser mais eficiente do que procurar por impulso</h2>
              <p>Quem procura <strong>bonecos de montar para presentear</strong> quase sempre quer resolver duas dúvidas ao mesmo tempo: reduzir a chance de erro e encontrar algo que pareça especial logo no primeiro olhar. Isso significa que a decisão não depende apenas do produto isolado, mas da forma como ele se encaixa no repertório de quem vai receber o presente. Quando a pessoa compra sem critério temático, a busca vira uma sequência de cliques em opções visualmente interessantes, mas pouco conectadas entre si. O resultado costuma ser mais ruído, mais comparação improdutiva e menos segurança para decidir. É justamente por isso que vale começar por um tema forte e só depois descer para a camada de produto.
              </p>
              <p>Essa lógica funciona muito bem porque um presente precisa gerar identificação rápida. Em geral, a pessoa que compra quer uma combinação de apelo visual, personagem reconhecível e sensação de acerto. Isso se torna muito mais simples quando a navegação começa por universos com leitura clara, como <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link>, <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link> ou <Link to="/bonecos-de-series-da-tv"><strong>Séries da TV</strong></Link>. Quando você parte desses pilares, a comparação fica menos genérica e o catálogo se organiza melhor diante da intenção da compra. O presente deixa de ser apenas uma escolha entre itens e passa a ser uma decisão guiada por contexto.</p>

              <h2>O que observar antes de abrir um produto quando o objetivo é presentear</h2>
              <p>Antes de cair na etapa de produto específico, vale organizar a decisão com perguntas simples, mas fundamentais. Quem vai receber já tem um tema favorito? A compra está sendo guiada por ocasião, idade, universo de personagem ou orçamento? O presente precisa causar impacto visual imediato ou pode funcionar mais pela profundidade da coleção? Essas perguntas são importantes porque mudam completamente a forma como a pessoa navega. Um presente para alguém fã de personagens populares costuma seguir um caminho muito diferente de um presente para quem gosta de comparar temas com mais calma ou já tem hábito de colecionar.</p>
              <p>Também ajuda bastante observar alguns critérios que costumam funcionar como filtro prático no começo da jornada:
              </p>
              <ul>
                <li>tema com leitura visual imediata;</li>
                <li>categoria clara e fácil de aprofundar;</li>
                <li>produto com imagem forte e apelo direto;</li>
                <li>possibilidade de continuar navegando para guias e vitrines relacionadas.</li>
              </ul>
              <p>Quando esses sinais aparecem juntos, a chance de o presente fazer mais sentido para quem vai receber cresce bastante. Em vez de depender da sorte, a escolha passa a ser sustentada por lógica de navegação e identificação temática.</p>

              <h2>Super Heróis, Roblox e Séries da TV: quais temas costumam acertar mais</h2>
              <p>Alguns universos funcionam melhor do que outros quando o assunto é presente, e isso não acontece por acaso. Temas fortes tendem a facilitar a decisão porque já carregam uma carga grande de reconhecimento, imagem mental e afinidade emocional. A pessoa não precisa entender profundamente o catálogo para perceber se aquela categoria faz sentido. Em muitos casos, basta bater o olho e reconhecer o universo para que a comparação já comece num ponto muito mais favorável. Esse tipo de resposta rápida é valiosa principalmente em presentes, porque quem compra costuma buscar clareza e agilidade, e não uma jornada longa demais até o produto final.
              </p>
              <p>No ecossistema da QBLOX, três caminhos costumam se destacar nesse cenário. <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link> funciona muito bem quando a compra depende de personagens populares e alto reconhecimento visual. <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link> tende a ser especialmente forte para perfis conectados ao universo gamer e à estética dos avatares. Já <Link to="/bonecos-de-series-da-tv"><strong>Séries da TV</strong></Link> costuma ser mais eficiente quando a escolha nasce de uma franquia ou de um personagem ligado ao repertório de séries. Entre os benefícios de começar por uma dessas categorias, vale destacar:
              </p>
              <ul>
                <li>decisão mais rápida por identificação com o tema;</li>
                <li>menor risco de abrir páginas pouco aderentes;</li>
                <li>mais facilidade para seguir até produtos com alto apelo de presente;</li>
                <li>maior chance de comparar opções com sentido real para a ocasião.</li>
              </ul>
              <p>Quando a escolha começa assim, o presente deixa de ser um gesto aleatório e passa a parecer muito mais intencional.</p>

              <h2>Como usar contexto da compra para não errar o produto final</h2>
              <p>Presentear não depende apenas de escolher um tema forte. Também é preciso entender em que contexto essa compra acontece. Há presentes que precisam gerar impacto imediato, outros que funcionam melhor por serem mais específicos e alguns que dependem muito do orçamento para fazer sentido. Esse tipo de nuance muda a forma como o usuário deve navegar pela loja. Em vez de buscar apenas “o melhor produto”, o ideal é buscar o produto mais coerente com a ocasião. Quando a pessoa entende isso, a comparação melhora porque ela passa a filtrar opções de maneira mais inteligente e não apenas pelo visual isolado de cada item.</p>
              <p>É nesse momento que o artigo ganha um papel estratégico dentro da navegação. Ele deve levar o usuário para rotas complementares como <Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>o guia por idade</strong></Link>, <Link to="/guia/bonecos-de-montar-por-faixa-de-preco"><strong>o guia por faixa de preço</strong></Link> e vitrines como <Link to="/ofertas-especiais"><strong>ofertas especiais</strong></Link>. Esses apoios ajudam a responder perguntas como:
              </p>
              <ul>
                <li>o presente precisa ter apelo imediato ou pode ser mais nichado;</li>
                <li>o orçamento já está definido ou ainda pode variar;</li>
                <li>vale seguir por categoria ou comparar produtos mais rápido;</li>
                <li>faz sentido buscar uma oportunidade em lançamentos ou promoções.</li>
              </ul>
              <p>Quando esse contexto é considerado, o risco de uma compra mal alinhada cai muito e a decisão flui com mais segurança.</p>

              <h2>Três produtos que ajudam a transformar intenção em comparação real</h2>
              <p>Um bom guia de presente não pode parar na recomendação genérica. Em algum momento, ele precisa colocar o usuário diante de produtos específicos, porque é aí que a intenção começa a virar comparação concreta. Essa passagem é importante por dois motivos. Primeiro, porque ajuda o leitor a validar visualmente se aquele tema continua fazendo sentido. Segundo, porque reforça a malha de navegação interna da loja e aproxima o conteúdo editorial da etapa transacional. Um guia que leva naturalmente a produtos específicos cumpre melhor sua função e reduz a distância entre leitura e decisão.</p>
              <p>Se você quer transformar essa leitura em comparação prática, três entradas naturais são estas:</p>
              <ul>
                <li><Link to={featuredProductLinks[0] ? getProductPath(featuredProductLinks[0]) : '/loja'}><strong>{featuredProductLinks[0]?.name || 'Produto em destaque 1'}</strong></Link> — bom para quem quer um presente com forte apelo visual desde o primeiro contato;</li>
                <li><Link to={featuredProductLinks[1] ? getProductPath(featuredProductLinks[1]) : '/loja'}><strong>{featuredProductLinks[1]?.name || 'Produto em destaque 2'}</strong></Link> — útil para quem já está comparando categoria, personagem e potencial de identificação;</li>
                <li><Link to={featuredProductLinks[2] ? getProductPath(featuredProductLinks[2]) : '/loja'}><strong>{featuredProductLinks[2]?.name || 'Produto em destaque 3'}</strong></Link> — indicado para validar se o tema merece aprofundamento antes da decisão final.</li>
              </ul>
              <p>Esse tipo de linkagem ajuda muito porque transforma o artigo em uma ponte real entre descoberta, contexto e compra.</p>

              <h2>Quando faz sentido usar ofertas, lançamentos ou faixa de preço como apoio</h2>
              <p>Nem toda compra para presente nasce de uma decisão temática completamente resolvida. Em muitos casos, o que pesa mais é o orçamento ou a vontade de encontrar uma oportunidade mais interessante. Nesses cenários, o tema continua importante, mas precisa dividir espaço com outros filtros. É aí que páginas como <Link to="/categoria/lancamentos"><strong>lançamentos</strong></Link>, <Link to="/ofertas-especiais"><strong>ofertas especiais</strong></Link> e <Link to="/guia/bonecos-de-montar-por-faixa-de-preco"><strong>faixa de preço</strong></Link> passam a ter um papel muito forte. Elas ajudam a reorganizar a escolha sem fazer o usuário perder o contexto da jornada principal.</p>
              <p>Essa camada complementar é especialmente útil para três perfis muito comuns:
              </p>
              <ul>
                <li>quem já definiu o valor máximo do presente;</li>
                <li>quem quer descobrir novidades antes de decidir o tema;</li>
                <li>quem deseja equilibrar apelo visual com sensação de oportunidade.</li>
              </ul>
              <p>Quando o artigo aponta esses caminhos no momento certo, ele não dispersa a navegação. Pelo contrário: ajuda a pessoa a refinar melhor a decisão sem sair do ecossistema do tema.</p>

              <h2>Como transformar uma busca por presente em uma decisão mais segura</h2>
              <p>No fim das contas, quem procura <strong>bonecos de montar para presentear</strong> quer mais do que um produto bonito. Quer reduzir incerteza, encontrar um tema com boa aderência e sentir que a compra tem uma lógica convincente por trás. Quando o artigo consegue organizar essa jornada, ele ajuda o usuário a sair do comportamento impulsivo e avançar com mais critério. Isso melhora a experiência, fortalece a navegação interna da loja e torna a escolha final muito mais coerente com o perfil da pessoa que vai receber o presente.</p>
              <p>Se você quer continuar com mais contexto, vale seguir por três direções práticas: aprofundar em um tema forte como <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link> ou <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link>, cruzar a decisão com <Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>idade</strong></Link> ou <Link to="/guia/bonecos-de-montar-por-faixa-de-preco"><strong>faixa de preço</strong></Link>, e então validar um produto específico conforme o contexto da compra. Esse encadeamento torna o presente mais bem resolvido e ajuda a loja a conduzir o usuário com muito mais naturalidade.</p>
            </article>

            <Card className="mt-16">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-3">Perguntas frequentes sobre como escolher bonecos de montar para presentear</h2>
                <p className="mb-6 text-muted-foreground">As perguntas abaixo ajudam a esclarecer dúvidas comuns de quem quer transformar um tema forte em um presente mais certeiro.</p>
                <Accordion type="single" collapsible className="w-full">
                  {faq.map((item, index) => (
                    <AccordionItem key={item.question} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <GuideRelatedPostsCarousel
              posts={relatedGuides}
              description="Continue a navegação com conteúdos complementares sobre idade, orçamento, comparação de temas e início de jornada."
            />

            <div className="mt-16 grid gap-4 md:grid-cols-3">
              <Link to="/bonecos-de-montar" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Guia principal</h3><p className="text-sm text-muted-foreground">Veja a visão geral do universo de bonecos de montar antes de aprofundar a escolha do presente.</p></Link>
              <Link to="/categoria/lancamentos" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Ver lançamentos</h3><p className="text-sm text-muted-foreground">Descubra novidades com potencial alto para presente e forte apelo visual.</p></Link>
              <Link to="/loja" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Explorar produtos</h3><p className="text-sm text-muted-foreground">Compare categorias e produtos com mais contexto antes de decidir.</p></Link>
            </div>

            <div className="mt-16">
              <AuthorSignature articleCountLabel="Guia prático para presentes por tema, contexto e decisão de compra" />
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="mt-20">
              <ProductCarousel products={recommendedProducts} title="Produtos recomendados para presentear" />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
