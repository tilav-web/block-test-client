// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    DASHBOARD: '/auth/dashboard',
    ADMIN_PANEL: '/auth/admin-panel',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // Subject endpoints
  SUBJECTS: {
    GET_ALL: '/subjects',
    GET_BY_ID: (id: string) => `/subjects/${id}`,
    CREATE: '/subjects',
    UPDATE: (id: string) => `/subjects/${id}`,
    DELETE: (id: string) => `/subjects/${id}`,
  },
  
  // Test endpoints
  TESTS: {
    GET_ALL: '/tests',
    GET_BY_ID: (id: string) => `/tests/${id}`,
    CREATE: '/tests',
    UPDATE: (id: string) => `/tests/${id}`,
    DELETE: (id: string) => `/tests/${id}`,
  },
  
  // Block endpoints
  BLOCKS: {
    GET_ALL: '/blocks',
    GET_BY_ID: (id: string) => `/blocks/${id}`,
    CREATE: '/blocks',
    UPDATE: (id: string) => `/blocks/${id}`,
    DELETE: (id: string) => `/blocks/${id}`,
  },
  
  // User management endpoints (if you add more later)
  USERS: {
    GET_ALL: '/auth/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  
  // Quiz endpoints
  QUIZ: {
    FETCH: (blockId: string) => `/blocks/${blockId}/quiz`,
    SAVE_RESULT: '/quiz/result',
    AUTOSAVE: '/quiz/autosave',
    GET_RESULTS: '/quiz/results',
    GET_RESULTS_BY_PERIOD: (period: string) => `/quiz/results/${period}`,
    GET_RATINGS_BY_PERIOD: (period: string) => `/quiz/ratings/${period}`,
  },
} as const;

// Type for API responses
export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  user?: T;
  token?: string;
  dashboard?: T;
  adminPanel?: T;
}

// Type for error responses
export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
} 