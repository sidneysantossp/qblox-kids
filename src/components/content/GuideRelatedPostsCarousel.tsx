import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export interface RelatedGuideCard {
  title: string;
  excerpt: string;
  path: string;
  label?: string;
}

interface GuideRelatedPostsCarouselProps {
  posts: RelatedGuideCard[];
  title?: string;
  description?: string;
}

export function GuideRelatedPostsCarousel({
  posts,
  title = 'Guias relacionados para aprofundar a busca',
  description = 'Continue a navegação com conteúdos complementares ligados ao mesmo momento da jornada.'
}: GuideRelatedPostsCarouselProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
      </div>

      <Carousel opts={{ align: 'start', loop: false }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {posts.map((post) => (
            <CarouselItem key={post.path} className="pl-2 md:pl-4 basis-[88%] sm:basis-1/2 xl:basis-1/3">
              <Link to={post.path} className="block h-full">
                <Card className="h-full transition-colors hover:border-primary">
                  <CardContent className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{post.label || 'Guia complementar'}</p>
                    <h3 className="mt-3 text-xl font-bold leading-snug">{post.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                    <p className="mt-5 text-sm font-medium text-primary">Ler guia</p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden xl:flex" />
        <CarouselNext className="hidden xl:flex" />
      </Carousel>
    </div>
  );
}
