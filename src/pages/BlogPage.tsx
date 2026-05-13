import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getPublishedBlogPosts } from '@/db/api';
import type { BlogPost } from '@/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <>
      <SEO
        title="Blog QBLOX | Dicas e Guias sobre Bonecos de Montar"
        description="Descubra dicas, guias e novidades sobre bonecos de montar tipo LEGO. Aprenda a escolher, montar e cuidar da sua coleção de minifiguras."
        url="https://qblox.com.br/blog"
        canonical="https://qblox.com.br/blog"
        type="website"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold mb-2">
            Blog QBLOX
          </h1>
          <p className="text-muted-foreground text-lg">
            Dicas, guias e novidades sobre bonecos de montar
          </p>
        </div>

        <div className="rounded-2xl border bg-muted/20 p-6 mb-8">
          <h2 className="text-xl font-bold mb-3">Explore conteúdos por intenção</h2>
          <div className="flex flex-wrap gap-2">
            <Link to="/bonecos-de-super-herois" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Bonecos de Super Heróis</Link>
            <Link to="/bonecos-de-roblox" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Bonecos de Roblox</Link>
            <Link to="/bonecos-de-series-da-tv" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Séries da TV</Link>
            <Link to="/categoria/lancamentos" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Lançamentos</Link>
            <Link to="/loja" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Todos os produtos</Link>
            <Link to="/bonecos-de-montar" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Guia principal</Link>
            <Link to="/guia/como-escolher-bonecos-de-montar-por-idade" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Guia por idade</Link>
            <Link to="/guia/bonecos-de-montar-para-presentear" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Guia para presentear</Link>
            <Link to="/guia/melhores-bonecos-de-montar-para-iniciantes" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Guia para iniciantes</Link>
            <Link to="/guia/bonecos-de-super-herois-mais-procurados" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Super-heróis mais procurados</Link>
            <Link to="/guia/como-comecar-uma-colecao-de-roblox" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Coleção de Roblox</Link>
            <Link to="/guia/bonecos-de-montar-por-faixa-de-preco" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Faixa de preço</Link>
            <Link to="/guia/melhores-lancamentos-de-bonecos-de-montar" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Lançamentos</Link>
            <Link to="/guia/comparativo-super-herois-roblox-series-tv" className="rounded-full bg-white px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Comparativo de temas</Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              Nenhum post publicado ainda.
            </p>
            <Link to="/" className="text-primary hover:underline">
              Voltar para a página inicial
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
