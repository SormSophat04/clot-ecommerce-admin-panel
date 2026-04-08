import { apiClient } from '../client';
import { ENDPOINTS } from '../config';
import type {
  Color,
  Size,
  ProductRecord,
  CreateProductPayload,
  UpdateProductPayload,
  PaginatedResponse,
} from '../../types/api';

interface ProductResponseDto {
  productId: number;
  productName: string;
  sku: string | null;
  price: number | null;
  stockQuantity: number | null;
  description: string | null;
  category: {
    categoryId: number;
    categoryName: string;
  } | null;
  brand: {
    brandId: number;
    brandName: string;
  } | null;
  colors?: Color[] | null;
  sizes?: Size[] | null;
  images?: string[] | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface SpringPageResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
  totalPages: number;
}

const toProductRecord = (dto: ProductResponseDto): ProductRecord => {
  const colors = Array.isArray(dto.colors) ? dto.colors : [];
  const sizes = Array.isArray(dto.sizes) ? dto.sizes : [];

  return {
    productId: dto.productId,
    productName: dto.productName,
    sku: dto.sku ?? '',
    price: Number(dto.price ?? 0),
    stockQuantity: Number(dto.stockQuantity ?? 0),
    description: dto.description ?? '',
    categoryId: dto.category?.categoryId ?? null,
    categoryName: dto.category?.categoryName ?? '',
    brandId: dto.brand?.brandId ?? null,
    brandName: dto.brand?.brandName ?? '',
    colorIds: colors.map((color) => color.colorId),
    sizeIds: sizes.map((size) => size.sizeId),
    colors,
    sizes,
    images: Array.isArray(dto.images) ? dto.images : [],
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

const paginateList = <T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> => {
  const total = items.length;
  const offset = Math.max((page - 1) * pageSize, 0);

  return {
    data: items.slice(offset, offset + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
};

export const productService = {
  getAll: async (
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      categoryId?: number;
      brandId?: number;
      search?: string;
    }
  ): Promise<PaginatedResponse<ProductRecord>> => {
    const normalizedPage = Math.max(page, 1);
    const normalizedPageSize = Math.max(pageSize, 1);
    const search = filters?.search?.trim();
    const categoryId = filters?.categoryId;
    const brandId = filters?.brandId;

    if (search) {
      const encodedSearch = encodeURIComponent(search);
      const data = await apiClient.get<ProductResponseDto[]>(
        `${ENDPOINTS.PRODUCTS}/search?name=${encodedSearch}`
      );
      const list = (Array.isArray(data) ? data : []).map(toProductRecord);
      const filtered = list.filter((item) =>
        (categoryId ? item.categoryId === categoryId : true) &&
        (brandId ? item.brandId === brandId : true)
      );
      return paginateList(filtered, normalizedPage, normalizedPageSize);
    }

    if (categoryId) {
      const data = await apiClient.get<ProductResponseDto[]>(
        `${ENDPOINTS.PRODUCTS}/category/${categoryId}`
      );
      const list = (Array.isArray(data) ? data : []).map(toProductRecord);
      const filtered = brandId
        ? list.filter((item) => item.brandId === brandId)
        : list;
      return paginateList(filtered, normalizedPage, normalizedPageSize);
    }

    if (brandId) {
      const data = await apiClient.get<ProductResponseDto[]>(
        `${ENDPOINTS.PRODUCTS}/brand/${brandId}`
      );
      const list = (Array.isArray(data) ? data : []).map(toProductRecord);
      return paginateList(list, normalizedPage, normalizedPageSize);
    }

    const params = new URLSearchParams({
      page: String(normalizedPage - 1),
      size: String(normalizedPageSize),
    });

    const response = await apiClient.get<SpringPageResponse<ProductResponseDto>>(
      `${ENDPOINTS.PRODUCTS}?${params.toString()}`
    );

    const content = Array.isArray(response?.content) ? response.content : [];
    return {
      data: content.map(toProductRecord),
      total: Number(response?.totalElements ?? 0),
      page: Number(response?.number ?? 0) + 1,
      pageSize: Number(response?.size ?? normalizedPageSize),
      totalPages: Math.max(Number(response?.totalPages ?? 1), 1),
    };
  },

  getById: async (id: number): Promise<ProductRecord> => {
    const data = await apiClient.get<ProductResponseDto>(`${ENDPOINTS.PRODUCTS}/${id}`);
    return toProductRecord(data);
  },

  create: async (data: CreateProductPayload): Promise<ProductRecord> => {
    const requestBody = {
      productName: data.productName,
      sku: data.sku ?? '',
      price: data.price,
      stockQuantity: data.stockQuantity,
      description: data.description ?? '',
      categoryId: data.categoryId,
      brandId: data.brandId,
      colorIds: data.colorIds ?? [],
      sizeIds: data.sizeIds ?? [],
    };
    const created = await apiClient.post<ProductResponseDto>(ENDPOINTS.PRODUCTS, requestBody);
    return toProductRecord(created);
  },

  update: async (id: number, data: UpdateProductPayload): Promise<ProductRecord> => {
    const requestBody = {
      productName: data.productName,
      sku: data.sku ?? '',
      price: data.price,
      stockQuantity: data.stockQuantity,
      description: data.description ?? '',
      categoryId: data.categoryId,
      brandId: data.brandId,
      colorIds: data.colorIds ?? [],
      sizeIds: data.sizeIds ?? [],
    };
    const updated = await apiClient.put<ProductResponseDto>(
      `${ENDPOINTS.PRODUCTS}/${id}`,
      requestBody
    );
    return toProductRecord(updated);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
  },

  updateStatus: async (
    id: number,
    status: 'active' | 'draft' | 'archived'
  ): Promise<ProductRecord> => {
    throw new Error(
      `Status update is not supported by backend for product ${id} (status: ${status}).`
    );
  },
};

