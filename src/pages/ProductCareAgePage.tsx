import { Baby, ShieldAlert, Sparkles, ToyBrick } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductCareAgePage() {
  return (
    <>
      <SEO
        title="Cuidados e Idade Recomendada | QBLOX KIDS"
        description="Veja orientações de cuidado, conservação e idade recomendada para bonecos de montar da QBLOX KIDS."
        keywords="cuidados bonecos de montar, idade recomendada, segurança infantil, conservação"
      />

      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary via-secondary to-accent py-14 text-white">
          <div className="container mx-auto px-4 text-center">
            <ToyBrick className="mx-auto mb-4 h-10 w-10" />
            <h1 className="mb-4 text-3xl font-bold xl:text-4xl">Cuidados e Idade Recomendada</h1>
            <p className="mx-auto max-w-2xl text-white/90">
              Orientações simples para aproveitar melhor os bonecos de montar com segurança e conservação.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid gap-5 px-4 py-10 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Baby className="mb-2 h-7 w-7 text-primary" />
              <CardTitle>Idade recomendada</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Produtos com peças pequenas não são indicados para crianças menores de 3 anos. Sempre verifique a indicação da página do produto.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ShieldAlert className="mb-2 h-7 w-7 text-secondary" />
              <CardTitle>Uso supervisionado</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Para crianças menores, recomendamos acompanhamento de um adulto durante a montagem e organização das peças.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="mb-2 h-7 w-7 text-accent" />
              <CardTitle>Conservação</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Guarde as peças em local seco, evite calor excessivo e limpe com pano seco ou levemente umedecido.
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
