import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  priceBrl: number;
  compareAtPrice?: number;
  attributes?: Record<string, any>;
  active: boolean;
  stock?: {
    quantity: number;
    reservedQuantity: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId: string;
  weightKg: number;
  dimensionsCm?: Record<string, number>;
  active: boolean;
  featured: boolean;
  variants: ProductVariant[];
  images: Array<{
    id: string;
    url: string;
    altText?: string;
    sortOrder: number;
  }>;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant: ProductVariant & {
    product: Pick<Product, 'id' | 'name' | 'slug'>;
  };
  createdAt: string;
  updatedAt: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  // Computed values
  totalItems: number;
  totalPrice: number;
  
  // Actions
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateItem: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      get totalPrice() {
        return get().items.reduce((total, item) => {
          return total + (item.variant.priceBrl * item.quantity);
        }, 0);
      },

      setItems: (items: CartItem[]) => {
        set({ items, error: null });
      },

      addItem: (newItem: CartItem) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          item => item.variantId === newItem.variantId
        );

        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + newItem.quantity,
            updatedAt: new Date().toISOString(),
          };
          set({ items: updatedItems, error: null });
        } else {
          // Add new item
          set({ 
            items: [...items, newItem], 
            error: null 
          });
        }
      },

      updateItem: (variantId: string, quantity: number) => {
        const items = get().items;
        const updatedItems = items.map(item => 
          item.variantId === variantId 
            ? { ...item, quantity, updatedAt: new Date().toISOString() }
            : item
        );
        set({ items: updatedItems, error: null });
      },

      removeItem: (variantId: string) => {
        const items = get().items;
        const filteredItems = items.filter(item => item.variantId !== variantId);
        set({ items: filteredItems, error: null });
      },

      clearCart: () => {
        set({ items: [], error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

// Selectors
export const selectCartItems = (state: CartState) => state.items;
export const selectCartTotal = (state: CartState) => state.totalItems;
export const selectCartPrice = (state: CartState) => state.totalPrice;
export const selectCartLoading = (state: CartState) => state.isLoading;
export const selectCartError = (state: CartState) => state.error;

// Hook for cart operations
export const useCart = () => {
  const cartStore = useCartStore();
  
  return {
    items: cartStore.items,
    totalItems: cartStore.totalItems,
    totalPrice: cartStore.totalPrice,
    isLoading: cartStore.isLoading,
    error: cartStore.error,
    setItems: cartStore.setItems,
    addItem: cartStore.addItem,
    updateItem: cartStore.updateItem,
    removeItem: cartStore.removeItem,
    clearCart: cartStore.clearCart,
    setLoading: cartStore.setLoading,
    setError: cartStore.setError,
  };
};

// Helper functions
export const getCartItemById = (items: CartItem[], variantId: string) => {
  return items.find(item => item.variantId === variantId);
};

export const getCartSubtotal = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    return total + (item.variant.priceBrl * item.quantity);
  }, 0);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};