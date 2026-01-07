'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ShieldCheck, Trash2, Edit2 } from 'lucide-react';
import StarRating from './StarRating';
import { Button } from '../ui/Button';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast } from '@/lib/toast';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface ReviewStats {
  total: number;
  averageRating: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewListProps {
  productId: string;
  refreshTrigger?: number;
}

export default function ReviewList({ productId, refreshTrigger = 0 }: ReviewListProps) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      setReviews(response.data.reviews);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      toast.error('Erro ao carregar avaliações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Deseja realmente deletar esta avaliação?')) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Avaliação deletada');
      fetchReviews();
    } catch (error: any) {
      console.error('Erro ao deletar avaliação:', error);
      toast.error(error.response?.data?.error || 'Erro ao deletar avaliação');
    }
  };

  const startEditing = (review: Review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment('');
  };

  const handleUpdate = async (reviewId: string) => {
    try {
      await api.put(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment.trim() || undefined
      });
      toast.success('Avaliação atualizada');
      cancelEditing();
      fetchReviews();
    } catch (error: any) {
      console.error('Erro ao atualizar avaliação:', error);
      toast.error(error.response?.data?.error || 'Erro ao atualizar avaliação');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && stats.total > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{stats.averageRating}</div>
              <StarRating rating={stats.averageRating} size="md" />
              <div className="text-sm text-gray-600 mt-1">
                {stats.total} {stats.total === 1 ? 'avaliação' : 'avaliações'}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star as keyof typeof stats.distribution];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">{star} ★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Nenhuma avaliação ainda</p>
            <p className="text-sm text-gray-500">Seja o primeiro a avaliar este produto!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200">
              {editingReviewId === review.id ? (
                // Modo de Edição
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sua Avaliação
                    </label>
                    <StarRating
                      rating={editRating}
                      interactive
                      onRatingChange={setEditRating}
                      size="md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentário
                    </label>
                    <textarea
                      rows={3}
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength={500}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdate(review.id)}
                      variant="default"
                      size="sm"
                    >
                      Salvar
                    </Button>
                    <Button
                      onClick={cancelEditing}
                      variant="outline"
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                // Modo de Visualização
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {review.user.fullName}
                        </span>
                        {review.isVerified && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            Compra Verificada
                          </span>
                        )}
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                      {user?.id === review.user.id && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(review)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
