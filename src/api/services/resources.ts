import { apiClient } from '../client';
import { ENDPOINTS } from '../config';
import type {
  Brand,
  Color,
  Size,
  CreateBrandRequest,
  UpdateBrandRequest,
  CreateColorRequest,
  UpdateColorRequest,
  CreateSizeRequest,
  UpdateSizeRequest,
} from '../../types/api';

export const resourceService = {
  getBrands: async (): Promise<Brand[]> => {
    const data = await apiClient.get<Brand[]>(ENDPOINTS.BRAND);
    return Array.isArray(data) ? data : [];
  },

  createBrand: async (request: CreateBrandRequest): Promise<Brand> => {
    return apiClient.post<Brand>(ENDPOINTS.BRAND, { brandName: request.name });
  },

  updateBrand: async (id: number, request: UpdateBrandRequest): Promise<Brand> => {
    return apiClient.put<Brand>(`${ENDPOINTS.BRAND}/${id}`, { brandName: request.name });
  },

  deleteBrand: async (id: number): Promise<void> => {
    return apiClient.delete(`${ENDPOINTS.BRAND}/${id}`);
  },

  getColors: async (): Promise<Color[]> => {
    const data = await apiClient.get<Color[]>(ENDPOINTS.COLOR);
    return Array.isArray(data) ? data : [];
  },

  createColor: async (request: CreateColorRequest): Promise<Color> => {
    return apiClient.post<Color>(ENDPOINTS.COLOR, { colorName: request.name });
  },

  updateColor: async (id: number, request: UpdateColorRequest): Promise<Color> => {
    return apiClient.put<Color>(`${ENDPOINTS.COLOR}/${id}`, { colorName: request.name });
  },

  deleteColor: async (id: number): Promise<void> => {
    return apiClient.delete(`${ENDPOINTS.COLOR}/${id}`);
  },

  getSizes: async (): Promise<Size[]> => {
    const data = await apiClient.get<Size[]>(ENDPOINTS.SIZE);
    return Array.isArray(data) ? data : [];
  },

  createSize: async (request: CreateSizeRequest): Promise<Size> => {
    return apiClient.post<Size>(ENDPOINTS.SIZE, { sizeName: request.name });
  },

  updateSize: async (id: number, request: UpdateSizeRequest): Promise<Size> => {
    return apiClient.put<Size>(`${ENDPOINTS.SIZE}/${id}`, { sizeName: request.name });
  },

  deleteSize: async (id: number): Promise<void> => {
    return apiClient.delete(`${ENDPOINTS.SIZE}/${id}`);
  },
};
