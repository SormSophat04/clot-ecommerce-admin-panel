import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../api/services';
import type { CreateProductPayload, UpdateProductPayload } from '../../types/api';

export const useProducts = (
  page: number = 1,
  pageSize: number = 20,
  filters?: { categoryId?: number; brandId?: number; search?: string }
) => {
  return useQuery({
    queryKey: ['products', 'list', page, pageSize, filters],
    queryFn: () => productService.getAll(page, pageSize, filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductPayload) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductPayload }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'draft' | 'archived' }) =>
      productService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
