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

const pageUrl = 'https://www.qblox.com.br/guia/comparativo-super-herois-roblox-series-tv';
const pageTitle = 'Comparativo entre Super Heróis, Roblox e Séries da TV';
const pageDescription = 'Guia completo para comparar os principais temas da loja e descobrir qual categoria faz mais sentido para presente, coleção ou início de jornada.';
const pageKeywords = 'comparativo super heróis roblox séries da tv, bonecos de super heróis, bonecos de roblox, bonecos de séries da tv, comparação de temas';

const faq: FAQItem[] = [
  { question: 'Como comparar Super Heróis, Roblox e Séries da TV?', answer: 'O melhor caminho é olhar intenção de compra, afinidade com personagens, profundidade da categoria e tipo de experiência que cada tema entrega.' },
  { question: 'Existe um melhor tema para começar?', answer: 'Não existe um único melhor tema. O ideal é entender qual universo combina mais com o perfil do usuário e então aprofundar a navegação.' },
  { question: 'Essa comparação ajuda na escolha do presente?', answer: 'Sim. Comparar temas reduz ruído, melhora a leitura do catálogo e acelera bastante a decisão quando o presente depende de identificação com personagens.' },
  { question: 'Super Heróis tende a funcionar melhor para quais perfis?', answer: 'Normalmente para quem valoriza reconhecimento rápido, personagens populares e forte apelo visual.' },
  { question: 'Roblox costuma ser melhor para quem?', answer: 'Para públicos ligados ao universo gamer e à estética de avatares, Roblox tende a gerar identificação mais imediata.' },
  { question: 'Séries da TV fazem mais sentido em que contexto?', answer: 'Funcionam melhor quando a compra é guiada por franquias, lembrança de personagens e afinidade com séries conhecidas.' },
  { question: 'Vale comparar categorias antes de abrir produtos?', answer: 'Sim. Para quem ainda está em dúvida, comparar temas primeiro costuma ser muito mais eficiente do que abrir itens isolados sem critério.' },
  { question: 'Quando faz sentido usar um guia complementar depois deste?', answer: 'Quando o usuário identifica o tema com mais aderência e quer refinar a decisão por idade, presente, orçamento ou produto específico.' }
];

const relatedGuides = [
  {
    path: '/guia/como-escolher-bonecos-de-montar-por-idade',
    title: 'Como escolher bonecos de montar por idade',
    excerpt: 'Use faixa etária como filtro complementar para refinar ainda mais a comparação entre temas.'
  },
  {
    path: '/guia/bonecos-de-montar-para-presentear',
    title: 'Bonecos de montar para presentear: como escolher melhor',
    excerpt: 'Leve a comparação de temas para o contexto de presente e veja como transformar isso em decisão prática.'
  },
  {
    path: '/guia/bonecos-de-montar-por-faixa-de-preco',
    title: 'Bonecos de montar por faixa de preço',
    excerpt: 'Cruze a escolha do tema com orçamento para filtrar melhor os caminhos de navegação.'
  },
  {
    path: '/guia/melhores-bonecos-de-montar-para-iniciantes',
    title: 'Melhores bonecos de montar para iniciantes',
    excerpt: 'Descubra qual desses universos tende a funcionar melhor como primeira porta de entrada.'
  }
];

export default function ThemesComparisonGuidePage() {
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
        console.error('Erro ao carregar dados do comparativo de temas:', error);
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
    { name: pageTitle, url: '/guia/comparativo-super-herois-roblox-series-tv' },
  ]);

  const itemListSchema = useMemo(() => {
    if (featuredProductLinks.length === 0) return null;

    return generateItemListSchema(
      'Produtos recomendados para comparar temas',
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
        title="Comparativo entre Super Heróis, Roblox e Séries da TV | Guia completo QBLOX"
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
              <span className="text-foreground font-medium">Comparativo de temas</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-5xl">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Guia editorial QBLOX</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">{pageTitle}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Se a dúvida está entre temas diferentes, este comparativo ajuda a entender qual categoria faz mais sentido para presente, coleção, afinidade visual e contexto da compra.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link to={QBLOX_AUTHOR_PAGE_PATH} className="font-medium text-foreground transition-colors hover:text-primary">Por {QBLOX_AUTHOR_NAME}</Link>
              <span>•</span>
              <span>Atualizado em 15 de maio de 2026</span>
              <span>•</span>
              <span>Leitura de 8 min</span>
            </div>

            <ArticleShareButtons url={pageUrl} title={pageTitle} />

            <article className="prose prose-lg max-w-none mt-12">
              <h2>Por que comparar temas antes de abrir produtos ajuda tanto na decisão</h2>
              <p>Quando a busca ainda está ampla, o maior erro costuma ser abrir produtos isolados sem antes entender qual universo tem mais aderência ao perfil da compra. É justamente por isso que um comparativo entre <strong>Super Heróis</strong>, <strong>Roblox</strong> e <strong>Séries da TV</strong> é tão importante. Ele organiza a navegação e reduz a sensação de ruído, porque ajuda o usuário a perceber se a decisão deve ser guiada por personagem popular, estética gamer, afinidade com franquias ou potencial de presente. Sem esse filtro, a comparação tende a ficar dispersa e a pessoa perde tempo com páginas que não conversam entre si.</p>
              <p>Esse tipo de conteúdo funciona como uma camada de clareza antes da etapa transacional. Em vez de clicar em qualquer item da loja, o leitor começa a entender quais temas entregam mais reconhecimento visual, quais ajudam mais em compras para presente e quais fazem mais sentido para quem deseja iniciar ou ampliar uma coleção. É por isso que esse artigo deve ser lido como uma ponte entre os pilares <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link>, <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link> e <Link to="/bonecos-de-series-da-tv"><strong>Séries da TV</strong></Link>, criando uma navegação mais coerente e muito menos aleatória.</p>

              <h2>Quando Super Heróis tende a funcionar melhor do que os outros temas</h2>
              <p>O universo de <strong>Super Heróis</strong> costuma se destacar quando a decisão depende de reconhecimento rápido, personagens populares e forte apelo visual. Para muitos perfis, essa é a rota mais simples porque a identificação acontece quase imediatamente. Não é preciso explicar demais o contexto: o personagem já carrega força própria, e isso facilita bastante a navegação. Em presentes, esse fator pesa muito. Em compras por afinidade, também. O usuário bate o olho e entende rapidamente o que aquela categoria representa, o que acelera a comparação e reduz a hesitação.</p>
              <p>Isso não significa que Super Heróis serve para todo mundo, mas indica que esse tema é particularmente forte em alguns contextos. Entre eles, vale destacar:
              </p>
              <ul>
                <li>presentes que precisam causar boa impressão logo de início;</li>
                <li>compras guiadas por personagens populares;</li>
                <li>navegação rápida para quem ainda não conhece bem o catálogo;</li>
                <li>comparação baseada em impacto visual e familiaridade imediata.</li>
              </ul>
              <p>Quando esse é o tipo de resposta que o usuário espera, aprofundar a busca em <Link to="/categoria/super-herois"><strong>categoria de Super Heróis</strong></Link> ou em um produto como <Link to={featuredProductLinks[0] ? getProductPath(featuredProductLinks[0]) : '/loja'}><strong>{featuredProductLinks[0]?.name || 'um produto em destaque'}</strong></Link> costuma ser um bom próximo passo.</p>

              <h2>Quando Roblox faz mais sentido como tema principal da navegação</h2>
              <p>O universo de <strong>Roblox</strong> tende a funcionar melhor quando a pessoa que vai receber ou comprar já se conecta com estética gamer, avatares e personagens de linguagem mais contemporânea. A identificação aqui não vem tanto da tradição de franquia, mas da proximidade com um repertório digital muito específico. Para alguns públicos, isso vale mais do que qualquer argumento de categoria ampla. Quando esse é o caso, a navegação melhora bastante porque o usuário deixa de comparar temas que nunca fariam sentido e passa a focar em uma categoria que conversa diretamente com sua referência visual.</p>
              <p>Esse cenário é particularmente forte quando a compra precisa parecer atual, conectada a um universo reconhecível e coerente com a linguagem do público. Alguns sinais de que Roblox pode ser a rota certa são:
              </p>
              <ul>
                <li>interesse claro por avatares, estética gamer e personagens blocky;</li>
                <li>busca por presente ligada a um repertório digital conhecido;</li>
                <li>necessidade de uma categoria com identidade visual forte desde o início;</li>
                <li>vontade de transformar afinidade temática em uma coleção mais organizada.</li>
              </ul>
              <p>Nesses casos, o melhor caminho costuma ser partir do pilar de <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link>, depois validar a profundidade da <Link to="/categoria/roblox"><strong>categoria Roblox</strong></Link> e então abrir produtos específicos para uma comparação mais concreta.</p>

              <h2>Quando Séries da TV pode ser a melhor escolha</h2>
              <p>O tema <strong>Séries da TV</strong> costuma funcionar melhor quando a decisão nasce da afinidade com franquias, personagens de séries conhecidas ou universos que já carregam vínculo emocional. Ao contrário de Super Heróis, onde o apelo vem muito da força do personagem, ou de Roblox, onde a estética contemporânea pesa bastante, aqui o que impulsiona a escolha é o reconhecimento narrativo. A pessoa não quer apenas um produto visualmente forte; ela quer um universo que remeta a uma lembrança, a uma franquia ou a um repertório específico de séries.</p>
              <p>Esse tipo de compra costuma fazer mais sentido em contextos como:
              </p>
              <ul>
                <li>presentes guiados por personagens de séries ou franquias;</li>
                <li>compras com foco em afinidade temática mais emocional;</li>
                <li>coleções que valorizam variedade de universos e referências culturais;</li>
                <li>navegação baseada em personagens já conhecidos antes da busca.</li>
              </ul>
              <p>Quando essa é a lógica, páginas como <Link to="/bonecos-de-series-da-tv"><strong>Séries da TV</strong></Link> e produtos conectados a esse universo ajudam a tornar a decisão muito mais coerente do que uma comparação puramente visual entre categorias genéricas.</p>

              <h2>Como escolher o melhor tema quando a intenção é presentear</h2>
              <p>Quando a compra tem intenção de presente, a comparaç��o entre temas ganha um peso muito mais prático. O objetivo deixa de ser apenas descobrir qual universo parece mais interessante e passa a ser entender qual deles reduz melhor a chance de erro. Nessa hora, a pergunta certa não é “qual tema é melhor em absoluto?”, mas sim “qual tema faz mais sentido para esta pessoa, neste contexto, com este tipo de apelo?”. Esse deslocamento muda completamente a leitura da loja e evita que o usuário navegue por temas fortes, mas pouco aderentes ao perfil de quem vai receber.</p>
              <p>Em geral, <strong>Super Heróis</strong> ganha vantagem quando o reconhecimento rápido importa mais. <strong>Roblox</strong> cresce quando existe afinidade com universo gamer. <strong>Séries da TV</strong> passa à frente quando o valor emocional da franquia pesa mais do que o apelo imediato da categoria. É justamente por isso que esse comparativo conversa tão bem com conteúdos como <Link to="/guia/bonecos-de-montar-para-presentear"><strong>o guia para presentear</strong></Link> e <Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>o guia por idade</strong></Link>, que aprofundam a decisão em outras camadas sem quebrar a lógica do tema principal.</p>

              <h2>Três produtos para começar a comparação entre temas de forma concreta</h2>
              <p>Depois de entender as diferenças entre os universos, chega o momento de validar se essa percepção se sustenta na comparação entre produtos reais. É essa etapa que transforma o comparativo em algo prático e útil. Quando o conteúdo aponta produtos específicos, o usuário consegue perceber se o tema continua fazendo sentido fora da teoria, observando melhor imagem, força do personagem, contexto visual e aderência à intenção da compra. Além disso, essa malha de links internos ajuda a conectar o artigo com páginas mais profundas da loja.</p>
              <p>Se você quer começar essa validação agora, três boas entradas são estas:</p>
              <ul>
                <li><Link to={featuredProductLinks[0] ? getProductPath(featuredProductLinks[0]) : '/loja'}><strong>{featuredProductLinks[0]?.name || 'Produto em destaque 1'}</strong></Link> — útil para avaliar força de personagem e leitura visual imediata;</li>
                <li><Link to={featuredProductLinks[1] ? getProductPath(featuredProductLinks[1]) : '/loja'}><strong>{featuredProductLinks[1]?.name || 'Produto em destaque 2'}</strong></Link> — bom para comparar tema e potencial de presente;</li>
                <li><Link to={featuredProductLinks[2] ? getProductPath(featuredProductLinks[2]) : '/loja'}><strong>{featuredProductLinks[2]?.name || 'Produto em destaque 3'}</strong></Link> — indicado para validar se vale aprofundar naquele universo antes de seguir.</li>
              </ul>
              <p>Esse tipo de passagem torna o comparativo mais robusto, porque ele deixa de ser só um texto explicativo e passa a funcionar como organizador da navegação real.</p>

              <h2>Quando faz sentido cruzar o tema com idade, orçamento ou início de jornada</h2>
              <p>Nem sempre o comparativo entre temas resolve tudo sozinho. Em muitos casos, ele serve como primeira triagem, e a decisão ainda precisa ser refinada por idade, orçamento ou estágio da jornada de compra. Isso acontece porque um mesmo tema pode funcionar muito bem em um perfil e nem tanto em outro. É exatamente nessa etapa que os guias complementares entram para aprofundar a comparação. Em vez de obrigar o usuário a recomeçar sua pesquisa, a loja oferece caminhos que preservam o contexto e adicionam novas camadas à decisão.</p>
              <p>Os três cruzamentos mais úteis costumam ser estes:</p>
              <ul>
                <li><Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>idade</strong></Link>, quando a faixa etária ainda precisa ser usada como filtro;</li>
                <li><Link to="/guia/bonecos-de-montar-por-faixa-de-preco"><strong>faixa de preço</strong></Link>, quando orçamento pesa mais do que afinidade inicial;</li>
                <li><Link to="/guia/melhores-bonecos-de-montar-para-iniciantes"><strong>iniciantes</strong></Link>, quando o usuário ainda está tentando entender qual porta de entrada faz mais sentido.</li>
              </ul>
              <p>Quando esse encadeamento acontece, a comparação entre temas fica muito mais útil e adaptável a diferentes tipos de jornada.</p>

              <h2>Como transformar a comparação de temas em uma decisão realmente útil</h2>
              <p>No fim das contas, o melhor tema é aquele que faz mais sentido para a intenção da compra, e não necessariamente o que parece mais forte em abstrato. <strong>Super Heróis</strong>, <strong>Roblox</strong> e <strong>Séries da TV</strong> podem funcionar muito bem, desde que a escolha respeite o contexto certo. Quando o usuário entende isso, ele sai da lógica de “qual tema é mais popular?” e entra em uma pergunta muito mais útil: “qual universo conversa melhor com o perfil desta compra?”. Essa mudança melhora a navegação, reduz o ruído e fortalece toda a jornada editorial da loja.</p>
              <p>Se você quer continuar a decisão com mais contexto, o melhor caminho é aprofundar primeiro no pilar que parece mais aderente, depois validar um produto específico ou um guia complementar conforme a necessidade da jornada. Esse fluxo cria uma navegação mais inteligente entre páginas pilar, categorias, guias e produtos, e é exatamente o que torna esse comparativo realmente útil para quem está escolhendo melhor.</p>
            </article>

            <Card className="mt-16">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-3">Perguntas frequentes sobre a comparação entre Super Heróis, Roblox e Séries da TV</h2>
                <p className="mb-6 text-muted-foreground">As perguntas abaixo ajudam a eliminar dúvidas comuns de quem ainda está definindo o melhor tema antes de aprofundar em categorias e produtos.</p>
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
              description="Continue a navegação com conteúdos complementares sobre idade, presente, orçamento e início de jornada."
            />

            <div className="mt-16 grid gap-4 md:grid-cols-3">
              <Link to="/bonecos-de-super-herois" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Super Heróis</h3><p className="text-sm text-muted-foreground">Aprofunde a busca no tema de maior reconhecimento visual e força de personagem.</p></Link>
              <Link to="/bonecos-de-roblox" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Roblox</h3><p className="text-sm text-muted-foreground">Compare a categoria certa para quem se conecta com universo gamer e avatares.</p></Link>
              <Link to="/bonecos-de-series-da-tv" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Séries da TV</h3><p className="text-sm text-muted-foreground">Explore o tema mais aderente quando a decisão é guiada por franquias e séries conhecidas.</p></Link>
            </div>

            <div className="mt-16">
              <AuthorSignature articleCountLabel="Guia comparativo para decidir entre os principais universos da loja" />
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="mt-20">
              <ProductCarousel products={recommendedProducts} title="Produtos recomendados para comparar temas" />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
