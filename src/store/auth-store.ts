import { create } from 'zustand';
import type { AuthStore, AuthUser } from '../interfaces/auth.interface';

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  user: undefined,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  handleAuth: async (userData: AuthUser) => set({ user: userData, isAuthenticated: true, isLoading: false }),

  logout: async () => set({ user: null, isAuthenticated: false, isLoading: false }),

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
})); 