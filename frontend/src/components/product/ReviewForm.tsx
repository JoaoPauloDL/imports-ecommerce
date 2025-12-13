'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import StarRating from './StarRating';
import { Button } from '../ui/Button';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast } from '@/lib/toast';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Por favor, selecione uma avaliação');
      return;
    }

    if (!user) {
      toast.error('Você precisa estar logado para avaliar');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(`/products/${productId}/reviews`, {
        rating,
        comment: comment.trim() || undefined
      });

      toast.success('Avaliação enviada com sucesso!');
      setRating(0);
      setComment('');
      onReviewSubmitted();
    } catch (error: any) {
      console.error('Erro ao enviar avaliação:', error);
      toast.error(error.response?.data?.error || 'Erro ao enviar avaliação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600 mb-4">
          Faça login para avaliar este produto
        </p>
        <Button href="/login" variant="primary">
          Fazer Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Avaliar Produto</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sua Avaliação
        </label>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comentário (opcional)
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conte o que você achou do produto..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/500 caracteres
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || rating === 0}
        className="w-full"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
      </Button>
    </form>
  );
}
