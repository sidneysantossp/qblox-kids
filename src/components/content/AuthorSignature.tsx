import { Link } from 'react-router-dom';
import { ArrowRight, FileText, UserRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { QBLOX_AUTHOR_BIO, QBLOX_AUTHOR_NAME, QBLOX_AUTHOR_PAGE_PATH, QBLOX_AUTHOR_ROLE } from '@/lib/authors';

interface AuthorSignatureProps {
  articleCountLabel?: string;
}

export function AuthorSignature({ articleCountLabel = 'Guias e artigos da QBLOX' }: AuthorSignatureProps) {
  return (
    <Card className="border bg-card/80">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Autor</p>
            <h2 className="mt-2 text-2xl font-bold">{QBLOX_AUTHOR_NAME}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{QBLOX_AUTHOR_ROLE}</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{QBLOX_AUTHOR_BIO}</p>
          </div>

          <div className="grid gap-3 md:min-w-72">
            <div className="rounded-2xl border bg-background/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                {articleCountLabel}
              </div>
              <p className="text-sm text-muted-foreground">Conteúdos sobre categorias, presentes, comparativos e sugestões para quem quer escolher melhor dentro da loja.</p>
            </div>

            <div className="rounded-2xl border bg-background/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <UserRound className="h-4 w-4 text-primary" />
                Sobre a equipe
              </div>
              <p className="text-sm text-muted-foreground">A equipe editorial da QBLOX publica guias práticos para ajudar clientes a navegar por temas, produtos e páginas informativas com mais clareza.</p>
            </div>

            <Link to={QBLOX_AUTHOR_PAGE_PATH} className="inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
              Ver página do autor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
