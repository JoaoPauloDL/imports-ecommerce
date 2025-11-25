'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { toast } from '@/lib/toast';

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
    stockQuantity: number;
    isActive: boolean;
  };
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isInitialized: false,

      fetchWishlist: async () => {
        try {
          set({ isLoading: true });
          const response = await api.get('/wishlist');
          set({ 
            items: response.data.wishlist,
            isInitialized: true,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Erro ao buscar wishlist:', error);
          set({ isLoading: false, isInitialized: true });
          
          // Se não estiver autenticado, limpar wishlist
          if (error.response?.status === 401) {
            set({ items: [] });
          }
        }
      },

      addToWishlist: async (productId: string) => {
        try {
          set({ isLoading: true });
          const response = await api.post('/wishlist', { productId });
          
          set((state) => ({
            items: [...state.items, response.data.wishlistItem],
            isLoading: false
          }));
          
          toast.success('Produto adicionado aos favoritos!');
        } catch (error: any) {
          console.error('Erro ao adicionar à wishlist:', error);
          set({ isLoading: false });
          
          if (error.response?.status === 401) {
            toast.error('Você precisa estar logado para adicionar aos favoritos');
          } else if (error.response?.status === 400) {
            toast.error('Produto já está nos favoritos');
          } else {
            toast.error('Erro ao adicionar aos favoritos');
          }
          throw error;
        }
      },

      removeFromWishlist: async (productId: string) => {
        try {
          set({ isLoading: true });
          await api.delete(`/wishlist/${productId}`);
          
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
            isLoading: false
          }));
          
          toast.success('Produto removido dos favoritos');
        } catch (error: any) {
          console.error('Erro ao remover da wishlist:', error);
          set({ isLoading: false });
          toast.error('Erro ao remover dos favoritos');
          throw error;
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      clearWishlist: () => {
        set({ items: [], isInitialized: false });
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
);
