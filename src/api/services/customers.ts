import { apiClient } from '../client';
import { ENDPOINTS, API_CONFIG } from '../config';
import type { Customer, PaginatedResponse } from '../../types/api';
import { mockCustomers } from '../mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const customerService = {
  getAll: async (
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      search?: string;
      sortBy?: string;
      order?: 'asc' | 'desc';
    }
  ): Promise<PaginatedResponse<Customer>> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(400);
      let filtered = mockCustomers;
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          c => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)
        );
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
    return apiClient.get<PaginatedResponse<Customer>>(
      `${ENDPOINTS.CUSTOMERS}?${params}`
    );
  },

  getById: async (id: string): Promise<Customer> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(300);
      const customer = mockCustomers.find(c => c.id === id);
      if (!customer) throw new Error('Customer not found');
      return customer;
    }
    return apiClient.get<Customer>(`${ENDPOINTS.CUSTOMERS}/${id}`);
  },
};
