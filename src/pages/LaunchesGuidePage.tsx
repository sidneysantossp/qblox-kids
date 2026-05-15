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
import { getBestsellerProducts, getFeaturedProducts } from '@/db/api';
import type { FAQItem, Product } from '@/types';

const pageUrl = 'https://qblox.com.br/guia/melhores-lancamentos-de-bonecos-de-montar';
const pageTitle = 'Melhores lançamentos de bonecos de montar';
const pageDescription = 'Guia completo para acompanhar lançamentos, entender quando novidade faz sentido e cruzar esse filtro com tema, presente e categoria.';
const pageKeywords = 'melhores lançamentos de bonecos de montar, novidades bonecos de montar, lançamentos para presente, lançamentos por tema, novos bonecos de montar';

const faq: FAQItem[] = [
  { question: 'Como acompanhar os melhores lançamentos?', answer: 'O melhor caminho é cruzar a categoria de lançamentos com páginas pilar temáticas e vitrines da loja, para entender quais novidades fazem mais sentido.' },
  { question: 'Vale acompanhar lançamentos mesmo antes de decidir o tema?', answer: 'Sim. Lançamentos ajudam a descobrir tendências e novos personagens que podem guiar a navegação para uma categoria mais específica.' },
  { question: 'Lançamentos funcionam melhor para presente ou coleção?', answer: 'Funcionam bem para os dois casos, especialmente quando o tema é reconhecível e a página ajuda a comparar contexto, categoria e preço.' },
  { question: 'Todo lançamento vale a atenção do usuário?', answer: 'Não. O ideal é observar quais novidades conversam com temas fortes e com intenção de compra real.' },
  { question: 'Lançamentos ajudam quem ainda está começando?', answer: 'Sim, desde que a pessoa use esse filtro junto com guias de iniciantes, tema e faixa de preço para não dispersar a decisão.' },
  { question: 'Como saber se vale abrir um lançamento específico?', answer: 'Vale quando a novidade reforça um universo já aderente ao perfil da compra ou quando ela cria uma oportunidade interessante de presente ou coleção.' },
  { question: 'Lançamentos combinam com vitrines de ofertas?', answer: 'Sim. Comparar novidade com oportunidade ajuda o usuário a decidir melhor quando orçamento também pesa.' },
  { question: 'Quando faz sentido sair dos lançamentos e voltar para um pilar temático?', answer: 'Quando o usuário percebe que o tema importa mais do que a novidade em si e precisa reorganizar a navegação com mais contexto.' }
];

const relatedGuides = [
  {
    path: '/guia/bonecos-de-montar-por-faixa-de-preco',
    title: 'Bonecos de montar por faixa de preço',
    excerpt: 'Cruze novidade com orçamento para decidir se vale seguir por lançamento ou oportunidade.'
  },
  {
    path: '/guia/bonecos-de-montar-para-presentear',
    title: 'Bonecos de montar para presentear: como escolher melhor',
    excerpt: 'Entenda quando lançamentos ajudam a escolher presentes mais interessantes e visuais.'
  },
  {
    path: '/guia/melhores-bonecos-de-montar-para-iniciantes',
    title: 'Melhores bonecos de montar para iniciantes',
    excerpt: 'Veja quando novidade ajuda e quando é melhor começar por temas mais estáveis.'
  },
  {
    path: '/guia/comparativo-super-herois-roblox-series-tv',
    title: 'Comparativo entre Super Heróis, Roblox e Séries da TV',
    excerpt: 'Compare a novidade com a força dos temas principais antes de aprofundar a compra.'
  }
];

export default function LaunchesGuidePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, bestseller] = await Promise.all([
          getFeaturedProducts(8),
          getBestsellerProducts(8),
        ]);

        setFeaturedProducts(Array.isArray(featured) ? featured : []);
        setBestsellerProducts(Array.isArray(bestseller) ? bestseller : []);
      } catch (error) {
        console.error('Erro ao carregar dados do guia de lançamentos:', error);
      }
    };

    loadData();
  }, []);

  const recommendedProducts = useMemo(() => {
    const all = [...featuredProducts, ...bestsellerProducts];
    const unique = all.filter((product, index, self) => self.findIndex((item) => item.id === product.id) === index);
    return unique.slice(0, 8);
  }, [featuredProducts, bestsellerProducts]);

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
    { name: pageTitle, url: '/guia/melhores-lancamentos-de-bonecos-de-montar' },
  ]);

  const itemListSchema = useMemo(() => {
    if (featuredProductLinks.length === 0) return null;

    return generateItemListSchema(
      'Produtos recomendados de lançamentos',
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
        title="Melhores lançamentos de bonecos de montar | Guia completo QBLOX"
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
              <span className="text-foreground font-medium">Lançamentos</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-5xl">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Guia editorial QBLOX</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">{pageTitle}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Se você quer acompanhar novidades sem transformar a navegação em ruído, este guia mostra como usar lançamentos como filtro de descoberta com mais contexto e critério.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link to={QBLOX_AUTHOR_PAGE_PATH} className="font-medium text-foreground transition-colors hover:text-primary">Por {QBLOX_AUTHOR_NAME}</Link>
              <span>•</span>
              <span>Atualizado em 15 de maio de 2026</span>
              <span>•</span>
              <span>Leitura de 8 min</span>
            </div>

            <ArticleShareButtons url={pageUrl} title={pageTitle} />

            <article className="prose prose-lg max-w-none mt-12">
              <h2>Por que lançamentos podem melhorar muito a descoberta de produtos</h2>
              <p>Acompanhar <strong>lançamentos de bonecos de montar</strong> é uma das formas mais eficientes de descobrir produtos novos sem depender apenas da navegação por categorias estáticas. Quando a pessoa usa lançamentos como filtro, ela passa a ver o catálogo com um olhar mais atual, identificando temas, personagens e oportunidades que talvez não aparecessem no topo da busca tradicional. Isso é especialmente útil para quem gosta de explorar novidades, quer encontrar presentes com frescor de mercado ou simplesmente deseja entender para onde a loja está direcionando mais atenção temática naquele momento.</p>
              <p>Mas novidade por si só não resolve a compra. O lançamento funciona melhor quando ele é cruzado com páginas pilar, categorias fortes e guias complementares. É esse contexto que impede a navegação de virar curiosidade sem direção. Quando a pessoa parte de <Link to="/categoria/lancamentos"><strong>lançamentos</strong></Link> e depois cruza essa vitrine com universos como <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link> ou <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link>, a descoberta deixa de ser aleatória e passa a fazer parte de um caminho mais estruturado de decisão.</p>

              <h2>Quando vale começar por lançamentos em vez de categorias tradicionais</h2>
              <p>Nem sempre o melhor ponto de partida é uma categoria consolidada. Em alguns casos, o usuário quer justamente entender o que há de novo antes de escolher um tema. Isso acontece muito quando a compra tem intenção de presente, quando a pessoa gosta de novidade ou quando está aberta a descobrir um universo que ainda não estava no radar. Nessas situações, os lançamentos funcionam como uma camada de inspiração. Eles ajudam a revelar tendências, produtos de maior apelo recente e combinações que talvez não fossem consideradas em uma navegação puramente temática.</p>
              <p>Esse caminho tende a funcionar melhor em alguns cenários bem específicos:
              </p>
              <ul>
                <li>quando o usuário quer descobrir temas novos antes de decidir;</li>
                <li>quando a compra depende de algo com sensação de novidade;</li>
                <li>quando a pessoa aceita comparar oportunidade, apelo visual e novidade ao mesmo tempo;</li>
                <li>quando o lançamento pode abrir caminho para uma categoria inteira ainda não explorada.</li>
              </ul>
              <p>Quando esse é o caso, os lançamentos deixam de ser apenas uma vitrine promocional e passam a funcionar como um verdadeiro filtro de descoberta.</p>

              <h2>Como evitar que a busca por novidade vire dispersão</h2>
              <p>O risco de começar por lançamentos é cair em uma navegação sem profundidade. A pessoa abre várias novidades, gosta de algumas, mas não entende bem como elas se relacionam com temas, categorias e intenções de compra. É por isso que a novidade precisa ser acompanhada de estrutura. Um lançamento só se torna útil quando ele ajuda o usuário a abrir uma rota mais clara dentro da loja. Se ele não leva a uma categoria relevante, não conversa com um universo forte ou não se conecta com uma intenção concreta, a busca tende a se tornar mais superficial do que produtiva.</p>
              <p>Uma forma muito eficiente de evitar essa dispersão é cruzar lançamentos com outros filtros editoriais. Em vez de parar na curiosidade do novo, vale complementar a busca com <Link to="/guia/bonecos-de-montar-por-faixa-de-preco"><strong>faixa de preço</strong></Link>, <Link to="/guia/bonecos-de-montar-para-presentear"><strong>presentear</strong></Link> ou com um comparativo entre temas. Isso ajuda o usuário a responder perguntas mais importantes do que “o que é novo?” — perguntas como “o que faz sentido para mim agora?”, “essa novidade funciona como presente?” ou “vale aprofundar nesse universo?”. É esse encadeamento que transforma descoberta em decisão real.</p>

              <h2>Quando um lançamento tem mais valor para presente do que para coleção</h2>
              <p>Muita novidade chama atenção porque parece mais especial logo no primeiro contato. Isso faz com que lançamentos tenham um papel muito forte em compras para presente. Quando a pessoa quer causar boa impressão, escolher algo com sensação de novidade pode aumentar bastante a percepção de valor. Em muitos casos, o lançamento funciona como uma resposta rápida para quem quer algo visualmente interessante e diferente do que já circula com frequência. O ponto importante é que isso só vale de verdade quando a novidade também conversa com o perfil de quem vai receber.</p>
              <p>Já no caso de coleção, o lançamento precisa ser analisado de outro jeito. O foco deixa de ser apenas a novidade e passa a incluir coerência temática, compatibilidade com o universo já explorado e possibilidade de continuidade. Isso significa que o mesmo lançamento pode ser excelente para presente, mas não necessariamente tão útil para alguém que está tentando expandir uma coleção de forma organizada. Essa diferença é uma das razões pelas quais vale cruzar a vitrine de lançamentos com páginas como <Link to="/guia/bonecos-de-montar-para-presentear"><strong>presentear</strong></Link> e <Link to="/guia/melhores-bonecos-de-montar-para-iniciantes"><strong>iniciantes</strong></Link>, para refinar melhor o contexto da decisão.</p>

              <h2>Três produtos para transformar novidade em comparação concreta</h2>
              <p>Assim como acontece nos outros guias, a camada editorial só ganha função prática quando começa a levar o usuário a produtos específicos. Isso é ainda mais importante em lançamentos, porque a novidade precisa ser validada visualmente e comparada com outras rotas possíveis. Quando o texto aponta itens concretos, o leitor consegue perceber se o interesse pelo novo se sustenta fora da abstração. Além disso, esses links fortalecem a interligação interna da loja e fazem o guia funcionar como um trampolim real para a próxima etapa da jornada.</p>
              <p>Se você quer começar essa validação agora, três boas entradas são estas:</p>
              <ul>
                <li><Link to={featuredProductLinks[0] ? getProductPath(featuredProductLinks[0]) : '/loja'}><strong>{featuredProductLinks[0]?.name || 'Produto em destaque 1'}</strong></Link> — útil para avaliar se a novidade tem apelo visual forte logo no primeiro olhar;</li>
                <li><Link to={featuredProductLinks[1] ? getProductPath(featuredProductLinks[1]) : '/loja'}><strong>{featuredProductLinks[1]?.name || 'Produto em destaque 2'}</strong></Link> — bom para comparar o peso do tema com a sensação de oportunidade;</li>
                <li><Link to={featuredProductLinks[2] ? getProductPath(featuredProductLinks[2]) : '/loja'}><strong>{featuredProductLinks[2]?.name || 'Produto em destaque 3'}</strong></Link> — indicado para validar se vale seguir nessa novidade ou voltar para uma categoria mais consolidada.</li>
              </ul>
              <p>Essa transição torna a navegação muito mais prática e impede que o usuário fique preso apenas na curiosidade da vitrine.</p>

              <h2>Quando vale cruzar lançamentos com preço, tema ou perfil da compra</h2>
              <p>Nem toda novidade justifica aprofundamento imediato. Em muitos casos, faz mais sentido cruzar o lançamento com outros filtros antes de continuar. O tema pode ser mais relevante do que a novidade. O orçamento pode impor um limite mais forte. A intenção de presente pode exigir uma categoria mais reconhecível. Esse tipo de nuance muda bastante a forma como o usuário deve navegar. É por isso que lançamentos funcionam melhor quando entram como parte de um fluxo mais amplo, e não como uma vitrine isolada desconectada das outras páginas do site.</p>
              <p>Os cruzamentos mais úteis normalmente são estes:</p>
              <ul>
                <li><Link to="/guia/bonecos-de-montar-por-faixa-de-preco"><strong>faixa de preço</strong></Link>, quando o orçamento é determinante;</li>
                <li><Link to="/guia/comparativo-super-herois-roblox-series-tv"><strong>comparação de temas</strong></Link>, quando a afinidade temática pesa mais do que a novidade;</li>
                <li><Link to="/guia/bonecos-de-montar-para-presentear"><strong>presentear</strong></Link>, quando o impacto imediato do lançamento precisa ser validado pela ocasião;</li>
                <li><Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>idade</strong></Link>, quando o perfil de quem vai receber ainda precisa ser considerado.</li>
              </ul>
              <p>Esse processo ajuda o leitor a perceber se o lançamento é realmente a melhor rota ou apenas uma distração momentânea dentro da navegação.</p>

              <h2>Como usar lançamentos sem perder a clareza da decisão</h2>
              <p>No fim das contas, acompanhar lançamentos vale muito quando a novidade está sendo usada como ferramenta de descoberta, e não como desculpa para uma comparação desorganizada. O melhor lançamento é aquele que ajuda o usuário a encontrar um tema mais aderente, um presente mais interessante ou uma oportunidade que faça sentido dentro do orçamento e do contexto da compra. Quando isso fica claro, a vitrine deixa de ser um desfile de curiosidades e passa a funcionar como parte estratégica da jornada de decisão.</p>
              <p>Se você quer continuar com mais contexto, vale partir de <Link to="/categoria/lancamentos"><strong>lançamentos</strong></Link>, cruzar a navegação com <Link to="/guia/bonecos-de-montar-por-faixa-de-preco"><strong>faixa de preço</strong></Link> ou <Link to="/guia/comparativo-super-herois-roblox-series-tv"><strong>comparativo de temas</strong></Link>, e então validar produtos específicos conforme a intenção principal da compra. Esse fluxo transforma novidade em descoberta útil, reforça a malha interna da loja e ajuda a tornar a decisão muito mais clara.</p>
            </article>

            <Card className="mt-16">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-3">Perguntas frequentes sobre lançamentos de bonecos de montar</h2>
                <p className="mb-6 text-muted-foreground">As perguntas abaixo ajudam a entender quando novidade melhora a navegação e quando ela deve ser combinada com outros filtros.</p>
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
              description="Continue a navegação com conteúdos complementares sobre preço, presente, temas e início de jornada."
            />

            <div className="mt-16 grid gap-4 md:grid-cols-3">
              <Link to="/categoria/lancamentos" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Categoria de lançamentos</h3><p className="text-sm text-muted-foreground">Veja as novidades mais recentes antes de cruzar com tema e contexto.</p></Link>
              <Link to="/bonecos-de-montar" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Guia principal</h3><p className="text-sm text-muted-foreground">Use o hub principal para reorganizar a busca antes de aprofundar um lançamento.</p></Link>
              <Link to="/ofertas-especiais" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Ofertas especiais</h3><p className="text-sm text-muted-foreground">Compare novidade com oportunidade antes de decidir a melhor rota.</p></Link>
            </div>

            <div className="mt-16">
              <AuthorSignature articleCountLabel="Guia prático para usar novidades como filtro de descoberta" />
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="mt-20">
              <ProductCarousel products={recommendedProducts} title="Produtos recomendados entre os lançamentos" />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
