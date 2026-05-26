import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getPublishedBlogPosts } from '@/db/api';
import type { BlogPost } from '@/types';

const blogThemes = [
  { label: 'Todos os conteúdos', href: '/blog', match: 'all' },
  { label: 'Bonecos de Montar', href: '/bonecos-de-montar', match: 'bonecos' },
  { label: 'Super Heróis', href: '/bonecos-de-super-herois', match: 'super-herois' },
  { label: 'Roblox', href: '/bonecos-de-roblox', match: 'roblox' },
  { label: 'Séries da TV', href: '/bonecos-de-series-da-tv', match: 'series-tv' },
  { label: 'Guia por idade', href: '/guia/como-escolher-bonecos-de-montar-por-idade', match: 'idade' },
  { label: 'Guia para presentear', href: '/guia/bonecos-de-montar-para-presentear', match: 'presente' },
  { label: 'Guia para iniciantes', href: '/guia/melhores-bonecos-de-montar-para-iniciantes', match: 'iniciantes' },
  { label: 'Comparativo de temas', href: '/guia/comparativo-super-herois-roblox-series-tv', match: 'comparativo' },
];

const coverByCategory: Record<string, string> = {
  'Bonecos de Montar': '/blog/blog-bonecos-de-montar.svg',
  'Ninjago': '/blog/blog-ninjago.svg',
  'Super Heróis': '/blog/blog-super-herois.svg',
  'Roblox': '/blog/blog-roblox.svg',
  'Séries da TV': '/blog/blog-series-tv.svg',
};

function inferCover(post: BlogPost) {
  if (post.featured_image) return post.featured_image;
  if (post.category && coverByCategory[post.category]) return coverByCategory[post.category];
  if (post.slug.includes('ninjago')) return '/blog/blog-ninjago.svg';
  if (post.slug.includes('roblox')) return '/blog/blog-roblox.svg';
  if (post.slug.includes('super-herois')) return '/blog/blog-super-herois.svg';
  if (post.slug.includes('series')) return '/blog/blog-series-tv.svg';
  return '/blog/blog-bonecos-de-montar.svg';
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('all');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getPublishedBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const visiblePosts = useMemo(() => {
    const limited = posts.slice(0, 9);
    if (selectedTheme === 'all') {
      return limited;
    }

    return limited.filter((post) => {
      const haystack = `${post.title} ${post.excerpt || ''} ${post.category || ''} ${post.slug}`.toLowerCase();
      return haystack.includes(selectedTheme);
    });
  }, [posts, selectedTheme]);

  return (
    <>
      <SEO
        title="Blog QBLOX | Dicas e Guias sobre Bonecos de Montar"
        description="Descubra dicas, guias e novidades sobre bonecos de montar tipo LEGO. Aprenda a escolher, montar e cuidar da sua coleção de minifiguras."
        url="https://www.qblox.com.br/blog"
        canonical="https://www.qblox.com.br/blog"
        type="website"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold mb-2">Blog QBLOX</h1>
          <p className="text-muted-foreground text-lg">Dicas, guias e novidades sobre bonecos de montar</p>
        </div>

        <div className="mb-8 lg:hidden">
          <label className="mb-2 block text-sm font-semibold">Explore Conteúdos por Tema</label>
          <div className="relative">
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="h-12 w-full appearance-none rounded-xl border bg-background px-4 pr-10 text-sm font-medium"
            >
              {blogThemes.map((theme) => (
                <option key={theme.match} value={theme.match}>{theme.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-video bg-muted" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
                      <Skeleton className="h-4 w-full mb-4 bg-muted" />
                      <Skeleton className="h-4 w-1/2 bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : visiblePosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {visiblePosts.map((post) => {
                  const coverImage = inferCover(post);
                  return (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-6">
                          {post.category && (
                            <Badge variant="secondary" className="mb-3">
                              {post.category}
                            </Badge>
                          )}
                          <h2 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {post.published_at && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.published_at)}</span>
                              </div>
                            )}
                            {post.reading_time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.reading_time} min</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-4 text-primary font-medium">
                            Ler mais
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">Nenhum conteúdo encontrado para esse tema.</p>
                <button onClick={() => setSelectedTheme('all')} className="text-primary hover:underline">Voltar para todos os conteúdos</button>
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <Card className="sticky top-28">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">Explore Conteúdos por Tema</h2>
                <div className="space-y-2">
                  {blogThemes.map((theme) => (
                    <button
                      key={theme.match}
                      onClick={() => setSelectedTheme(theme.match)}
                      className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${selectedTheme === theme.match ? 'border-primary bg-primary/5 text-primary' : 'hover:border-primary/50 hover:bg-muted/40'}`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
