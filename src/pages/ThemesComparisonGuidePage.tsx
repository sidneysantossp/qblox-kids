import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateArticleSchema, generateFAQSchema } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';

const faq = [
  { question: 'Como comparar Super Heróis, Roblox e Séries da TV?', answer: 'O melhor caminho é olhar intenção de compra, afinidade com personagens, profundidade da categoria e oportunidades nas vitrines e páginas pilar de cada tema.' },
  { question: 'Existe um melhor tema para começar?', answer: 'Não existe um único melhor tema. O ideal é começar pela página pilar que mais combina com o perfil do usuário e depois comparar os produtos e guias relacionados.' },
  { question: 'Essa comparação ajuda na escolha do presente?', answer: 'Sim. Comparar os temas reduz ruído e acelera a decisão quando o objetivo é escolher um presente com apelo visual e temática reconhecível.' },
];

export default function ThemesComparisonGuidePage() {
  const articleSchema = generateArticleSchema({
    headline: 'Comparativo entre Super Heróis, Roblox e Séries da TV',
    description: 'Guia para comparar os principais temas de bonecos de montar da loja e descobrir qual faz mais sentido para cada intenção de compra.',
    url: 'https://qblox.com.br/guia/comparativo-super-herois-roblox-series-tv',
    author: 'QBLOX',
  });

  return (
    <>
      <SEO title="Comparativo entre Super Heróis, Roblox e Séries da TV | Guia QBLOX" description="Compare os principais temas da QBLOX e descubra qual categoria faz mais sentido para presentear, começar uma coleção ou ampliar seu catálogo." canonical="https://qblox.com.br/guia/comparativo-super-herois-roblox-series-tv" url="https://qblox.com.br/guia/comparativo-super-herois-roblox-series-tv" type="article" />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b"><div className="container mx-auto px-4 py-4"><nav className="flex items-center gap-2 text-sm"><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><span className="text-foreground font-medium">Comparativo de temas</span></nav></div></div>
        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-4xl">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6">Comparativo entre Super Heróis, Roblox e Séries da TV</h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-12">
            <p>Comparar os temas principais da loja ajuda a transformar uma busca ampla em uma decisão mais prática. Em vez de navegar sem critério por muitos produtos, o usuário pode avaliar qual universo faz mais sentido para sua intenção.</p>
            <p>Na QBLOX, os temas Super Heróis, Roblox e Séries da TV são portas de entrada fortes para diferentes perfis de compra. O ideal é começar pelas páginas pilar e depois aprofundar nas categorias e vitrines de cada tema.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <Link to="/bonecos-de-super-herois" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Super Heróis</h2><p className="text-sm text-muted-foreground">Bom para personagens populares e compra guiada por reconhecimento imediato.</p></Link>
            <Link to="/bonecos-de-roblox" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Roblox</h2><p className="text-sm text-muted-foreground">Forte para públicos conectados a personagens e identidade visual contemporânea.</p></Link>
            <Link to="/bonecos-de-series-da-tv" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Séries da TV</h2><p className="text-sm text-muted-foreground">Ajuda quando a intenção é escolher por franquia e universo reconhecível.</p></Link>
          </div>
          <Card><CardContent className="p-6"><h2 className="text-2xl font-bold mb-4">Perguntas frequentes</h2><div className="space-y-4">{faq.map((item) => <div key={item.question}><h3 className="font-semibold mb-1">{item.question}</h3><p className="text-muted-foreground">{item.answer}</p></div>)}</div></CardContent></Card>
        </section>
      </div>
    </>
  );
}
