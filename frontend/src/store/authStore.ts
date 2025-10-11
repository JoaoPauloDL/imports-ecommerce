import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN';
  emailVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateTokens: (tokens: AuthTokens) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User, tokens: AuthTokens) => {
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      updateTokens: (tokens: AuthTokens) => {
        set({ tokens });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectTokens = (state: AuthState) => state.tokens;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectIsAdmin = (state: AuthState) => 
  state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN';

// Actions
export const useAuth = () => {
  const authStore = useAuthStore();
  
  return {
    user: authStore.user,
    tokens: authStore.tokens,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    isAdmin: selectIsAdmin(authStore),
    login: authStore.login,
    logout: authStore.logout,
    updateUser: authStore.updateUser,
    updateTokens: authStore.updateTokens,
    setLoading: authStore.setLoading,
  };
};