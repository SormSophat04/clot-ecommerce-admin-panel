// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000,
  USE_MOCK: import.meta.env.VITE_USE_MOCK_API === 'true',
};

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  AUTH_CATEGORIES: '/auth/categories',

  // Category CRUD
  CATEGORY_LIST: '/categories',
  CATEGORY_CREATE: '/categories',
  CATEGORY_UPDATE: '/categories',
  CATEGORY_DELETE: '/categories',

  // Dashboard
  DASHBOARD_SUMMARY: '/dashboard/summary',
  DASHBOARD_REVENUE: '/dashboard/revenue',
  DASHBOARD_CATEGORIES: '/dashboard/categories',
  DASHBOARD_CUSTOMER_LOCATIONS: '/dashboard/locations',

  // Resources
  PRODUCTS: '/products',
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  CATEGORY: '/categories',
  BRAND: '/brands',
  COLOR: '/colors',
  SIZE: '/sizes',
  REVIEWS: '/reviews',
} as const;
