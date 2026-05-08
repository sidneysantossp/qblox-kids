import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getProductReviews, getProductReviewsStats } from '@/db/api';
import type { ProductReview } from '@/types';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ProductReview[]>([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | number>('all');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    applyFilter();
  }, [activeFilter, reviews]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const [reviewsData, statsData] = await Promise.all([
        getProductReviews(productId),
        getProductReviewsStats(productId),
      ]);
      setReviews(reviewsData);
      setFilteredReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...reviews];

    if (activeFilter === 'images') {
      filtered = filtered.filter((r) => r.images && r.images.length > 0);
    } else if (typeof activeFilter === 'number') {
      filtered = filtered.filter((r) => r.rating === activeFilter);
    }

    setFilteredReviews(filtered);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
    
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-[#FFC107] text-[#FFC107]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '1 dia';
    if (diffDays === 1) return '1 dia';
    if (diffDays < 7) return `${diffDays} dias`;
    if (diffDays < 14) return '1 semana';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 60) return '1 mês';
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} ano${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
  };

  const openLightbox = (images: string[], index: number) => {
    setSelectedImages(images);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setSelectedImages([]);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const reviewsWithImages = reviews.filter((r) => r.images && r.images.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-black">Avaliações</h2>
        <span className="text-gray-400">|</span>
        <span className="text-2xl md:text-3xl font-bold text-black">{stats.averageRating.toFixed(1)}</span>
        {renderStars(Math.round(stats.averageRating), 'md')}
        <span className="text-base md:text-lg text-gray-600">
          {stats.totalReviews} avaliações
        </span>
        {reviews.some((r) => r.is_verified_purchase) && (
          <Badge variant="secondary" className="bg-green-50 text-green-600 border-green-200">
            ✓ Todas por compras verificadas
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('all')}
          className="rounded-full h-9 px-5 text-sm"
        >
          Todas classificações ({reviews.length})
        </Button>
        
        {reviewsWithImages.length > 0 && (
          <Button
            variant={activeFilter === 'images' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('images')}
            className="rounded-full h-9 px-5 text-sm"
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            ({reviewsWithImages.length})
          </Button>
        )}

        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
          if (count === 0) return null;
          
          const labels: Record<number, string> = {
            5: 'excelente custo-benefício',
            4: 'brilhante',
            3: 'boa qualidade',
            2: 'entrega rápida',
            1: 'regular'
          };
          
          return (
            <Button
              key={rating}
              variant={activeFilter === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(rating)}
              className="rounded-full h-9 px-5 text-sm"
            >
              {labels[rating]} ({count})
            </Button>
          );
        })}
      </div>

      {/* Review Images Preview */}
      {reviewsWithImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {reviewsWithImages.slice(0, 6).map((review, reviewIdx) =>
            review.images?.map((img, imgIdx) => (
              <button
                key={`${review.id}-${imgIdx}`}
                onClick={() => openLightbox(review.images || [], imgIdx)}
                className="relative flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
              >
                <img
                  src={img}
                  alt={`Review ${reviewIdx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-[#FFC107] text-[#FFC107]" />
                  {review.rating.toFixed(1)}
                </div>
              </button>
            ))
          )}
          {reviewsWithImages.length > 6 && (
            <button
              onClick={() => setActiveFilter('images')}
              className="flex-shrink-0 w-28 h-28 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-sm font-medium hover:bg-accent transition-colors"
            >
              <span className="text-lg font-semibold">Ver mais</span>
            </button>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma avaliação encontrada com este filtro
          </p>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                    {getInitials(review.user_name)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      {renderStars(review.rating, 'sm')}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-base">{review.user_name}</p>
                        <span className="text-sm text-gray-500">• há {formatDate(review.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-sm leading-relaxed text-gray-700">{review.comment}</p>

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 pt-2">
                      {review.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => openLightbox(review.images || [], idx)}
                          className="w-24 h-24 rounded border overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={img}
                            alt={`Review ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600 hover:text-gray-900">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Foi útil ({review.helpful_count})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && selectedImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light"
          >
            ×
          </button>
          <img
            src={selectedImages[lightboxIndex]}
            alt="Review"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {selectedImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full ${
                    idx === lightboxIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
