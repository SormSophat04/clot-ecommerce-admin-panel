import { apiClient } from '../client';
import { ENDPOINTS, API_CONFIG } from '../config';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  PaginatedResponse,
} from '../../types/api';
import { mockProducts } from '../mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getAll: async (
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      category?: string;
      status?: string;
      search?: string;
    }
  ): Promise<PaginatedResponse<Product>> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(400);
      let filtered = mockProducts;
      if (filters?.category) {
        filtered = filtered.filter(p => p.category === filters.category);
      }
      if (filters?.status) {
        filtered = filtered.filter(p => p.status === filters.status);
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
    return apiClient.get<PaginatedResponse<Product>>(
      `${ENDPOINTS.PRODUCTS}?${params}`
    );
  },

  getById: async (id: string): Promise<Product> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(300);
      const product = mockProducts.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    }
    return apiClient.get<Product>(`${ENDPOINTS.PRODUCTS}/${id}`);
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(500);
      const newProduct: Product = {
        id: String(mockProducts.length + 1),
        ...data,
        images: data.images || [],
        status: 'active',
        sku: `PRD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockProducts.push(newProduct);
      return newProduct;
    }
    return apiClient.post<Product>(ENDPOINTS.PRODUCTS, data);
  },

  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(400);
      const index = mockProducts.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      mockProducts[index] = { ...mockProducts[index], ...data, updatedAt: new Date().toISOString() };
      return mockProducts[index];
    }
    return apiClient.put<Product>(`${ENDPOINTS.PRODUCTS}/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(300);
      const index = mockProducts.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      mockProducts.splice(index, 1);
      return;
    }
    return apiClient.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
  },

  updateStatus: async (
    id: string,
    status: 'active' | 'draft' | 'archived'
  ): Promise<Product> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(300);
      const index = mockProducts.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      mockProducts[index].status = status;
      mockProducts[index].updatedAt = new Date().toISOString();
      return mockProducts[index];
    }
    return apiClient.patch<Product>(`${ENDPOINTS.PRODUCTS}/${id}/status`, { status });
  },
};
