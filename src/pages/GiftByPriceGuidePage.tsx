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

const pageUrl = 'https://qblox.com.br/guia/bonecos-de-montar-por-faixa-de-preco';
const pageTitle = 'Bonecos de montar por faixa de preço';
const pageDescription = 'Guia completo para comparar bonecos de montar por faixa de preço sem perder contexto de tema, categoria, presente e custo-benefício.';
const pageKeywords = 'bonecos de montar por faixa de preço, bonecos de montar baratos, bonecos de montar custo-benefício, presente por faixa de preço, categorias de bonecos de montar';

const faq: FAQItem[] = [
  { question: 'Como escolher bonecos de montar por faixa de preço?', answer: 'O melhor caminho é combinar orçamento com tema, afinidade do personagem e intenção de compra, usando categorias e vitrines para comparar melhor.' },
  { question: 'Vale começar por ofertas ou por categorias?', answer: 'Se o foco principal é orçamento, ofertas ajudam bastante. Se o foco é aderência temática, começar por categorias e páginas pilar tende a ser mais eficiente.' },
  { question: 'Faixa de preço muda a escolha do tema?', answer: 'Pode mudar, principalmente quando a compra é para presente. Algumas categorias equilibram melhor apelo visual e custo-benefício.' },
  { question: 'Preço mais baixo sempre significa melhor escolha?', answer: 'Não. Para decidir bem, é preciso olhar também tema, apelo visual, clareza da categoria e chance de o produto fazer sentido para quem vai receber.' },
  { question: 'Como comparar custo-benefício sem abrir dezenas de produtos?', answer: 'Uma boa prática é começar por uma categoria forte, usar um guia complementar e então abrir poucos produtos específicos para validar tema e faixa de preço.' },
  { question: 'Lançamentos podem valer mesmo com orçamento apertado?', answer: 'Sim, desde que a pessoa esteja aberta a comparar novidade com promoções e categorias já consolidadas antes de decidir.' },
  { question: 'Esse tipo de guia ajuda em compras para presente?', answer: 'Ajuda bastante, porque transforma um teto de gasto em um filtro prático de navegação e evita comparações sem contexto.' },
  { question: 'Quando vale sair da faixa de preço e ir para um guia temático?', answer: 'Quando o usuário percebe que o tema favorito pesa mais do que a diferença de valor entre produtos semelhantes.' }
];

const relatedGuides = [
  {
    path: '/guia/bonecos-de-montar-para-presentear',
    title: 'Bonecos de montar para presentear: como escolher melhor',
    excerpt: 'Veja como tema, contexto da compra e apelo visual podem ajudar a definir melhor o presente.'
  },
  {
    path: '/guia/como-escolher-bonecos-de-montar-por-idade',
    title: 'Como escolher bonecos de montar por idade',
    excerpt: 'Use faixa etária e repertório do personagem para reduzir o risco da compra.'
  },
  {
    path: '/guia/comparativo-super-herois-roblox-series-tv',
    title: 'Comparativo entre Super Heróis, Roblox e Séries da TV',
    excerpt: 'Compare os temas principais da loja antes de decidir quanto faz sentido investir.'
  },
  {
    path: '/guia/melhores-lancamentos-de-bonecos-de-montar',
    title: 'Melhores lançamentos de bonecos de montar',
    excerpt: 'Descubra quando vale priorizar novidade e quando vale olhar oportunidade.'
  }
];

export default function GiftByPriceGuidePage() {
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
        console.error('Erro ao carregar dados do guia por faixa de preço:', error);
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
    { name: pageTitle, url: '/guia/bonecos-de-montar-por-faixa-de-preco' },
  ]);

  const itemListSchema = useMemo(() => {
    if (featuredProductLinks.length === 0) return null;

    return generateItemListSchema(
      'Produtos recomendados por faixa de preço',
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
        title="Bonecos de montar por faixa de preço | Guia completo QBLOX"
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
              <span className="text-foreground font-medium">Faixa de preço</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-5xl">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Guia editorial QBLOX</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">{pageTitle}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Se a sua principal dúvida é quanto gastar, este guia mostra como usar preço como filtro sem transformar a compra em uma escolha rasa, desconectada de tema, contexto e intenção.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link to={QBLOX_AUTHOR_PAGE_PATH} className="font-medium text-foreground transition-colors hover:text-primary">Por {QBLOX_AUTHOR_NAME}</Link>
              <span>•</span>
              <span>Atualizado em 15 de maio de 2026</span>
              <span>•</span>
              <span>Leitura de 8 min</span>
            </div>

            <ArticleShareButtons url={pageUrl} title={pageTitle} />

            <article className="prose prose-lg max-w-none mt-12">
              <h2>Por que a faixa de preço ajuda, mas não pode ser o único critério</h2>
              <p>Quem pesquisa <strong>bonecos de montar por faixa de preço</strong> normalmente quer reduzir o universo de opções sem abrir mão de uma escolha que ainda faça sentido em tema, apelo visual e contexto da compra. Isso é completamente legítimo, porque preço é um filtro importante e ajuda a dar clareza para a navegação. O problema aparece quando ele vira o único critério. Nesse cenário, o usuário corre o risco de escolher algo aparentemente vantajoso, mas com pouco vínculo com o perfil de quem vai receber o produto ou com pouca aderência ao tema que mais faria sentido. É por isso que preço deve funcionar como organizador da busca, e não como substituto de contexto. Quando ele é bem combinado com categoria, universo visual e intenção da compra, a decisão melhora bastante e deixa de parecer uma comparação aleatória entre itens isolados.</p>
              <p>Esse raciocínio é importante porque a noção de “melhor preço” varia conforme o objetivo. Para um presente, o usuário pode aceitar um valor um pouco acima se o apelo visual for mais forte e a chance de acerto parecer maior. Para uma primeira compra, o foco pode estar em custo-benefício, mas ainda assim o tema precisa conversar com o repertório de quem vai usar o produto. Por isso, antes de abrir qualquer vitrine, vale cruzar a faixa de preço com páginas como <Link to="/bonecos-de-montar"><strong>bonecos de montar</strong></Link>, <Link to="/guia/bonecos-de-montar-para-presentear"><strong>o guia para presentear</strong></Link> e <Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>o guia por idade</strong></Link>. Esse encadeamento ajuda a dar mais sentido ao orçamento e reduz o risco de navegar apenas pelo número, sem entender o que aquela compra realmente precisa entregar.</p>

              <h2>Quando o orçamento deve ser o ponto de partida da navegação</h2>
              <p>Em muitos cenários, começar pelo orçamento é a escolha mais eficiente. Isso acontece especialmente quando o usuário já sabe o valor máximo que pretende gastar e quer transformar esse limite em um filtro de decisão. Nesse caso, a faixa de preço deixa de ser um detalhe e passa a estruturar a busca. Ela ajuda a cortar ruído, evita comparações irrelevantes e encurta o caminho até categorias e produtos com maior chance de encaixe. O problema não está em começar pelo preço; está em parar nele. Se o usuário usa o orçamento como primeiro passo e depois aprofunda por categoria, tema e intenção de presente, a jornada tende a ficar muito mais lógica e fluida.</p>
              <p>Essa abordagem funciona melhor quando o leitor enxerga claramente alguns critérios de apoio. Os mais úteis costumam ser:
              </p>
              <ul>
                <li>valor máximo disponível para a compra;</li>
                <li>tema que parece mais aderente ao perfil de quem vai receber;</li>
                <li>necessidade de impacto visual imediato ou compra mais racional;</li>
                <li>possibilidade de comparar promoções, categorias e produtos relacionados.</li>
              </ul>
              <p>Quando esses elementos entram no jogo, a faixa de preço deixa de ser um teto genérico e passa a funcionar como filtro inteligente. Isso é especialmente útil para quem quer presentear sem perder muito tempo com opções que nunca fariam sentido dentro do contexto da compra.</p>

              <h2>Diferença entre produto barato e produto com bom custo-benefício</h2>
              <p>Existe uma diferença importante entre encontrar um produto barato e encontrar um produto com bom custo-benefício. O primeiro critério é puramente numérico. O segundo exige contexto. Um item pode ter valor menor, mas não gerar identificação com o tema, não ajudar na navegação ou não parecer a melhor escolha quando comparado com outras opções do mesmo universo. Já um produto com bom custo-benefício é aquele que equilibra valor, apelo visual, clareza de categoria e potencial de acerto. Para quem está escolhendo dentro do universo de <strong>bonecos de montar</strong>, esse equilíbrio costuma importar muito mais do que uma simples redução de preço.</p>
              <p>É justamente por isso que olhar apenas a vitrine de promoções não resolve tudo. Em muitos casos, a melhor navegação começa por páginas como <Link to="/ofertas-especiais"><strong>ofertas especiais</strong></Link>, mas precisa continuar em universos fortes como <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link> ou <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link>. Quando o usuário faz essa combinação, ele passa a perceber melhor o que realmente está ganhando com aquela escolha. Alguns sinais de bom custo-benefício aparecem com frequência:
              </p>
              <ul>
                <li>tema forte e fácil de reconhecer;</li>
                <li>produto que se conecta naturalmente com outros da mesma categoria;</li>
                <li>boa apresentação visual para quem está comprando por ocasião ou presente;</li>
                <li>navegação simples entre categoria, guia e produto específico.</li>
              </ul>
              <p>Esses sinais ajudam o usuário a avaliar valor percebido, e não apenas preço final. É isso que torna a compra mais satisfatória no longo prazo.</p>

              <h2>Quais categorias costumam equilibrar melhor preço e apelo visual</h2>
              <p>Nem toda categoria responde da mesma forma quando o filtro principal passa a ser orçamento. Algumas funcionam melhor porque oferecem personagens com leitura mais rápida, mais produtos relacionados e categorias que fazem sentido logo no primeiro clique. Quando o usuário quer equilibrar apelo visual com valor, categorias temáticas fortes tendem a ser as melhores candidatas. Isso acontece porque elas ajudam a comparar não só preço, mas contexto de tema, força do personagem e aderência ao perfil da compra. Em vez de um catálogo homogêneo, o leitor passa a enxergar a lógica da loja com muito mais clareza.</p>
              <p>Na prática, vale olhar com atenção para caminhos como <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link>, <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link> e <Link to="/categoria/lancamentos"><strong>Lançamentos</strong></Link>. Cada um ajuda de um jeito diferente. Super Heróis costuma resolver bem compras com forte reconhecimento de personagem. Roblox funciona quando a pessoa valoriza identidade visual contemporânea. Lançamentos fazem sentido quando a compra depende de novidade e comparação com oportunidades recentes. Quando o usuário cruza essas categorias com seu orçamento, a decisão começa a ficar menos genérica e muito mais prática.</p>

              <h2>Como cruzar faixa de preço com intenção de presente sem perder contexto</h2>
              <p>Uma compra guiada por orçamento muda bastante quando o objetivo é presentear. Nesse caso, não basta caber no bolso. O presente também precisa parecer acertado para quem recebe. Isso significa que apelo visual, identificação com o personagem e categoria certa passam a pesar junto com o valor. Quando o usuário entende isso, ele começa a usar a faixa de preço como ferramenta de refinamento, e não como uma barreira que empurra a escolha para qualquer item mais barato. Esse ajuste mental melhora muito a qualidade da navegação e evita frustração na etapa final da compra.</p>
              <p>Para fazer esse cruzamento com mais inteligência, ajuda pensar em perguntas como: o tema já está definido? A idade da pessoa já é conhecida? A compra depende de oportunidade ou de impacto visual? É aqui que guias complementares como <Link to="/guia/bonecos-de-montar-para-presentear"><strong>presentear</strong></Link> e <Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>idade</strong></Link> se tornam tão importantes. Eles ajudam a contextualizar o valor e evitam que o leitor trate orçamento como se fosse o único organizador da jornada. Quando o preço conversa com tema e ocasião, a decisão tende a ser muito mais segura.</p>

              <h2>Três produtos para começar a comparação com mais contexto de valor</h2>
              <p>Assim como em outros guias, o conteúdo só ganha função prática quando começa a apontar produtos específicos. Isso é essencial porque ajuda o usuário a validar visualmente se aquele orçamento ainda faz sentido dentro do tema escolhido. Também reforça a navegação interna, criando pontes entre a explicação editorial e a etapa transacional. Quando esses links são posicionados no ponto certo, o leitor consegue sair da abstração e entrar em uma comparação real, com mais clareza sobre o que está ganhando e o que está sacrificando em cada faixa de valor.</p>
              <p>Se você quer transformar agora esse filtro de orçamento em comparação concreta, três boas entradas são estas:</p>
              <ul>
                <li><Link to={featuredProductLinks[0] ? getProductPath(featuredProductLinks[0]) : '/loja'}><strong>{featuredProductLinks[0]?.name || 'Produto em destaque 1'}</strong></Link> — útil para validar se um valor mais enxuto ainda entrega bom apelo visual;</li>
                <li><Link to={featuredProductLinks[1] ? getProductPath(featuredProductLinks[1]) : '/loja'}><strong>{featuredProductLinks[1]?.name || 'Produto em destaque 2'}</strong></Link> — bom para comparar preço com tema e potencial de presente;</li>
                <li><Link to={featuredProductLinks[2] ? getProductPath(featuredProductLinks[2]) : '/loja'}><strong>{featuredProductLinks[2]?.name || 'Produto em destaque 3'}</strong></Link> — indicado para quem quer entender até onde vale subir ou descer no orçamento sem perder aderência.</li>
              </ul>
              <p>Essa etapa ajuda muito porque transforma a faixa de preço em um critério palpável, e não apenas em um número solto dentro da jornada.</p>

              <h2>Quando vale olhar ofertas, vitrines e lançamentos antes de decidir</h2>
              <p>Nem toda decisão por preço precisa começar diretamente pela categoria. Em alguns casos, vale mais olhar oportunidades antes de aprofundar no tema. Isso acontece principalmente quando o leitor está aberto a novidade, quer descobrir algo com bom impacto visual ou ainda não fechou completamente o universo do presente. Nesses cenários, vitrines de apoio ajudam a encurtar caminho e revelam combinações que talvez não aparecessem numa busca puramente temática. O ponto importante é que isso não deve dispersar a navegação, e sim refiná-la.</p>
              <p>É por isso que páginas como <Link to="/ofertas-especiais"><strong>ofertas especiais</strong></Link> e <Link to="/categoria/lancamentos"><strong>lançamentos</strong></Link> funcionam tão bem como apoio. Elas ajudam especialmente quando o usuário:
              </p>
              <ul>
                <li>já definiu um teto de gasto e quer descobrir a melhor oportunidade;</li>
                <li>procura novidade antes de escolher o tema final;</li>
                <li>quer comparar custo-benefício com apelo de produto recente;</li>
                <li>precisa decidir rápido sem abandonar completamente o contexto da compra.</li>
              </ul>
              <p>Quando essas vitrines entram na jornada no momento certo, elas ampliam a comparação sem destruir a lógica do tema. O usuário continua entendendo o que está fazendo, mas passa a ver mais rotas possíveis dentro do seu orçamento.</p>

              <h2>Como usar o orçamento como filtro sem empobrecer a escolha</h2>
              <p>No fim das contas, escolher <strong>bonecos de montar por faixa de preço</strong> não significa procurar o item mais barato. Significa usar o orçamento como um filtro inicial para encontrar a opção mais coerente dentro de um conjunto de possibilidades. Quando esse processo é bem conduzido, o leitor consegue equilibrar valor, tema, contexto de presente e chance de acerto. Isso torna a jornada muito mais útil e muito menos mecânica. A faixa de preço passa a funcionar como um apoio inteligente para a decisão, e não como um atalho que empobrece a experiência.</p>
              <p>Se você quer continuar navegando com mais contexto, o melhor caminho é combinar este guia com páginas como <Link to="/guia/bonecos-de-montar-para-presentear"><strong>presentear</strong></Link>, <Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>idade</strong></Link> e <Link to="/guia/comparativo-super-herois-roblox-series-tv"><strong>comparativo de temas</strong></Link>, antes de validar um produto específico ou seguir para vitrines como <Link to="/ofertas-especiais"><strong>ofertas especiais</strong></Link>. Esse encadeamento torna a decisão mais segura, reforça a interligação entre páginas e ajuda a transformar uma busca por preço em uma escolha realmente bem resolvida.</p>
            </article>

            <Card className="mt-16">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-3">Perguntas frequentes sobre bonecos de montar por faixa de preço</h2>
                <p className="mb-6 text-muted-foreground">As perguntas abaixo ajudam a esclarecer como usar orçamento, tema e contexto da compra de forma mais equilibrada.</p>
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
              description="Continue a navegação com conteúdos complementares sobre presentes, idade, comparação de temas e lançamentos."
            />

            <div className="mt-16 grid gap-4 md:grid-cols-3">
              <Link to="/ofertas-especiais" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Ofertas especiais</h3><p className="text-sm text-muted-foreground">Comece pelas vitrines mais orientadas a custo-benefício.</p></Link>
              <Link to="/bonecos-de-montar" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Guia principal</h3><p className="text-sm text-muted-foreground">Volte ao hub principal antes de aprofundar a comparação por preço.</p></Link>
              <Link to="/loja" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Explorar produtos</h3><p className="text-sm text-muted-foreground">Amplie a busca e compare categorias e vitrines da loja.</p></Link>
            </div>

            <div className="mt-16">
              <AuthorSignature articleCountLabel="Guia prático para comparar preço, tema e custo-benefício" />
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="mt-20">
              <ProductCarousel products={recommendedProducts} title="Produtos recomendados para comparar por faixa de preço" />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
