import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../api/services';
import type { CreateProductRequest, UpdateProductRequest } from '../../types/api';

export const useProducts = (
  page: number = 1,
  pageSize: number = 20,
  filters?: { category?: string; status?: string; search?: string }
) => {
  return useQuery({
    queryKey: ['products', 'list', page, pageSize, filters],
    queryFn: () => productService.getAll(page, pageSize, filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'draft' | 'archived' }) =>
      productService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
