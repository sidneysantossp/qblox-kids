import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateArticleSchema, generateFAQSchema } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';

const faq = [
  { question: 'Como acompanhar os melhores lançamentos?', answer: 'A melhor estratégia é cruzar a categoria de lançamentos com páginas pilar temáticas e vitrines da loja, para entender quais novidades têm mais potencial comercial e de busca.' },
  { question: 'Vale acompanhar lançamentos mesmo antes de decidir o tema?', answer: 'Sim. Lançamentos ajudam a descobrir tendências e novos personagens que podem levar o usuário a uma categoria ou pilar mais específico.' },
  { question: 'Lançamentos funcionam melhor para presente ou coleção?', answer: 'Funcionam bem para os dois casos, especialmente quando o tema é reconhecível e a página ajuda a comparar contexto, categoria e preço.' },
];

export default function LaunchesGuidePage() {
  const articleSchema = generateArticleSchema({
    headline: 'Melhores lançamentos de bonecos de montar para acompanhar',
    description: 'Guia para acompanhar os melhores lançamentos de bonecos de montar e descobrir quais vitrines e temas merecem mais atenção.',
    url: 'https://qblox.com.br/guia/melhores-lancamentos-de-bonecos-de-montar',
    author: 'QBLOX',
  });

  return (
    <>
      <SEO title="Melhores lançamentos de bonecos de montar | Guia QBLOX" description="Descubra como acompanhar os lançamentos de bonecos de montar e usar vitrines, categorias e pilares para decidir melhor suas compras." canonical="https://qblox.com.br/guia/melhores-lancamentos-de-bonecos-de-montar" url="https://qblox.com.br/guia/melhores-lancamentos-de-bonecos-de-montar" type="article" />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b"><div className="container mx-auto px-4 py-4"><nav className="flex items-center gap-2 text-sm"><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><span className="text-foreground font-medium">Lançamentos</span></nav></div></div>
        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-4xl">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6">Melhores lançamentos de bonecos de montar para acompanhar</h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-12">
            <p>Acompanhar lançamentos é uma das formas mais eficientes de encontrar novos temas, personagens e oportunidades de compra antes que a busca fique saturada apenas em produtos isolados.</p>
            <p>Na QBLOX, os lançamentos funcionam melhor quando o usuário cruza a vitrine com as páginas pilar e as categorias mais fortes, o que ajuda a identificar se aquela novidade faz sentido como presente, início de coleção ou expansão temática.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <Link to="/categoria/lancamentos" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Categoria de lançamentos</h2><p className="text-sm text-muted-foreground">Veja as novidades mais recentes da loja.</p></Link>
            <Link to="/bonecos-de-montar" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Guia principal</h2><p className="text-sm text-muted-foreground">Use o hub principal para comparar temas antes de seguir.</p></Link>
            <Link to="/ofertas-especiais" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Ofertas especiais</h2><p className="text-sm text-muted-foreground">Compare lançamentos com vitrines orientadas a oportunidade.</p></Link>
          </div>
          <Card><CardContent className="p-6"><h2 className="text-2xl font-bold mb-4">Perguntas frequentes</h2><div className="space-y-4">{faq.map((item) => <div key={item.question}><h3 className="font-semibold mb-1">{item.question}</h3><p className="text-muted-foreground">{item.answer}</p></div>)}</div></CardContent></Card>
        </section>
      </div>
    </>
  );
}
