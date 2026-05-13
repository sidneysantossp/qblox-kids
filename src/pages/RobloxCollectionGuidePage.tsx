import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateArticleSchema, generateFAQSchema } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';

const faq = [
  { question: 'Como começar uma coleção de Roblox?', answer: 'O ideal é começar por uma página pilar que organize o tema, depois visitar a categoria principal e comparar produtos em destaque antes de expandir para toda a coleção.' },
  { question: 'Vale começar por personagens populares ou por ofertas?', answer: 'Depende da intenção. Personagens populares ajudam na afinidade temática, enquanto ofertas ajudam a testar a primeira compra com melhor custo-benefício.' },
  { question: 'Como saber se vale expandir a coleção?', answer: 'A melhor referência é comparar variedade de produtos, lançamentos e vitrines comerciais ligadas ao tema dentro da loja.' },
];

export default function RobloxCollectionGuidePage() {
  const articleSchema = generateArticleSchema({
    headline: 'Como começar uma coleção de Roblox',
    description: 'Guia para começar uma coleção de bonecos de Roblox comparando tema, produtos e vitrines da loja.',
    url: 'https://qblox.com.br/guia/como-comecar-uma-colecao-de-roblox',
    author: 'QBLOX',
  });

  return (
    <>
      <SEO
        title="Como começar uma coleção de Roblox | Guia QBLOX"
        description="Aprenda como começar uma coleção de bonecos de Roblox usando categoria, vitrines e conteúdos certos para orientar sua decisão de compra."
        canonical="https://qblox.com.br/guia/como-comecar-uma-colecao-de-roblox"
        url="https://qblox.com.br/guia/como-comecar-uma-colecao-de-roblox"
        type="article"
      />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b"><div className="container mx-auto px-4 py-4"><nav className="flex items-center gap-2 text-sm"><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><span className="text-foreground font-medium">Coleção de Roblox</span></nav></div></div>
        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-4xl">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6">Como começar uma coleção de Roblox</h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-12">
            <p>Montar uma coleção de Roblox faz mais sentido quando você navega por tema, compara vitrines e entende a profundidade da categoria antes de escolher os primeiros produtos.</p>
            <p>Na QBLOX, a melhor forma de começar é usar o pilar de Roblox como hub principal, visitar a categoria correspondente e só então decidir entre lançamentos, ofertas e produtos com maior apelo temático.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <Link to="/bonecos-de-roblox" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Pilar de Roblox</h2><p className="text-sm text-muted-foreground">Acesse o hub principal do tema para organizar a busca.</p></Link>
            <Link to="/categoria/roblox" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Categoria Roblox</h2><p className="text-sm text-muted-foreground">Veja a variedade de produtos e compare personagens.</p></Link>
            <Link to="/categoria/lancamentos" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Lançamentos</h2><p className="text-sm text-muted-foreground">Use os lançamentos para descobrir novas oportunidades no tema.</p></Link>
          </div>
          <Card><CardContent className="p-6"><h2 className="text-2xl font-bold mb-4">Perguntas frequentes</h2><div className="space-y-4">{faq.map((item) => <div key={item.question}><h3 className="font-semibold mb-1">{item.question}</h3><p className="text-muted-foreground">{item.answer}</p></div>)}</div></CardContent></Card>
        </section>
      </div>
    </>
  );
}
