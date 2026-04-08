import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../api/services';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../../types/api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateCategoryRequest) => categoryService.createCategory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = (id?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: { id: number } & UpdateCategoryRequest) => 
      categoryService.updateCategory(request.id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      if (id) queryClient.invalidateQueries({ queryKey: ['categories', id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
