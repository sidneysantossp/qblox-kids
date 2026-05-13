import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateArticleSchema, generateFAQSchema } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';

const faq = [
  { question: 'Como escolher bonecos de montar por faixa de preço?', answer: 'A melhor forma é combinar orçamento com tema, afinidade do personagem e intenção de compra, usando vitrines e categorias para comparar o que faz mais sentido dentro da loja.' },
  { question: 'Vale começar por ofertas ou por categorias?', answer: 'Se o foco é orçamento, ofertas podem ser o primeiro passo. Se o foco é afinidade temática, começar por categorias e pilares tende a ser mais eficiente.' },
  { question: 'Faixa de preço muda a escolha do tema?', answer: 'Pode mudar, principalmente quando o usuário procura presente. Algumas categorias e vitrines ajudam mais a equilibrar apelo visual e custo-benefício.' },
];

export default function GiftByPriceGuidePage() {
  const articleSchema = generateArticleSchema({
    headline: 'Bonecos de montar para presentear por faixa de preço',
    description: 'Guia para escolher bonecos de montar por faixa de preço, equilibrando tema, intenção de compra e custo-benefício.',
    url: 'https://qblox.com.br/guia/bonecos-de-montar-por-faixa-de-preco',
    author: 'QBLOX',
  });

  return (
    <>
      <SEO
        title="Bonecos de montar por faixa de preço | Guia QBLOX"
        description="Descubra como comparar bonecos de montar por faixa de preço e encontrar a melhor opção para presentear ou começar uma coleção."
        canonical="https://qblox.com.br/guia/bonecos-de-montar-por-faixa-de-preco"
        url="https://qblox.com.br/guia/bonecos-de-montar-por-faixa-de-preco"
        type="article"
      />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={generateFAQSchema(faq)} />

      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 border-b"><div className="container mx-auto px-4 py-4"><nav className="flex items-center gap-2 text-sm"><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link><ChevronRight className="w-4 h-4 text-muted-foreground" /><span className="text-foreground font-medium">Faixa de preço</span></nav></div></div>
        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-4xl">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6">Bonecos de montar para presentear por faixa de preço</h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-12">
            <p>Escolher bonecos de montar por faixa de preço é uma forma prática de reduzir o universo de opções sem perder qualidade na decisão. Quando o orçamento é claro, fica mais fácil cruzar preço com tema, vitrines e categorias com melhor apelo.</p>
            <p>Na QBLOX, o ideal é combinar esse tipo de busca com páginas pilar, ofertas especiais e categorias fortes como Super Heróis e Roblox para encontrar o ponto de equilíbrio entre tema e custo-benefício.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <Link to="/ofertas-especiais" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Ofertas especiais</h2><p className="text-sm text-muted-foreground">Comece pelas vitrines mais orientadas a custo-benefício.</p></Link>
            <Link to="/bonecos-de-montar" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Guia principal</h2><p className="text-sm text-muted-foreground">Entenda o cluster principal antes de comparar preços.</p></Link>
            <Link to="/loja" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Todos os produtos</h2><p className="text-sm text-muted-foreground">Amplie a busca e compare categorias e vitrines da loja.</p></Link>
          </div>
          <Card><CardContent className="p-6"><h2 className="text-2xl font-bold mb-4">Perguntas frequentes</h2><div className="space-y-4">{faq.map((item) => <div key={item.question}><h3 className="font-semibold mb-1">{item.question}</h3><p className="text-muted-foreground">{item.answer}</p></div>)}</div></CardContent></Card>
        </section>
      </div>
    </>
  );
}
