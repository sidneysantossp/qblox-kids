import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateArticleSchema, generateFAQSchema } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';

const faq = [
  { question: 'Bonecos de montar são bons para presentear?', answer: 'Sim. Funcionam especialmente bem quando o presente é guiado por personagens conhecidos, categorias temáticas e faixa de preço clara.' },
  { question: 'Como escolher um presente sem errar o tema?', answer: 'O melhor caminho é começar pelos pilares temáticos e depois comparar categorias e produtos com maior saída, como Super Heróis, Roblox e Séries da TV.' },
  { question: 'Vale olhar ofertas e lançamentos antes de decidir?', answer: 'Sim. Essas vitrines ajudam a encontrar oportunidades mais atrativas e produtos com maior apelo recente.' },
];

export default function GiftGuidePage() {
  const articleSchema = generateArticleSchema({
    headline: 'Bonecos de montar para presentear: como escolher',
    description: 'Guia para escolher bonecos de montar como presente com base em tema, preço e intenção de compra.',
    url: 'https://qblox.com.br/guia/bonecos-de-montar-para-presentear',
    author: 'QBLOX',
  });

  return (
    <>
      <SEO
        title="Bonecos de montar para presentear | Guia QBLOX"
        description="Descubra como escolher bonecos de montar para presentear com base em tema, categoria, faixa de preço e personagens mais buscados."
        canonical="https://qblox.com.br/guia/bonecos-de-montar-para-presentear"
        url="https://qblox.com.br/guia/bonecos-de-montar-para-presentear"
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
              <span className="text-foreground font-medium">Guia para presentear</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-4xl">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6">Bonecos de montar para presentear: como escolher melhor</h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-12">
            <p>Escolher bonecos de montar para presentear fica mais fácil quando a decisão começa pelo tema certo. Em vez de olhar só o nome do produto, vale comparar categoria, apelo visual, preço e popularidade do personagem.</p>
            <p>Na QBLOX, os pilares e categorias ajudam a filtrar o que faz mais sentido para diferentes perfis de presente, principalmente quando você quer comparar vitrines, ofertas e lançamentos antes de decidir.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <Link to="/bonecos-de-super-herois" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Presentes de Super Heróis</h2><p className="text-sm text-muted-foreground">Boa escolha para personagens populares e presentes de alto reconhecimento.</p></Link>
            <Link to="/bonecos-de-roblox" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Presentes de Roblox</h2><p className="text-sm text-muted-foreground">Ajuda a escolher temas contemporâneos com forte apelo para fãs do universo Roblox.</p></Link>
            <Link to="/ofertas-especiais" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Ofertas e oportunidades</h2><p className="text-sm text-muted-foreground">Veja promoções para melhorar o custo-benefício na hora de presentear.</p></Link>
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

          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/bonecos-de-montar" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Guia principal</h3><p className="text-sm text-muted-foreground">Veja a visão geral do cluster de bonecos de montar.</p></Link>
            <Link to="/categoria/lancamentos" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Ver lançamentos</h3><p className="text-sm text-muted-foreground">Descubra novidades com potencial alto para presente.</p></Link>
            <Link to="/loja" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Explorar produtos</h3><p className="text-sm text-muted-foreground">Compare categorias e encontre o melhor presente para cada ocasião.</p></Link>
          </div>
        </section>
      </div>
    </>
  );
}
