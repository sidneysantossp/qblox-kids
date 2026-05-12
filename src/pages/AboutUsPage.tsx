import { Link } from 'react-router-dom';
import { Award, Heart, Rocket, Shield, Star, Target, Users } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function AboutUsPage() {
  return (
    <>
      <SEO
        title="Quem Somos | QBLOX KIDS"
        description="Conheça a QBLOX KIDS, sua loja especializada em bonecos de montar tipo LEGO. Nossa missão é inspirar criatividade e diversão para todas as idades."
        keywords="sobre nós, quem somos, QBLOX KIDS, história, missão, valores"
      />

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Início</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Quem Somos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-balance">
              Bem-vindo à QBLOX KIDS
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto text-pretty">
              Somos apaixonados por brinquedos que inspiram criatividade, imaginação e diversão. 
              Nossa missão é trazer alegria para crianças e colecionadores através dos melhores 
              bonecos de montar do mercado.
            </p>
          </div>
        </div>

        {/* Nossa História */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                  Nossa História
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto" />
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground mb-6 text-pretty">
                  A QBLOX KIDS nasceu do sonho de criar um espaço onde a imaginação não tem limites. 
                  Fundada por entusiastas de brinquedos de montar, nossa loja começou como um pequeno 
                  projeto e cresceu para se tornar referência em minifiguras e blocos de montar no Brasil.
                </p>

                <p className="text-lg text-muted-foreground mb-6 text-pretty">
                  Acreditamos que brincar é essencial para o desenvolvimento infantil. Por isso, 
                  selecionamos cuidadosamente cada produto em nosso catálogo, garantindo qualidade, 
                  segurança e, acima de tudo, diversão garantida.
                </p>

                <p className="text-lg text-muted-foreground text-pretty">
                  Hoje, atendemos milhares de famílias em todo o país, oferecendo desde personagens 
                  clássicos até os lançamentos mais recentes de super-heróis, filmes, séries e muito mais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Nossos Pilares
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Missão */}
              <Card className="h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-balance">Missão</h3>
                  <p className="text-muted-foreground text-pretty">
                    Inspirar criatividade e imaginação através de brinquedos de qualidade, 
                    proporcionando momentos inesquecíveis de diversão e aprendizado para 
                    crianças e colecionadores.
                  </p>
                </CardContent>
              </Card>

              {/* Visão */}
              <Card className="h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Rocket className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-balance">Visão</h3>
                  <p className="text-muted-foreground text-pretty">
                    Ser a loja de referência em bonecos de montar no Brasil, reconhecida 
                    pela excelência no atendimento, variedade de produtos e compromisso 
                    com a satisfação dos nossos clientes.
                  </p>
                </CardContent>
              </Card>

              {/* Valores */}
              <Card className="h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-balance">Valores</h3>
                  <p className="text-muted-foreground text-pretty">
                    Paixão pelo que fazemos, compromisso com a qualidade, respeito aos 
                    nossos clientes, inovação constante e responsabilidade social e ambiental.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Nossos Diferenciais */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Por Que Escolher a QBLOX KIDS?
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Diferencial 1 */}
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2 text-balance">Produtos de Qualidade</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Selecionamos apenas produtos de alta qualidade e segurança certificada.
                  </p>
                </CardContent>
              </Card>

              {/* Diferencial 2 */}
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2 text-balance">Variedade Incrível</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Mais de 10 mil modelos exclusivos de personagens e temas variados.
                  </p>
                </CardContent>
              </Card>

              {/* Diferencial 3 */}
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2 text-balance">Compra Segura</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Ambiente 100% seguro com múltiplas formas de pagamento.
                  </p>
                </CardContent>
              </Card>

              {/* Diferencial 4 */}
              <Card className="h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2 text-balance">Atendimento Excepcional</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Equipe dedicada pronta para ajudar você em todas as etapas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Pronto para Começar sua Coleção?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-pretty">
              Explore nossa loja e descubra milhares de produtos incríveis para todas as idades!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link to="/loja">Explorar Loja</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/central-de-ajuda">Fale Conosco</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
