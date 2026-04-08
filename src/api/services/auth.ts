import { apiClient, setToken, removeToken } from '../client';
import { ENDPOINTS } from '../config';
import type { LoginRequest, LoginResponse, User, Category } from '../../types/api';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.LOGIN,
      credentials,
      { skipAuth: true }
    );
    setToken(response.token);
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(ENDPOINTS.LOGOUT);
    } finally {
      removeToken();
    }
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>(ENDPOINTS.ME);
  },

  getCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>(ENDPOINTS.AUTH_CATEGORIES);
  },
};
