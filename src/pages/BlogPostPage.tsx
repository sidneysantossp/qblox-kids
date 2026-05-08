import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/db/api';
import type { BlogPost } from '@/types';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const data = await getBlogPostBySlug(slug);
        setPost(data);

        if (data && data.category) {
          const related = await getRelatedBlogPosts(data.id, data.category);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Erro ao carregar post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6 bg-muted" />
        <Skeleton className="h-12 w-3/4 mb-4 bg-muted" />
        <Skeleton className="h-6 w-1/2 mb-8 bg-muted" />
        <Skeleton className="aspect-video w-full mb-8 bg-muted" />
        <Skeleton className="h-4 w-full mb-2 bg-muted" />
        <Skeleton className="h-4 w-full mb-2 bg-muted" />
        <Skeleton className="h-4 w-3/4 bg-muted" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
        <Link to="/blog">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.meta_title || `${post.title} | Blog QBLOX`}
        description={post.meta_description || post.excerpt || post.title}
        image={post.featured_image || undefined}
        url={`https://qblox.com.br/blog/${post.slug}`}
        type="article"
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o blog
        </Link>

        {/* Article Header */}
        <article>
          {post.category && (
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
          )}

          <h1 className="text-3xl xl:text-5xl font-bold mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground mb-8">
            {post.author && (
              <span>Por {post.author}</span>
            )}
            {post.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            )}
            {post.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.reading_time} min de leitura</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {relatedPost.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.reading_time && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{relatedPost.reading_time} min</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-primary text-sm font-medium">
                        Ler mais
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Card className="mt-12 bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para começar sua coleção?
            </h3>
            <p className="mb-6">
              Explore nossa coleção completa de bonecos de montar compatíveis com LEGO
            </p>
            <Link to="/">
              <Button size="lg" variant="secondary">
                Ver Produtos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
