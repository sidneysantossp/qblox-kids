import { Link } from 'react-router-dom';
import { FileText, Mail, MapPin, Send } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contato | QBLOX KIDS"
        description="Fale com a QBLOX KIDS por e-mail ou pelo formulário da Central de Ajuda."
        keywords="contato QBLOX KIDS, atendimento por email, central de ajuda"
      />

      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary via-secondary to-accent py-14 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-3xl font-bold xl:text-4xl">Contato</h1>
            <p className="mx-auto max-w-2xl text-white/90">
              Atendimento por e-mail e formulário para dúvidas sobre pedidos, produtos, pagamentos e entregas.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Mail className="mb-2 h-7 w-7 text-primary" />
              <CardTitle>E-mail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Envie sua mensagem para nossa equipe de atendimento.</p>
              <a className="font-medium text-primary hover:underline" href="mailto:contato@kidsblockstore.com.br">
                contato@kidsblockstore.com.br
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="mb-2 h-7 w-7 text-secondary" />
              <CardTitle>Formulário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Use o formulário da Central de Ajuda para enviar nome, e-mail, número do pedido e mensagem.</p>
              <Button asChild className="bg-[#FFD200] text-[#111827] hover:bg-[#F5C400]">
                <Link to="/central-de-ajuda">
                  <Send className="mr-2 h-4 w-4" />
                  Abrir formulário
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="mb-2 h-7 w-7 text-accent" />
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>R. Baronesa de Bela Vista, 411 - Vila Congonhas</p>
              <p>São Paulo - SP, 04612-001</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
