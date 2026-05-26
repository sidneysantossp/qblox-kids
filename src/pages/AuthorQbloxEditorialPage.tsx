import { Link } from 'react-router-dom';
import { ChevronRight, FileText, ShoppingBag, UserRound } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';
import { QBLOX_AUTHOR_BIO, QBLOX_AUTHOR_NAME, QBLOX_AUTHOR_PAGE_URL, QBLOX_AUTHOR_ROLE } from '@/lib/authors';

const authorArticleLinks = [
  { title: 'Como escolher bonecos de montar por idade', path: '/guia/como-escolher-bonecos-de-montar-por-idade' },
  { title: 'Bonecos de montar para presentear', path: '/guia/bonecos-de-montar-para-presentear' },
  { title: 'Melhores bonecos de montar para iniciantes', path: '/guia/melhores-bonecos-de-montar-para-iniciantes' },
  { title: 'Bonecos de super-heróis mais procurados', path: '/guia/bonecos-de-super-herois-mais-procurados' },
  { title: 'Como começar uma coleção de Roblox', path: '/guia/como-comecar-uma-colecao-de-roblox' },
  { title: 'Bonecos de montar por faixa de preço', path: '/guia/bonecos-de-montar-por-faixa-de-preco' },
  { title: 'Melhores lançamentos de bonecos de montar', path: '/guia/melhores-lancamentos-de-bonecos-de-montar' },
  { title: 'Comparativo entre Super Heróis, Roblox e Séries da TV', path: '/guia/comparativo-super-herois-roblox-series-tv' },
  { title: 'Blog QBLOX', path: '/blog' },
];

const authorSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: QBLOX_AUTHOR_PAGE_URL,
  mainEntity: {
    '@type': 'Person',
    name: QBLOX_AUTHOR_NAME,
    description: QBLOX_AUTHOR_BIO,
    jobTitle: QBLOX_AUTHOR_ROLE,
    url: QBLOX_AUTHOR_PAGE_URL,
    worksFor: {
      '@type': 'Organization',
      name: 'QBLOX',
      url: 'https://www.qblox.com.br'
    }
  }
});

export default function AuthorQbloxEditorialPage() {
  return (
    <>
      <SEO
        title={`${QBLOX_AUTHOR_NAME} | Autor da QBLOX`}
        description="Conheça a equipe editorial da QBLOX, responsável por guias, comparativos, páginas pilar e conteúdos otimizados sobre bonecos de montar."
        canonical={QBLOX_AUTHOR_PAGE_URL}
        url={QBLOX_AUTHOR_PAGE_URL}
        type="article"
      />
      <SchemaMarkup schema={authorSchema} />

      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Autor</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto max-w-5xl px-4 py-12 xl:py-16">
          <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Página do autor</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">{QBLOX_AUTHOR_NAME}</h1>
            <p className="mt-3 text-base font-medium text-foreground/80">{QBLOX_AUTHOR_ROLE}</p>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{QBLOX_AUTHOR_BIO}</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <UserRound className="h-5 w-5" />
                  <h2 className="text-lg font-bold">Quem assina</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">A assinatura editorial da QBLOX reúne conteúdos publicados pela equipe da marca para orientar a navegação e a descoberta de temas e produtos.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                  <h2 className="text-lg font-bold">O que você encontra aqui</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">Guias sobre presentes, categorias, comparativos, seleções temáticas e conteúdos que ajudam a entender melhor as opções disponíveis na loja.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <FileText className="h-5 w-5" />
                  <h2 className="text-lg font-bold">Conteúdos publicados</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">Nesta página você encontra os artigos e guias ligados à assinatura editorial da QBLOX, reunidos em um só lugar.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-10">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold">Artigos e guias publicados</h2>
              <p className="mt-2 text-muted-foreground">Abaixo estão os conteúdos vinculados a esta assinatura editorial.</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {authorArticleLinks.map((item) => (
                  <Link key={item.path} to={item.path} className="rounded-2xl border p-4 transition-colors hover:border-primary">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.path}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
