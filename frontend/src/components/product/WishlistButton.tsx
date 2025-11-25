'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  showText?: boolean;
}

export default function WishlistButton({
  productId,
  size = 'md',
  variant = 'icon',
  showText = false
}: WishlistButtonProps) {
  const { user } = useAuthStore();
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoading, fetchWishlist, isInitialized } = useWishlistStore();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user && !isInitialized) {
      fetchWishlist();
    }
  }, [user, isInitialized, fetchWishlist]);

  useEffect(() => {
    setIsFavorite(isInWishlist(productId));
  }, [productId, isInWishlist]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      return;
    }

    try {
      if (isFavorite) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      // Error handling is done in the store
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading || !user}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
          ${isFavorite
            ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100'
            : 'bg-white border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600'
          }
          ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isLoading ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        <Heart
          className={`${sizeClasses[size]} ${isFavorite ? 'fill-current' : ''}`}
        />
        {showText && (
          <span className="text-sm font-medium">
            {isFavorite ? 'Favoritado' : 'Adicionar aos Favoritos'}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !user}
      title={!user ? 'Faça login para adicionar aos favoritos' : isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`
        ${buttonSizeClasses[size]}
        rounded-full bg-white shadow-md hover:shadow-lg transition-all
        ${isFavorite
          ? 'text-red-600 hover:scale-110'
          : 'text-gray-400 hover:text-red-600 hover:scale-110'
        }
        ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isLoading ? 'opacity-50 cursor-wait' : ''}
      `}
    >
      <Heart
        className={`${sizeClasses[size]} ${isFavorite ? 'fill-current' : ''}`}
      />
    </button>
  );
}
