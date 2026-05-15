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

const pageUrl = 'https://qblox.com.br/guia/melhores-bonecos-de-montar-para-iniciantes';
const pageTitle = 'Melhores bonecos de montar para iniciantes';
const pageDescription = 'Guia completo para iniciantes que querem escolher bonecos de montar por tema, facilidade de decisão, categoria e potencial de compra com mais contexto.';
const pageKeywords = 'melhores bonecos de montar para iniciantes, bonecos de montar para começar, bonecos de montar para presente, categorias de bonecos de montar, produtos para iniciantes';

const faq: FAQItem[] = [
  { question: 'Quais bonecos de montar são melhores para iniciantes?', answer: 'Os melhores para iniciantes costumam ser os que combinam tema reconhecível, boa apresentação visual, contexto claro de categoria e navegação simples entre produtos relacionados.' },
  { question: 'Como começar sem se perder entre tantas categorias?', answer: 'O ideal é começar por uma página pilar principal, depois visitar um tema forte como Super Heróis, Roblox ou Séries da TV e só então comparar produtos específicos.' },
  { question: 'Vale começar por lançamentos ou ofertas?', answer: 'Depende da intenção. Lançamentos ajudam a descobrir temas novos, enquanto ofertas são melhores quando o foco principal é testar a primeira compra com custo-benefício.' },
  { question: 'Super Heróis é um tema melhor para iniciantes?', answer: 'Em muitos casos, sim. Super Heróis costuma facilitar a decisão porque trabalha com personagens populares, identificação rápida e produtos de forte apelo visual.' },
  { question: 'Roblox também funciona bem como tema de entrada?', answer: 'Sim. Para quem já gosta do universo gamer, Roblox oferece afinidade imediata e ajuda a tornar a navegação mais intuitiva desde a primeira comparação.' },
  { question: 'Como saber se o produto é bom para primeira compra?', answer: 'Alguns sinais ajudam bastante: visual claro, categoria bem definida, imagens consistentes, contexto de tema e presença de links para produtos ou guias relacionados.' },
  { question: 'Vale comparar categorias antes de abrir produtos específicos?', answer: 'Sim. Para iniciantes, comparar categorias primeiro costuma reduzir ruído e melhorar bastante a qualidade da decisão.' },
  { question: 'Quando faz sentido sair do guia e ir para um produto?', answer: 'Quando o usuário já identificou o tema com mais aderência ao seu perfil e quer validar preço, visual, afinidade com o personagem e possibilidade de ampliar a busca.' }
];

const relatedGuides = [
  {
    path: '/guia/como-escolher-bonecos-de-montar-por-idade',
    title: 'Como escolher bonecos de montar por idade',
    excerpt: 'Veja como usar faixa etária, tema e intenção de compra para reduzir o risco da escolha.'
  },
  {
    path: '/guia/bonecos-de-montar-para-presentear',
    title: 'Bonecos de montar para presentear: como escolher melhor',
    excerpt: 'Entenda como transformar um tema forte em um presente com mais chance de acerto.'
  },
  {
    path: '/guia/comparativo-super-herois-roblox-series-tv',
    title: 'Comparativo entre Super Heróis, Roblox e Séries da TV',
    excerpt: 'Compare os temas mais fortes da loja antes de decidir onde vale aprofundar sua navegação.'
  },
  {
    path: '/guia/bonecos-de-montar-por-faixa-de-preco',
    title: 'Bonecos de montar por faixa de preço',
    excerpt: 'Use o orçamento como filtro sem perder contexto de categoria, tema e apelo visual.'
  }
];

export default function BeginnersGuidePage() {
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
        console.error('Erro ao carregar dados do guia para iniciantes:', error);
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
    { name: pageTitle, url: '/guia/melhores-bonecos-de-montar-para-iniciantes' },
  ]);

  const itemListSchema = useMemo(() => {
    if (featuredProductLinks.length === 0) return null;

    return generateItemListSchema(
      'Produtos recomendados para iniciantes',
      pageUrl,
      featuredProductLinks.map((product) => ({
        name: product.name,
        url: `https://qblox.com.br${getProductPath(product)}`,
        image: product.image_url,
        price: product.price,
        currency: 'BRL',
      }))
    );
  }, [featuredProductLinks]);

  return (
    <>
      <SEO
        title="Melhores bonecos de montar para iniciantes | Guia completo QBLOX"
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
              <span className="text-foreground font-medium">Guia para iniciantes</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-5xl">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Guia editorial QBLOX</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">{pageTitle}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Se você está começando agora e quer descobrir quais são os melhores bonecos de montar para iniciantes, este guia foi estruturado para reduzir o ruído da decisão e transformar uma busca ampla em um caminho mais claro, prático e fácil de seguir.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link to={QBLOX_AUTHOR_PAGE_PATH} className="font-medium text-foreground transition-colors hover:text-primary">Por {QBLOX_AUTHOR_NAME}</Link>
              <span>•</span>
              <span>Atualizado em 15 de maio de 2026</span>
              <span>•</span>
              <span>Leitura de 8 min</span>
            </div>

            <ArticleShareButtons url={pageUrl} title={pageTitle} />

            <article className="prose prose-lg max-w-none mt-12">
              <h2>Por que começar por um guia faz tanta diferença para quem ainda não conhece o catálogo</h2>
              <p>Quem procura <strong>melhores bonecos de montar para iniciantes</strong> normalmente não quer apenas uma lista aleatória de produtos. Na maior parte das vezes, a pessoa está tentando entender por onde começar sem errar a mão, sem se perder entre categorias e sem precisar abrir dezenas de páginas para chegar a uma comparação minimamente confiável. É justamente por isso que um guia de entrada bem feito é tão importante. Ele organiza a jornada para quem ainda não conhece a estrutura da loja, mostra quais universos costumam ser mais amigáveis no começo e reduz o risco de uma escolha pouco aderente ao perfil de quem vai comprar ou receber o produto. Para iniciantes, navegar sem contexto quase sempre gera mais dúvida do que clareza.
              </p>
              <p>Esse ponto é ainda mais importante porque o início da jornada costuma ser guiado por reconhecimento visual e facilidade de decisão, não por profundidade temática. Quem está começando precisa entender quais temas são mais fáceis de ler, quais categorias ajudam a comparar melhor e quais produtos funcionam como ponte entre interesse inicial e descoberta de novos universos. Em vez de sair clicando sem critério, vale começar por páginas como <Link to="/bonecos-de-montar"><strong>bonecos de montar</strong></Link>, avançar para temas fortes como <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link> ou <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link> e só então validar produtos específicos. Esse fluxo cria uma navegação mais natural e muito mais produtiva para quem ainda está formando repertório dentro da loja.</p>

              <h2>O que um iniciante realmente precisa observar antes de abrir um produto</h2>
              <p>Antes de comparar um item específico, o iniciante deveria responder a algumas perguntas simples, porque elas mudam completamente o tipo de produto que faz mais sentido no começo da jornada. O objetivo é presentear? A compra é para uma criança, para alguém que gosta de personagens específicos ou para um perfil mais colecionador? Existe algum tema favorito que já facilite a leitura do catálogo? Essas perguntas parecem básicas, mas são elas que reduzem o risco de navegar por páginas irrelevantes e ajudam a perceber quais produtos realmente merecem atenção. Quando o usuário não faz esse filtro inicial, a tendência é comparar opções isoladas sem entender o cenário completo.
              </p>
              <p>Também vale observar alguns sinais que costumam indicar se um produto é bom para uma primeira compra. Os mais importantes são:
              </p>
              <ul>
                <li>tema fácil de reconhecer logo no primeiro olhar;</li>
                <li>boas imagens e apresentação visual clara;</li>
                <li>categoria bem definida e conectada a outros produtos;</li>
                <li>possibilidade de aprofundar a navegação com guias, páginas pilar e vitrines relacionadas.</li>
              </ul>
              <p>Quando o iniciante usa esses critérios, a compra deixa de depender de impulso e passa a ser orientada por contexto. Isso melhora a experiência desde o começo e cria uma sensação de controle muito maior ao longo da navegação.</p>

              <h2>Quais temas costumam funcionar melhor como porta de entrada</h2>
              <p>Nem todo tema funciona do mesmo jeito para quem está começando. Alguns universos exigem mais familiaridade para fazer sentido, enquanto outros ajudam o usuário a decidir rapidamente porque entregam personagens conhecidos, forte apelo visual e uma leitura mais intuitiva do catálogo. Em geral, as melhores portas de entrada são as categorias que combinam reconhecimento imediato com boa profundidade de navegação. Isso permite que o iniciante entre com confiança e, ao mesmo tempo, descubra caminhos para ampliar a busca depois da primeira decisão. É exatamente esse equilíbrio que torna uma categoria mais amigável para quem ainda está entendendo o universo da loja.
              </p>
              <p>No caso da QBLOX, três caminhos costumam se destacar nesse papel inicial. <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link> facilita muito a escolha porque trabalha com personagens populares e forte apelo de identificação. <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link> tende a funcionar melhor para públicos conectados ao universo gamer e à estética de avatares. Já <Link to="/bonecos-de-series-da-tv"><strong>Séries da TV</strong></Link> faz sentido quando a afinidade com franquias conhecidas é o principal gatilho da compra. Entre os benefícios de começar por um desses temas, vale destacar:
              </p>
              <ul>
                <li>decisão mais rápida por reconhecimento visual;</li>
                <li>menor risco de comparar produtos sem contexto;</li>
                <li>mais facilidade para seguir a navegação até um item específico;</li>
                <li>melhor percepção de continuidade para futuras compras.</li>
              </ul>
              <p>Quando a entrada acontece por uma categoria forte, o iniciante entende mais rápido o funcionamento da loja e sente menos fricção para continuar explorando.</p>

              <h2>Como transformar um interesse genérico em uma navegação mais inteligente</h2>
              <p>Muita gente chega à loja com um interesse ainda pouco definido. Sabe que quer algo dentro do universo de <strong>bonecos de montar</strong>, mas não tem certeza se deve começar por personagem, por preço, por lançamento ou por categoria. Nesses casos, a melhor estratégia é transformar uma curiosidade genérica em uma navegação estruturada. Isso significa sair do comportamento de “abrir qualquer produto que pareça interessante” e entrar em um caminho de descoberta que faça sentido. É aqui que páginas pilar, guias satélite e vitrines relacionadas ajudam tanto. Elas funcionam como organizadores da decisão e impedem que a pessoa gaste energia em rotas pouco produtivas.
              </p>
              <p>Para quem está começando, um fluxo especialmente útil é este: primeiro entender a visão geral no pilar de <Link to="/bonecos-de-montar"><strong>bonecos de montar</strong></Link>, depois aprofundar em um tema de maior aderência, e só então comparar produtos específicos ou conteúdos complementares. Esse processo fica ainda melhor quando o usuário cruza a navegação com artigos como <Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>como escolher por idade</strong></Link> ou <Link to="/guia/bonecos-de-montar-para-presentear"><strong>o guia para presentear</strong></Link>, dependendo da intenção principal da compra. Quanto melhor esse encadeamento, maior a chance de o iniciante sair da dúvida e chegar a uma decisão com mais clareza, menos retrabalho e muito mais segurança.</p>

              <h2>Três produtos que ajudam a começar a comparação com mais contexto</h2>
              <p>Um guia para iniciantes não pode parar na teoria. Em algum momento, ele precisa levar a pessoa para produtos específicos que materializem a comparação. É isso que transforma o conteúdo em algo realmente útil. Quando o usuário encontra exemplos concretos dentro do próprio texto, ele consegue validar mais rápido se aquele tema tem a aderência que parecia ter na teoria. Além disso, links de produto colocados com contexto fortalecem a navegação interna da loja e fazem o artigo cumprir uma função prática no processo de decisão. Em vez de encerrar a leitura no nível da explicação, o guia abre a porta para a ação seguinte.
              </p>
              <p>Se você quer começar essa comparação agora, três boas entradas são estas:</p>
              <ul>
                <li><Link to={featuredProductLinks[0] ? getProductPath(featuredProductLinks[0]) : '/loja'}><strong>{featuredProductLinks[0]?.name || 'Produto em destaque 1'}</strong></Link> — bom para quem quer um produto com apelo visual forte logo no primeiro contato;</li>
                <li><Link to={featuredProductLinks[1] ? getProductPath(featuredProductLinks[1]) : '/loja'}><strong>{featuredProductLinks[1]?.name || 'Produto em destaque 2'}</strong></Link> — útil para quem já está comparando tema e potencial de presente;</li>
                <li><Link to={featuredProductLinks[2] ? getProductPath(featuredProductLinks[2]) : '/loja'}><strong>{featuredProductLinks[2]?.name || 'Produto em destaque 3'}</strong></Link> — indicado para validar se vale aprofundar a navegação dentro daquele universo.</li>
              </ul>
              <p>Esse tipo de ancoragem reduz a distância entre leitura e decisão, o que costuma melhorar bastante a experiência de quem ainda está começando.</p>

              <h2>Quando faz sentido sair do tema e olhar preço, ofertas ou lançamentos</h2>
              <p>Nem todo iniciante entra na loja guiado por um personagem ou universo específico. Em muitos casos, o fator decisivo é orçamento, oportunidade ou vontade de testar uma primeira compra com menos risco. Nessa situação, o raciocínio muda um pouco. O tema continua importante, mas começa a dividir espaço com outros filtros, como preço, promoção e novidade. Saber quando sair do tema e olhar esses outros critérios é parte importante de uma jornada de compra mais madura, mesmo para quem ainda está no começo da exploração. Quando isso é bem resolvido, o usuário não abandona a navegação; ele apenas muda de eixo de comparação com mais consciência.
              </p>
              <p>É aí que entram conteúdos e páginas como <Link to="/guia/bonecos-de-montar-por-faixa-de-preco"><strong>o guia por faixa de preço</strong></Link>, <Link to="/ofertas-especiais"><strong>ofertas especiais</strong></Link> e <Link to="/categoria/lancamentos"><strong>lançamentos</strong></Link>. Esses caminhos ajudam a organizar três tipos de comportamento muito comuns em iniciantes:
              </p>
              <ul>
                <li>quem quer minimizar o risco financeiro da primeira compra;</li>
                <li>quem prefere descobrir temas novos antes de decidir;</li>
                <li>quem quer comparar oportunidade, apelo visual e aderência ao perfil de uso.</li>
              </ul>
              <p>Quando o guia reconhece essas intenções e aponta os caminhos certos, ele deixa de ser apenas introdutório e passa a funcionar como um verdadeiro mapa de decisão.</p>

              <h2>Como sair da dúvida e escolher um ponto de entrada com mais confiança</h2>
              <p>No fim das contas, quem procura <strong>melhores bonecos de montar para iniciantes</strong> está tentando responder uma pergunta muito prática: qual é o ponto de entrada mais seguro para começar sem se frustrar? Essa resposta não nasce de uma lista pronta, mas de um processo de filtragem mais inteligente. É preciso entender o tema com mais aderência, observar se a categoria ajuda ou atrapalha a decisão, validar produtos com melhor leitura visual e, quando necessário, usar outros eixos como preço e presente para organizar melhor a escolha. Quanto mais claro for esse fluxo, menor a sensação de confusão e maior a confiança para avançar.
              </p>
              <p>Se você quer continuar essa jornada com mais contexto, vale seguir por três caminhos bem objetivos: aprofundar no pilar de <Link to="/bonecos-de-montar"><strong>bonecos de montar</strong></Link>, comparar um universo forte como <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link> ou <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link>, e então validar um produto específico ou um guia complementar conforme a intenção principal da compra. Esse encadeamento cria uma experiência mais fluida, fortalece a interligação entre conteúdos e transforma a primeira navegação em algo realmente útil para quem está começando.</p>
            </article>

            <Card className="mt-16">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-3">Perguntas frequentes sobre os melhores bonecos de montar para iniciantes</h2>
                <p className="mb-6 text-muted-foreground">As perguntas abaixo ajudam a eliminar dúvidas comuns de quem ainda está descobrindo como comparar temas, vitrines e produtos dentro da loja.</p>
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
              description="Continue a navegação com conteúdos complementares sobre idade, presente, comparação de temas e orçamento."
            />

            <div className="mt-16 grid gap-4 md:grid-cols-3">
              <Link to="/bonecos-de-montar" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Guia principal</h3><p className="text-sm text-muted-foreground">Veja a visão geral do universo de bonecos de montar antes de aprofundar em um tema específico.</p></Link>
              <Link to="/ofertas-especiais" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Ofertas especiais</h3><p className="text-sm text-muted-foreground">Descubra opções com melhor custo-benefício para uma primeira compra.</p></Link>
              <Link to="/loja" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Explorar produtos</h3><p className="text-sm text-muted-foreground">Compare categorias, preços e vitrines da loja para seguir a decisão com mais contexto.</p></Link>
            </div>

            <div className="mt-16">
              <AuthorSignature articleCountLabel="Guia de entrada para quem está começando a explorar a loja" />
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="mt-20">
              <ProductCarousel products={recommendedProducts} title="Produtos recomendados para quem está começando" />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
