export interface AuthUser {
  id?: string;
  _id?: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  full_name: string;
  phone: string;
  is_active: boolean;
  is_verified: boolean;
  accessible_blocks?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: AuthUser | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  handleAuth: (userData: AuthUser) => void;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions; 