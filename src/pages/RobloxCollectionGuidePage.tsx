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

const pageUrl = 'https://www.qblox.com.br/guia/como-comecar-uma-colecao-de-roblox';
const pageTitle = 'Como começar uma coleção de Roblox';
const pageDescription = 'Guia completo para começar uma coleção de Roblox com mais contexto, entendendo tema, variedade, continuidade visual e produtos de entrada.';
const pageKeywords = 'como começar uma coleção de roblox, bonecos de roblox, coleção de roblox, roblox para presente, bonecos de montar de roblox';

const faq: FAQItem[] = [
  { question: 'Como começar uma coleção de Roblox?', answer: 'O melhor caminho é começar por uma página pilar que organize o tema, depois visitar a categoria principal e só então validar produtos em destaque.' },
  { question: 'Vale começar por personagens populares ou por ofertas?', answer: 'Depende da intenção. Personagens populares ajudam na afinidade temática, enquanto ofertas ajudam a testar a primeira compra com menos risco.' },
  { question: 'Como saber se vale expandir a coleção?', answer: 'A melhor referência é olhar variedade de produtos, consistência visual do tema e presença de vitrines ou guias relacionados.' },
  { question: 'Roblox funciona bem para iniciantes?', answer: 'Sim, especialmente quando o usuário já se conecta com avatares, estética blocky e universo gamer.' },
  { question: 'O que torna Roblox tão bom para coleção?', answer: 'A identidade visual forte e a facilidade de reconhecer personagens ajudam bastante na formação de uma coleção coesa.' },
  { question: 'Vale comparar Roblox com outros temas antes de decidir?', answer: 'Sim. Para alguns perfis, pode fazer sentido comparar com Super Heróis ou Séries da TV antes de aprofundar a busca.' },
  { question: 'Como usar a categoria Roblox sem se perder?', answer: 'O ideal é navegar primeiro pelo pilar, depois pela categoria e só então abrir poucos produtos específicos para validar a direção da coleção.' },
  { question: 'Quando um produto de Roblox parece bom para primeira compra?', answer: 'Quando ele tem boa leitura visual, tema claro, conexão com outros itens e ajuda a visualizar continuidade para a coleção.' }
];

const relatedGuides = [
  {
    path: '/guia/melhores-bonecos-de-montar-para-iniciantes',
    title: 'Melhores bonecos de montar para iniciantes',
    excerpt: 'Descubra por que Roblox pode funcionar tão bem como porta de entrada para novos compradores.'
  },
  {
    path: '/guia/comparativo-super-herois-roblox-series-tv',
    title: 'Comparativo entre Super Heróis, Roblox e Séries da TV',
    excerpt: 'Compare Roblox com outros temas fortes antes de aprofundar a escolha.'
  },
  {
    path: '/guia/como-escolher-bonecos-de-montar-por-idade',
    title: 'Como escolher bonecos de montar por idade',
    excerpt: 'Cruze faixa etária e tema para organizar melhor a entrada no universo Roblox.'
  },
  {
    path: '/guia/bonecos-de-montar-para-presentear',
    title: 'Bonecos de montar para presentear: como escolher melhor',
    excerpt: 'Entenda quando Roblox funciona bem como presente e como validar isso com mais contexto.'
  }
];

export default function RobloxCollectionGuidePage() {
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
        console.error('Erro ao carregar dados do guia de Roblox:', error);
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
    { name: pageTitle, url: '/guia/como-comecar-uma-colecao-de-roblox' },
  ]);

  const itemListSchema = useMemo(() => {
    if (featuredProductLinks.length === 0) return null;

    return generateItemListSchema(
      'Produtos recomendados de Roblox',
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
        title="Como começar uma coleção de Roblox | Guia completo QBLOX"
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
              <span className="text-foreground font-medium">Coleção de Roblox</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-5xl">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Guia editorial QBLOX</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">{pageTitle}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Se você quer montar uma coleção de Roblox sem sair abrindo produtos aleatoriamente, este guia ajuda a transformar afinidade temática em um caminho mais claro de navegação e decisão.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link to={QBLOX_AUTHOR_PAGE_PATH} className="font-medium text-foreground transition-colors hover:text-primary">Por {QBLOX_AUTHOR_NAME}</Link>
              <span>•</span>
              <span>Atualizado em 15 de maio de 2026</span>
              <span>•</span>
              <span>Leitura de 8 min</span>
            </div>

            <ArticleShareButtons url={pageUrl} title={pageTitle} />

            <article className="prose prose-lg max-w-none mt-12">
              <h2>Por que Roblox funciona tão bem como universo de entrada</h2>
              <p>O universo de <strong>bonecos de Roblox</strong> costuma ter uma vantagem muito clara para quem está começando: a identificação visual acontece rápido. Diferentemente de temas que dependem mais de franquias tradicionais ou de repertório mais amplo, Roblox conversa diretamente com um imaginário contemporâneo, ligado a avatares, universo gamer e estética blocky. Isso faz com que a categoria se organize de maneira muito intuitiva para quem já gosta desse tipo de linguagem visual. Quando o usuário entra por esse caminho, a navegação fica menos genérica e mais orientada, o que é ótimo tanto para compra quanto para formação de coleção.</p>
              <p>Essa força como porta de entrada acontece porque Roblox entrega dois benefícios ao mesmo tempo. Por um lado, a leitura do tema é muito clara logo no primeiro contato. Por outro, existe espaço para aprofundar a busca depois da primeira escolha. Isso faz com que o pilar de <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link> funcione bem não só como categoria de afinidade imediata, mas também como início de uma jornada mais longa dentro da loja. Para quem quer começar uma coleção, isso é especialmente valioso, porque permite entrar com segurança e manter coerência ao longo da expansão da busca.</p>

              <h2>O que observar antes de escolher os primeiros itens da coleção</h2>
              <p>Começar uma coleção não depende apenas de gostar do tema. Também é preciso perceber como esse tema se organiza dentro do catálogo e até onde ele oferece margem para continuidade. Quando a pessoa abre produtos isolados cedo demais, sem antes entender a lógica da categoria, corre o risco de montar uma coleção pouco coerente ou baseada em escolhas impulsivas. Por isso, antes de abrir qualquer item, vale observar se o universo faz sentido de forma ampla, se o visual é consistente e se existem caminhos naturais para continuar a navegação depois da primeira compra.</p>
              <p>Alguns critérios ajudam bastante a deixar essa etapa mais racional:
              </p>
              <ul>
                <li>clareza visual do universo Roblox dentro da categoria;</li>
                <li>facilidade de reconhecer personagens e estilos semelhantes;</li>
                <li>presença de produtos relacionados que permitam continuidade;</li>
                <li>existência de guias, vitrines e páginas pilar que ajudem a comparar melhor.</li>
              </ul>
              <p>Quando esses sinais aparecem, o usuário entende que não está apenas comprando uma peça isolada, mas entrando em um universo que pode ser explorado com mais profundidade ao longo do tempo.</p>

              <h2>Como a categoria Roblox ajuda a organizar melhor a busca</h2>
              <p>Uma das maiores vantagens de começar uma coleção de Roblox é que a categoria costuma oferecer um recorte muito claro do universo temático. Isso ajuda o usuário a filtrar rapidamente o que tem mais aderência ao seu gosto e reduz bastante o ruído da navegação. Em vez de dispersar energia em vários temas diferentes, a pessoa começa a enxergar personagens, vitrines e produtos sob a mesma lógica visual, o que facilita muito a comparação. Quando isso acontece, a jornada deixa de ser só exploratória e passa a parecer muito mais coerente com a intenção inicial.</p>
              <p>É justamente por isso que faz tanto sentido sair do pilar de <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link> e aprofundar na <Link to="/categoria/roblox"><strong>categoria Roblox</strong></Link> antes de abrir itens específicos. Esse encadeamento ajuda o usuário a perceber variedade, recorrência temática e possibilidades de continuidade. Em coleções, isso pesa muito. Quem quer construir algo consistente normalmente se beneficia mais de uma categoria bem organizada do que de uma compra puramente visual e isolada. Essa estrutura cria um ambiente melhor para comparar e fortalece a percepção de que a coleção está se formando com algum critério real.</p>

              <h2>Quando Roblox funciona melhor para presente e quando funciona melhor para coleção</h2>
              <p>O tema <strong>Roblox</strong> pode funcionar muito bem em presente, mas também se destaca como universo de coleção. A diferença está no contexto da compra. Quando o objetivo é presentear alguém que já se identifica com esse imaginário, a escolha tende a ser rápida porque o reconhecimento da estética gamer resolve boa parte da decisão. Já quando o foco é coleção, o usuário começa a olhar com mais atenção para continuidade, combinação visual e expansão futura dentro da categoria. Em ambos os casos, o tema é forte, mas a forma de navegar muda bastante.</p>
              <p>Em presentes, o ponto forte está em identificação imediata. Em coleção, o ponto forte está em coerência visual e profundidade de universo. Isso explica por que esse tema conversa tão bem com guias como <Link to="/guia/bonecos-de-montar-para-presentear"><strong>presentear</strong></Link> e <Link to="/guia/melhores-bonecos-de-montar-para-iniciantes"><strong>iniciantes</strong></Link>. Um mesmo universo pode ajudar em momentos diferentes da jornada, desde que o usuário saiba o que está tentando resolver. Quando essa diferença fica clara, a navegação fica muito mais inteligente e muito menos impulsiva.</p>

              <h2>Três produtos para validar se o tema realmente faz sentido</h2>
              <p>Depois de entender a força do universo Roblox, chega o momento de validar essa percepção em produtos concretos. Essa etapa é importante porque impede que o usuário fique apenas no nível da intenção e ajuda a transformar o tema em comparação prática. Quando os links para produtos aparecem dentro do conteúdo, a jornada se torna mais útil e a passagem do guia para a loja ocorre com mais naturalidade. Além disso, esses links reforçam a malha interna e ajudam a conectar a leitura editorial com a camada transacional.</p>
              <p>Se você quer fazer essa validação agora, três boas entradas são estas:</p>
              <ul>
                <li><Link to={featuredProductLinks[0] ? getProductPath(featuredProductLinks[0]) : '/loja'}><strong>{featuredProductLinks[0]?.name || 'Produto em destaque 1'}</strong></Link> — bom para avaliar força visual e aderência imediata ao tema;</li>
                <li><Link to={featuredProductLinks[1] ? getProductPath(featuredProductLinks[1]) : '/loja'}><strong>{featuredProductLinks[1]?.name || 'Produto em destaque 2'}</strong></Link> — útil para comparar o potencial de presente com a continuidade da coleção;</li>
                <li><Link to={featuredProductLinks[2] ? getProductPath(featuredProductLinks[2]) : '/loja'}><strong>{featuredProductLinks[2]?.name || 'Produto em destaque 3'}</strong></Link> — indicado para entender até onde vale aprofundar a navegação nesse universo.</li>
              </ul>
              <p>Esses pontos de entrada transformam o guia em uma ponte prática entre afinidade temática e decisão mais concreta dentro da loja.</p>

              <h2>Quando vale comparar Roblox com outros universos antes de aprofundar</h2>
              <p>Apesar da força do tema, nem sempre Roblox será a melhor escolha para todos os perfis. Em alguns casos, vale muito a pena comparar com outros universos antes de seguir. Se o reconhecimento rápido de personagem é mais importante do que a estética gamer, <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link> pode ser um caminho mais forte. Se a decisão depende de afinidade com franquias televisivas, <Link to="/bonecos-de-series-da-tv"><strong>Séries da TV</strong></Link> pode gerar mais identificação. Fazer essa comparação não enfraquece a rota Roblox; apenas ajuda a confirmar se ela é realmente a mais coerente para a intenção da compra.</p>
              <p>É por isso que conteúdos como <Link to="/guia/comparativo-super-herois-roblox-series-tv"><strong>o comparativo entre temas</strong></Link> são tão úteis. Eles ajudam o usuário a sair da lógica de preferência genérica e entrar em uma comparação mais estruturada, cruzando contexto, perfil e apelo visual. Quando isso acontece, a pessoa navega com mais confiança e tende a perceber mais rápido se o universo Roblox é realmente o mais aderente para começar ou ampliar a coleção.</p>

              <h2>Como transformar afinidade temática em uma coleção mais consistente</h2>
              <p>No fim das contas, começar uma coleção de Roblox não significa apenas comprar um primeiro item. Significa entrar em um universo que precisa fazer sentido de forma ampla para continuar interessante com o tempo. Quando o usuário entende isso, ele deixa de pensar apenas em um produto e passa a enxergar o catálogo como um ambiente de continuidade. É esse olhar que ajuda a construir uma coleção mais coerente, mais conectada com a afinidade pessoal e muito menos dependente de compras impulsivas.</p>
              <p>Se você quer continuar com mais contexto, o melhor caminho é sair do <Link to="/bonecos-de-roblox"><strong>pilar de Roblox</strong></Link>, aprofundar na <Link to="/categoria/roblox"><strong>categoria principal</strong></Link>, validar produtos específicos e então cruzar essa navegação com guias como <Link to="/guia/melhores-bonecos-de-montar-para-iniciantes"><strong>iniciantes</strong></Link> ou <Link to="/guia/bonecos-de-montar-para-presentear"><strong>presentear</strong></Link>, dependendo da intenção da jornada. Esse fluxo torna a coleção mais consistente e ajuda a loja a conduzir a decisão com muito mais clareza.</p>
            </article>

            <Card className="mt-16">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-3">Perguntas frequentes sobre como começar uma coleção de Roblox</h2>
                <p className="mb-6 text-muted-foreground">As perguntas abaixo ajudam a tirar dúvidas comuns de quem quer transformar afinidade temática em uma coleção mais coerente.</p>
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
              description="Continue a navegação com conteúdos complementares sobre comparação de temas, início de jornada, idade e presente."
            />

            <div className="mt-16 grid gap-4 md:grid-cols-3">
              <Link to="/bonecos-de-roblox" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Pilar de Roblox</h3><p className="text-sm text-muted-foreground">Aprofunde a busca no hub principal do tema antes de seguir para produtos.</p></Link>
              <Link to="/categoria/roblox" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Categoria Roblox</h3><p className="text-sm text-muted-foreground">Veja a variedade de produtos e compare personagens com mais contexto.</p></Link>
              <Link to="/categoria/lancamentos" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Lançamentos</h3><p className="text-sm text-muted-foreground">Use os lançamentos para descobrir novas oportunidades dentro do tema.</p></Link>
            </div>

            <div className="mt-16">
              <AuthorSignature articleCountLabel="Guia prático para iniciar uma coleção com mais clareza de tema" />
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="mt-20">
              <ProductCarousel products={recommendedProducts} title="Produtos recomendados para começar uma coleção de Roblox" />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
