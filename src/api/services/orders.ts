import { apiClient } from '../client';
import { ENDPOINTS, API_CONFIG } from '../config';
import type {
  Order,
  UpdateOrderStatusRequest,
  PaginatedResponse,
} from '../../types/api';
import { mockOrders } from '../mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  getAll: async (
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      status?: string;
      paymentStatus?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<PaginatedResponse<Order>> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(400);
      let filtered = mockOrders;
      if (filters?.status) {
        filtered = filtered.filter(o => o.status === filters.status);
      }
      return {
        data: filtered.slice((page - 1) * pageSize, page * pageSize),
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
      };
    }
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...filters,
    });
    return apiClient.get<PaginatedResponse<Order>>(
      `${ENDPOINTS.ORDERS}?${params}`
    );
  },

  getById: async (id: string): Promise<Order> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(300);
      const order = mockOrders.find(o => o.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
    return apiClient.get<Order>(`${ENDPOINTS.ORDERS}/${id}`);
  },

  updateStatus: async (
    id: string,
    data: UpdateOrderStatusRequest
  ): Promise<Order> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(400);
      const index = mockOrders.findIndex(o => o.id === id);
      if (index === -1) throw new Error('Order not found');
      mockOrders[index] = { ...mockOrders[index], ...data, updatedAt: new Date().toISOString() };
      return mockOrders[index];
    }
    return apiClient.patch<Order>(`${ENDPOINTS.ORDERS}/${id}/status`, data);
  },
};
