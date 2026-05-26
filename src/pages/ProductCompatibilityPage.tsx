import { Blocks, CheckCircle2, Info, Puzzle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductCompatibilityPage() {
  return (
    <>
      <SEO
        title="Compatibilidade dos Bonecos | QBLOX KIDS"
        description="Entenda a compatibilidade dos bonecos de montar vendidos na QBLOX KIDS com blocos e acessórios do mesmo padrão."
        keywords="compatibilidade bonecos de montar, minifiguras compatíveis, blocos de montar"
      />

      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary via-secondary to-accent py-14 text-white">
          <div className="container mx-auto px-4 text-center">
            <Puzzle className="mx-auto mb-4 h-10 w-10" />
            <h1 className="mb-4 text-3xl font-bold xl:text-4xl">Compatibilidade dos Bonecos</h1>
            <p className="mx-auto max-w-2xl text-white/90">
              Informações para entender como os bonecos podem ser combinados com peças, bases e acessórios compatíveis.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid gap-5 px-4 py-10 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Blocks className="mb-2 h-7 w-7 text-primary" />
              <CardTitle>Padrão de encaixe</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Os produtos seguem padrão de bonecos de montar compatíveis com bases e acessórios do mesmo formato.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle2 className="mb-2 h-7 w-7 text-secondary" />
              <CardTitle>Combinação por tema</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Personagens de temas diferentes podem ser usados juntos para ampliar brincadeiras, cenários e coleções.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Info className="mb-2 h-7 w-7 text-accent" />
              <CardTitle>Variações do produto</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Alguns itens podem ter acessórios, bases ou quantidades diferentes. Confira sempre as fotos e a descrição do produto.
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
