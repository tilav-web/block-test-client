import { useAuthStore } from '../store/auth-store';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout,
    clearError,
    setLoading,
    handleAuth
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout,
    clearError,
    setLoading,
    handleAuth
  };
}; 