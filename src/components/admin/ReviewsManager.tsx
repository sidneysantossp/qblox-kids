import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, X, Star, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  uploadImage,
} from '@/db/admin-api';
import type { ProductReview } from '@/types';

interface ReviewsManagerProps {
  productId: string | null;
}

export default function ReviewsManager({ productId }: ReviewsManagerProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ProductReview | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form state
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const loadReviews = async () => {
    if (!productId) return;
    
    try {
      setIsLoading(true);
      const data = await getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      toast.error('Erro ao carregar avaliações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (reviewImages.length >= 2) {
      toast.error('Máximo de 2 imagens por avaliação');
      return;
    }

    // Validar tamanho (1MB)
    if (file.size > 1024 * 1024) {
      toast.error('Imagem deve ter no máximo 1MB');
      return;
    }

    try {
      setUploadingImages(true);
      const imageUrl = await uploadImage(file, 'reviews');
      setReviewImages([...reviewImages, imageUrl]);
      toast.success('Imagem enviada com sucesso');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setUserName('');
    setRating(5);
    setComment('');
    setReviewImages([]);
    setEditingReview(null);
  };

  const handleOpenDialog = (review?: ProductReview) => {
    if (review) {
      setEditingReview(review);
      setUserName(review.user_name);
      setRating(review.rating);
      setComment(review.comment);
      setReviewImages(review.images || []);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      toast.error('Salve o produto antes de adicionar avaliações');
      return;
    }

    if (!userName.trim() || !comment.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setIsLoading(true);

      const reviewData = {
        product_id: productId,
        user_name: userName.trim(),
        rating,
        comment: comment.trim(),
        images: reviewImages,
        is_verified_purchase: true,
      };

      if (editingReview) {
        await updateProductReview(editingReview.id, reviewData);
        toast.success('Avaliação atualizada com sucesso');
      } else {
        await createProductReview(reviewData);
        toast.success('Avaliação adicionada com sucesso');
      }

      await loadReviews();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      toast.error('Erro ao salvar avaliação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) return;

    try {
      await deleteProductReview(reviewId);
      toast.success('Avaliação excluída com sucesso');
      await loadReviews();
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      toast.error('Erro ao excluir avaliação');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-[#FFC107] text-[#FFC107]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!productId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Salve o produto primeiro para adicionar avaliações
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Avaliações ({reviews.length})</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Avaliação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingReview ? 'Editar Avaliação' : 'Nova Avaliação'}
                </DialogTitle>
                <DialogDescription>
                  Adicione uma avaliação para este produto
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Nome do Usuário *</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Avaliação *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= rating
                              ? 'fill-[#FFC107] text-[#FFC107]'
                              : 'fill-gray-200 text-gray-200 hover:fill-[#FFE082] hover:text-[#FFE082]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Comentário *</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escreva o comentário da avaliação..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagens (até 2)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {reviewImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Review ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {reviewImages.length < 2 && (
                      <button
                        type="button"
                        className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                        onClick={() => document.getElementById('review-image-upload')?.click()}
                        disabled={uploadingImages}
                      >
                        {uploadingImages ? (
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </div>
                  <input
                    id="review-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tamanho máximo: 1MB por imagem
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      editingReview ? 'Atualizar' : 'Adicionar'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && reviews.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma avaliação adicionada ainda
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{review.user_name}</p>
                      {review.is_verified_purchase && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Compra verificada
                        </Badge>
                      )}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(review)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
