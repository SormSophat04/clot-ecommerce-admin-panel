import { apiClient } from '../client';
import { ENDPOINTS } from '../config';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types/api';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const data = await apiClient.get<Category[]>(ENDPOINTS.CATEGORY_LIST);
    return Array.isArray(data) ? data : [];
  },

  getCategory: async (id: number): Promise<Category> => {
    return apiClient.get<Category>(`${ENDPOINTS.CATEGORY_LIST}/${id}`);
  },

  createCategory: async (request: CreateCategoryRequest): Promise<Category> => {
    return apiClient.post<Category>(ENDPOINTS.CATEGORY_CREATE, { categoryName: request.name });
  },

  updateCategory: async (id: number, request: UpdateCategoryRequest): Promise<Category> => {
    return apiClient.put<Category>(`${ENDPOINTS.CATEGORY_UPDATE}/${id}`, { categoryName: request.name });
  },

  deleteCategory: async (id: number): Promise<void> => {
    return apiClient.delete(`${ENDPOINTS.CATEGORY_DELETE}/${id}`);
  },
};
