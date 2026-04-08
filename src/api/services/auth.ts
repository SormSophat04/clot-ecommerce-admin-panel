import { apiClient, setToken, removeToken } from '../client';
import { ENDPOINTS, API_CONFIG } from '../config';
import type { LoginRequest, LoginResponse, User } from '../../types/api';
import { mockLoginResponse, mockUser } from '../mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(500);
      // Validate mock credentials (accept any non-empty)
      if (!credentials.phoneNumber || !credentials.password) {
        throw new Error('Phone number and password are required');
      }
      const response = { ...mockLoginResponse };
      response.user.phoneNumber = credentials.phoneNumber;
      setToken(response.token);
      return response;
    }

    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.LOGIN,
      credentials,
      { skipAuth: true }
    );
    setToken(response.token);
    return response;
  },

  logout: async (): Promise<void> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(300);
      removeToken();
      return;
    }

    try {
      await apiClient.post(ENDPOINTS.LOGOUT);
    } finally {
      removeToken();
    }
  },

  getCurrentUser: async (): Promise<User> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(200);
      return mockUser;
    }

    return apiClient.get<User>(ENDPOINTS.ME);
  },
};
