import axios, { AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

// Configuração base do axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use(
  (config) => {
    // Tenta pegar o token do Zustand store primeiro
    const { tokens } = useAuthStore.getState();
    let token: string | undefined = tokens?.accessToken;
    
    // Fallback: tenta pegar do localStorage
    if (!token) {
      token = localStorage.getItem('token') || undefined;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { tokens, updateTokens, logout } = useAuthStore.getState();
      
      if (tokens?.refreshToken) {
        try {
          // Tentar renovar o token
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken: tokens.refreshToken }
          );
          
          const newTokens = response.data.data.tokens;
          updateTokens(newTokens);
          
          // Repetir a requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Se o refresh falhar, fazer logout
          logout();
          
          // Redirecionar para login se estivermos no browser
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      } else {
        // Sem refresh token, fazer logout
        logout();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message?: string;
  data: {
    items?: T[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  errors?: any[];
}

// Funções helper para requisições
export const apiRequest = {
  get: <T = any>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.get(url, { params });
  },
  
  post: <T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.post(url, data);
  },
  
  put: <T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.put(url, data);
  },
  
  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.delete(url, config);
  },
  
  patch: <T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.patch(url, data);
  },
};

// Funções específicas da API
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) => apiRequest.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    apiRequest.post('/auth/login', data),
  
  refresh: (refreshToken: string) =>
    apiRequest.post('/auth/refresh', { refreshToken }),
  
  logout: (refreshToken?: string) =>
    apiRequest.post('/auth/logout', { refreshToken }),
  
  forgotPassword: (email: string) =>
    apiRequest.post('/auth/forgot', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiRequest.post('/auth/reset', { token, password }),
  
  verifyEmail: (token: string) =>
    apiRequest.get(`/auth/verify/${token}`),
};

export const userApi = {
  getProfile: () => apiRequest.get('/users/profile'),
  
  updateProfile: (data: Partial<{
    fullName: string;
    phone: string;
  }>) => apiRequest.put('/users/profile', data),
  
  getAddresses: () => apiRequest.get('/users/addresses'),
  
  createAddress: (data: {
    name: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
    isDefault?: boolean;
  }) => apiRequest.post('/users/addresses', data),
  
  updateAddress: (id: string, data: any) =>
    apiRequest.put(`/users/addresses/${id}`, data),
  
  deleteAddress: (id: string) =>
    apiRequest.delete(`/users/addresses/${id}`),
};

export const productsApi = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }) => apiRequest.get('/products', params),
  
  getProductBySlug: (slug: string) =>
    apiRequest.get(`/products/${slug}`),
  
  getProductVariants: (productId: string) =>
    apiRequest.get(`/products/${productId}/variants`),
  
  getCategories: () => apiRequest.get('/categories'),
  
  getCategoryBySlug: (slug: string) =>
    apiRequest.get(`/categories/${slug}`),
};

export const cartApi = {
  getCart: () => apiRequest.get('/cart'),
  
  addItem: (data: {
    variantId: string;
    quantity: number;
  }) => apiRequest.post('/cart/add', data),
  
  updateItem: (data: {
    variantId: string;
    quantity: number;
  }) => apiRequest.put('/cart/update', data),
  
  removeItem: (variantId: string) =>
    apiRequest.delete('/cart/remove', { data: { variantId } }),
  
  clearCart: () => apiRequest.delete('/cart/clear'),
};

export const ordersApi = {
  calculateShipping: (data: {
    zipcode: string;
    items: Array<{
      variantId: string;
      quantity: number;
    }>;
  }) => apiRequest.post('/orders/calculate', data),
  
  createOrder: (data: {
    shippingAddressId: string;
    paymentMethod: string;
    couponCode?: string;
    items: Array<{
      variantId: string;
      quantity: number;
    }>;
  }) => apiRequest.post('/orders/create', data),
  
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => apiRequest.get('/orders', params),
  
  getOrderById: (id: string) => apiRequest.get(`/orders/${id}`),
  
  cancelOrder: (id: string, reason?: string) =>
    apiRequest.put(`/orders/${id}/cancel`, { reason }),
};

export const paymentsApi = {
  createPreference: (data: any) =>
    apiRequest.post('/payments/preference', data),
  
  getPaymentStatus: (paymentId: string) =>
    apiRequest.get(`/payments/${paymentId}/status`),
};

// Helper para lidar com erros da API
export const handleApiError = (error: AxiosError): string => {
  if (error.response?.data) {
    const data = error.response.data as ApiResponse;
    return data.message || 'Erro desconhecido';
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Erro de conexão';
};

// Helper para verificar se uma resposta foi bem-sucedida
export const isApiSuccess = <T>(response: AxiosResponse<ApiResponse<T>>): boolean => {
  return response.status >= 200 && response.status < 300 && response.data.success;
};

export default api;