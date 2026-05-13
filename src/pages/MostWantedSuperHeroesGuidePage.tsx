import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateArticleSchema, generateFAQSchema } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';

const faq = [
  { question: 'Quais bonecos de super-heróis costumam ser mais procurados?', answer: 'Normalmente os mais procurados são os ligados a personagens clássicos, coleções de forte apelo visual e temas com boa profundidade de categoria dentro da loja.' },
  { question: 'Como usar esse tema para escolher melhor?', answer: 'O melhor caminho é ir da página pilar para a categoria, comparar os destaques da loja e depois validar quais produtos e ofertas se encaixam melhor na intenção da compra.' },
  { question: 'Vale procurar por vitrines antes de olhar a categoria completa?', answer: 'Sim. As vitrines ajudam a descobrir tendências e produtos com maior saída antes de explorar toda a categoria.' },
];

export default function MostWantedSuperHeroesGuidePage() {
  const articleSchema = generateArticleSchema({
    headline: 'Bonecos de super-heróis mais procurados',
    description: 'Guia para entender quais temas e personagens de super-heróis geram mais interesse na hora de escolher bonecos de montar.',
    url: 'https://qblox.com.br/guia/bonecos-de-super-herois-mais-procurados',
    author: 'QBLOX',
  });

  return (
    <>
      <SEO
        title="Bonecos de super-heróis mais procurados | Guia QBLOX"
        description="Entenda quais personagens e temas de super-heróis costumam ser mais procurados e como navegar melhor pela categoria e pelas vitrines da QBLOX."
        canonical="https://qblox.com.br/guia/bonecos-de-super-herois-mais-procurados"
        url="https://qblox.com.br/guia/bonecos-de-super-herois-mais-procurados"
        type="article"
      />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />

      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b"><div className="container mx-auto px-4 py-4"><nav className="flex items-center gap-2 text-sm"><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><span className="text-foreground font-medium">Super-heróis mais procurados</span></nav></div></div>
        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-4xl">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6">Bonecos de super-heróis mais procurados</h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-12">
            <p>Quando o tema é super-heróis, a busca costuma ser guiada por personagens reconhecíveis, força da franquia e capacidade de formar uma coleção coerente. Por isso, entender o que tem mais saída ajuda a decidir melhor.</p>
            <p>Na QBLOX, o melhor caminho é começar pela página pilar de super-heróis, passar pela categoria correspondente e então comparar destaques, ofertas e produtos com maior relevância comercial.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <Link to="/bonecos-de-super-herois" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Pilar de Super Heróis</h2><p className="text-sm text-muted-foreground">Acesse o hub principal do tema com links e produtos relacionados.</p></Link>
            <Link to="/categoria/super-herois" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Categoria completa</h2><p className="text-sm text-muted-foreground">Veja todos os produtos ligados ao universo de super-heróis.</p></Link>
            <Link to="/ofertas-especiais" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Ofertas especiais</h2><p className="text-sm text-muted-foreground">Descubra oportunidades com melhor apelo de preço dentro da loja.</p></Link>
          </div>
          <Card><CardContent className="p-6"><h2 className="text-2xl font-bold mb-4">Perguntas frequentes</h2><div className="space-y-4">{faq.map((item) => <div key={item.question}><h3 className="font-semibold mb-1">{item.question}</h3><p className="text-muted-foreground">{item.answer}</p></div>)}</div></CardContent></Card>
        </section>
      </div>
    </>
  );
}
