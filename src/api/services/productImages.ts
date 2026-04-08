import { apiClient } from '../client';
import { ENDPOINTS } from '../config';
import type { ProductImageRecord } from '../../types/api';

interface ProductImageResponseDto {
  productImageId: number;
  productId: number;
  imageData: string | null;
  mimeType: string | null;
  size: number | null;
}

const toProductImageRecord = (dto: ProductImageResponseDto): ProductImageRecord => {
  return {
    productImageId: dto.productImageId,
    productId: dto.productId,
    imageData: dto.imageData ?? '',
    mimeType: dto.mimeType ?? 'image/jpeg',
    size: Number(dto.size ?? 0),
  };
};

export const productImageService = {
  getAllByProduct: async (productId: number): Promise<ProductImageRecord[]> => {
    const data = await apiClient.get<ProductImageResponseDto[]>(
      `${ENDPOINTS.PRODUCTS}/${productId}/images`
    );
    return (Array.isArray(data) ? data : []).map(toProductImageRecord);
  },

  upload: async (productId: number, file: File): Promise<ProductImageRecord> => {
    const formData = new FormData();
    formData.append('image', file);

    const data = await apiClient.post<ProductImageResponseDto>(
      `${ENDPOINTS.PRODUCTS}/${productId}/images`,
      formData
    );
    return toProductImageRecord(data);
  },

  deleteById: async (productId: number, imageId: number): Promise<void> => {
    return apiClient.delete(`${ENDPOINTS.PRODUCTS}/${productId}/images/${imageId}`);
  },

  deleteAllByProduct: async (productId: number): Promise<void> => {
    return apiClient.delete(`${ENDPOINTS.PRODUCTS}/${productId}/images`);
  },
};

