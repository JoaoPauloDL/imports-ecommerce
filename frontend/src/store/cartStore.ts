import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  
  // Computed properties
  items: CartItem[];
  total: number;
  itemCount: number;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeGuestCart: (userId: string) => Promise<void>;
  
  // Utils
  getSessionId: () => string;
  setSessionId: (id: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,
      sessionId: '',

      // Computed getters
      get items() {
        return get().cart?.items || [];
      },
      
      get total() {
        return get().cart?.total || 0;
      },
      
      get itemCount() {
        return get().cart?.itemCount || 0;
      },

      getSessionId: () => {
        let sessionId = get().sessionId;
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          set({ sessionId });
        }
        return sessionId;
      },

      setSessionId: (id: string) => {
        set({ sessionId: id });
      },

      fetchCart: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Get userId from auth store if logged in, otherwise use sessionId
          const sessionId = get().getSessionId();
          const userId = localStorage.getItem('userId'); // Or from auth store
          
          console.log('🛒 FetchCart - Buscando carrinho:', { userId, sessionId });
          
          const params = userId ? { userId } : { sessionId };
          const response = await api.get('/api/cart', { params });
          
          console.log('🛒 FetchCart - Resposta:', response.data);
          
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching cart:', error);
          // Se der erro, limpar o carrinho para evitar inconsistência
          set({ 
            cart: { id: '', items: [], total: 0, itemCount: 0 },
            error: error.response?.data?.error || 'Erro ao carregar carrinho',
            isLoading: false 
          });
        }
      },

      addToCart: async (productId: string, quantity: number = 1) => {
        try {
          set({ isLoading: true, error: null });
          
          const sessionId = get().getSessionId();
          
          // Tentar pegar userId do authStore
          let userId: string | null = null;
          try {
            const authStore = (await import('./authStore')).useAuthStore.getState();
            userId = authStore.user?.id || null;
          } catch (e) {
            // Se authStore não estiver disponível, tentar localStorage
            userId = localStorage.getItem('userId');
          }
          
          console.log('🛒 AddToCart params:', { productId, quantity, userId, sessionId });
          
          const response = await api.post('/api/cart/add', {
            productId,
            quantity,
            ...(userId ? { userId } : { sessionId })
          });
          
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          console.error('Error adding to cart:', error);
          console.error('Error details:', error.response?.data);
          set({ 
            error: error.response?.data?.error || 'Erro ao adicionar ao carrinho',
            isLoading: false 
          });
          throw error;
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        try {
          set({ isLoading: true, error: null });
          
          const sessionId = get().getSessionId();
          const userId = localStorage.getItem('userId');
          
          const response = await api.put('/api/cart/update', {
            productId,
            quantity,
            ...(userId ? { userId } : { sessionId })
          });
          
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          console.error('Error updating cart:', error);
          set({ 
            error: error.response?.data?.error || 'Erro ao atualizar carrinho',
            isLoading: false 
          });
          throw error;
        }
      },

      removeItem: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const sessionId = get().getSessionId();
          const userId = localStorage.getItem('userId');
          
          const params = userId ? { userId, productId } : { sessionId, productId };
          const response = await api.delete('/api/cart/remove', { params });
          
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          console.error('Error removing from cart:', error);
          set({ 
            error: error.response?.data?.error || 'Erro ao remover item',
            isLoading: false 
          });
          throw error;
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const sessionId = get().getSessionId();
          const userId = localStorage.getItem('userId');
          
          const params = userId ? { userId } : { sessionId };
          await api.delete('/api/cart/clear', { params });
          
          set({ cart: { id: '', items: [], total: 0, itemCount: 0 }, isLoading: false });
        } catch (error: any) {
          console.error('Error clearing cart:', error);
          set({ 
            error: error.response?.data?.error || 'Erro ao limpar carrinho',
            isLoading: false 
          });
          throw error;
        }
      },

      mergeGuestCart: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const sessionId = get().getSessionId();
          
          const response = await api.post('/api/cart/merge', {
            userId,
            sessionId
          });
          
          set({ cart: response.data, isLoading: false });
          
          // Clear sessionId after merge
          set({ sessionId: '' });
        } catch (error: any) {
          console.error('Error merging cart:', error);
          set({ 
            error: error.response?.data?.error || 'Erro ao mesclar carrinho',
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        // Também persistir o carrinho para evitar inconsistências visuais
        cart: state.cart,
      }),
    }
  )
);
