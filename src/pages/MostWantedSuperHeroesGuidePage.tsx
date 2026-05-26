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

const pageUrl = 'https://www.qblox.com.br/guia/bonecos-de-super-herois-mais-procurados';
const pageTitle = 'Bonecos de super-heróis mais procurados';
const pageDescription = 'Guia completo para entender quais personagens e temas de super-heróis costumam gerar mais interesse e como usar isso para escolher melhor.';
const pageKeywords = 'bonecos de super-heróis mais procurados, bonecos de montar de super-heróis, personagens mais buscados, bonecos de heróis para presente, super-heróis para colecionar';

const faq: FAQItem[] = [
  { question: 'Quais bonecos de super-heróis costumam ser mais procurados?', answer: 'Normalmente os mais procurados são os ligados a personagens clássicos, categorias de forte apelo visual e universos com boa profundidade de navegação.' },
  { question: 'Como usar esse tema para escolher melhor?', answer: 'O melhor caminho é sair da página pilar, visitar a categoria principal e só depois validar produtos, ofertas e conteúdos complementares.' },
  { question: 'Vale olhar vitrines antes de abrir a categoria completa?', answer: 'Sim. As vitrines ajudam a identificar tendências e produtos de maior saída antes de aprofundar a busca.' },
  { question: 'Esse tema funciona bem para presentear?', answer: 'Sim, especialmente quando a decisão depende de reconhecimento imediato, personagens populares e impacto visual.' },
  { question: 'Super-heróis servem também para colecionadores?', answer: 'Servem bastante, principalmente quando o usuário valoriza continuidade temática, variedade de personagens e potencial de combinação entre produtos.' },
  { question: 'O que faz um personagem vender mais dentro dessa categoria?', answer: 'A combinação de notoriedade, força visual, apelo emocional e presença consistente dentro da categoria costuma aumentar muito a procura.' },
  { question: 'Vale comparar com outros temas antes de decidir?', answer: 'Sim. Dependendo do perfil da compra, comparar com Roblox ou Séries da TV pode deixar a escolha mais segura.' },
  { question: 'Quando faz sentido abrir um produto específico?', answer: 'Quando o usuário já identificou o personagem ou subtema com mais aderência e quer validar imagem, categoria e relação com outros itens.' }
];

const relatedGuides = [
  {
    path: '/guia/comparativo-super-herois-roblox-series-tv',
    title: 'Comparativo entre Super Heróis, Roblox e Séries da TV',
    excerpt: 'Compare o universo de super-heróis com outros temas fortes antes de aprofundar a compra.'
  },
  {
    path: '/guia/bonecos-de-montar-para-presentear',
    title: 'Bonecos de montar para presentear: como escolher melhor',
    excerpt: 'Entenda quando super-heróis funciona melhor como presente e como validar essa escolha.'
  },
  {
    path: '/guia/melhores-bonecos-de-montar-para-iniciantes',
    title: 'Melhores bonecos de montar para iniciantes',
    excerpt: 'Veja por que super-heróis costuma ser uma porta de entrada tão forte para novos compradores.'
  },
  {
    path: '/guia/como-escolher-bonecos-de-montar-por-idade',
    title: 'Como escolher bonecos de montar por idade',
    excerpt: 'Cruze faixa etária com o universo de heróis para filtrar melhor a navegação.'
  }
];

export default function MostWantedSuperHeroesGuidePage() {
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
        console.error('Erro ao carregar dados do guia de super-heróis:', error);
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
    { name: pageTitle, url: '/guia/bonecos-de-super-herois-mais-procurados' },
  ]);

  const itemListSchema = useMemo(() => {
    if (featuredProductLinks.length === 0) return null;

    return generateItemListSchema(
      'Produtos recomendados de super-heróis',
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
        title="Bonecos de super-heróis mais procurados | Guia completo QBLOX"
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
              <span className="text-foreground font-medium">Super-heróis mais procurados</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-5xl">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Guia editorial QBLOX</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight xl:text-5xl">{pageTitle}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Se a sua dúvida é por que alguns heróis geram tanta procura e como usar isso para navegar melhor, este guia ajuda a transformar popularidade em critério real de escolha.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Link to={QBLOX_AUTHOR_PAGE_PATH} className="font-medium text-foreground transition-colors hover:text-primary">Por {QBLOX_AUTHOR_NAME}</Link>
              <span>•</span>
              <span>Atualizado em 15 de maio de 2026</span>
              <span>•</span>
              <span>Leitura de 8 min</span>
            </div>

            <ArticleShareButtons url={pageUrl} title={pageTitle} />

            <article className="prose prose-lg max-w-none mt-12">
              <h2>Por que o universo de super-heróis costuma liderar a atenção logo no início da jornada</h2>
              <p>Quando o assunto é <strong>bonecos de super-heróis mais procurados</strong>, a resposta começa pelo reconhecimento. Poucos universos têm tanta capacidade de gerar identificação rápida quanto o de heróis. Isso acontece porque o usuário não precisa fazer muito esforço para entender o tema: o personagem já carrega força visual, história e apelo emocional quase instantaneamente. Em compras para presente, isso encurta bastante o caminho da decisão. Em navegação orgânica, também ajuda muito, porque a pessoa entende mais rápido o que está vendo e por que aquela categoria pode fazer sentido. Em vez de começar a busca por um produto solto, o usuário entra por um universo que já traz clareza.
              </p>
              <p>Esse comportamento explica por que a categoria de <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link> costuma funcionar tão bem como porta de entrada. Ela reúne personagens fortes, boa leitura de vitrine e um contexto que facilita a comparação. Além disso, cria um tipo de navegação que favorece tanto quem quer presentear quanto quem deseja explorar um tema com mais profundidade. Quando o usuário percebe que a categoria faz sentido logo no início, a tendência é permanecer mais tempo, comparar melhor e enxergar com mais clareza quais produtos realmente merecem atenção.</p>

              <h2>O que faz um personagem ser mais procurado dentro dessa categoria</h2>
              <p>Nem todo personagem performa do mesmo jeito dentro do universo de heróis. Alguns se destacam porque já são parte do repertório popular há muito tempo, enquanto outros crescem por força de apelo visual, memória afetiva ou momento de mercado. Quando a pessoa está procurando um tema que ajude a decidir melhor, entender isso faz diferença. O personagem mais procurado normalmente não é só o mais famoso: é o que melhor combina reconhecimento, impacto visual, facilidade de presente e continuidade temática. Isso faz com que a busca pareça mais segura, porque o usuário sente que está comparando algo que já tem validação espontânea dentro da jornada de compra.
              </p>
              <p>Na prática, alguns elementos tendem a empurrar um personagem para o topo da procura:
              </p>
              <ul>
                <li>visual forte e fácil de reconhecer;</li>
                <li>ligação com franquias ou universos muito conhecidos;</li>
                <li>boa presença dentro da categoria e da vitrine da loja;</li>
                <li>alta aderência tanto para presente quanto para coleção.</li>
              </ul>
              <p>Esses sinais ajudam muito porque permitem que o usuário use popularidade como apoio sem transformar a escolha em algo puramente superficial. Popularidade, quando bem lida, pode ser um ótimo atalho para aprofundar a comparação de forma mais inteligente.</p>

              <h2>Quando super-heróis funciona melhor para presente do que para coleção</h2>
              <p>O universo de <strong>bonecos de super-heróis</strong> costuma funcionar de forma muito forte em presentes porque oferece reconhecimento imediato. Quem compra não precisa explicar o contexto, nem apostar tanto em um tema de nicho. O personagem já fala por si. Isso reduz o risco da escolha e aumenta a sensação de acerto logo no primeiro contato. Quando a intenção é presentear alguém que gosta de figuras populares, a categoria de heróis quase sempre ajuda mais do que universos que exigem repertório mais específico. É por isso que esse tema aparece com tanta frequência em comparações ligadas a compra rápida e assertiva.</p>
              <p>Por outro lado, o mesmo universo também pode ser excelente para coleção quando o usuário valoriza variedade, continuidade e identificação com personagens diferentes do mesmo grupo temático. A diferença é que, nesse caso, a navegação costuma ser um pouco mais profunda. Em vez de depender só do impacto visual, o usuário quer entender como aquele produto se relaciona com outros itens. É justamente por isso que esse guia conversa tão bem com páginas como <Link to="/guia/bonecos-de-montar-para-presentear"><strong>presentear</strong></Link> e <Link to="/guia/melhores-bonecos-de-montar-para-iniciantes"><strong>iniciantes</strong></Link>. Um mesmo tema pode servir a objetivos diferentes, desde que o contexto da escolha esteja claro.</p>

              <h2>O que comparar antes de abrir um produto específico</h2>
              <p>Antes de clicar em qualquer item da categoria, vale organizar a decisão com algumas perguntas práticas. O foco está em presente ou em coleção? O personagem precisa ser extremamente popular ou basta pertencer a um universo forte? O apelo visual importa mais do que profundidade de tema? Essas perguntas ajudam a evitar um comportamento muito comum: abrir vários produtos com aparência semelhante sem entender de fato qual faz mais sentido para a intenção da compra. Quando isso acontece, a comparação fica cansativa e pouco objetiva.</p>
              <p>Alguns critérios ajudam bastante a deixar essa etapa mais eficiente:
              </p>
              <ul>
                <li>força visual do personagem no primeiro olhar;</li>
                <li>grau de reconhecimento e familiaridade com o universo;</li>
                <li>capacidade do tema de funcionar como presente ou coleção;</li>
                <li>presença de páginas complementares para continuar a navegação.</li>
              </ul>
              <p>Quando o usuário observa esses pontos antes de abrir um produto, ele reduz a comparação desnecessária e entra na vitrine com mais clareza sobre o que está tentando validar.</p>

              <h2>Três produtos para começar a validação com mais contexto</h2>
              <p>Um comparativo que fala de popularidade só ganha utilidade prática quando leva o leitor para produtos concretos. É isso que transforma a leitura em navegação real. Quando o usuário encontra exemplos específicos no meio do texto, fica muito mais fácil validar se aquele personagem ou universo ainda faz sentido fora do nível abstrato da categoria. Esses links funcionam como pontos de aterrissagem e ajudam a aproximar o conteúdo editorial da decisão transacional dentro da loja.</p>
              <p>Se você quer começar essa validação agora, três boas entradas são estas:</p>
              <ul>
                <li><Link to={featuredProductLinks[0] ? getProductPath(featuredProductLinks[0]) : '/loja'}><strong>{featuredProductLinks[0]?.name || 'Produto em destaque 1'}</strong></Link> — bom para avaliar impacto visual e força imediata do personagem;</li>
                <li><Link to={featuredProductLinks[1] ? getProductPath(featuredProductLinks[1]) : '/loja'}><strong>{featuredProductLinks[1]?.name || 'Produto em destaque 2'}</strong></Link> — útil para comparar categoria e potencial de presente;</li>
                <li><Link to={featuredProductLinks[2] ? getProductPath(featuredProductLinks[2]) : '/loja'}><strong>{featuredProductLinks[2]?.name || 'Produto em destaque 3'}</strong></Link> — indicado para decidir se vale aprofundar a busca nesse universo.</li>
              </ul>
              <p>Esses links tornam a jornada muito mais prática e ajudam o leitor a validar com rapidez o que parecia mais promissor na teoria.</p>

              <h2>Quando vale comparar super-heróis com outros temas antes de decidir</h2>
              <p>Apesar da força dos heróis, nem sempre esse é o melhor tema para todos os perfis. Em alguns contextos, vale mais comparar antes de aprofundar a navegação. Se a compra depende muito de repertório gamer, por exemplo, <Link to="/bonecos-de-roblox"><strong>Roblox</strong></Link> pode fazer mais sentido. Se a afinidade está ligada a franquias televisivas, <Link to="/bonecos-de-series-da-tv"><strong>Séries da TV</strong></Link> pode ter mais aderência. Essa comparação não enfraquece o tema de heróis; pelo contrário, ajuda a mostrar quando ele realmente é o melhor caminho.</p>
              <p>É por isso que conteúdos como <Link to="/guia/comparativo-super-herois-roblox-series-tv"><strong>o comparativo entre temas</strong></Link> são tão importantes. Eles ajudam a usar popularidade como critério, mas sem transformar a escolha em impulso puro. Quando o usuário entende em que cenário super-heróis vence e em qual cenário outros temas fazem mais sentido, a decisão se torna muito mais madura e muito menos aleatória.</p>

              <h2>Como transformar popularidade em um critério útil de navegação</h2>
              <p>No fim das contas, dizer que certos personagens são mais procurados só faz sentido quando isso ajuda o usuário a escolher melhor. Popularidade por si só não resolve a compra, mas pode ser um ótimo atalho quando a intenção está ligada a presente, reconhecimento imediato ou início de jornada. O importante é usar essa informação como apoio e cruzá-la com categoria, contexto e profundidade da navegação. Quando isso acontece, a procura deixa de ser um número abstrato e passa a funcionar como uma bússola para a decisão.</p>
              <p>Se você quer seguir com mais contexto, vale aprofundar primeiro no pilar de <Link to="/bonecos-de-super-herois"><strong>Super Heróis</strong></Link>, depois validar produtos específicos ou cruzar a escolha com guias como <Link to="/guia/bonecos-de-montar-para-presentear"><strong>presentear</strong></Link> e <Link to="/guia/como-escolher-bonecos-de-montar-por-idade"><strong>idade</strong></Link>. Esse encadeamento faz com que a popularidade trabalhe a favor da navegação, e não apenas como curiosidade de categoria.</p>
            </article>

            <Card className="mt-16">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-3">Perguntas frequentes sobre os bonecos de super-heróis mais procurados</h2>
                <p className="mb-6 text-muted-foreground">As perguntas abaixo ajudam a entender como popularidade, tema e contexto de compra se conectam dentro da categoria.</p>
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
              description="Continue a navegação com conteúdos complementares sobre comparação de temas, presentes, idade e início de jornada."
            />

            <div className="mt-16 grid gap-4 md:grid-cols-3">
              <Link to="/bonecos-de-super-herois" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Pilar de Super Heróis</h3><p className="text-sm text-muted-foreground">Aprofunde a busca no hub principal do tema e encontre mais caminhos de navegação.</p></Link>
              <Link to="/categoria/super-herois" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Categoria completa</h3><p className="text-sm text-muted-foreground">Veja todos os produtos ligados ao universo de heróis antes de decidir.</p></Link>
              <Link to="/ofertas-especiais" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Ofertas especiais</h3><p className="text-sm text-muted-foreground">Descubra oportunidades com bom apelo visual e melhor custo-benefício.</p></Link>
            </div>

            <div className="mt-16">
              <AuthorSignature articleCountLabel="Guia prático para usar popularidade como critério de navegação" />
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="mt-20">
              <ProductCarousel products={recommendedProducts} title="Produtos recomendados de super-heróis" />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
