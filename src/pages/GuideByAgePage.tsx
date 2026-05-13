import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { SchemaMarkup, generateArticleSchema, generateFAQSchema } from '@/lib/schema';
import { Card, CardContent } from '@/components/ui/card';

const faq = [
  {
    question: 'Como escolher bonecos de montar por idade?',
    answer: 'O ideal é comparar nível de detalhe, tema de interesse e complexidade visual. Crianças menores costumam responder melhor a personagens reconhecíveis e kits mais diretos, enquanto colecionadores podem buscar temas e séries específicas.'
  },
  {
    question: 'Vale usar a idade como único critério de compra?',
    answer: 'Não. Além da idade, vale observar afinidade com personagens, categoria, objetivo do presente e variedade de produtos relacionados dentro da loja.'
  },
  {
    question: 'Quais categorias funcionam melhor para começar?',
    answer: 'Super Heróis, Roblox e Séries da TV costumam funcionar bem como portas de entrada porque já têm personagens fáceis de reconhecer e boa variedade de produtos.'
  },
];

export default function GuideByAgePage() {
  const articleSchema = generateArticleSchema({
    headline: 'Como escolher bonecos de montar por idade',
    description: 'Guia prático para escolher bonecos de montar por faixa etária, tema e intenção de compra.',
    url: 'https://qblox.com.br/guia/como-escolher-bonecos-de-montar-por-idade',
    author: 'QBLOX',
  });

  return (
    <>
      <SEO
        title="Como escolher bonecos de montar por idade | Guia QBLOX"
        description="Guia prático para escolher bonecos de montar por idade, tema e momento de compra, com links para categorias, pilares e produtos relacionados."
        canonical="https://qblox.com.br/guia/como-escolher-bonecos-de-montar-por-idade"
        url="https://qblox.com.br/guia/como-escolher-bonecos-de-montar-por-idade"
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
              <span className="text-foreground font-medium">Como escolher por idade</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 xl:py-16 max-w-4xl">
          <h1 className="text-4xl xl:text-5xl font-bold mb-6">Como escolher bonecos de montar por idade</h1>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-12">
            <p>Escolher bonecos de montar por idade ajuda a reduzir ruído na decisão de compra, mas o melhor resultado vem quando você cruza faixa etária com tema de interesse, familiaridade com personagens e objetivo da compra.</p>
            <p>Para públicos mais novos, personagens reconhecíveis e coleções com apelo visual forte costumam facilitar a escolha. Para públicos mais velhos e colecionadores, vale observar categoria, lançamentos e páginas pilar específicas para encontrar temas com maior profundidade.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <Link to="/bonecos-de-super-herois" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Super Heróis</h2><p className="text-sm text-muted-foreground">Boa porta de entrada para personagens populares e presentes de apelo imediato.</p></Link>
            <Link to="/bonecos-de-roblox" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Roblox</h2><p className="text-sm text-muted-foreground">Tema forte para quem busca personagens contemporâneos e coleções com identidade visual própria.</p></Link>
            <Link to="/bonecos-de-series-da-tv" className="rounded-2xl border p-5 hover:border-primary transition-colors"><h2 className="font-bold mb-2">Séries da TV</h2><p className="text-sm text-muted-foreground">Funciona bem para presentes guiados por franquias e reconhecimento do personagem.</p></Link>
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
            <Link to="/bonecos-de-montar" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Guia principal</h3><p className="text-sm text-muted-foreground">Volte para o hub principal de bonecos de montar.</p></Link>
            <Link to="/loja" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Explorar produtos</h3><p className="text-sm text-muted-foreground">Compare categorias, preços e lançamentos da loja.</p></Link>
            <Link to="/blog" className="rounded-xl border p-4 hover:border-primary transition-colors"><h3 className="font-semibold mb-1">Ver mais guias</h3><p className="text-sm text-muted-foreground">Continue navegando por conteúdos informacionais relacionados.</p></Link>
          </div>
        </section>
      </div>
    </>
  );
}
