import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateArticleSchema, generateFAQSchema } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';

const faq = [
  {
    question: 'Quais bonecos de montar são melhores para iniciantes?',
    answer: 'Os melhores para iniciantes costumam ser os que têm tema fácil de reconhecer, preço de entrada competitivo e uma navegação simples entre categoria, vitrines e produtos relacionados.'
  },
  {
    question: 'Como começar sem se perder entre tantas categorias?',
    answer: 'O ideal é começar por uma página pilar principal, depois visitar um tema forte como Super Heróis, Roblox ou Séries da TV e só então comparar os produtos mais relevantes.'
  },
  {
    question: 'Vale começar por lançamentos ou ofertas?',
    answer: 'Depende da intenção. Lançamentos ajudam a descobrir novidades, enquanto ofertas são melhores quando o foco é custo-benefício para a primeira compra.'
  },
];

export default function BeginnersGuidePage() {
  const articleSchema = generateArticleSchema({
    headline: 'Melhores bonecos de montar para iniciantes',
    description: 'Guia para quem está começando e quer escolher os melhores bonecos de montar por tema, preço e facilidade de decisão.',
    url: 'https://qblox.com.br/guia/melhores-bonecos-de-montar-para-iniciantes',
    author: 'QBLOX',
  });

  return (
    <>
      <SEO
        title="Melhores bonecos de montar para iniciantes | Guia QBLOX"
        description="Descubra como começar no universo dos bonecos de montar escolhendo categorias, temas e vitrines mais fáceis para iniciantes."
        canonical="https://qblox.com.br/guia/melhores-bonecos-de-montar-para-iniciantes"
        url="https://qblox.com.br/guia/melhores-bonecos-de-montar-para-iniciantes"
        type="article"
      />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />

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

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-4xl">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6">Melhores bonecos de montar para iniciantes</h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-12">
            <p>Começar no universo dos bonecos de montar fica mais fácil quando a busca é guiada por tema, nível de familiaridade e clareza de navegação. Em vez de olhar apenas produtos isolados, vale começar pelos hubs principais e pelas vitrines com maior apelo.</p>
            <p>Na QBLOX, o melhor fluxo para iniciantes é visitar primeiro o guia principal, depois explorar temas fortes como Super Heróis, Roblox e Séries da TV, e por fim comparar produtos, ofertas e lançamentos para descobrir o ponto de entrada ideal.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <Link to="/bonecos-de-montar" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Guia principal</h2><p className="text-sm text-muted-foreground">Tenha uma visão geral do cluster e dos principais caminhos de compra.</p></Link>
            <Link to="/bonecos-de-super-herois" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Super Heróis</h2><p className="text-sm text-muted-foreground">Tema forte para começar por personagens populares e decisão mais rápida.</p></Link>
            <Link to="/ofertas-especiais" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Ofertas especiais</h2><p className="text-sm text-muted-foreground">Veja opções com melhor custo-benefício para a primeira compra.</p></Link>
          </div>

          <Card className="mb-12">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Perguntas frequentes</h2>
              <div className="space-y-4">
                {faq.map((item) => (
                  <div key={item.question}>
                    <h3 className="font-semibold mb-1">{item.question}</h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
